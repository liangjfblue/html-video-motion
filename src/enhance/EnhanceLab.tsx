import { useEffect, useRef, useState } from "react";
import {
  ENHANCEMENTS,
  RiseIn,
  StaggerText,
  Typewriter,
  ScrambleText,
  HighlightSweep,
  Spotlight,
  ScanSweep,
  Aurora,
  ShimmerText,
  TypingDots,
  CountUp,
  Odometer,
  RingProgress,
  themeSalesOption,
  SvgDraw,
  MorphGrid,
  MorphCell,
  ParticleNetwork,
  ConfettiBurst,
  MediaCard,
  CardStage,
} from "../motion";
import type { EnhCategory, Enhancement } from "../motion";
import * as echarts from "echarts";
import { AGENT_NOTES } from "../motion/agent-notes";
import { buildSpec } from "./sources";
import "./EnhanceLab.css";

/**
 * ?enhance=1 — 视觉增强组件库页（Visual Enhancement Lab）。
 *
 * 注册表（src/motion/registry.ts）驱动的能力目录：大卡 2 列，每格
 * 上半是真机演示舞台（LIVE PREVIEW），下半是 场景 / 用法 / 要点 三行；
 * hyperframes 形态直接 iframe 实播合成 timeline（循环）。
 * 章节构建前在这里选型试效果，选好按 api 抄进章节；加新能力必须在
 * 这里可见（docs/visual-enhancement.md §扩展协议）。
 *
 * 右上角主题切换会重挂全部演示，让依赖 CSS 变量的 Canvas / ECharts
 * 组件也能在三套主题下重新读取颜色。
 */

const CATS: { id: EnhCategory | "all"; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "entrance", label: "入场" },
  { id: "emphasis", label: "强调" },
  { id: "data", label: "数据" },
  { id: "flow", label: "流程" },
  { id: "ambient", label: "氛围" },
  { id: "finale", label: "收尾" },
];

const CAT_LABEL: Record<EnhCategory, string> = {
  entrance: "入场",
  emphasis: "强调",
  data: "数据",
  flow: "流程",
  ambient: "氛围",
  finale: "收尾",
};

const KIND_LABEL: Record<Enhancement["kind"], string> = {
  react: "React · live",
  css: "CSS · live",
  hyperframes: "HY · baked",
};

type Theme = "dark" | "light" | "blueprint";

const THEMES: { id: Theme; label: string }[] = [
  { id: "dark", label: "夜幕" },
  { id: "light", label: "纸白" },
  { id: "blueprint", label: "蓝图" },
];

function initialTheme(): Theme {
  const saved = window.localStorage.getItem("html-video-motion-theme");
  return THEMES.some((theme) => theme.id === saved) ? (saved as Theme) : "dark";
}

/** css 入场类演示用：挂载 350ms 后加 .in 触发过渡 */
function useInAfter(ms = 350): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(t);
  }, []);
  return on;
}

