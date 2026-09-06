import { Children, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * MediaCard / CardStage — 多素材卡编排（react 形态,live sync）。
 *
 * 两三个视频/图片素材以卡片同屏,做导演式编排：
 *   - 进场：卡片按槽位 stagger 依次长出,带有机角度(--cs-rot)
 *   - 焦点：focus 随讲述切换——焦点卡放大提亮,其余压暗退远(DOF 分层,
 *     官方 launch 分镜 BEAT 1 手法),transform/filter 过渡 700ms
 *   - 素材增强：图片卡可开 kenburns 慢推;视频卡沿用 StepVideo 契约
 *     (muted autoplay loop playsInline,canplay 前透明防黑帧)
 *
 * 用法：
 *   <CardStage layout="canvas" focus={step >= 2 ? 1 : 0}>
 *     <MediaCard kind="video" src="/media/a.mp4" tag="实拍 01" caption="工作台" />
 *     <MediaCard kind="image" src="/assets/b.png" caption="提案卡" kenburns />
 *   </CardStage>
 *
 * 确定性：纯 CSS 动画 + 主题令牌,实时录制与 seek 渲染均可复现。
 */

// ─────────────────────────── MediaCard ───────────────────────────

interface MediaCardProps {
  /** 素材地址；视频(.mp4/.webm)自动走 video,其余走 img */
  src?: string;
  /** 强制指定形态；不填按扩展名推断;都不填可放 children 占位内容 */
  kind?: "video" | "image";
  /** 左上角 mono 标签（如「实拍 01」「截图 02」） */
  tag?: string;
  /** 底部说明条 */
  caption?: string;
  /** 图片慢推（Ken Burns,16s 往复;视频自带画面生命感,不用开） */
  kenburns?: boolean;
  className?: string;
  children?: ReactNode;
}

export function MediaCard({ src, kind, tag, caption, kenburns, className, children }: MediaCardProps) {
  const resolved: "video" | "image" =
    kind ?? (src && /\.(mp4|webm|mov)$/i.test(src) ? "video" : "image");
  return (
    <figure className={`media-card ${className ?? ""}`}>
      <div className="mc-media">
        {src && resolved === "video" ? <CardVideo src={src} /> : null}
        {src && resolved === "image" ? (
          <img src={src} alt="" className={kenburns ? "mc-kb" : ""} />
        ) : null}
        {!src ? <div className="mc-slot">{children}</div> : null}
      </div>
      {(tag || caption) && (
        <figcaption className="mc-bar">
          {tag && <span className="mc-tag">{tag}</span>}
          {caption && <span>{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/** 视频契约与 StepVideo 一致：muted 自动循环,canplay 前透明防黑帧 */
function CardVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCan = () => setReady(true);
    el.addEventListener("canplay", onCan, { once: true });
    el.play().catch(() => {});
    return () => el.removeEventListener("canplay", onCan);
  }, [src]);
  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s" }}
    />
  );
}

// ─────────────────────────── CardStage ───────────────────────────

interface CardStageProps {
  /** duo=主副双卡 / trio=三联排 / canvas=散点画布(有机角度,需容器有高) */
  layout?: "duo" | "trio" | "canvas";
  /** 焦点卡序号；null=全部平权。随讲述切换即「素材讲述跟随」 */
  focus?: number | null;
  /** 进场错相 ms（默认 140） */
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

export function CardStage({
  layout = "duo",
  focus = null,
  stagger = 140,
  className,
  style,
  children,
}: CardStageProps) {
  const items = Children.toArray(children);
  return (
    <div className={`card-stage cs-${layout} ${className ?? ""}`} style={style}>
      {items.map((child, i) => (
        <div className="cs-item" key={i} style={{ ["--cs-delay" as string]: i * stagger }}>
          <div className={`cs-focus ${focus === i ? "is-focus" : focus != null ? "is-recede" : ""}`}>
            {child}
            {/* 压暗叠加层:is-recede 时淡入（比 filter 便宜,视频安全） */}
            <div className="cs-dim" aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  );
}
