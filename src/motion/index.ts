/**
 * Motion component library — ports of html-presentation's component-lab
 * "keep" set, rebuilt for the step engine:
 *
 *   StaggerText      错开文字显现（纯 CSS back-out 交错入场）
 *   Typewriter       打字机标题（rAF 逐字）
 *   CountUp          数字滚动计数器（rAF + ease-out，解析 "995.1K"/"73%"）
 *   SvgDraw          SVG 路径描绘（rAF stroke-dashoffset，流程图/路线图）
 *   ParticleNetwork  节点连线网络（canvas，固定种子 → 录制可复现）
 *   MorphGrid        变形网格布局（step 驱动的网格几何过渡）
 *   DynamicChart     动态数据图表（ECharts 封装 + 主题令牌预设）
 *
 * 视觉增强（2026-09 扩充，emphasis/ambient 补齐）：
 *   HighlightSweep   荧光笔扫过（论点核心词）
 *   Spotlight        聚光压暗（全屏只看一个点）
 *   ScanSweep        扫描光带（证据卡被"检查"一次）
 *   Aurora           极光氛围（低速渐变底，纯 CSS 可复现）
 *   ShimmerText      渐变字扫光（官方 thinking-big 手法）
 *   TypingDots       打字点呼吸（官方 apple-motion 手法）
 *   registry.ts      全部动效能力注册表（六类 × react/css/hyperframes），
 *                    选型查表入口，能力地图见 docs/visual-enhancement.md
 *   （fx-focus-in / fx-whip-* / fx-bubble-pop / fx-punch-zoom /
 *     fx-capture-pulse 在 animations.css，同样已登记注册表）
 *
 * All components animate ON MOUNT and read colors from CSS custom
 * properties, so they follow the active theme and replay on step change.
 *
 * Deferred from the lab's keep list (documented decision):
 *   • three-product 3D 展台 — needs the `three` dependency; not required
 *     by current content. Add later as a lazy-import component.
 *   • lottie-icon — needs lottie-web + JSON assets; skipped.
 */
export { StaggerText } from "./StaggerText";
export { Typewriter } from "./Typewriter";
export { CountUp } from "./CountUp";
export { SvgDraw } from "./SvgDraw";
export { ParticleNetwork } from "./ParticleNetwork";
export { MorphGrid, MorphCell } from "./MorphGrid";
export { DynamicChart, themeSalesOption } from "./DynamicChart";
export { ScrambleText } from "./ScrambleText";
export { RiseIn } from "./RiseIn";
export { ConfettiBurst } from "./ConfettiBurst";
export { Odometer } from "./Odometer";
export { RingProgress } from "./RingProgress";
export { HighlightSweep } from "./HighlightSweep";
export { Spotlight } from "./Spotlight";
export { ScanSweep } from "./ScanSweep";
export { Aurora } from "./Aurora";
export { ShimmerText } from "./ShimmerText";
export { TypingDots } from "./TypingDots";
export { MediaCard, CardStage } from "./MediaCard";
export {
  ENHANCEMENTS,
  byCategory,
  byKind,
  getEnhancement,
} from "./registry";
export type { Enhancement, EnhCategory, EnhKind } from "./registry";
