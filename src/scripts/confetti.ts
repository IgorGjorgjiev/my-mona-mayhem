// Pixel confetti on a single canvas. Runs only for a short burst, then stops its loop.

interface Piece {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	color: string;
	spin: number;
}

const DURATION_MS = 3200;
const GRAVITY = 0.32;

let running = 0;

export function burst(canvas: HTMLCanvasElement, colors: string[]) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const w = window.innerWidth;
	const h = window.innerHeight;
	canvas.width = w * dpr;
	canvas.height = h * dpr;
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	const count = w < 640 ? 90 : 160;
	const pieces: Piece[] = Array.from({ length: count }, (_, i) => {
		const fromLeft = i % 2 === 0;
		return {
			x: fromLeft ? -10 : w + 10,
			y: h * (0.55 + Math.random() * 0.3),
			vx: (fromLeft ? 1 : -1) * (5 + Math.random() * 9),
			vy: -(10 + Math.random() * 12),
			size: 4 + Math.floor(Math.random() * 3) * 2,
			color: colors[i % colors.length],
			spin: Math.random(),
		};
	});

	const id = ++running;
	const start = performance.now();

	const frame = (now: number) => {
		if (id !== running) return;
		const elapsed = now - start;
		ctx.clearRect(0, 0, w, h);
		ctx.globalAlpha = elapsed > DURATION_MS - 600 ? Math.max(0, (DURATION_MS - elapsed) / 600) : 1;

		for (const p of pieces) {
			p.vy += GRAVITY;
			p.vx *= 0.985;
			p.x += p.vx;
			p.y += p.vy;
			// Fake 3D flip by squashing height, snapped to whole pixels for the retro look.
			const squash = Math.abs(Math.cos(elapsed / 120 + p.spin * 6));
			ctx.fillStyle = p.color;
			ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, Math.max(2, Math.round(p.size * squash)));
		}

		if (elapsed < DURATION_MS) requestAnimationFrame(frame);
		else ctx.clearRect(0, 0, w, h);
	};
	requestAnimationFrame(frame);
}
