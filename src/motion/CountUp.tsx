import { useEffect, useRef, useState } from "react";
import { easeOutCubic } from "./anim";

interface Props {
  /** Target value: number, or string with suffix like "995.1K" / "73%". */
  value: number | string;
  duration?: number;
  delay?: number;
  /** Decimals when `value` is a plain number (inferred from strings). */
  decimals?: number;
  className?: string;
}

/**
 * Port of the component-lab "数字滚动计数器" — rAF count-up with cubic
 * ease-out, tabular digits. Parses "995.1K" / "73%" / "2,352" style
 * values (leading number + trailing non-numeric suffix, commas stripped).
 */
export function CountUp({
  value,
  duration = 1600,
  delay = 0,
  decimals,
  className,
}: Props) {
  const { target, suffix, inferredDecimals } = parseValue(value);
  const [display, setDisplay] = useState(() => format(0, decimals ?? inferredDecimals));
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const dec = decimals ?? inferredDecimals;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start == null) start = now + delay;
      const elapsed = now - start;
      if (elapsed < 0) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, elapsed / duration);
      setDisplay(format(target * easeOutCubic(p), dec));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, delay, decimals, inferredDecimals]);

  return (
    <span className={`cu-num ${className ?? ""}`}>
      {display}
      {suffix}
    </span>
  );
}

function parseValue(value: number | string) {
  if (typeof value === "number")
    return { target: value, suffix: "", inferredDecimals: 0 };
  const m = value.trim().match(/^(-?\d*\.?\d+)\s*(.*)$/);
  if (!m) return { target: 0, suffix: "", inferredDecimals: 0 };
  const raw = m[1]!;
  return {
    target: Number(raw),
    suffix: m[2]!,
    inferredDecimals: raw.includes(".") ? raw.split(".")![1]!.length : 0,
  };
}

function format(n: number, decimals: number): string {
  const fixed = n.toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const grouped = int!.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${grouped}.${frac}` : grouped;
}
