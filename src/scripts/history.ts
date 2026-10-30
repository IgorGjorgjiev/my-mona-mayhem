const HISTORY_KEY = 'mm:history';
const MAX_ENTRIES = 10;

export interface BattleRecord {
	p1: string;
	p2: string;
	total1: number;
	total2: number;
	/** Username of the winner, or null for a tie */
	winner: string | null;
	at: number;
}

export function loadHistory(): BattleRecord[] {
	try {
		const parsed: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
		return Array.isArray(parsed) ? (parsed as BattleRecord[]).filter((r) => r && typeof r.p1 === 'string').slice(0, MAX_ENTRIES) : [];
	} catch {
		return [];
	}
}

export function saveBattle(record: BattleRecord): BattleRecord[] {
	const list = [record, ...loadHistory()].slice(0, MAX_ENTRIES);
	try {
		localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
	} catch {}
	return list;
}

export function clearHistory() {
	try {
		localStorage.removeItem(HISTORY_KEY);
	} catch {}
}