/** MorphGrid 演示：2.4s 循环翻转 variant（仅预览页用，不进录制） */
function MorphDemo() {
  const [v, setV] = useState<1 | 2>(1);
  useEffect(() => {
    const t = setInterval(() => setV((p) => (p === 1 ? 2 : 1)), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <MorphGrid variant={v} className="el-morph">
      <MorphCell><b>A</b></MorphCell>
      <MorphCell><b>B</b></MorphCell>
      <MorphCell><b>C</b></MorphCell>
      <MorphCell><b>D</b></MorphCell>
      <MorphCell><b>E</b></MorphCell>
      <MorphCell><b>F</b></MorphCell>
    </MorphGrid>
  );
}

/** HY 合成实播：iframe 加载后把 window.__timelines 全部 loop 播放。
 *  合成是 1920×1080 固定画布，等比 scale 进 16:9 舞台（同比例，刚好铺满）。 */
const HY_FILE: Record<string, string> = {
  "hy-hook-card": "b01-hook",
  "hy-gap-card": "b03-gap",
  "hy-cta-card": "b09-cta",
  "dub-hook": "dub-hook",
  "dub-gacha": "dub-gacha",
  "dub-punct": "dub-punct",
  "dub-checklist": "dub-checklist",
  "tpl-chat-pop": "tpl-chat-pop",
  "tpl-cursor-morph": "tpl-cursor-morph",
  "tpl-media-canvas": "tpl-media-canvas",
};

/** 动作段循环：from 起播；span 给了则播到 from+span 回跳——把合成片尾
 *  的静止 hold 裁掉，卡上不会出现数秒不动的"假死"段 */
const HY_LOOPS: Record<string, { from?: number; span?: number; zoom?: number }> = {
  "hy-hook-card": { zoom: 1.12 },
  "hy-gap-card": { zoom: 1.22 },
  "hy-cta-card": { from: 4.8, zoom: 1.3 },
  "dub-checklist": { from: 3.0, span: 6.8, zoom: 1.12 },
  "tpl-chat-pop": { from: 0.9, span: 6.6, zoom: 1.18 },
  "tpl-cursor-morph": { from: 1.9, span: 3.9, zoom: 1.45 },
  "tpl-media-canvas": { zoom: 1.08 },
};

function HyPreview({ id }: { id: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [fit, setFit] = useState({ s: 0, x: 0, y: 0 });
  const zoom = HY_LOOPS[id]?.zoom ?? 1;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    // 等比适配 + 可选变焦：放大后居中裁掉合成四周留白
    const fit = () => {
      const s = (wrap.clientWidth / 1920) * zoom;
      setFit({
        s,
        x: (wrap.clientWidth - 1920 * s) / 2,
        y: (wrap.clientHeight - 1080 * s) / 2,
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [id, zoom]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const play = () => {
      type HyTl = {
        repeat?: (n: number) => HyTl;
        play?: (from?: number) => HyTl;
        seek?: (t: number) => HyTl;
        time?: () => number;
        duration?: () => number;
        eventCallback?: (type: string, cb?: () => void) => void;
      };
      try {
        const w = el.contentWindow as (Window & { __timelines?: Record<string, HyTl> }) | null;
        const tls = w?.__timelines ?? {};
        const cfg = HY_LOOPS[id] ?? {};
        const from = cfg.from ?? 0;
        for (const tl of Object.values(tls)) {
          if (!cfg.from && !cfg.span) { tl.repeat?.(-1)?.play?.(); continue; }
          // 只循环动作段 [from, from+span]：终点钳到 timeline 实际时长
          // （GSAP 时长 ≠ 合成 data-duration），窗口轮询回跳；定时器挂在
          // iframe 自己的 window 上，卡片卸载即随之销毁
          const end = Math.min(from + (cfg.span ?? Infinity), tl.duration?.() ?? Infinity);
          tl.seek?.(from);
          if (Number.isFinite(end)) {
            w?.setInterval(() => { if ((tl.time?.() ?? Infinity) >= end - 0.02) tl.seek?.(from); }, 100);
          } else {
            tl.eventCallback?.("onComplete", () => { tl.seek?.(from)?.play?.(); });
          }
          tl.play?.(from);
        }
      } catch { /* 合成未就绪时静默，静态首帧兜底 */ }
    };
    el.addEventListener("load", play);
    return () => el.removeEventListener("load", play);
  }, [id]);

  return (
    <div className="el-hyframe" ref={wrapRef}>
      <iframe
        ref={frameRef}
        title={id}
        src={`/compositions/${HY_FILE[id]}.html`}
        scrolling="no"
        style={fit.s ? { transform: `scale(${fit.s})`, left: fit.x, top: fit.y } : undefined}
      />
    </div>
  );
}

/** 每条能力的真机演示（按注册表 id 分发） */
function DemoInner({ id }: { id: string }) {
  const on = useInAfter();
  switch (id) {
    // ── entrance ──
    case "rise-in":
      return <RiseIn delay={200}><h3 className="el-display">遮罩上滑标题</h3></RiseIn>;
    case "stagger-text":
      return <div className="el-display"><StaggerText text="逐字交错翻入" by="char" delay={200} stagger={45} /></div>;
    case "typewriter":
      return <div className="el-display-sm"><Typewriter text="旁白正在念的文本…" cps={22} delay={300} /></div>;
    case "scramble-text":
      return <div className="el-display"><ScrambleText text="SCRAMBLE 995.1K" duration={1600} seed={9} /></div>;
    case "mask-reveal":
      return <h3 className={`mask-reveal el-display ${on ? "in" : ""}`}>从左到右擦亮</h3>;
    case "rule-grow":
      return (
        <div className="el-rule-demo">
          <span>横线随口播划出</span>
          <div className={`rule-grow ${on ? "in" : ""}`} />
        </div>
      );
    case "kf-scale-in":
      return (
        <span className="el-badge" style={{ animation: "scale-in 600ms var(--ease-overshoot) 200ms both" }}>
          徽章 / 图章
        </span>
      );
    case "kf-pop-in":
      return (
        <span className="el-badge" style={{ animation: "pop-in 500ms var(--ease-overshoot) 200ms both" }}>
          轻松弹入
        </span>
      );
    case "letter-stagger":
      return (
        <h1 className="letter-stagger el-letters">
          {"MOTION".split("").map((ch, i) => (
            <span className="letter" style={{ ["--i" as string]: i }} key={i}>{ch}</span>
          ))}
        </h1>
      );
    case "fx-focus-in":
      return <h3 className="fx-focus-in el-display-sm">失焦 → 对上焦</h3>;
    case "fx-whip-pan":
      return <p className="fx-whip-left el-whip">甩镜换手 · 从右甩入</p>;
    case "fx-bubble-pop":
      return (
        <div className="el-bubble-wrap">
          <div className="fx-bubble-pop el-bubble">这条评论说到点子上了</div>
          <TypingDots delay={900} />
        </div>
      );
    // ── emphasis ──
    case "highlight-sweep":
      return (
        <h3>
          论点核心词会被{" "}
          <HighlightSweep delay={450} rest={0.35}>荧光笔划过</HighlightSweep>
        </h3>
      );
    case "spotlight":
      return (
        <div className="el-stage-fill">
          <span className="el-hint el-focus-hint">整屏都压暗，只有焦点这一句是亮的</span>
          <Spotlight x={0.5} y={0.5} radius={0.3} dim={0.72} delay={350} />
        </div>
      );
    case "scan-sweep":
      return (
        <div className="el-stage-fill el-cardish">
          <ScanSweep delay={450} width={0.3} />
          <span className="el-hint">证据卡被检查一次</span>
        </div>
      );
    case "shot-emphasis":
      return (
        <figure className="xx-shot el-shot-demo">
          <div className="el-shot-ph">证据实拍</div>
          <figcaption>一次性缓推放大</figcaption>
        </figure>
      );
    case "pulse-halo":
      return (
        <span className="el-halo-wrap">
          <i className="el-halo-dot" />
          <i className="el-halo-ring" style={{ animation: "pulse-halo 2.2s ease-out 300ms infinite" }} />
        </span>
      );
    case "shimmer-text":
      return (
        <div className="el-display">
          <ShimmerText delay={450} baseColor="var(--text-muted)" color="var(--accent)">
            金句落定，光从字面流过
          </ShimmerText>
        </div>
      );
    case "fx-punch-zoom":
      return (
        <figure className="fx-punch-zoom el-fig-demo">推镜强调 · 推近再回位</figure>
      );
    case "fx-capture-pulse":
      return <h3 className="fx-capture-pulse el-display-sm">快门脉冲 · 被捕捉的一帧</h3>;
    // ── data ──
    case "count-up":
      return <span className="el-bignum"><CountUp value="995.1K" duration={1800} delay={200} /></span>;
    case "odometer":
      return <Odometer value={1.05} decimals={2} suffix="×" duration={1800} className="el-bignum" />;
    case "ring-progress":
      return <RingDemo />;
    case "dynamic-chart":
      return <ChartDemo />;
    // ── flow ──
    case "svg-draw":
      return (
        <SvgDraw
          className="el-svg"
          viewBox="0 0 420 90"
          paths={[
            "M 20 45 C 100 5 150 85 210 45",
            "M 210 45 C 270 5 320 85 400 45",
          ]}
          stroke="var(--primary, #5a8cff)"
          strokeWidth={5}
          duration={800}
          stagger={150}
        />
      );
    case "morph-grid":
      return <MorphDemo />;
    // ── ambient ──
    case "particle-network":
      return (
        <div className="el-stage-fill">
          <ParticleNetwork className="el-abs" count={26} seed={42} />
        </div>
      );
    case "aurora":
      return (
        <div className="el-stage-fill">
          <Aurora speed={1} opacity={0.55} seed={7} />
          <span className="el-hint el-z">低速极光底噪</span>
        </div>
      );
    case "typing-dots":
      return (
        <div className="el-dots-wrap">
          <span>正在生成</span>
          <TypingDots count={3} delay={300} />
        </div>
      );
    // ── finale ──
    case "confetti-burst":
      return (
        <div className="el-stage-fill">
          <ConfettiBurst active count={100} seed={3} origin={{ x: 0.5, y: 0.55 }} />
          <span className="el-hint el-z">成果揭晓</span>
        </div>
      );
    // ── 素材编排 ──
    case "card-stage":
      return <CardStageDemo />;
    // ── hyperframes（baked 合成：iframe 实播 timeline，循环）──
    case "hy-hook-card":
    case "hy-gap-card":
    case "hy-cta-card":
    case "dub-hook":
    case "dub-gacha":
    case "dub-punct":
    case "dub-checklist":
    case "tpl-chat-pop":
    case "tpl-cursor-morph":
    case "tpl-media-canvas":
      return <HyPreview id={id} />;
    default:
      return <span className="el-hint">（无演示）</span>;
  }
}

/** 自循环的演示不用重挂（自身就是持续动画 / HY 内部已 loop） */
const SELF_LOOP = new Set([
  "particle-network", "aurora", "typing-dots", "pulse-halo", "morph-grid", "card-stage",
  "hy-hook-card", "hy-gap-card", "hy-cta-card", "dub-hook", "dub-gacha", "dub-punct",
  "dub-checklist", "tpl-chat-pop", "tpl-cursor-morph", "tpl-media-canvas",
]);
/** 一次性演示的循环：每张卡用 id 做种生成随机周期(3.2–5.8s)，
 *  初相彼此错开——不会出现全页同一瞬间集体重放的"齐停"。 */
function Demo({ id }: { id: string }) {
  const [tick, setTick] = useState(0);
  const loops = !SELF_LOOP.has(id);
  useEffect(() => {
    if (!loops) return;
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    const rnd = (n: number) => ((h = (h * 1664525 + 1013904223) >>> 0) / 2 ** 32) * n;
    let t: number;
    const arm = () => {
      t = window.setTimeout(() => {
        setTick((n) => n + 1);
        arm();
      }, 3200 + rnd(2600));
    };
    arm();
    return () => clearTimeout(t);
  }, [id, loops]);
  return loops ? <DemoInner key={`${id}-${tick}`} id={id} /> : <DemoInner id={id} />;
}

/** RingProgress 演示：周期重挂重放填充动画 */
function RingDemo() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2600);
    return () => clearInterval(t);
  }, []);
  return <RingProgress key={tick} value={0.6} label="60%" size={130} />;
}

