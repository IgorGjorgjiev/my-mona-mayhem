import { USERNAME_RE, type ApiError, type ContributionData, type ContributionDay } from '../lib/contributions';
import { burst } from './confetti';
import { clearHistory, loadHistory, saveBattle, type BattleRecord } from './history';
import { isMuted, setMuted, sfx } from './sound';
import { computeStats, flatten, type PlayerStats } from './stats';

interface Fighter {
	slot: 1 | 2;
	data: ContributionData;
	stats: PlayerStats;
}

const BATTLES_KEY = 'mm:battles';
const EMPTY_CELL = '#161a33';
const HEX_RE = /^#[0-9a-f]{3,8}$/i;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const app = $<HTMLDivElement>('app');
const form = $<HTMLFormElement>('battle-form');
const inputs = [$<HTMLInputElement>('p1'), $<HTMLInputElement>('p2')] as const;
const battleBtn = $<HTMLButtonElement>('battle-btn');
const errorEl = $<HTMLParagraphElement>('battle-error');
const loadingEl = $<HTMLParagraphElement>('loading');
const resultsEl = $<HTMLElement>('results');
const historyEl = $<HTMLElement>('history');
const historyList = $<HTMLOListElement>('history-list');
const countdownEl = $<HTMLDivElement>('countdown');
const countdownText = $<HTMLParagraphElement>('countdown-text');
const tip = $<HTMLDivElement>('tip');
const confettiCanvas = $<HTMLCanvasElement>('confetti');
const themeToggle = $<HTMLButtonElement>('theme-toggle');
const muteToggle = $<HTMLButtonElement>('mute-toggle');

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const numFmt = new Intl.NumberFormat('en-US');
const relFmt = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const graphDays = new WeakMap<Element, ContributionDay[]>();
const requests = new Map<string, Promise<ContributionData>>();

let busy = false;

/* ---------------------------------------------------------------- helpers */

