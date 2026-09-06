import { useEffect, useRef } from "react";
import { cssVar, easeInOutCubic } from "./anim";

interface Props {
  /** SVG path `d` strings, drawn in order with a stagger. */
  paths: string[];
  viewBox?: string;
  duration?: number;
  /** ms between path starts. */
  stagger?: number;
  stroke?: string;
  strokeWidth?: number;
  /** Easing for each path draw. */
  width?: number | string;
  height?: number | string;
  className?: string;
}

/**
 * Port of the component-lab "SVG 路径描绘" — measures each path, then
 * animates stroke-dashoffset → 0 (rAF, ease-in-out). Flow diagrams /
 * route maps that draw themselves when the step mounts.
 */
export function SvgDraw({
  paths,
  viewBox = "0 0 1000 400",
  duration = 1400,
  stagger = 250,
  stroke,
  strokeWidth = 3,
  width = "100%",
  height = "auto",
  className,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const els = Array.from(svg.querySelectorAll<SVGPathElement>("path[data-draw]"));
    const lens = els.map((p) => p.getTotalLength());
    els.forEach((p, i) => {
      p.style.strokeDasharray = `${lens[i]}`;
      p.style.strokeDashoffset = `${lens[i]}`;
      p.style.opacity = "1";
    });

    let start: number | null = null;
    const totalStagger = stagger * Math.max(0, els.length - 1);
    const total = totalStagger + duration;

    const tick = (now: number) => {
      if (start == null) start = now;
      const t = now - start;
      els.forEach((p, i) => {
        const local = (t - i * stagger) / duration;
        const clamped = Math.max(0, Math.min(1, local));
        p.style.strokeDashoffset = `${lens[i]! * (1 - easeInOutCubic(clamped))}`;
      });
      if (t < total) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [paths, duration, stagger]);

  const strokeColor = stroke ?? cssVar("--primary", cssVar("--accent", "#b98eff"));

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      width={width}
      height={height}
      className={className}
      fill="none"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          data-draw
          d={d}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0 }}
        />
      ))}
    </svg>
  );
}
