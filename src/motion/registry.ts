/**
 * registry.ts — 视觉增强能力注册表（Visual Enhancement Registry）。
 *
 * 把分散在三处的动效词汇统一登记，让"给某一步加视觉增强"从手写
 * 变成查表选用：
 *
 *   react       src/motion 组件（live sync，挂载即动，步变重放）
 *   css         animations.css / base.css 关键帧与类名（轻量、零 JS）
 *   hyperframes motion-segments/compositions 插段（baked sync，
 *               GSAP timeline 渲 mp4 后整段接入）
 *
 * 选型铁律：只做"能指着旁白一句话说这条动效
 * 对应它"的动。每个条目的 `use` 字段就是这句话的模板。
 *
 * 六类分法按"旁白说到什么"划分，不按实现技术划分：
 *   entrance  内容刚被说到，元素进场
 *   emphasis  关键词/证据需要被单独注意
 *   data      数字与图表本身承载论据
 *   flow      关系、步骤、链路的结构演示
 *   ambient   静止画面的底层生命感（低速、低对比、不抢内容）
 *   finale    段落/全片的收束时刻
 */

export type EnhKind = "react" | "css" | "hyperframes";

export type EnhCategory =
  | "entrance"
  | "emphasis"
  | "data"
  | "flow"
  | "ambient"
  | "finale";

export interface Enhancement {
  /** 稳定 id（kebab-case），章节代码与文档引用它 */
  id: string;
  /** 中文名 */
  name: string;
  category: EnhCategory;
  kind: EnhKind;
  /** 什么时候用：对应旁白说到什么的半句话 */
  use: string;
  /** 怎么用：组件签名 / 类名用法 / composition 文件 */
  api: string;
  /** 固定种子 → 录制与 seek 渲染可复现（canvas 类必填 false 若无 seed） */
  seedSafe: boolean;
}

