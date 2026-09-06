import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** ms，之后开始扫 */
  delay?: number;
  /** 扫过时长 ms */
  duration?: number;
  /** 荧光色，默认主题 --accent */
  color?: string;
  /** 落定后的常驻高亮透明度（0 = 扫完即散） */
  rest?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * HighlightSweep — 荧光笔扫过（emphasis 类）。
 * 旁白说到论点核心词的瞬间，一道荧光从左到右划过并落到常驻低亮。
 * 墨层垫在文字下方（z 序：ink 0 / 文字 relative），不遮字形。
 */
export function HighlightSweep({
  children,
  delay = 0,
  duration = 700,
  color,
  rest = 0.35,
  className,
  style,
}: Props) {
  const inkVars = {
    ["--hl-delay" as string]: `${delay}ms`,
    ["--hl-dur" as string]: `${duration}ms`,
    ["--hl-rest" as string]: rest,
    ["--hl-color" as string]: color ?? "var(--accent, #b98eff)",
  };
  return (
    <span className={`hl-sweep ${className ?? ""}`} style={style}>
      <i className="hl-sweep-ink" style={inkVars} aria-hidden="true" />
      <span className="hl-sweep-text">{children}</span>
    </span>
  );
}
