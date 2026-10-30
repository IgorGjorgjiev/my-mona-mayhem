import type { APIRoute } from 'astro';
import {
	DEFAULT_COLORS,
	USERNAME_RE,
	type ContributionData,
	type ContributionLevel,
	type ContributionWeek,
} from '../../../lib/contributions';

export const prerender = false;

const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;
const FETCH_TIMEOUT_MS = 8000;
const HEX_COLOR_RE = /^#[0-9a-f]{3,8}$/i;

const cache = new Map<string, { expires: number; data: ContributionData }>();

interface RawDay {
	weekday: number;
	count: number;
	level: number;
}

interface RawWeek {
	first_day: string;
	contribution_days: RawDay[];
}

interface RawResponse {
	from: string;
	to: string;
	total_contributions: number;
	colors_full?: string[];
	weeks: RawWeek[];
}

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

function addDays(iso: string, days: number): string {
	const d = new Date(`${iso}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}

function toLevel(n: number): ContributionLevel {
	return Math.min(4, Math.max(0, Math.round(n) || 0)) as ContributionLevel;
}

function normalize(username: string, raw: RawResponse): ContributionData {
	const weeks: ContributionWeek[] = raw.weeks.map((week) => ({
		firstDay: week.first_day,
		days: week.contribution_days.map((day) => ({
			date: addDays(week.first_day, day.weekday - new Date(`${week.first_day}T00:00:00Z`).getUTCDay()),
			count: Math.max(0, day.count | 0),
			level: toLevel(day.level),
		})),
	}));

	const colors =
		Array.isArray(raw.colors_full) && raw.colors_full.length === 5 && raw.colors_full.every((c) => HEX_COLOR_RE.test(c))
			? raw.colors_full
			: DEFAULT_COLORS;

	return {
		username,
		from: raw.from,
		to: raw.to,
		total: Math.max(0, raw.total_contributions | 0),
		colors,
		weeks,
	};
}

function isRawResponse(value: unknown): value is RawResponse {
	const v = value as RawResponse;
	return !!v && typeof v === 'object' && Array.isArray(v.weeks) && typeof v.total_contributions === 'number';
}

export const GET: APIRoute = async ({ params }) => {
	const username = params.username?.trim() ?? '';
	if (!USERNAME_RE.test(username)) {
		return json({ error: 'Invalid GitHub username' }, 400);
	}

	const key = username.toLowerCase();
	const hit = cache.get(key);
	if (hit && hit.expires > Date.now()) {
		return json(hit.data, 200, { 'Cache-Control': 'public, max-age=600', 'X-Cache': 'HIT' });
	}

	let res: Response;
	try {
		res = await fetch(`https://github.com/${encodeURIComponent(username)}.contribs`, {
			headers: { Accept: 'application/json', 'User-Agent': 'mona-mayhem' },
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
		});
	} catch (err) {
		const timedOut = err instanceof DOMException && err.name === 'TimeoutError';
		return json({ error: timedOut ? 'GitHub took too long to respond' : 'Could not reach GitHub' }, timedOut ? 504 : 502);
	}

	if (res.status === 404) return json({ error: `User "${username}" not found` }, 404);
	if (res.status === 429) return json({ error: 'GitHub rate limit hit, try again in a minute' }, 429);
	if (!res.ok) return json({ error: `GitHub responded with ${res.status}` }, 502);

	let raw: unknown;
	try {
		raw = await res.json();
	} catch {
		return json({ error: 'GitHub returned unexpected data' }, 502);
	}
	if (!isRawResponse(raw)) return json({ error: 'GitHub returned unexpected data' }, 502);

	const data = normalize(username, raw);

	if (cache.size >= CACHE_MAX_ENTRIES) {
		const oldest = cache.keys().next().value;
		if (oldest !== undefined) cache.delete(oldest);
	}
	cache.set(key, { expires: Date.now() + CACHE_TTL_MS, data });

	return json(data, 200, { 'Cache-Control': 'public, max-age=600', 'X-Cache': 'MISS' });
};
