/**
 * sources.ts — 每条能力的「100% 复刻材料」。
 *
 * 用 Vite ?raw 把动效源码（组件 TSX / CSS 关键帧 / HY 合成 HTML）原样
 * 打进组件库页，「给 agent」复制出的契约自带全部实现——agent 不需要
 * 访问本仓库即可复刻。CSS 关联块按「源码里出现过的类名/关键帧名」
 * 从 animations.css + motion.css 自动提取。
 */
import RiseInSrc from "../motion/RiseIn.tsx?raw";
import StaggerTextSrc from "../motion/StaggerText.tsx?raw";
import TypewriterSrc from "../motion/Typewriter.tsx?raw";
import ScrambleTextSrc from "../motion/ScrambleText.tsx?raw";
import HighlightSweepSrc from "../motion/HighlightSweep.tsx?raw";
import SpotlightSrc from "../motion/Spotlight.tsx?raw";
import ScanSweepSrc from "../motion/ScanSweep.tsx?raw";
import ShimmerTextSrc from "../motion/ShimmerText.tsx?raw";
import TypingDotsSrc from "../motion/TypingDots.tsx?raw";
import CountUpSrc from "../motion/CountUp.tsx?raw";
import OdometerSrc from "../motion/Odometer.tsx?raw";
import RingProgressSrc from "../motion/RingProgress.tsx?raw";
import DynamicChartSrc from "../motion/DynamicChart.tsx?raw";
import SvgDrawSrc from "../motion/SvgDraw.tsx?raw";
import MorphGridSrc from "../motion/MorphGrid.tsx?raw";
import ParticleNetworkSrc from "../motion/ParticleNetwork.tsx?raw";
import AuroraSrc from "../motion/Aurora.tsx?raw";
import ConfettiBurstSrc from "../motion/ConfettiBurst.tsx?raw";
import MediaCardSrc from "../motion/MediaCard.tsx?raw";
import AnimSrc from "../motion/anim.ts?raw";
import AnimationsCssSrc from "../styles/animations.css?raw";
import MotionCssSrc from "../motion/motion.css?raw";
import HyB01Src from "../../compositions/b01-hook.html?raw";
import HyB03Src from "../../compositions/b03-gap.html?raw";
import HyB09Src from "../../compositions/b09-cta.html?raw";
import HyDubHookSrc from "../../compositions/dub-hook.html?raw";
import HyDubGachaSrc from "../../compositions/dub-gacha.html?raw";
import HyDubPunctSrc from "../../compositions/dub-punct.html?raw";
import HyDubChecklistSrc from "../../compositions/dub-checklist.html?raw";
import HyTplChatSrc from "../../compositions/tpl-chat-pop.html?raw";
import HyTplCursorSrc from "../../compositions/tpl-cursor-morph.html?raw";
import HyTplMediaSrc from "../../compositions/tpl-media-canvas.html?raw";
import GsapSrc from "../../vendor/gsap/dist/gsap.min.js?raw";
import SpaceGrotesk500 from "../../public/fonts/space-grotesk-500-normal.woff2?inline";
import SpaceGrotesk700 from "../../public/fonts/space-grotesk-700-normal.woff2?inline";
import DemoCardSvg from "../../public/media/demo-card.svg?raw";

import type { AgentNote } from "../motion/agent-notes";
import { ENHANCEMENTS, type Enhancement } from "../motion/registry";

/* ── react 组件：id → 源码 ─────────────────────── */
const REACT_SRC: Record<string, string> = {
  "rise-in": RiseInSrc,
  "stagger-text": StaggerTextSrc,
  typewriter: TypewriterSrc,
  "scramble-text": ScrambleTextSrc,
  "highlight-sweep": HighlightSweepSrc,
  spotlight: SpotlightSrc,
  "scan-sweep": ScanSweepSrc,
  "shimmer-text": ShimmerTextSrc,
  "typing-dots": TypingDotsSrc,
  "count-up": CountUpSrc,
  odometer: OdometerSrc,
  "ring-progress": RingProgressSrc,
  "dynamic-chart": DynamicChartSrc,
  "svg-draw": SvgDrawSrc,
  "morph-grid": MorphGridSrc,
  "particle-network": ParticleNetworkSrc,
  aurora: AuroraSrc,
  "confetti-burst": ConfettiBurstSrc,
  "card-stage": MediaCardSrc,
};

