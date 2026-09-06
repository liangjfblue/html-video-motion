import type { ReactNode } from "react";
import "./motion.css";

interface Props {
  /** 1 = 3-column, 2 = 2-column. Chapters drive this per step. */
  variant?: 1 | 2;
  children: ReactNode;
  className?: string;
}

/**
 * Port of the component-lab "变形网格布局" — grid geometry morphs via a
 * CSS transition when `variant` flips. Step-driven (no timers), so the
 * morph lands exactly on the narration beat that calls for it.
 */
export function MorphGrid({ variant = 1, children, className }: Props) {
  return (
    <div className={`morph-grid morph-${variant} ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function MorphCell({ children }: { children: ReactNode }) {
  return <div className="morph-cell">{children}</div>;
}
