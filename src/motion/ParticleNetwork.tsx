import { useEffect, useRef } from "react";
import { cssVar, mulberry32 } from "./anim";

interface Props {
  /** Approximate particle count. */
  count?: number;
  seed?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Port of the component-lab "节点连线网络" — ambient canvas particle
 * network with proximity links. Uses a FIXED-SEED PRNG so every playback
 * of the same step is pixel-identical (deterministic recording).
 * Link/accent colors follow the theme's --accent token.
 */
export function ParticleNetwork({
  count = 60,
  seed = 42,
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
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

    const accent = cssVar("--accent", "#b98eff");
    const rand = mulberry32(seed);
    const pts: P[] = Array.from({ length: count }, () => ({
      x: rand() * W,
      y: rand() * H,
      vx: (rand() - 0.5) * 0.4,
      vy: (rand() - 0.5) * 0.4,
      r: 1 + rand() * 1.8,
    }));

    const LINK = 130;
    const step = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i]!.x - pts[j]!.x;
          const dy = pts[i]!.y - pts[j]!.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * 0.35;
            ctx.strokeStyle = accent;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i]!.x, pts[i]!.y);
            ctx.lineTo(pts[j]!.x, pts[j]!.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = accent;
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [count, seed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", ...style }}
    />
  );
}
