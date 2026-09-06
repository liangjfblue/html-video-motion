import type { CSSProperties } from "react";

interface Props {
  /** 焦点位置 0–1（容器比例） */
  x?: number;
  y?: number;
  /** 焦点半径（容器短边比例，0–1） */
  radius?: number;
  /** 暗场强度 0–1 */
  dim?: number;
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Spotlight — 聚光压暗（emphasis 类）。
 * 全屏只看一个点：径向暗场罩在屏容器上，焦点处留出亮洞，
 * 挂载时从"略放大+全透明"聚焦落定。放在 relative 的屏容器内，
 * 压在内容之上（z-index 4，录制采集范围内）。
 */
export function Spotlight({
  x = 0.5,
  y = 0.42,
  radius = 0.24,
  dim = 0.72,
  delay = 0,
  duration = 900,
  className,
  style,
}: Props) {
  const vars = {
    ["--sp-x" as string]: `${(x * 100).toFixed(2)}%`,
    ["--sp-y" as string]: `${(y * 100).toFixed(2)}%`,
    ["--sp-r" as string]: `${(radius * 100).toFixed(2)}%`,
    ["--sp-dim" as string]: dim,
    ["--sp-delay" as string]: `${delay}ms`,
    ["--sp-dur" as string]: `${duration}ms`,
  };
  return (
    <div
      className={`spotlight ${className ?? ""}`}
      style={{ ...vars, ...style }}
      aria-hidden="true"
    />
  );
}
