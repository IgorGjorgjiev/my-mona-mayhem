import type { ContributionData, ContributionDay } from '../lib/contributions';

export interface PlayerStats {
	total: number;
	longestStreak: number;
	currentStreak: number;
	activeDays: number;
	bestDay: ContributionDay | null;
}

export function flatten(data: ContributionData): ContributionDay[] {
	return data.weeks.flatMap((w) => w.days);
}

export function computeStats(data: ContributionData): PlayerStats {
	const days = flatten(data);
	let longest = 0;
	let run = 0;
	let active = 0;
	let best: ContributionDay | null = null;

	for (const day of days) {
		if (day.count > 0) {
			run++;
			active++;
			if (run > longest) longest = run;
			if (!best || day.count > best.count) best = day;
		} else {
			run = 0;
		}
	}

	// Current streak counts back from the latest day; today with zero doesn't break it yet.
	let current = 0;
	for (let i = days.length - 1; i >= 0; i--) {
		if (days[i].count > 0) current++;
		else if (i === days.length - 1) continue;
		else break;
	}

	return { total: data.total, longestStreak: longest, currentStreak: current, activeDays: active, bestDay: best };
}
