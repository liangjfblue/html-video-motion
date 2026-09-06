import type { CSSProperties } from "react";

interface Props {
  delay?: number;
  /** 掠过时长 ms */
  duration?: number;
  /** 光带宽度（容器宽比例 0–1） */
  width?: number;
  /** 光带颜色，默认主题 --accent 的半透明 */
  color?: string;
  /** 光带走向（deg，100 ≈ 微斜向右下） */
  angle?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * ScanSweep — 扫描光带（emphasis 类）。
 * 一道斜向光带在卡片/截图上掠过一次，像被"检查"过。
 * 放进 position:relative + overflow:hidden 的卡内使用；
 * 终点位移用 calc(100%/width) 换算，保证任何宽度都完整出画。
 */
export function ScanSweep({
  delay = 0,
  duration = 1100,
  width = 0.3,
  color,
  angle = 100,
  className,
  style,
}: Props) {
  const vars = {
    ["--sw-delay" as string]: `${delay}ms`,
    ["--sw-dur" as string]: `${duration}ms`,
    ["--sw-w" as string]: width,
    ["--sw-color" as string]:
      color ?? "var(--sweep, rgba(185, 142, 255, 0.28))",
    ["--sw-angle" as string]: `${angle}deg`,
  };
  return (
    <span
      className={`scan-sweep ${className ?? ""}`}
      style={{ ...vars, ...style }}
      aria-hidden="true"
    >
      <i />
    </span>
  );
}
