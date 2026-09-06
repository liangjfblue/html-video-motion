/**
 * agent-notes.ts — 每条视觉增强能力的 agent 契约注解。
 *
 * 组件库页（?enhance=1）的「给 agent」按钮把这些注解与注册表
 * 条目合成一份 markdown 开发契约，直接贴进 agent 对话/章节任务即可
 * 正确使用该能力。保持每条一句：brief 是卡片上的短要点（≤18 字），
 * params 讲参数怎么取值，timing 讲与旁白的对位关系，dont 讲踩过的坑。
 *
 * 没有注解的能力照常出契约（只含 何时用/用法/约束 三段）。
 */

export interface AgentNote {
  /** 卡片「要点」行的短语（详情 hover 看其余三段） */
  brief?: string;
  /** 参数怎么取值（默认值、取值范围、解析行为） */
  params?: string;
  /** 与旁白/步的对位关系（delay 怎么算、时长怎么配） */
  timing?: string;
  /** 使用禁忌（踩过的坑） */
  dont?: string;
}

export const AGENT_NOTES: Record<string, AgentNote> = {
  // ── entrance ──
  "rise-in": {
    brief: "旁白 onset 即挂，只给强调行",
    params: "delay=延后再滑的 ms；duration=滑动时长（默认 900）",
    timing: "该行旁白 onset 即挂（delay 0-200），一行只给一次",
    dont: "整屏每一行都上滑——只给被强调的行，其余用静态",
  },
  "stagger-text": {
    brief: "首字对重音，总长 ≤ 旁白 2/3",
    params: "by=char 最有电影感；stagger=每字错相 ms（40-55）",
    timing: "首字对旁白重音，stagger 总时长 ≤ 该句旁白时长的 2/3",
    dont: "超过 12 字的长句逐字翻（改 by=word 或换 RiseIn）",
  },
  typewriter: {
    brief: "打字节奏对齐念速，只打旁白词",
    params: "cps=打字速度；delay=起打延迟 ms",
    timing: "cps 实测调到打字节奏与旁白念速一致，句尾留 300ms",
    dont: "拿去打正文段落——只打旁白正在念的文本（引语/终端/弹幕）",
  },
  "scramble-text": {
    brief: "解码完成点 ≈ 念到该数字",
    params: "duration=解码时长；seed 必填（确定性渲染）",
    timing: "解码完成点 ≈ 旁白念出该数字/代号的时刻",
    dont: "长中文句解码（乱码字符对英文/数字最有效）",
  },
  "mask-reveal": {
    brief: "700ms 擦除，对齐句起始",
    params: "纯 css：初始 clip-path 收敛，加 .in 类触发擦除",
    timing: "700ms 过渡，对齐该句起始",
    dont: "频繁反复触发（过渡类只给一次性入场）",
  },
  "rule-grow": {
    brief: "线到位 ≈ 念完短句",
    params: "纯 css：.in 触发 scaleX 0→1，origin 左端",
    timing: "线走到位 ≈ 旁白念完短句，dur-cinematic 令牌 1400ms",
    dont: "竖线/斜线（本类只有横向生长语义）",
  },
  "kf-scale-in": {
    brief: "落定即重音，600ms",
    params: "animation 内联：scale-in + --ease-overshoot 令牌",
    timing: "徽章/图章落定即旁白重音，600ms",
    dont: "大面积内容块（过冲缩放只适合小件）",
  },
  "kf-pop-in": {
    brief: "轻松语境重音，500ms",
    params: "animation 内联：pop-in（带 -2deg 旋入）",
    timing: "轻松语境的重音点，500ms",
    dont: "严肃数据屏（会显得轻浮）",
  },
  "letter-stagger": {
    brief: "英文大标题逐字起立",
    params: "子元素 .letter 带 --i 序号（0..n），错相 60ms",
    timing: "英文大标题逐字起立，与英文旁白词对齐",
    dont: "中文（本类按字母切分，中文用 StaggerText）",
  },
  "fx-focus-in": {
    brief: "大字模糊对焦 900ms",
    params: "纯 css：blur 12px + scale 1.12 → 清晰，--dur-cinematic",
    timing: "挂载即播 900ms——大字/卡片从模糊中对上焦",
    dont: "小字正文（blur 大字才有镜头感，小字只显脏）",
  },
  "fx-whip-pan": {
    brief: "换手：前句甩出，本句甩入",
    params: "fx-whip-left=从右甩入；fx-whip-right=从左甩入；位移 160px + blur 10px",
    timing: "两句换手：前句 360ms 甩出，本句 620ms 甩入， expo 缓动",
    dont: "同屏三句以上连甩（观众会晕）",
  },
  "fx-bubble-pop": {
    brief: "念到该评论/对话时弹出",
    params: "纯 css：scaleX 0.04 从左下角长出，460ms 过冲；配 .fx-dots 呼吸点",
    timing: "旁白念到该评论/对话时弹出，呼吸点接在弹出后",
    dont: "没有对话/评论语义的列表（气泡是『有人在说话』的符号）",
  },

  // ── emphasis ──
  "highlight-sweep": {
    brief: "领先旁白 150ms 划核心词",
    params: "delay=起扫 ms；rest=落定常驻透明度（0=扫完即散，常用 0.35）；color=荧光色",
    timing: "delay ≈ 旁白念到该词的时刻 −150ms（画面领先声音）",
    dont: "整段句包住（只包核心词）；同屏超过 2 处",
  },
  spotlight: {
    brief: "压暗 900ms，内容落焦点位",
    params: "x/y=焦点位置 0-1；radius=亮洞半径（短边占比）；dim=暗场强度",
    timing: "dim ≥0.65 才有压暗感；900ms 聚焦落定",
    dont: "有实拍人脸的屏（别把脸压暗）；内容必须落在焦点位",
  },
  "scan-sweep": {
    brief: "念到『看这张卡』时扫一次",
    params: "width=光带宽（容器宽占比）；angle=走向 deg；一次性扫过",
    timing: "delay 450-700ms，旁白念到『看这张卡』时",
    dont: "循环往复（一次即『检查过』，循环变跑马灯）",
  },
  "shot-emphasis": {
    brief: "挂载即 4.6s 一次性慢推",
    params: "纯 css：.xx-shot 自带 4.6s 一次性慢推；宽幅卡加 -wide 排除",
    timing: "无需接线，挂载即随 0.7s 延迟启动",
    dont: "卡内录屏文字必须可读——推近不能以糊字为代价",
  },
  "pulse-halo": {
    brief: "常驻呼吸，表示『活的』",
    params: "animation 内联：pulse-halo 2.2s infinite；套在点/灯元素上",
    timing: "常驻呼吸，表示『活的』状态",
    dont: "大面积/多点位同用（会变成圣诞树）",
  },
  "shimmer-text": {
    brief: "落定后扫一次，金句限定",
    params: "delay=起扫 ms；repeat=扫光次数（默认 1）；baseColor/color=底色/光带色",
    timing: "文字落定后扫一次（delay ≈ 入场完成 +200ms），金句限定",
    dont: "正文段落扫光（只给一句话金句）",
  },
  "fx-punch-zoom": {
    brief: "重音前 100ms 起推",
    params: "纯 css：推近 1.55× 带微失焦 35% 处到位，再回位，--dur-cinematic",
    timing: "旁白重音前 100ms 起推（推到最近时正是重音）",
    dont: "嵌在变形/滚动布局里用（transform 会互相打架）",
  },
  "fx-capture-pulse": {
    brief: "全部落定后的『被捕捉帧』",
    params: "纯 css：scale 1.012 + brightness 1.18，700ms",
    timing: "文字/帧全部落定之后给——『被捕捉』的那一帧",
    dont: "多行同时脉冲（逐行错开或只给最后一行）",
  },

  // ── data ──
  "count-up": {
    brief: "时长 ≈ 旁白 −300ms，先落定",
    params: "value 接受 '995.1K'/'73%'/'2,352' 格式（自动解析后缀与小数位）",
    timing: "duration ≈ 该数字的旁白时长 −300ms（数字先落定，人声收尾）",
    dont: "把单位写进数字滚动区（单位放 suffix 静态显示）",
  },
  odometer: {
    brief: "短数字专用，1800ms 翻完",
    params: "decimals=小数位；suffix=后缀（×、%）；duration=翻牌时长",
    timing: "短数字（倍率/版本号）专用，1800ms 内翻完",
    dont: "超过 4 位数（翻牌列太长会裁切）",
  },
  "ring-progress": {
    brief: "常驻辅助指示，不作主角",
    params: "value=0-1；label=环心文字；size/stroke=尺寸环宽",
    timing: "常驻指示（多放悬停 chrome 区，录制不采集）",
    dont: "当主内容主角（它是辅助件）",
  },
  "dynamic-chart": {
    brief: "挂载即生长约 1s，需真数据",
    params: "option=ECharts 配置；reInitKey=主题切换时重初始化",
    timing: "挂载即按 ECharts 动画生长，约 1s",
    dont: "没有真实数据的装饰图表（编造数据一票否决）",
  },

  // ── flow ──
  "svg-draw": {
    brief: "描线顺序 = 讲解顺序",
    params: "paths=SVG path 数组（按讲解顺序排列）；stagger=逐条错相 ms；stroke 走令牌",
    timing: "描线顺序 = 旁白讲解顺序，每条 duration ≈ 讲该节点的时长",
    dont: "连线穿卡/穿字（脑图实测教训：端点用实测中心坐标）",
  },
  "morph-grid": {
    brief: "variant 由 step 驱动",
    params: "variant=1|2（3 列 ↔ 2 列）；几何过渡 800ms",
    timing: "variant 由 step 驱动（步变才变）——不要定时器驱动",
    dont: "单元格内放复杂交互内容（过渡中会重排）",
  },

  // ── ambient ──
  "particle-network": {
    brief: "常驻底噪，z 序最底",
    params: "count=节点数；seed 必填（同 seed 同画面，录制可复现）",
    timing: "常驻底噪；z 序 0，内容压在上层",
    dont: "放在内容上层或给亮色主题用默认白（对比度会翻车）",
  },
  aurora: {
    brief: "常驻低速漂移，非主角",
    params: "speed=速度倍率（1≈16s 循环）；opacity=整体 0-1；seed=错相位",
    timing: "常驻低速漂移——替代『全场静止』，不是动效主角",
    dont: "有录屏/实拍证据的屏（渐变会抢注意力）",
  },
  "typing-dots": {
    brief: "只表达『正在生成/等待』",
    params: "count=点数（默认 3）；delay=起始 ms；错相 180ms",
    timing: "接在触发元素之后（弹出/提问完成 → 点开始呼吸）",
    dont: "当装饰撒在各处（它只表达『正在生成/等待』）",
  },

  // ── finale ──
  "confetti-burst": {
    brief: "收尾重音爆发，全片 1-2 次",
    params: "count=纸屑数；seed 必填；origin=爆点 0-1",
    timing: "收尾重音帧一次爆发——全片最多 1-2 次",
    dont: "数据/技术屏用（庆祝语义会消解论点）",
  },

  "card-stage": {
    brief: "focus 跟随旁白，≤3 卡",
    params: "layout=duo 主副双卡/trio 三联排/canvas 散点画布（canvas 需容器有高度）；focus=焦点卡序号或 null；stagger=进场错相 ms",
    timing: "focus 由 step 驱动——旁白讲到第几张就 focus 几（讲述跟随）；切换过渡 700ms",
    dont: "同屏超过 3 卡（观众读不完）；视频卡开 kenburns（视频自带生命感）；canvas 模式忘给容器高度",
  },
  // ── hyperframes（baked 插段）──
  "hy-hook-card": {
    brief: "开场 3-8s，语句级对齐",
    params: "改文案直接编辑 composition HTML；--variables 可参数化时长",
    timing: "开场 3-8s；语句级对齐：GSAP 时刻 = 步内落针 150ms + onset −50ms",
    dont: "文案频繁改的屏改为程序内拆段；换配音后重渲重校准",
  },
  "hy-gap-card": {
    brief: "中段痛点定调位",
    params: "同 hy-hook-card（b03-gap.html）",
    timing: "中段痛点定调位；渲染 6s@25fps 约 10s",
    dont: "timed video 不可嵌 timed figure；media 元素必须有 id（否则渲染冻结）",
  },
  "hy-cta-card": {
    brief: "收尾指令位，逐字对齐",
    params: "同 hy-hook-card（b09-cta.html）",
    timing: "收尾行动指令位；终端逐字命令对齐『一条命令』旁白",
    dont: "CJK 字体必须 @font-face local() 声明，否则 lint/render 字体回退",
  },
  "dub-hook": {
    brief: "旧片样板，接入前重写",
    params: "旧实验段，参考其弹幕编排与节拍结构",
    timing: "作样板用，接入前重写文案与对位",
    dont: "直接原样上片（内容属于旧配音片）",
  },
  "dub-gacha": {
    brief: "揭晓重音前留 200ms 悬念",
    params: "旧实验段——抽卡揭晓的节奏参考",
    timing: "揭晓重音前留 200ms 悬念帧",
    dont: "同 dub-hook",
  },
  "dub-punct": {
    brief: "对比切换卡在『换个断法』",
    params: "旧实验段——前后对比排版参考",
    timing: "两半屏对比切换要卡在旁白『换个断法』处",
    dont: "同 dub-hook",
  },
  "dub-checklist": {
    brief: "勾掉时刻 = 念到该项",
    params: "旧实验段——清单步进参考",
    timing: "每项勾掉时刻 = 旁白念到该项",
    dont: "同 dub-hook",
  },
  "tpl-chat-pop": {
    brief: "气泡间隔 2s 对齐旁白",
    params: "改 .row 内气泡文案；脚本顶部 T 常量改各气泡节拍(秒)",
    timing: "打字点呼吸 0.3s 起，气泡间隔 2s（对齐旁白念到该评论）；渲 8s@25fps 约 8s",
    dont: "气泡超过 4 条（版面触底）；光标位移只能用 x/y transform（left/top 逐帧抖动）",
  },
  "tpl-cursor-morph": {
    brief: "节奏别改快，改快显廉价",
    params: "改 #menu 三行文案/快捷键；脚本顶部 T 常量改节拍",
    timing: "按压 0.12s+回弹 0.18s、形变 0.58s——节奏别改快，改快显廉价",
    dont: "光标只能走直轴（不斜切）；高亮必须同色相 0 透明度起步（防插值发黑）",
  },
  "tpl-media-canvas": {
    brief: "三卡 stagger 0.5s，真素材加 id",
    params: "占位块整体换成真素材：<video id='v1' src='media/…' muted playsinline> / <img id='i1'>（id 必填否则渲染冻结）；脚本顶部 T 常量改节拍",
    timing: "三卡 stagger 0.5s；焦点节拍默认 3.8s 对位『注意这张』；渲 8.5s@25fps",
    dont: "真素材忘加 id；卡超过 3 张；远景卡别加 focus 推近（它负责 DOF 退远）",
  },
};
