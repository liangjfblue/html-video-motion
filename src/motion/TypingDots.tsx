import type { CSSProperties } from "react";

interface Props {
  /** 点数，默认 3 */
  count?: number;
  /** ms，之后开始呼吸 */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * TypingDots — 打字点呼吸（ambient 类，吸收自官方 apple-motion
 * 构图的 iMessage typing dots：错相 180ms 上下呼吸）。
 * 旁白念到"正在生成/等待回复"类语义时垫状态感。
 */
export function TypingDots({ count = 3, delay = 0, className, style }: Props) {
  return (
    <span className={`fx-dots ${className ?? ""}`} style={style} role="status">
      {Array.from({ length: count }).map((_, i) => (
        <i key={i} style={{ ["--i" as string]: i, animationDelay: `${delay + i * 180}ms` }} />
      ))}
    </span>
  );
}
