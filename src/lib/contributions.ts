export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
	/** ISO date, YYYY-MM-DD (UTC) */
	date: string;
	count: number;
	level: ContributionLevel;
}

export interface ContributionWeek {
	firstDay: string;
	days: ContributionDay[];
}

export interface ContributionData {
	username: string;
	from: string;
	to: string;
	total: number;
	/** Colors for levels 0-4, as returned by GitHub */
	colors: string[];
	weeks: ContributionWeek[];
}

export interface ApiError {
	error: string;
}

export const DEFAULT_COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

export const USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
