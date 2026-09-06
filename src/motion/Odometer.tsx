import { useEffect, useRef } from "react";
import { easeOutCubic } from "./anim";
import "./motion.css";

interface Props {
  /** 目标数字（支持小数，如 1.0） */
  value: number;
  decimals?: number;
  /** 千分位之外的固定前后缀（如 "M"/"%"），原样渲染不翻牌 */
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

interface Col {
  kind: "digit" | "char";
  ch: string;
  target: number; // digit 列的目标数字
  order: number;  // 越左越先落定
}

/**
 * Odometer — 数字翻牌（gsap 数字滚动的机械翻牌版）。
 * 每个数字位是一列 0-9 竖排字带，rAF 缓动滚到目标位；
 * 高位先落定、低位后落定，小数点/字母原样渲染。
 * 确定性：纯时间驱动 + easeOutCubic。
 */
export function Odometer({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1600,
  delay = 0,
  className,
}: Props) {
  const formatted = formatNumber(value, decimals);
  const cols: Col[] = [];
  let order = 0;
  for (const ch of formatted) {
    if (/\d/.test(ch)) {
      cols.push({ kind: "digit", ch, target: Number(ch), order: order++ });
    } else {
      cols.push({ kind: "char", ch, target: 0, order: 0 });
    }
  }
  const stripRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const tick = (now: number) => {
      if (start == null) start = now + delay;
      const t = now - start;
      if (t < 0) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      cols.forEach((col, i) => {
        if (col.kind !== "digit") return;
        const el = stripRefs.current[i];
        if (!el) return;
        const local = Math.min(1, Math.max(0, t / duration));
        const eased = easeOutCubic(local);
        el.style.transform = `translateY(${-col.target * eased}em)`;
      });
      if (t < duration + delay) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, duration, delay]);

  return (
    <span className={`od-num ${className ?? ""}`} aria-label={`${prefix}${formatted}${suffix}`}>
      {prefix}
      {cols.map((col, i) =>
        col.kind === "digit" ? (
          <span key={i} className="od-col">
            <span
              ref={(el) => {
                stripRefs.current[i] = el;
              }}
              className="od-strip"
            >
              {DIGITS.map((d) => (
                <span key={d} className="od-digit">
                  {d}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i}>{col.ch}</span>
        ),
      )}
      {suffix}
    </span>
  );
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function formatNumber(v: number, decimals: number): string {
  const fixed = v.toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const grouped = int!.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${grouped}.${frac}` : grouped;
}
