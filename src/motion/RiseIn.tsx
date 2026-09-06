import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** ms，之后开始上滑 */
  delay?: number;
  /** 上滑时长 ms */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * RiseIn — 行级遮罩上滑（gsap SplitText mask-reveal 的自研版）。
 * 外层 overflow:hidden 遮罩，内层从下方 112% 滑入，expo 缓动。
 * children 可包含任意带样式的 span（主题双色、荧光笔等不受影响）。
 */
export function RiseIn({
  children,
  delay = 0,
  duration = 900,
  className,
  style,
}: Props) {
  const outer: CSSProperties = {
    overflow: "hidden",
    display: "block",
    ...style,
  };
  const inner: CSSProperties = {
    display: "block", // 块级：children 的 text-align / 宽度行为不被收缩
    transform: "translateY(112%)",
    animation: `rise-unmask ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
    animationDelay: `${delay}ms`,
    paddingBottom: "0.12em",
    marginBottom: "-0.12em",
  };
  return (
    <div className={className} style={outer}>
      <span style={inner}>{children}</span>
    </div>
  );
}