/** DynamicChart 演示：clear+setOption 每 3s 重放生长（不依赖 init 时机） */
function ChartDemo() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chart = echarts.init(el);
    // 双数据集轮替：柱高/折线每周期切换，配 update 补间持续可见运动
    const sets = [
      { bars: [12, 18, 15, 22], line: [3, 5, 4, 7] },
      { bars: [9, 15, 12, 19], line: [4.5, 3.5, 5.5, 6] },
    ];
    let i = 0;
    const play = () => {
      i ^= 1;
      chart.setOption(themeSalesOption(["Q1", "Q2", "Q3", "Q4"], sets[i].bars, sets[i].line));
    };
    play();
    const iv = setInterval(play, 2600);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(el);
    return () => { clearInterval(iv); ro.disconnect(); chart.dispose(); };
  }, []);
  return (
    <div className="el-chart">
      <div ref={ref} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

/** CardStage 演示：主副双卡 + 焦点每 2.2s 轮换（仅预览页用，不进录制） */
function CardStageDemo() {
  const [focus, setFocus] = useState<number | null>(null);
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      n += 1;
      setFocus(n % 3 === 2 ? null : n % 2);
    }, 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <CardStage layout="duo" focus={focus} className="el-cards">
      <MediaCard kind="video" src="/media/demo-loop.mp4" tag="示例 01" caption="生成画面示例" />
      <MediaCard kind="image" src="/media/demo-card.svg" tag="截图 02" caption="成果提案" kenburns />
    </CardStage>
  );
}

