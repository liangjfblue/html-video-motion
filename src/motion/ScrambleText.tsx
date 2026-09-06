import { useEffect, useRef, useState } from "react";
import { mulberry32 } from "./anim";

interface Props {
  text: string;
  /** 解码总时长 ms */
  duration?: number;
  delay?: number;
  /** 未解码位置每 80ms 换一批乱码（确定性：种子化） */
  seed?: number;
  /** 解码用字符集 */
  charset?: string;
  className?: string;
}

const DEFAULT_CHARS = "!<>-_\\/[]{}=+*^?#%$@01";

/**
 * ScrambleText — 解码文字（gsap ScrambleText 的自研版）。
 * 乱码逐位“解码”成正文：左侧先落定，未解码位持续翻动随机字符。
 * 固定种子 → 每次播放逐帧一致（录制确定性）。
 */
export function ScrambleText({
  text,
  duration = 1400,
  delay = 0,
  seed = 42,
  charset = DEFAULT_CHARS,
  className,
}: Props) {
  const [shown, setShown] = useState("");
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const rand = mulberry32(seed);
    setShown("");
    let start: number | null = null;
    let lastShift = -80;
    let noise = Array.from({ length: text.length }, () =>
      charset!.charAt(Math.floor(rand() * charset!.length)),
    );
    const tick = (now: number) => {
      if (start == null) start = now + delay;
      const t = now - start;
      if (t < 0) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, t / duration);
      const resolved = Math.floor(p * text.length);
      if (t - lastShift >= 80) {
        lastShift = t;
        noise = noise.map((c, i) =>
          i < resolved
            ? c
            : charset!.charAt(Math.floor(rand() * charset!.length)),
        );
      }
      setShown(
        text.slice(0, resolved) +
          noise.slice(resolved).join(""),
      );
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setShown(text);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [text, duration, delay, seed, charset]);

  return <span className={className}>{shown}</span>;
}
