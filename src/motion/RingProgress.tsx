import { useMemo } from "react";

interface Props {
  /** 0–1 全局进度 */
  value: number;
  size?: number;
  /** 环宽 */
  stroke?: number;
  label?: string;
  className?: string;
}

/**
 * RingProgress — 环形进度指示（SVG，主题 accent 描边）。
 * 放在悬停 chrome 区（录制不采集），预览时一眼看到全片位置。
 */
export function RingProgress({ value, size = 56, stroke = 5, label, className }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  const dash = `${(c * v).toFixed(2)} ${(c * (1 - v)).toFixed(2)}`;

  const track = "var(--border, rgba(255,255,255,0.2))";
  const accent = useMemo(
    () => `var(--accent, #b98eff)`,
    [],
  );

  return (
    <div className={`rp ${className ?? ""}`} data-no-advance title={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={0}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            animation: "rp-fill 900ms var(--ease-quart, cubic-bezier(0.19, 1, 0.22, 1)) both",
            ["--rp-from" as string]: (c * v).toFixed(2),
          }}
        />
        {label ? (
          <text
            x="50%"
            y="54%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
            fontSize={size * 0.22}
            fontFamily="var(--font-mono, monospace)"
          >
            {label}
          </text>
        ) : null}
      </svg>
    </div>
  );
}
