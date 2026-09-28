import { useMemo, useRef } from "react";
import { ChartCard } from "@aibyters/layout";
import { chartVars, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { DEFAULT_FORMATTER, seriesOpacity, splitCardProps, type CardKey } from "./internal/cartesian";
import { SvgAxes, SvgTooltipLayer, computeSvgFrame, svgBoxStyle, useSvgTooltip } from "./internal/svg";

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  [key: string]: any;
}

export interface CandlestickChartProps extends Omit<BaseChartProps, "colors"> {
  data: Candle[];
  /** Colours for rising / falling candles. Default: theme positive / critical. */
  colors?: { up?: string; down?: string };
  /** Legend labels. Default `{ up: "Up", down: "Down" }`. */
  seriesLabels?: { up?: string; down?: string };
  onCandleClick?: (candle: Candle) => void;
}

/** OHLC candles drawn with plain SVG at real pixel size. */
export function CandlestickChart(props: CandlestickChartProps) {
  const [card, plot] = splitCardProps(props);
  const colors = { up: props.colors?.up ?? chartVars.positive, down: props.colors?.down ?? chartVars.negative };
  const series: SeriesDescriptor[] = [
    { key: "up", label: props.seriesLabels?.up ?? "Up", color: colors.up, shape: "square" },
    { key: "down", label: props.seriesLabels?.down ?? "Down", color: colors.down, shape: "square" },
  ];
  return (
    <ChartCard {...card} series={series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <CandlestickBody ctx={ctx} resolvedColors={colors} {...plot} />}
    </ChartCard>
  );
}

function CandlestickBody({ ctx, data, resolvedColors, valueFormatter = DEFAULT_FORMATTER, labelFormatter, onCandleClick }: Omit<CandlestickChartProps, CardKey> & { ctx: ChartContextValue; resolvedColors: { up: string; down: string } }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { hover, show, hide } = useSvgTooltip(svgRef);
  const w = ctx.width || 400;
  const h = ctx.height;
  const fs = ctx.settings.fontSize;

  const { lo, hi } = useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const d of data) {
      if (d.low < lo) lo = d.low;
      if (d.high > hi) hi = d.high;
    }
    if (!Number.isFinite(lo)) lo = 0;
    if (!Number.isFinite(hi)) hi = 1;
    if (lo === hi) {
      lo -= 1;
      hi += 1;
    }
    const pad = (hi - lo) * 0.08;
    return { lo: lo - pad, hi: hi + pad };
  }, [data]);

  const categories = data.map((d) => (labelFormatter ? labelFormatter(d.date) : String(d.date)));
  const frame = computeSvgFrame({ width: w, height: h, fontSize: fs, tickCount: ctx.settings.tickCount, yMin: lo, yMax: hi, valueFormatter, categories });
  const { left, top, plotH, slot, scaleY } = frame;
  const bodyW = Math.max(2, Math.min(slot * 0.6, 24));

  return (
    <div style={svgBoxStyle}>
      <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Candlestick chart, ${data.length} periods`} style={{ display: "block", fontFamily: chartVars.fontBody }}>
        <SvgAxes frame={frame} fontSize={fs} valueFormatter={valueFormatter} categories={categories} />
        {data.map((d, i) => {
          const up = d.close >= d.open;
          const key = up ? "up" : "down";
          const c = up ? resolvedColors.up : resolvedColors.down;
          const opacity = seriesOpacity(key, ctx);
          if (opacity === 0) return null;
          const cx = left + slot * i + slot / 2;
          const yHigh = scaleY(d.high);
          const yLow = scaleY(d.low);
          const yTop = scaleY(Math.max(d.open, d.close));
          const yBot = scaleY(Math.min(d.open, d.close));
          const rows = [
            { key: "open", label: "Open", value: d.open },
            { key: "high", label: "High", value: d.high },
            { key: "low", label: "Low", value: d.low },
            { key: "close", label: "Close", value: d.close, color: c },
          ];
          return (
            <g key={`${d.date}-${i}`} opacity={opacity} onPointerMove={(e) => show(e, categories[i], rows)} onPointerLeave={hide} onClick={() => onCandleClick?.(d)} style={{ cursor: onCandleClick ? "pointer" : "default" }}>
              <title>{`${d.date}: O ${valueFormatter(d.open)} H ${valueFormatter(d.high)} L ${valueFormatter(d.low)} C ${valueFormatter(d.close)}`}</title>
              <rect x={left + slot * i} y={top} width={slot} height={plotH} fill="transparent" />
              <line x1={cx} x2={cx} y1={yHigh} y2={yLow} stroke={c} strokeWidth={Math.max(1, Math.min(2, bodyW / 6))} />
              <rect x={cx - bodyW / 2} y={yTop} width={bodyW} height={Math.max(1, yBot - yTop)} fill={c} rx={1} />
            </g>
          );
        })}
      </svg>
      <SvgTooltipLayer hover={hover} width={w} height={h} valueFormatter={(v) => valueFormatter(v)} />
    </div>
  );
}