/* ── css 类动效：id → 源码里可检索的类名/关键帧名 ── */
const CSS_TOKENS: Record<string, string[]> = {
  "mask-reveal": ["mask-reveal"],
  "rule-grow": ["rule-grow"],
  "kf-scale-in": ["scale-in"],
  "kf-pop-in": ["pop-in"],
  "letter-stagger": ["letter-stagger", "letter-rise"],
  "fx-focus-in": ["fx-focus-in"],
  "fx-whip-pan": ["fx-whip"],
  "fx-bubble-pop": ["fx-bubble-pop"],
  "shot-emphasis": ["xx-shot", "xx-shot-wide"],
  "pulse-halo": ["pulse-halo"],
  "fx-punch-zoom": ["fx-punch-zoom"],
  "fx-capture-pulse": ["fx-capture-pulse"],
};

/* ── hyperframes 合成：id → 完整 HTML 源码 ──────── */
const HY_SRC: Record<string, string> = {
  "hy-hook-card": HyB01Src,
  "hy-gap-card": HyB03Src,
  "hy-cta-card": HyB09Src,
  "dub-hook": HyDubHookSrc,
  "dub-gacha": HyDubGachaSrc,
  "dub-punct": HyDubPunctSrc,
  "dub-checklist": HyDubChecklistSrc,
  "tpl-chat-pop": HyTplChatSrc,
  "tpl-cursor-morph": HyTplCursorSrc,
  "tpl-media-canvas": HyTplMediaSrc,
};

/** 复刻时随附的主题变量默认值（深色；可整体换肤） */
const THEME_TOKENS = `:root {
  --accent: #b98eff;
  --primary: #5a8cff;
  --accent-gold: #ffc402;
  --text: #f6f2e8;
  --text-muted: #9a958a;
  --shell: #08090d;
  --bg: rgba(255, 255, 255, 0.03);
  --card-bg: rgba(255, 255, 255, 0.06);
  --border: rgba(255, 255, 255, 0.16);
  --ease-quart: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-expo: cubic-bezier(0.86, 0, 0.07, 1);
  --ease-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-slow: 900ms;
  --dur-cinematic: 1400ms;
}`;

/** 把 CSS 文本按顶层块（含紧邻注释）切开 */
function topBlocks(css: string): string[] {
  const blocks: string[] = [];
  let depth = 0;
  let seg = -1;
  for (let i = 0; i < css.length; i++) {
    if (css.startsWith("/*", i)) {
      const e = css.indexOf("*/", i + 2);
      if (e >= 0) { i = e + 1; continue; }
    }
    const ch = css[i];
    if (depth === 0 && seg < 0 && !/\s/.test(ch)) seg = i;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0 && seg >= 0) { blocks.push(css.slice(seg, i + 1)); seg = -1; }
    }
  }
  return blocks;
}

/** 从两份公共 CSS 中提取与 tokens 相关的顶层块（类名或关键帧名出现在 tokens 里） */
function extractCss(tokens: string[]): string {
  if (!tokens.length) return "";
  const blocks = [...topBlocks(AnimationsCssSrc), ...topBlocks(MotionCssSrc)];
  const selected = new Set(tokens);
  let previousSize = -1;

  while (selected.size !== previousSize) {
    previousSize = selected.size;
    const current = blocks.filter((b) => blockMatches(b, selected));
    const currentCss = current.join("\n");
    for (const block of blocks) {
      const keyframe = block.match(/@keyframes\s+([\w-]+)/)?.[1];
      if (keyframe && currentCss.includes(keyframe)) selected.add(keyframe);
    }
  }

  return blocks.filter((b) => blockMatches(b, selected)).join("\n\n");
}

