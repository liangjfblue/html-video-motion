import { useEffect, useRef, useState } from "react";
import "./motion.css";

interface Props {
  text: string;
  /** Reveal speed in characters per second. */
  cps?: number;
  delay?: number;
  /** Show the blinking caret while typing (and keep it after). */
  caret?: boolean;
  className?: string;
}

/**
 * Port of the component-lab "打字机标题" — rAF progressive text reveal.
 * Deterministic (speed-bound, not loop-bound). Pair with a mono font for
 * terminal scenes.
 */
export function Typewriter({
  text,
  cps = 18,
  delay = 0,
  caret = true,
  className,
}: Props) {
  const [shown, setShown] = useState("");
  const raf = useRef<number | null>(null);

  useEffect(() => {
    setShown("");
    let start: number | null = null;
    const tick = (now: number) => {
      if (start == null) start = now + delay;
      const elapsed = now - start;
      if (elapsed < 0) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      const n = Math.min(text.length, Math.floor((elapsed / 1000) * cps));
      setShown(text.slice(0, n));
      if (n < text.length) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [text, cps, delay]);

  return (
    <span className={className}>
      {shown}
      {caret && <span className="tw-caret" />}
    </span>
  );
}
