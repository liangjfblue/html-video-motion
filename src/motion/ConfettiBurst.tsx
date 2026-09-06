import { useEffect, useRef } from "react";
import { cssVar, mulberry32 } from "./anim";
import "./motion.css";

interface Props {
  /** true 时触发一次爆发 */
  active: boolean;
  /** 纸屑数量 */
  count?: number;
  seed?: number;
  /** 爆发源（相对画布的比例坐标） */
  origin?: { x: number; y: number };
  /** 持续 ms，全部落定后停止 */
  duration?: number;
  className?: string;
}

interface P {
  x: number; y: number;
  vx: number; vy: number;
  rot: number; vr: number;
  w: number; h: number;
  color: string;
  born: number;
}

/**
 * ConfettiBurst — 金色纸屑爆发（gsap Physics2D 的 canvas 自研版）。
 * active 翻 true 的瞬间从 origin 喷发，重力+空气阻力+旋转，落定后自清。
 * 固定种子 + 主题色（--accent-gold/--primary/白），逐帧一致。
 */
export function ConfettiBurst({
  active,
  count = 140,
  seed = 7,
  origin = { x: 0.5, y: 0.32 },
  duration = 3200,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = parent.clientWidth;
    const H = parent.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const gold = cssVar("--accent-gold", "#ffc402");
    const purple = cssVar("--primary", "#b98eff");
    const white = cssVar("--text", "#f6f2e8");
    const COLORS = [gold, gold, gold, purple, white];

    const rand = mulberry32(seed);
    const ox = origin.x * W;
    const oy = origin.y * H;
    const parts: P[] = Array.from({ length: count }, () => {
      const angle = -Math.PI / 2 + (rand() - 0.5) * Math.PI * 1.1;
      const speed = 320 + rand() * 520;
      return {
        x: ox, y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: rand() * Math.PI * 2,
        vr: (rand() - 0.5) * 12,
        w: 5 + rand() * 7,
        h: 3 + rand() * 5,
        color: COLORS[Math.floor(rand() * COLORS.length)]!,
        born: 0,
      };
    });

    const t0 = performance.now();
    let last = t0;
    const G = 900;
    const DRAG = 0.995;

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, W, H);
      const elapsed = now - t0;
      let alive = false;
      for (const p of parts) {
        p.vy += G * dt;
        p.vx *= DRAG;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.y > H + 20) continue;
        // 纸屑渐隐（后半程）
        const fade = elapsed > duration * 0.6
          ? Math.max(0, 1 - (elapsed - duration * 0.6) / (duration * 0.4))
          : 1;
        if (fade <= 0) continue;
        alive = true;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive && elapsed < duration) {
        raf.current = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, W, H);
      }
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
      ctx.clearRect(0, 0, W, H);
    };
  }, [active, count, seed, origin.x, origin.y, duration]);

  return <canvas ref={canvasRef} className={`cf-canvas ${className ?? ""}`} />;
}
