import { useMemo } from "react";
import "./motion.css";

interface Props {
  text: string;
  /** Split granularity. Chinese titles usually want "char". */
  by?: "word" | "char";
  /** ms before the first unit appears. */
  delay?: number;
  /** ms between units. */
  stagger?: number;
  className?: string;
}

/**
 * Port of the component-lab "错开文字显现" (stagger-text) — units rise
 * with a back-out overshoot, pure CSS (no animation library). Replays on
 * mount, so a step change restarts it. Colors inherit from context.
 */
export function StaggerText({
  text,
  by = "char",
  delay = 0,
  stagger = 80,
  className,
}: Props) {
  const units = useMemo(
    () => (by === "word" ? text.split(/(\s+)/) : [...text]),
    [text, by],
  );
  let visibleIndex = 0;
  return (
    <span className={`st-text ${className ?? ""}`}>
      {units.map((u, i) => {
        if (/^\s+$/.test(u)) return <span key={i}>{u}</span>;
        const d = delay + visibleIndex++ * stagger;
        return (
          <span
            key={i}
            className="st-unit"
            style={{ ["--st-delay" as string]: `${d}ms` }}
          >
            {u}
          </span>
        );
      })}
    </span>
  );
}