function blockMatches(block: string, tokens: Set<string>): boolean {
  const keyframe = block.match(/@keyframes\s+([\w-]+)/)?.[1];
  if (keyframe && tokens.has(keyframe)) return true;
  const heads = block.split("{", 1)[0];
  const classes = heads.match(/\.([\w-]+)/g)?.map((s) => s.slice(1)) ?? [];
  return classes.some((className) => tokens.has(className));
}

/** react 组件的依赖样式：组件源码里出现过的类名/关键帧名 → 关联 CSS 块 */
function extractCssFor(src: string): string {
  const tokens = [...topBlocks(AnimationsCssSrc), ...topBlocks(MotionCssSrc)]
    .map((b) => {
      const kf = b.match(/@keyframes\s+([\w-]+)/)?.[1];
      if (kf && src.includes(kf)) return kf;
      const heads = b.split("{", 1)[0];
      return heads.match(/\.([\w-]+)/g)?.map((s) => s.slice(1)).find((c) => c.length > 3 && src.includes(c));
    })
    .filter((t): t is string => Boolean(t));
  return extractCss([...new Set(tokens)]);
}

const fence = (lang: string, text: string) => `\`\`\`${lang}\n${text.trim()}\n\`\`\``;

const dataSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(DemoCardSvg)}`;

/** 把仓库内的 HY 合成转换成真正的单文件版本：内联运行时/字体/示例素材并自动循环。 */
function standaloneHy(src: string): string {
  const autoplay = `<script>
