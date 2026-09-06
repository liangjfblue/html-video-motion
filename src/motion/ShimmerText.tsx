import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** ms，之后开始扫光 */
  delay?: number;
  /** 单次扫光时长 ms */
  duration?: number;
  /** 扫光次数（默认 1；金句可 2） */
  repeat?: number;
  /** 底色，默认主题 --text */
  baseColor?: string;
  /** 光带色，默认白（配暗主题） */
  color?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * ShimmerText — 渐变字表面扫光（emphasis 类，吸收自官方
 * hyperframes-launches thinking-big 构图：background-clip:text +
 * backgroundPosition 140% → -140% 补间）。旁白点到金句时让光从
 * 字面上流过一次；底色/光带色走主题令牌。
 */
export function ShimmerText({
  children,
  delay = 0,
  duration = 900,
  repeat = 1,
  baseColor,
  color,
  className,
  style,
}: Props) {
  const vars = {
    ["--sh-delay" as string]: `${delay}ms`,
    ["--sh-dur" as string]: `${duration}ms`,
    ["--sh-repeat" as string]: repeat,
    ...(baseColor ? { ["--sh-base" as string]: baseColor } : {}),
    ...(color ? { ["--sh-color" as string]: color } : {}),
  };
  return (
    <span className={`shimmer-text ${className ?? ""}`} style={{ ...vars, ...style }}>
      <span className="shimmer-text-inner">{children}</span>
    </span>
  );
}
