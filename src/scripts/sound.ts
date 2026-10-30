// Retro sound effects generated with the Web Audio API (no audio files).

const MUTE_KEY = 'mm:muted';

let ctx: AudioContext | null = null;
let muted = readMuted();

function readMuted(): boolean {
	try {
		return localStorage.getItem(MUTE_KEY) === '1';
	} catch {
		return false;
	}
}

function audio(): AudioContext | null {
	if (muted) return null;
	if (!ctx) {
		const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!Ctor) return null;
		ctx = new Ctor();
	}
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'square', volume = 0.07, endFreq?: number) {
	const ac = audio();
	if (!ac) return;
	const t = ac.currentTime + start;
	const osc = ac.createOscillator();
	const gain = ac.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, t);
	if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
	gain.gain.setValueAtTime(volume, t);
	gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
	osc.connect(gain).connect(ac.destination);
	osc.start(t);
	osc.stop(t + duration + 0.02);
}

function noise(duration: number, volume = 0.35) {
	const ac = audio();
	if (!ac) return;
	const t = ac.currentTime;
	const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * duration), ac.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

	const src = ac.createBufferSource();
	src.buffer = buffer;
	const filter = ac.createBiquadFilter();
	filter.type = 'lowpass';
	filter.frequency.setValueAtTime(2400, t);
	filter.frequency.exponentialRampToValueAtTime(60, t + duration);
	const gain = ac.createGain();
	gain.gain.setValueAtTime(volume, t);
	gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
	src.connect(filter).connect(gain).connect(ac.destination);
	src.start(t);
}

export const sfx = {
	coin() {
		tone(988, 0, 0.09);
		tone(1319, 0.09, 0.4);
	},
	tick() {
		tone(440, 0, 0.14, 'square', 0.06);
	},
	fight() {
		tone(196, 0, 0.45, 'sawtooth', 0.08, 784);
		tone(392, 0.05, 0.4, 'square', 0.05, 1568);
	},
	powerUp() {
		[523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.07, 0.13));
		tone(1568, 0.36, 0.45);
	},
	explosion() {
		noise(0.7);
		tone(140, 0, 0.5, 'square', 0.08, 35);
	},
	error() {
		tone(196, 0, 0.12, 'square', 0.06);
		tone(147, 0.12, 0.2, 'square', 0.06);
	},
	blip() {
		tone(880, 0, 0.05, 'square', 0.04);
	},
};

export function isMuted() {
	return muted;
}

export function setMuted(value: boolean) {
	muted = value;
	try {
		localStorage.setItem(MUTE_KEY, value ? '1' : '0');
	} catch {}
	if (value && ctx) void ctx.suspend();
}