export const ENHANCEMENTS: Enhancement[] = [
  // ── entrance ────────────────────────────────────────────────────
  {
    id: "rise-in",
    name: "遮罩上滑",
    category: "entrance",
    kind: "react",
    use: "一句话被打断强调、行级标题进场",
    api: "<RiseIn delay={120} duration={650}><p>…</p></RiseIn>",
    seedSafe: true,
  },
  {
    id: "stagger-text",
    name: "交错翻入文字",
    category: "entrance",
    kind: "react",
    use: "金句/标题逐字砸出来（by=char 最有电影感）",
    api: '<StaggerText text="…" by="char" delay={80} stagger={40} />',
    seedSafe: true,
  },
  {
    id: "typewriter",
    name: "打字机标题",
    category: "entrance",
    kind: "react",
    use: "旁白正在念的文本（引语、终端输出、弹幕）",
    api: '<Typewriter text="…" cps={21} delay={160} />',
    seedSafe: true,
  },
  {
    id: "scramble-text",
    name: "乱码解码文字",
    category: "entrance",
    kind: "react",
    use: "技术感数字/代号揭晓",
    api: '<ScrambleText text="…" duration={1600} seed={9} />',
    seedSafe: true,
  },
  {
    id: "mask-reveal",
    name: "clip-path 擦除",
    category: "entrance",
    kind: "css",
    use: "整块文本从左到右擦亮（加 .in 触发）",
    api: '<h2 class="mask-reveal in">…</h2>',
    seedSafe: true,
  },
  {
    id: "rule-grow",
    name: "横线生长",
    category: "entrance",
    kind: "css",
    use: "分隔线/下划线随口播节奏划出",
    api: '<div class="rule-grow in" />',
    seedSafe: true,
  },
  {
    id: "kf-scale-in",
    name: "缩放过冲入场",
    category: "entrance",
    kind: "css",
    use: "徽章/图章/认证时刻",
    api: 'style={{ animation: "scale-in 600ms var(--ease-overshoot) both" }}',
    seedSafe: true,
  },
  {
    id: "kf-pop-in",
    name: "弹跳入场",
    category: "entrance",
    kind: "css",
    use: "轻松语境的元素蹦出",
    api: 'style={{ animation: "pop-in 500ms var(--ease-overshoot) both" }}',
    seedSafe: true,
  },
  {
    id: "letter-stagger",
    name: "字母交错",
    category: "entrance",
    kind: "css",
    use: "英文大标题逐字起立（.letter-stagger > .letter，--i 序号）",
    api: '<h1 class="letter-stagger"><span class="letter" style="--i:0">M</span><span class="letter" style="--i:1">O</span>…</h1>',
    seedSafe: true,
  },
  {
    id: "fx-focus-in",
    name: "失焦聚焦入场",
    category: "entrance",
    kind: "css",
    use: "大字/卡片从模糊中对上焦（官方 apple-motion、vfx 构图的镜头语言）",
    api: '<h2 class="fx-focus-in">…</h2>',
    seedSafe: true,
  },
  {
    id: "fx-whip-pan",
    name: "甩镜文字交接",
    category: "entrance",
    kind: "css",
    use: "两句话快速换手：位移 + motion blur 同步清除（fx-whip-left 从右入 / fx-whip-right 从左入）",
    api: '<p class="fx-whip-left">下一句</p>',
    seedSafe: true,
  },
  {
    id: "fx-bubble-pop",
    name: "气泡长出",
    category: "entrance",
    kind: "css",
    use: "对话/评论/弹幕气泡从角部弹开（fx-bubble-pop 类，配 fx-dots 呼吸点）",
    api: '<div class="fx-bubble-pop">评论内容</div>',
    seedSafe: true,
  },

  // ── emphasis ────────────────────────────────────────────────────
  {
    id: "highlight-sweep",
    name: "荧光笔扫过",
    category: "emphasis",
    kind: "react",
    use: "这个词/这句话是论点核心，说到的瞬间划过",
    api: "<HighlightSweep delay={400} rest={0.35}>关键词</HighlightSweep>",
    seedSafe: true,
  },
  {
    id: "spotlight",
    name: "聚光压暗",
    category: "emphasis",
    kind: "react",
    use: "全屏只看这一个点（叠在屏容器上，指定焦点 x/y）",
    api: '<Spotlight x={0.5} y={0.42} radius={0.24} dim={0.72} />',
    seedSafe: true,
  },
  {
    id: "scan-sweep",
    name: "扫描光带",
    category: "emphasis",
    kind: "react",
    use: "证据卡/截图被检查——光带掠过一次",
    api: '<ScanSweep delay={600} width={0.3} />（放进 position:relative 的卡内）',
    seedSafe: true,
  },
  {
    id: "shot-emphasis",
    name: "证据卡放大",
    category: "emphasis",
    kind: "css",
    use: "实拍/截图卡一次性缓推放大（.xx-shot 自带，-wide 排除）",
    api: '<figure class="xx-shot">…</figure>',
    seedSafe: true,
  },
  {
    id: "pulse-halo",
    name: "脉冲光环",
    category: "emphasis",
    kind: "css",
    use: "通知点/状态灯的呼吸提示",
    api: '<i style={{ animation: "pulse-halo 2.2s ease-out infinite" }} />',
    seedSafe: true,
  },
  {
    id: "shimmer-text",
    name: "渐变字扫光",
    category: "emphasis",
    kind: "react",
    use: "金句落定后一道光从字面流过（吸收自官方 thinking-big 构图）",
    api: '<ShimmerText delay={600}>金句</ShimmerText>',
    seedSafe: true,
  },
  {
    id: "fx-punch-zoom",
    name: "推镜强调",
    category: "emphasis",
    kind: "css",
    use: "静态卡被重点讲到：快推近 1.55× 带微失焦再回位（fx-punch-zoom 类）",
    api: '<figure class="fx-punch-zoom">…</figure>',
    seedSafe: true,
  },
  {
    id: "fx-capture-pulse",
    name: "快门脉冲",
    category: "emphasis",
    kind: "css",
    use: "文字/帧落定瞬间微亮一下——「被捕捉」的一帧（官方 thesis beat 手法）",
    api: '<h2 class="fx-capture-pulse">…</h2>',
    seedSafe: true,
  },

  // ── data ────────────────────────────────────────────────────────
  {
    id: "count-up",
    name: "数字滚动",
    category: "data",
    kind: "react",
    use: "增长/规模数字随口播爬升（解析 995.1K、73% 等格式）",
    api: '<CountUp value="995.1K" duration={1600} />',
    seedSafe: true,
  },
  {
    id: "odometer",
    name: "翻牌数字",
    category: "data",
    kind: "react",
    use: "机械翻牌感的短数字（倍率、版本号）",
    api: '<Odometer value={1.05} decimals={2} suffix="×" />',
    seedSafe: true,
  },
  {
    id: "ring-progress",
    name: "环形进度",
    category: "data",
    kind: "react",
    use: "占比/进度的一眼可读（多用于 chrome 区）",
    api: "<RingProgress value={0.6} label=\"60%\" />",
    seedSafe: true,
  },
  {
    id: "dynamic-chart",
    name: "动态图表",
    category: "data",
    kind: "react",
    use: "趋势/对比有真实数据支撑时（ECharts + 主题令牌）",
    api: "<DynamicChart option={themeSalesOption} />",
    seedSafe: true,
  },

  // ── flow ────────────────────────────────────────────────────────
  {
    id: "svg-draw",
    name: "SVG 描线",
    category: "flow",
    kind: "react",
    use: "流程链路/脑图连线随讲解顺序画出（多路径 stagger）",
    api: '<SvgDraw viewBox="…" paths={["M…","M…"]} stroke="var(--primary)" stagger={120} />',
    seedSafe: true,
  },
  {
    id: "morph-grid",
    name: "网格变形",
    category: "flow",
    kind: "react",
    use: "同一组卡片在两种布局间重排（3 列 ↔ 2 列）",
    api: "<MorphGrid variant={1|2}>…<MorphCell /></MorphGrid>",
    seedSafe: true,
  },

  // ── ambient ─────────────────────────────────────────────────────
  {
    id: "particle-network",
    name: "粒子连线网络",
    category: "ambient",
    kind: "react",
    use: "科技感底噪（固定 seed，录制可复现）",
    api: '<ParticleNetwork count={28} seed={42} />',
    seedSafe: true,
  },
  {
    id: "aurora",
    name: "极光氛围",
    category: "ambient",
    kind: "react",
    use: "抽象/情绪屏的低速渐变底，替代全场静止",
    api: "<Aurora speed={1} opacity={0.5} seed={7} />（放入 relative 容器）",
    seedSafe: true,
  },
  {
    id: "typing-dots",
    name: "打字点呼吸",
    category: "ambient",
    kind: "react",
    use: "旁白念到「正在生成/等待回复」时垫状态感（官方 apple-motion 手法）",
    api: "<TypingDots count={3} delay={200} />",
    seedSafe: true,
  },

  // ── 素材编排 ──
  {
    id: "card-stage",
    name: "多素材卡编排",
    category: "emphasis",
    kind: "react",
    use: "两三个视频/图片卡同屏：进场 stagger、焦点随讲述切换（焦点卡放大提亮、其余压暗退远）、图片 Ken Burns 慢推",
    api: '<CardStage layout="canvas" focus={focus}><MediaCard kind="video" src="/media/a.mp4" tag="实拍 01" caption="工作台" /><MediaCard kind="image" src="/assets/b.png" caption="提案卡" kenburns /></CardStage>',
    seedSafe: true,
  },

  // ── finale ──────────────────────────────────────────────────────
  {
    id: "confetti-burst",
    name: "金纸屑爆发",
    category: "finale",
    kind: "react",
    use: "成果揭晓/收尾庆祝的一瞬间",
    api: '<ConfettiBurst active count={120} seed={3} origin={{x:0.5,y:0.7}} />',
    seedSafe: true,
  },

  // ── hyperframes 插段（baked sync，渲 mp4 后整段接入）──
  {
    id: "hy-hook-card",
    name: "HY 钩子卡",
    category: "entrance",
    kind: "hyperframes",
    use: "开场 3-8s：计数揭晓 + 双栏证据（口播 take 已锁定）",
    api: "motion-segments/compositions/b01-hook.html",
    seedSafe: true,
  },
  {
    id: "hy-gap-card",
    name: "HY 痛点卡",
    category: "emphasis",
    kind: "hyperframes",
    use: "中段痛点定调：大字痛点 + 对比证据滑入",
    api: "motion-segments/compositions/b03-gap.html",
    seedSafe: true,
  },
  {
    id: "hy-cta-card",
    name: "HY 终端 CTA 卡",
    category: "finale",
    kind: "hyperframes",
    use: "收尾行动指令：终端逐字命令 + 收束文案",
    api: "motion-segments/compositions/b09-cta.html",
    seedSafe: true,
  },
  {
    id: "dub-hook",
    name: "HY 配音钩子段（实验）",
    category: "entrance",
    kind: "hyperframes",
    use: "弹幕/短句编排的旧样板——做开场话题钩子时可参考",
    api: "motion-segments/compositions/dub-hook.html",
    seedSafe: true,
  },
  {
    id: "dub-gacha",
    name: "HY 抽卡演示段（实验）",
    category: "emphasis",
    kind: "hyperframes",
    use: "单段重抽/抽卡揭晓瞬间——揭晓类时刻的样板",
    api: "motion-segments/compositions/dub-gacha.html",
    seedSafe: true,
  },
  {
    id: "dub-punct",
    name: "HY 断句演示段（实验）",
    category: "flow",
    kind: "hyperframes",
    use: "断句/停顿前后对比——『同一句话两种断法』的样板",
    api: "motion-segments/compositions/dub-punct.html",
    seedSafe: true,
  },
  {
    id: "dub-checklist",
    name: "HY 排查清单段（实验）",
    category: "flow",
    kind: "hyperframes",
    use: "逐项排查清单步进——步骤逐条勾掉的样板",
    api: "motion-segments/compositions/dub-checklist.html",
    seedSafe: true,
  },
  {
    id: "tpl-chat-pop",
    name: "HY 对话气泡模板",
    category: "entrance",
    kind: "hyperframes",
    use: "评论区/对话编排：打字点呼吸 → 气泡依次长出，改 COMMENTS 文案即用",
    api: "motion-segments/compositions/tpl-chat-pop.html（参数区 T 改节拍时刻）",
    seedSafe: true,
  },
  {
    id: "tpl-cursor-morph",
    name: "HY 光标形变模板",
    category: "flow",
    kind: "hyperframes",
    use: "演示产品 UI：假光标点击 + 按钮几何形变展开菜单（官方 connector-morph 手法参数化）",
    api: "motion-segments/compositions/tpl-cursor-morph.html（改 #menu 三行文案）",
    seedSafe: true,
  },
  {
    id: "tpl-media-canvas",
    name: "HY 素材画布模板",
    category: "entrance",
    kind: "hyperframes",
    use: "两三个素材卡画布式编排：相机慢漂移 + 三卡 stagger 滑入 + DOF 焦点节拍（官方 launch BEAT 1 手法）",
    api: "motion-segments/compositions/tpl-media-canvas.html（占位块换成 <video>/<img>，必须有 id）",
    seedSafe: true,
  },
];

/** 按类别取全部能力（章节走查时按"旁白说到什么"查表） */
export function byCategory(cat: EnhCategory): Enhancement[] {
  return ENHANCEMENTS.filter((e) => e.category === cat);
}

/** 按接入形态取（react=live / css=轻量 / hyperframes=baked 插段） */
export function byKind(kind: EnhKind): Enhancement[] {
  return ENHANCEMENTS.filter((e) => e.kind === kind);
}

export function getEnhancement(id: string): Enhancement | undefined {
  return ENHANCEMENTS.find((e) => e.id === id);
}