function escapeHtml(s: string): string {
	return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function fmtDate(iso: string): string {
	return dateFmt.format(new Date(`${iso}T00:00:00Z`)).toUpperCase();
}

function plural(n: number, word: string): string {
	return `${numFmt.format(n)} ${word}${n === 1 ? '' : 'S'}`;
}

function wait(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function retrigger(el: Element, className: string) {
	el.classList.remove(className);
	void (el as HTMLElement).offsetWidth;
	el.classList.add(className);
	el.addEventListener('animationend', () => el.classList.remove(className), { once: true });
}

function cssVar(name: string): string {
	return getComputedStyle(root).getPropertyValue(name).trim();
}

/* ------------------------------------------------------------------ intro */

function enterApp() {
	root.classList.add('is-ready');
	app.inert = false;
}

function setupIntro() {
	const intro = document.getElementById('intro');
	if (!intro || root.classList.contains('skip-intro')) {
		intro?.remove();
		enterApp();
		return;
	}

	app.inert = true;
	$<HTMLButtonElement>('intro-start').focus({ preventScroll: true });
	let done = false;

	const dismiss = () => {
		if (done) return;
		done = true;
		window.removeEventListener('keydown', onKey);
		sfx.coin();
		try {
			sessionStorage.setItem('mm:intro', '1');
		} catch {}
		intro.classList.add('is-leaving');
		setTimeout(() => {
			enterApp();
			if (matchMedia('(pointer: fine)').matches) inputs[0].focus({ preventScroll: true });
		}, 320);
		setTimeout(() => intro.remove(), 700);
	};

	const onKey = (e: KeyboardEvent) => {
		if (['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(e.key)) return;
		e.preventDefault();
		dismiss();
	};

	intro.addEventListener('click', dismiss);
	window.addEventListener('keydown', onKey);
}

/* --------------------------------------------------------------- toggles */

function setupToggles() {
	const syncTheme = () => {
		const alt = root.dataset.theme === 'alt';
		themeToggle.setAttribute('aria-pressed', String(alt));
	};
	const syncMute = () => {
		muteToggle.setAttribute('aria-pressed', String(isMuted()));
		muteToggle.textContent = isMuted() ? 'SOUND: OFF' : 'SOUND: ON';
	};

	themeToggle.addEventListener('click', () => {
		const alt = root.dataset.theme !== 'alt';
		if (alt) root.dataset.theme = 'alt';
		else delete root.dataset.theme;
		try {
			localStorage.setItem('mm:theme', alt ? 'alt' : 'default');
		} catch {}
		syncTheme();
		sfx.blip();
	});

	muteToggle.addEventListener('click', () => {
		setMuted(!isMuted());
		syncMute();
		sfx.blip();
	});

	syncTheme();
	syncMute();
}

/* ------------------------------------------------------------ validation */

type FieldState = 'empty' | 'invalid' | 'ready';

function fieldState(input: HTMLInputElement): FieldState {
	const v = input.value.trim();
	if (!v) return 'empty';
	return USERNAME_RE.test(v) ? 'ready' : 'invalid';
}

function updateSlot(input: HTMLInputElement) {
	const slot = input.closest('.slot')!;
	const status = slot.querySelector('.slot__status')!;
	const state = fieldState(input);
	slot.classList.toggle('is-ready', state === 'ready');
	slot.classList.remove('is-invalid');
	input.removeAttribute('aria-invalid');
	status.textContent = state === 'ready' ? 'READY!' : state === 'invalid' ? 'INVALID NAME' : 'INSERT NAME';
}

function markInvalid(index: number) {
	const input = inputs[index];
	const slot = input.closest('.slot')!;
	slot.classList.remove('is-ready');
	slot.classList.add('is-invalid');
	slot.querySelector('.slot__status')!.textContent = 'CHECK NAME';
	input.setAttribute('aria-invalid', 'true');
	retrigger(slot.querySelector('.slot__field')!, 'shake');
}

function showError(message: string, invalid: number[] = []) {
	errorEl.textContent = message;
	errorEl.hidden = false;
	retrigger(errorEl, 'shake');
	invalid.forEach(markInvalid);
}

function clearError() {
	errorEl.hidden = true;
	errorEl.textContent = '';
}

function validate(): [string, string] | null {
	const names = inputs.map((i) => i.value.trim()) as [string, string];
	const empty = names.flatMap((n, i) => (n ? [] : [i]));
	if (empty.length === 2) {
		showError('BOTH PLAYERS NEED A NAME', empty);
	} else if (empty.length === 1) {
		showError(`PLAYER ${empty[0] + 1} NEEDS A NAME`, empty);
	} else {
		const bad = names.flatMap((n, i) => (USERNAME_RE.test(n) ? [] : [i]));
		if (bad.length) {
			showError(`${bad.map((i) => `PLAYER ${i + 1}`).join(' & ')}: NOT A VALID GITHUB USERNAME`, bad);
		} else if (names[0].toLowerCase() === names[1].toLowerCase()) {
			showError('A PLAYER CANNOT FIGHT THEMSELVES. PICK TWO DIFFERENT NAMES', [1]);
		} else {
			return names;
		}
	}
	sfx.error();
	const firstBad = inputs.find((i) => i.getAttribute('aria-invalid') === 'true');
	firstBad?.focus();
	return null;
}

/* ------------------------------------------------------------------- data */

function fetchContributions(username: string): Promise<ContributionData> {
	const key = username.toLowerCase();
	const cached = requests.get(key);
	if (cached) return cached;

	const request = (async () => {
		let res: Response;
		try {
			res = await fetch(`/api/contributions/${encodeURIComponent(username)}`, { signal: AbortSignal.timeout(15000) });
		} catch {
			throw new Error('NETWORK ERROR, CHECK YOUR CONNECTION');
		}
		const body = (await res.json().catch(() => null)) as ContributionData | ApiError | null;
		if (!res.ok || !body || 'error' in body) {
			throw new Error(body && 'error' in body ? body.error : `REQUEST FAILED (${res.status})`);
		}
		return body;
	})();

	requests.set(key, request);
	request.catch(() => requests.delete(key));
	return request;
}

/* -------------------------------------------------------------- countdown */

async function countdown() {
	if (reducedMotion.matches) return;

	countdownEl.hidden = false;
	let skip!: () => void;
	const skipped = new Promise<void>((resolve) => (skip = resolve));
	let isSkipped = false;
	const onSkip = () => {
		isSkipped = true;
		skip();
	};
	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			onSkip();
		}
	};
	countdownEl.addEventListener('click', onSkip);
	window.addEventListener('keydown', onKey);

	const steps = ['3', '2', '1', '⚡FIGHT!⚡'];
	for (let i = 0; i < steps.length && !isSkipped; i++) {
		const fight = i === steps.length - 1;
		countdownText.textContent = steps[i];
		countdownText.classList.toggle('is-fight', fight);
		if (fight) sfx.fight();
		else sfx.tick();

		const anim = countdownText.animate(
			[
				{ transform: 'scale(2.6)', opacity: 0 },
				{ transform: 'scale(1)', opacity: 1, offset: 0.22 },
				{ transform: 'scale(1)', opacity: 1, offset: 0.72 },
				{ transform: fight ? 'scale(1.6)' : 'scale(0.5)', opacity: 0 },
			],
			{ duration: fight ? 820 : 640, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
		);
		await Promise.race([anim.finished.catch(() => {}), skipped]);
		anim.cancel();
	}

	countdownEl.removeEventListener('click', onSkip);
	window.removeEventListener('keydown', onKey);
	countdownEl.hidden = true;
}

/* -------------------------------------------------------------- rendering */

// GitHub's light palette gets lighter as activity drops, which reads backwards on a dark
// screen. When the API sends that palette, swap in GitHub's own dark-mode equivalent.
const GITHUB_LIGHT = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const GITHUB_DARK = [EMPTY_CELL, '#0e4429', '#006d32', '#26a641', '#39d353'];

function palette(colors: string[]): string[] {
	if (colors.every((c, i) => c.toLowerCase() === GITHUB_LIGHT[i])) return GITHUB_DARK;
	const safe = colors.map((c) => (HEX_RE.test(c) ? c : '#30a14e'));
	return [EMPTY_CELL, safe[1], safe[2], safe[3], safe[4]];
}

function paletteStyle(colors: string[]): string {
	return palette(colors).map((c, i) => `--l${i}:${c}`).join(';');
}

function graphHtml(data: ContributionData): string {
	const days = flatten(data);
	const first = days[0];
	const pad = first ? new Date(`${first.date}T00:00:00Z`).getUTCDay() : 0;
	let cells = '<i class="c c--pad"></i>'.repeat(pad);
	for (let i = 0; i < days.length; i++) cells += `<i class="c" data-l="${days[i].level}" data-i="${i}"></i>`;

	const label = `${data.username}: ${plural(data.total, 'contribution')} from ${fmtDate(data.from)} to ${fmtDate(data.to)}`;
	return `<div class="graph-wrap"><div class="graph" role="img" aria-label="${escapeHtml(label)}" style="--cols:${data.weeks.length}">${cells}</div></div>`;
}

function statHtml(label: string, value: string, better: boolean): string {
	return `<div${better ? ' class="is-better"' : ''}><dt>${label}</dt><dd>${value}</dd></div>`;
}

function fighterHtml(f: Fighter, other: Fighter, outcome: 'win' | 'lose' | 'tie'): string {
	const { data, stats } = f;
	const name = escapeHtml(data.username);
	const badge = outcome === 'win' ? 'WINNER' : outcome === 'lose' ? 'K.O.' : 'DRAW';
	const best = stats.bestDay ? `${numFmt.format(stats.bestDay.count)} <small>${fmtDate(stats.bestDay.date)}</small>` : '-';

	return `
	<article class="fighter fighter--p${f.slot}${outcome === 'win' ? ' is-winner' : outcome === 'lose' ? ' is-loser' : ''}" style="${paletteStyle(data.colors)}">
		<header class="fighter__head">
			<img class="fighter__avatar" src="https://github.com/${encodeURIComponent(data.username)}.png?size=112" width="56" height="56" alt="" decoding="async" />
			<div>
				<span class="fighter__tag">PLAYER ${f.slot}</span>
				<h3 class="fighter__name"><a href="https://github.com/${encodeURIComponent(data.username)}" target="_blank" rel="noopener noreferrer">${name}</a></h3>
				<p class="fighter__range">${fmtDate(data.from)} - ${fmtDate(data.to)}</p>
			</div>
			<span class="fighter__badge">${badge}</span>
		</header>
		<div class="fighter__score">
			<strong data-count="${data.total}">0</strong>
			<span>CONTRIBUTIONS</span>
		</div>
		${graphHtml(data)}
		<dl class="stats">
			${statHtml('\u{1F525} LONGEST STREAK', plural(stats.longestStreak, 'DAY'), stats.longestStreak > other.stats.longestStreak)}
			${statHtml('CURRENT STREAK', plural(stats.currentStreak, 'DAY'), stats.currentStreak > other.stats.currentStreak)}
			${statHtml('BEST DAY', best, (stats.bestDay?.count ?? 0) > (other.stats.bestDay?.count ?? 0))}
			${statHtml('ACTIVE DAYS', numFmt.format(stats.activeDays), stats.activeDays > other.stats.activeDays)}
		</dl>
	</article>`;
}

function legendHtml(colors: string[]): string {
	const style = paletteStyle(colors);
	const squares = [0, 1, 2, 3, 4].map((l) => `<i style="background:var(--l${l})"></i>`).join('');
	return `<div class="legend" style="${style}" aria-hidden="true"><span>LESS</span>${squares}<span>MORE</span></div>`;
}

function countUp(el: HTMLElement) {
	const target = Number(el.dataset.count) || 0;
	if (reducedMotion.matches || target === 0) {
		el.textContent = numFmt.format(target);
		return;
	}
	const duration = 1100;
	const start = performance.now() + 350;
	const step = (now: number) => {
		const t = Math.min(1, Math.max(0, (now - start) / duration));
		const eased = 1 - Math.pow(1 - t, 4);
		el.textContent = numFmt.format(Math.round(target * eased));
		if (t < 1) requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
}

function winnerOf(a: Fighter, b: Fighter): Fighter | null {
	if (a.data.total === b.data.total) return null;
	return a.data.total > b.data.total ? a : b;
}

function renderResults(a: Fighter, b: Fighter) {
	const winner = winnerOf(a, b);
	const margin = Math.abs(a.data.total - b.data.total);
	const outcome = (f: Fighter) => (!winner ? 'tie' : winner === f ? 'win' : 'lose');

	const banner = winner
		? `<div class="banner" role="status">\u{1F3C6} ${escapeHtml(winner.data.username.toUpperCase())} WINS! \u{1F3C6}<small>BY ${plural(margin, 'CONTRIBUTION')}</small></div>`
		: `<div class="banner banner--tie" role="status">\u{1F91D} IT'S A TIE! \u{1F91D}<small>${plural(a.data.total, 'CONTRIBUTION')} EACH</small></div>`;

	resultsEl.innerHTML = `
		${banner}
		<div class="matchup">
			${fighterHtml(a, b, outcome(a))}
			<div class="vs" aria-hidden="true"><span>VS</span></div>
			${fighterHtml(b, a, outcome(b))}
		</div>
		${legendHtml(a.data.colors)}
		<div class="results__actions">
			<button class="chip" type="button" data-action="share">\u{1F4CB} SHARE RESULTS</button>
			<button class="chip" type="button" data-action="again">NEW BATTLE</button>
			<span class="sr-only" role="status" data-share-status></span>
		</div>`;
	resultsEl.hidden = false;

	resultsEl.querySelectorAll<HTMLElement>('.graph').forEach((graph, i) => {
		graphDays.set(graph, flatten(i === 0 ? a.data : b.data));
	});
	resultsEl.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
	// On narrow screens the graph scrolls; start on the most recent weeks.
	resultsEl.querySelectorAll<HTMLElement>('.graph-wrap').forEach((wrap) => (wrap.scrollLeft = wrap.scrollWidth));

	resultsEl.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
	return winner;
}

function shareText(a: Fighter, b: Fighter): string {
	const winner = winnerOf(a, b);
	const line = (f: Fighter) =>
		`P${f.slot} ${f.data.username}: ${numFmt.format(f.data.total)} contributions, longest streak ${f.stats.longestStreak} days`;
	const result = winner
		? `\u{1F3C6} ${winner.data.username} WINS by ${numFmt.format(Math.abs(a.data.total - b.data.total))}!`
		: `\u{1F91D} It's a tie!`;
	return ['MONA MAYHEM - GITHUB BATTLE', line(a), line(b), result, location.origin].join('\n');
}

async function copy(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.setAttribute('readonly', '');
		ta.style.cssText = 'position:fixed;opacity:0';
		document.body.append(ta);
		ta.select();
		const ok = document.execCommand('copy');
		ta.remove();
		return ok;
	}
}

/* ----------------------------------------------------------- HUD/history */

function timeAgo(at: number): string {
	const sec = Math.round((at - Date.now()) / 1000);
	const abs = Math.abs(sec);
	if (abs < 60) return relFmt.format(sec, 'second');
	if (abs < 3600) return relFmt.format(Math.round(sec / 60), 'minute');
	if (abs < 86400) return relFmt.format(Math.round(sec / 3600), 'hour');
	return relFmt.format(Math.round(sec / 86400), 'day');
}

function renderHud(history: BattleRecord[]) {
	let battles = 0;
	try {
		battles = Number(localStorage.getItem(BATTLES_KEY)) || 0;
	} catch {}
	$('hud-battles').textContent = String(battles).padStart(2, '0');

	let best: { name: string; total: number } | null = null;
	for (const r of history) {
		for (const [name, total] of [
			[r.p1, r.total1],
			[r.p2, r.total2],
		] as const) {
			if (!best || total > best.total) best = { name, total };
		}
	}
	$('hud-hiscore').textContent = best ? `${String(best.total).padStart(6, '0')} ${best.name.toUpperCase()}` : '------';
}

function renderHistory(history = loadHistory()) {
	renderHud(history);
	historyEl.hidden = history.length === 0;
	historyList.innerHTML = history
		.map((r, i) => {
			const side = (name: string, total: number) =>
				`<b class="${r.winner === name ? 'is-win' : ''}">${escapeHtml(name)} ${numFmt.format(total)}</b>`;
			const result = r.winner ? `WINNER: ${escapeHtml(r.winner.toUpperCase())}` : 'TIE';
			return `<li class="history__item">
				<div class="history__match">
					${side(r.p1, r.total1)}<span class="history__vs">VS</span>${side(r.p2, r.total2)}
					<span class="history__meta">${result} &middot; ${timeAgo(r.at).toUpperCase()}</span>
				</div>
				<button class="chip" type="button" data-rematch="${i}" aria-label="Rematch ${escapeHtml(r.p1)} versus ${escapeHtml(r.p2)}">REMATCH</button>
			</li>`;
		})
		.join('');
}

/* ----------------------------------------------------------------- battle */

function setBusy(value: boolean) {
	busy = value;
	battleBtn.setAttribute('aria-disabled', String(value));
	battleBtn.querySelector('.battle-btn__label')!.textContent = value ? 'FIGHTING...' : 'BATTLE!';
}

async function battle() {
	if (busy) return;
	clearError();
	const names = validate();
	if (!names) return;

	setBusy(true);
	sfx.coin();
	hideTip();

	const data = Promise.allSettled(names.map(fetchContributions));
	await countdown();

	// Only show the loader if the data isn't already here after the countdown.
	const loaderTimer = setTimeout(() => (loadingEl.hidden = false), 120);
	const [r1, r2] = await data;
	clearTimeout(loaderTimer);
	loadingEl.hidden = true;

	const failed = [r1, r2].flatMap((r, i) => (r.status === 'rejected' ? [i] : []));
	if (failed.length) {
		const messages = failed.map((i) => {
			const reason = (([r1, r2][i] as PromiseRejectedResult).reason as Error)?.message ?? 'UNKNOWN ERROR';
			return `PLAYER ${i + 1}: ${reason.toUpperCase()}`;
		});
		sfx.explosion();
		showError(messages.join(' / '), failed);
		setBusy(false);
		return;
	}

	const [d1, d2] = [r1, r2].map((r) => (r as PromiseFulfilledResult<ContributionData>).value);
	const a: Fighter = { slot: 1, data: d1, stats: computeStats(d1) };
	const b: Fighter = { slot: 2, data: d2, stats: computeStats(d2) };
	const winner = renderResults(a, b);

	sfx.powerUp();
	await wait(250);
	burst(confettiCanvas, [cssVar('--p1'), cssVar('--p2'), cssVar('--gold'), '#ffffff']);

	try {
		localStorage.setItem(BATTLES_KEY, String((Number(localStorage.getItem(BATTLES_KEY)) || 0) + 1));
	} catch {}
	renderHistory(
		saveBattle({
			p1: d1.username,
			p2: d2.username,
			total1: d1.total,
			total2: d2.total,
			winner: winner ? winner.data.username : null,
			at: Date.now(),
		}),
	);

	resultsEl.querySelector<HTMLButtonElement>('[data-action="share"]')!.onclick = async (e) => {
		const btn = e.currentTarget as HTMLButtonElement;
		const ok = await copy(shareText(a, b));
		const status = resultsEl.querySelector('[data-share-status]')!;
		btn.textContent = ok ? 'COPIED TO CLIPBOARD!' : 'COPY FAILED';
		status.textContent = ok ? 'Copied to clipboard' : 'Copy failed';
		sfx.blip();
		setTimeout(() => (btn.textContent = '\u{1F4CB} SHARE RESULTS'), 1800);
	};

	setBusy(false);
}

/* ---------------------------------------------------------------- tooltip */

function hideTip() {
	tip.hidden = true;
}

function showTip(cell: HTMLElement) {
	const days = graphDays.get(cell.parentElement!);
	const day = days?.[Number(cell.dataset.i)];
	if (!day) return hideTip();

	tip.innerHTML = `<strong>${day.count === 0 ? 'NO' : numFmt.format(day.count)} CONTRIBUTION${day.count === 1 ? '' : 'S'}</strong><br>${fmtDate(day.date)}`;
	tip.hidden = false;

	const r = cell.getBoundingClientRect();
	const tw = tip.offsetWidth;
	const th = tip.offsetHeight;
	const x = Math.min(window.innerWidth - tw - 6, Math.max(6, r.left + r.width / 2 - tw / 2));
	let y = r.top - th - 12;
	if (y < 6) y = r.bottom + 12;
	tip.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}

/* ------------------------------------------------------------------ wire */

function init() {
	setupIntro();
	setupToggles();
	renderHistory();

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		retrigger(battleBtn, 'is-pressed');
		void battle();
	});

	inputs.forEach((input) => {
		input.addEventListener('input', () => {
			updateSlot(input);
			if (!errorEl.hidden) clearError();
		});
		updateSlot(input);
	});

	resultsEl.addEventListener('pointerover', (e) => {
		const cell = (e.target as Element).closest<HTMLElement>('.c[data-i]');
		if (cell) showTip(cell);
		else hideTip();
	});
	resultsEl.addEventListener('pointerleave', hideTip);
	window.addEventListener('scroll', hideTip, { passive: true });

	resultsEl.addEventListener('click', (e) => {
		const action = (e.target as Element).closest<HTMLElement>('[data-action="again"]');
		if (!action) return;
		window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
		inputs[0].focus({ preventScroll: true });
		inputs[0].select();
	});

	historyList.addEventListener('click', (e) => {
		const btn = (e.target as Element).closest<HTMLElement>('[data-rematch]');
		if (!btn || busy) return;
		const record = loadHistory()[Number(btn.dataset.rematch)];
		if (!record) return;
		inputs[0].value = record.p1;
		inputs[1].value = record.p2;
		inputs.forEach(updateSlot);
		void battle();
	});

	$('history-clear').addEventListener('click', () => {
		clearHistory();
		renderHistory([]);
		sfx.explosion();
	});
}

init();