window.addEventListener("load", () => {
  for (const timeline of Object.values(window.__timelines || {})) {
    timeline.repeat(-1).play(0);
  }
});
</script>`;

  return src
    .replace(/<script src="\.\.\/vendor\/gsap\/dist\/gsap\.min\.js"><\/script>/g, `<script>${GsapSrc}</script>`)
    .replace(/(?:\.\.\/)?fonts\/space-grotesk-500-normal\.woff2/g, SpaceGrotesk500)
    .replace(/(?:\.\.\/)?fonts\/space-grotesk-700-normal\.woff2/g, SpaceGrotesk700)
    .replace(/\.\.\/media\/proposal-card\.png/g, dataSvg)
    .replace("</body>", `${autoplay}\n</body>`);
}

function missingKeyframes(css: string): string[] {
  const allCss = `${AnimationsCssSrc}\n${MotionCssSrc}`;
  const known = [...allCss.matchAll(/@keyframes\s+([\w-]+)/g)].map((match) => match[1]);
  return known.filter((name) => css.includes(name) && !css.includes(`@keyframes ${name}`));
}

export interface SpecAudit {
  checked: number;
  errors: string[];
}

/** 构建/CI 使用：确保 41 条复制契约的源码映射与关键依赖完整。 */
export function auditAgentSpecs(): SpecAudit {
  const errors: string[] = [];

  for (const item of ENHANCEMENTS) {
    if (item.kind === "react") {
      const src = REACT_SRC[item.id];
      if (!src) {
        errors.push(`${item.id}: 缺少 React 源码`);
        continue;
      }
      const localImports = [...src.matchAll(/from\s+["'](\.\/[^"']+)["']/g)].map((match) => match[1]);
      const unsupported = localImports.filter((path) => path !== "./anim");
      if (unsupported.length) errors.push(`${item.id}: 未附带本地依赖 ${unsupported.join(", ")}`);
      const missing = missingKeyframes(extractCssFor(src));
      if (missing.length) errors.push(`${item.id}: 缺少关键帧 ${missing.join(", ")}`);
    } else if (item.kind === "css") {
      if (!CSS_TOKENS[item.id]) {
        errors.push(`${item.id}: 缺少 CSS 映射`);
        continue;
      }
      const missing = missingKeyframes(extractCss(CSS_TOKENS[item.id]));
      if (missing.length) errors.push(`${item.id}: 缺少关键帧 ${missing.join(", ")}`);
    } else {
      const src = HY_SRC[item.id];
      if (!src) {
        errors.push(`${item.id}: 缺少 HY 源码`);
        continue;
      }
      const standalone = standaloneHy(src);
      if (/\.\.\/(?:vendor|fonts|media)\//.test(standalone)) errors.push(`${item.id}: 仍有仓库相对资源`);
      if (!standalone.includes("timeline.repeat(-1).play(0)")) errors.push(`${item.id}: 缺少自动播放启动器`);
    }
  }

  return { checked: ENHANCEMENTS.length, errors };
}

/**
 * 组装自包含的 agent 契约：完整源码 + 依赖样式 + 主题默认值，
 * agent 拿到即可在任意项目 100% 复刻，无需访问本仓库。
 */
export function buildSpec(e: Enhancement, note: AgentNote, kindLabel: string, catLabel: string, apiPublic?: string): string {
  const api = apiPublic ?? e.api;
  const head = [
    `【视觉增强】${e.name}（${e.id}）· ${catLabel} · ${kindLabel}`,
    `何时用: ${e.use}`,
    `用法: ${api}`,
  ];
  if (note.params) head.push(`参数: ${note.params}`);
  if (note.timing) head.push(`时机: ${note.timing}`);
  if (note.dont) head.push(`不要: ${note.dont}`);
  head.push("约束: 挂载即动（无手势、无外部状态）· 固定 seed 输出确定 · 颜色只读下列 CSS 变量");

  let body: string;
  if (e.kind === "react") {
    const src = REACT_SRC[e.id] ?? "";
    const usesAnim = /from "\.\/anim"/.test(src);
    const deps = ["React 16.8+", ...(e.id === "dynamic-chart" ? ["echarts ^5"] : [])].join("、");
    const css = extractCssFor(src);
    body = [
      `## 复刻材料（自包含，无需访问原仓库）`,
      `① 依赖: ${deps}`,
      `② 组件源码:`,
      fence("tsx", src),
      ...(usesAnim ? [`③ 工具函数 anim.ts:`, fence("ts", AnimSrc)] : []),
      `${usesAnim ? "④" : "③"} 关联样式（已从公共样式表提取，类名/关键帧与组件一一对应）:`,
      fence("css", css || "/* 无额外样式 */"),
      `${usesAnim ? "⑤" : "④"} 主题变量默认值（挂到 :root 即可跑，可整体换肤）:`,
      fence("css", THEME_TOKENS),
    ].join("\n");
  } else if (e.kind === "css") {
    const tokens = CSS_TOKENS[e.id] ?? [];
    const css = extractCss(tokens);
    body = [
      `## 复刻材料（自包含）`,
      `① 集成: 把下方样式加入全局 CSS，再按顶部“用法”创建元素；只有用法中明确包含 .in 的效果需要用 .in 触发`,
      `② 样式源码:`,
      fence("css", css || "/* 见 animations.css */"),
      `③ 主题变量默认值:`,
      fence("css", THEME_TOKENS),
      `④ 验收: 元素挂载后应在浏览器中产生可见的 transform / opacity / clip-path 变化，且控制台无缺失关键帧错误`,
    ].join("\n");
  } else {
    const html = standaloneHy(HY_SRC[e.id] ?? "");
    body = [
      `## 复刻材料（单文件，可直接运行）`,
      `① 保存为任意 .html 文件并在浏览器打开；GSAP、英文字体和示例素材均已内联，加载后会自动循环播放:`,
      fence("html", html),
      `② 修改: 文案直接改 HTML；节拍修改脚本顶部的 T 常量或 GSAP timeline 时间点`,
      `③ 接入: 可放进 iframe 直接预览，也可按 1920×1080、25fps 渲染成视频后整段接入`,
      `④ 验收: 离开本仓库单独打开仍应自动播放，控制台不得出现 gsap 未定义或本地资源 404`,
    ].join("\n");
  }

  return [...head, body].join("\n\n");
}