/**
 * 「给 agent」按钮的产出物由 sources.buildSpec 合成：注解 + 完整源码
 * （组件 TSX / CSS 关键帧 / HY 合成整文件），自包含、可直接 100% 复刻。
 */
function CopyButton({ getText }: { getText: () => Promise<string> }) {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const onCopy = async () => {
    try {
      setState("busy");
      const text = await getText();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setState("ok");
      setTimeout(() => setState("idle"), 1400);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2200);
    }
  };
  return (
    <button
      className={`el-copy ${state === "ok" ? "is-ok" : state === "error" ? "is-error" : ""}`}
      onClick={onCopy}
      disabled={state === "busy"}
      aria-live="polite"
      title="复制完整实现（注解 + 源码 + 样式 + 依赖，agent 可直接复刻）"
    >
      {state === "busy" ? "准备中…" : state === "ok" ? "✓ 已复制" : state === "error" ? "复制失败·重试" : "⧉ 给 agent"}
    </button>
  );
}

/** 全部视图的首页精选：三张数据卡提到第 2/4/5 位（首屏即见数据类动效） */
const FEATURED = ["odometer", "ring-progress", "dynamic-chart"];
const FEATURED_SLOTS = [1, 3, 4]; // 0-based 插入位

/** 展示层去管线化：HY 用法只保留合成路径，接入方式用通用措辞。 */
function publicApi(e: Enhancement): string {
  return e.kind === "hyperframes" ? e.api.split("→")[0].trim() : e.api;
}

