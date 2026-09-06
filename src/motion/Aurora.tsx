import type { CSSProperties } from "react";

interface Props {
  /** 速度倍率（1 = 基准 16s 循环；越大越快） */
  speed?: number;
  /** 整体不透明度 0–1 */
  opacity?: number;
  /** 主色（副色自动取 --primary），默认主题 --accent */
  color?: string;
  /** 相位种子：多实例不同步（同屏多块 Aurora 时错开） */
  seed?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Aurora — 极光氛围（ambient 类）。
 * 两团大半径径向渐变经重模糊后沿长周期错相漂移，给抽象/情绪屏
 * 一层低速生命感。纯 CSS 循环、无随机数——实时录制与 seek 渲染
 * 都可复现。放在 relative + overflow:hidden 容器内（z 序 0，
 * 内容正常压在上面）。
 */
export function Aurora({
  speed = 1,
  opacity = 0.5,
  color,
  seed = 0,
  className,
  style,
}: Props) {
  const base = 16 / Math.max(0.25, speed);
  const phase = -(seed % 97) / 7; // 负延迟偏移相位，秒
  const vars = {
    ["--au-dur" as string]: `${base.toFixed(2)}s`,
    ["--au-opacity" as string]: opacity,
    ["--au-phase" as string]: `${phase.toFixed(2)}s`,
    ["--au-c1" as string]: color ?? "var(--accent, #b98eff)",
  };
  return (
    <div
      className={`aurora ${className ?? ""}`}
      style={{ ...vars, ...style }}
      aria-hidden="true"
    >
      <i className="au-a" />
      <i className="au-b" />
    </div>
  );
}
