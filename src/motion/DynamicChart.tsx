import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { cssVar } from "./anim";

interface Props {
  /** ECharts option. Colors default to theme tokens when omitted. */
  option: echarts.EChartsOption;
  /** Change to force a re-init (e.g. pass the active theme id so charts
   *  re-mount — and re-read theme colors — when the theme switches). */
  reInitKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ECharts wrapper. Mounts a chart instance per step (mount → entrance
 * animation plays; unmount → dispose). Pass `themeColors()`-derived
 * colors in your option to follow the active theme, or hard-code colors
 * for a fixed look.
 */
export function DynamicChart({ option, reInitKey, className, style }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const chart = echarts.init(el);
    chart.setOption(option);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(el);
    return () => {
      ro.disconnect();
      chart.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reInitKey]);

  return (
    <div
      ref={elRef}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
}

/** Sales-chart style preset built from theme tokens (purple-gold's
 *  layout-chart look: accent bars + smooth primary line). */
export function themeSalesOption(
  categories: string[],
  bars: number[],
  line: number[],
  barName = "营收",
  lineName = "增长率",
): echarts.EChartsOption {
  const accent = cssVar("--accent-gold", cssVar("--accent", "#ffc402"));
  const primary = cssVar("--chart-line", cssVar("--primary", "#b98eff"));
  const muted = cssVar("--text-muted", "#aaa59a");
  const light = cssVar("--text-light", "#746f66");
  const border = cssVar("--border", "rgba(255,255,255,0.16)");
  return {
    animationDuration: 1200,
    animationDurationUpdate: 700,
    animationEasingUpdate: "cubicInOut",
    grid: { left: 34, right: 34, top: 44, bottom: 46, containLabel: true },
    tooltip: { show: false },
    legend: {
      data: [barName, lineName],
      textStyle: { color: muted, fontSize: 11 },
      bottom: 0,
      itemWidth: 14,
      itemHeight: 8,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLine: { lineStyle: { color: border } },
      axisTick: { show: false },
      axisLabel: { color: muted, fontSize: 12 },
    },
    yAxis: [
      {
        type: "value",
        name: barName,
        max: 25,
        nameTextStyle: { color: light, fontSize: 10 },
        axisLabel: { color: muted, fontSize: 10 },
        splitLine: { lineStyle: { color: border, type: "dashed" } },
      },
      {
        type: "value",
        name: lineName,
        max: 8,
        nameTextStyle: { color: light, fontSize: 10 },
        axisLabel: { color: muted, fontSize: 10, formatter: "{value}%" },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: barName,
        type: "bar",
        barWidth: 38,
        data: bars,
        itemStyle: {
          color: accent,
          borderRadius: [3, 3, 0, 0],
        },
      },
      {
        name: lineName,
        type: "line",
        yAxisIndex: 1,
        data: line,
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { color: primary, width: 2.5 },
        itemStyle: { color: primary },
      },
    ],
  };
}