export function EnhanceLab() {
  const [cat, setCat] = useState<EnhCategory | "all">("all");
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("html-video-motion-theme", theme);
  }, [theme]);

  const base = ENHANCEMENTS.filter((e) => cat === "all" || e.category === cat);
  let list = base;
  if (cat === "all") {
    const rest = base.filter((e) => !FEATURED.includes(e.id));
    FEATURED.forEach((id, i) => {
      const pick = base.find((e) => e.id === id)!;
      rest.splice(FEATURED_SLOTS[i], 0, pick);
    });
    list = rest;
  }

  return (
    <div className="el-scroll">
      <header className="el-header">
        <h1 className="el-title">视觉增强组件库</h1>
        <div className="el-hd-right">
          <div className="el-themes" role="group" aria-label="页面主题">
            {THEMES.map((item) => (
              <button
                key={item.id}
                className={`el-theme ${theme === item.id ? "is-on" : ""}`}
                aria-pressed={theme === item.id}
                onClick={() => setTheme(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <a
            className="el-github"
            href="https://github.com/liangjfblue/html-video-motion"
            target="_blank"
            rel="noreferrer"
            title="GitHub 源码 · html-video-motion"
            aria-label="GitHub 源码仓库"
          >
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.05.78 2.13v3.16c0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
            </svg>
          </a>
        </div>
      </header>

      <nav className="el-cats">
        {CATS.map((c) => (
          <button
            key={c.id}
            className={`el-cat ${cat === c.id ? "is-on" : ""}`}
            onClick={() => setCat(c.id)}
          >
            {c.label}
          </button>
        ))}
      </nav>

      <div className="el-grid" key={`${cat}-${theme}`}>
        {list.map((e) => {
          const note = AGENT_NOTES[e.id] ?? {};
          const details = (
            [
              ["参数", note.params],
              ["时机", note.timing],
              ["不要", note.dont],
            ] as [string, string | undefined][]
          ).filter((kv): kv is [string, string] => Boolean(kv[1]));
          return (
            <article className="el-card" key={e.id}>
              <div className="el-stage">
                <Demo id={e.id} />
              </div>
              <div className="el-body">
                <header className="el-titlerow">
                  <h3 className="el-name">{e.name}</h3>
                  <code className="el-id">{e.id}</code>
                  <span className="el-chips">
                    <span className={`el-pill el-pill-${e.category}`}>{CAT_LABEL[e.category]}</span>
                    <span className={`el-pill el-pill-${e.kind}`}>{KIND_LABEL[e.kind]}</span>
                  </span>
                </header>
                <div className="el-row">
                  <span className="el-label">场景</span>
                  <span className="el-val">{e.use}</span>
                </div>
                {note.brief ? (
                  <div className="el-row el-row-tip">
                    <span className="el-label">要点</span>
                    <span className="el-val">{note.brief}</span>
                    {details.length ? (
                      <span className="el-tipbox">
                        {details.map(([k, v]) => (
                          <span key={k}>
                            <b>{k}</b>
                            {v}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <div className="el-row el-row-api">
                  <span className="el-label">用法</span>
                  <span className="el-apiwrap">
                    <code className="el-api">{publicApi(e)}</code>
                    <CopyButton getText={() => buildSpec(e, note, KIND_LABEL[e.kind], CAT_LABEL[e.category], publicApi(e))} />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="el-footer">
        铁律：只做「能指着旁白一句话说这条动效对应它」的动
      </footer>
    </div>
  );
}
