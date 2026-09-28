import { useMemo, useState } from "react";
import { ChartCard } from "@aibyters/layout";
import { ChartTooltip, chartVars, resolveColors, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";

export interface WaffleDatum {
  name: string;
  value: number;
}

export interface WaffleChartProps extends BaseChartProps {
  data: WaffleDatum[];
  /** Cells per row. Default 10. */
  columns?: number;
  /** Number of rows. Default 10. */
  rows?: number;
  /** Denominator for the grid. Defaults to the sum of visible values; a larger total leaves empty cells. */
  total?: number;
  /** Gap between cells in px. Default 3. */
  cellGap?: number;
  /** Maximum cell size in px. Default 22. */
  maxCellSize?: number;
  /** Formatter for the "1 cell = X" footnote. Defaults to valueFormatter. */
  unitFormatter?: (value: number) => string;
  onItemClick?: (item: WaffleDatum, index: number) => void;
}

interface Cell {
  segment: number; // index into data, -1 = empty
}

/** Largest-remainder apportionment so the cells always add up to columns*rows. */
function apportion(values: number[], totalCells: number, total: number): number[] {
  if (total <= 0) return values.map(() => 0);
  const raw = values.map((v) => (Math.max(0, v) / total) * totalCells);
  const floors = raw.map((r) => Math.floor(r));
  let used = floors.reduce((a, b) => a + b, 0);
  const remainder = raw.map((r, i) => ({ i, frac: r - floors[i] })).sort((a, b) => b.frac - a.frac);
  const target = Math.min(totalCells, Math.round(values.reduce((a, b) => a + Math.max(0, b), 0) / total * totalCells));
  for (const r of remainder) {
    if (used >= target) break;
    if (values[r.i] > 0) {
      floors[r.i] += 1;
      used += 1;
    }
  }
  // Every non-zero segment gets at least one cell when there is room, so tiny shares stay visible.
  for (let i = 0; i < values.length; i++) {
    if (values[i] > 0 && floors[i] === 0 && used < totalCells) {
      floors[i] = 1;
      used += 1;
    }
  }
  return floors;
}

interface PlotProps {
  ctx: ChartContextValue;
  data: WaffleDatum[];
  columns: number;
  rows: number;
  total: number;
  cellGap: number;
  maxCellSize: number;
  palette: string[];
  fmt: (v: number) => string;
  onItemClick?: (item: WaffleDatum, index: number) => void;
  title: string;
}

function WafflePlot({ ctx, data, columns, rows, total, cellGap, maxCellSize, palette, fmt, onItemClick, title }: PlotProps) {
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const visibleIdx = data.map((_, i) => i).filter((i) => !ctx.hiddenSeries.has(`s${i}`));
  const visibleSum = visibleIdx.reduce((a, i) => a + Math.max(0, data[i].value), 0);
  const denom = total > 0 ? total : visibleSum;
  const totalCells = columns * rows;

  const cells = useMemo<Cell[]>(() => {
    const counts = apportion(visibleIdx.map((i) => data[i].value), totalCells, denom);
    const out: Cell[] = [];
    visibleIdx.forEach((di, k) => {
      for (let c = 0; c < counts[k]; c++) out.push({ segment: di });
    });
    while (out.length < totalCells) out.push({ segment: -1 });
    return out.slice(0, totalCells);
  }, [visibleIdx.join(","), data, totalCells, denom]);

  const availW = ctx.width || 320;
  const availH = ctx.height;
  const cellW = Math.floor((availW - cellGap * (columns - 1)) / columns);
  const cellH = Math.floor((availH - cellGap * (rows - 1)) / rows);
  const size = Math.max(4, Math.min(maxCellSize, cellW, cellH));
  const svgW = columns * size + (columns - 1) * cellGap;
  const svgH = rows * size + (rows - 1) * cellGap;
  const radius = Math.max(1, Math.round(size * 0.18));
  const hoveredSeg = hover?.i ?? -1;

  const describe = (i: number) => {
    const d = data[i];
    const share = denom > 0 ? d.value / denom : 0;
    return `${d.name}: ${fmt(d.value)} (${(share * 100).toFixed(1)}%)`;
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        role="img"
        aria-label={`${title}. ${visibleIdx.map(describe).join("; ")}`}
        style={{ display: "block", overflow: "visible", fontFamily: chartVars.fontBody }}
        onMouseLeave={() => setHover(null)}
      >
        {cells.map((cell, idx) => {
          // Fill from the bottom-left, row by row, like a classic waffle.
          const col = idx % columns;
          const row = rows - 1 - Math.floor(idx / columns);
          const x = col * (size + cellGap);
          const y = row * (size + cellGap);
          const empty = cell.segment < 0;
          const dim = hoveredSeg >= 0 && cell.segment !== hoveredSeg;
          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={size}
              height={size}
              rx={radius}
              fill={empty ? chartVars.grid : palette[cell.segment]}
              opacity={dim ? 0.3 : empty ? 0.6 : 1}
              style={{ transition: ctx.animate ? "opacity 120ms" : undefined, cursor: !empty && onItemClick ? "pointer" : "default" }}
              onMouseMove={(e) => {
                if (empty) return setHover(null);
                const host = (e.currentTarget.ownerSVGElement?.parentElement as HTMLElement | null)?.getBoundingClientRect();
                setHover({ i: cell.segment, x: e.clientX - (host?.left ?? 0), y: e.clientY - (host?.top ?? 0) });
              }}
              onClick={() => !empty && onItemClick?.(data[cell.segment], cell.segment)}
            >
              <title>{empty ? "Unallocated" : describe(cell.segment)}</title>
            </rect>
          );
        })}
      </svg>
      {hover && !ctx.isTouch && (
        <div style={{ position: "absolute", left: Math.min(hover.x + 12, Math.max(0, availW - 200)), top: hover.y + 12, pointerEvents: "none", zIndex: 5 }}>
          <ChartTooltip
            title={data[hover.i].name}
            rows={[
              { key: "value", label: "Value", value: data[hover.i].value, color: palette[hover.i] },
              { key: "share", label: "Share", value: denom > 0 ? `${((data[hover.i].value / denom) * 100).toFixed(1)}%` : "–" },
            ]}
            valueFormatter={(v) => fmt(v)}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Waffle / unit chart. A grid of `columns × rows` cells coloured by each segment's share of the
 * total. Legend toggles recompute the shares among the visible segments.
 */
export function WaffleChart({
  data,
  columns = 10,
  rows = 10,
  total,
  cellGap = 3,
  maxCellSize = 22,
  unitFormatter,
  onItemClick,
  colors,
  valueFormatter,
  height,
  footer,
  exportData,
  ...card
}: WaffleChartProps) {
  const fmt = valueFormatter ?? ((v: number) => formatCompactNumber(v));
  const palette = resolveColors(colors, data.length);
  const series: SeriesDescriptor[] = data.map((d, i) => ({ key: `s${i}`, label: d.name, color: palette[i], shape: "square" }));
  const sum = data.reduce((a, d) => a + Math.max(0, d.value), 0);
  const denom = total && total > 0 ? total : sum;
  const perCell = denom / (columns * rows);
  const unit = (unitFormatter ?? fmt)(perCell);
  const legendValues: Record<string, string> = {};
  data.forEach((d, i) => {
    legendValues[`s${i}`] = denom > 0 ? `${((d.value / denom) * 100).toFixed(0)}%` : "";
  });
  const defaultHeight = Math.min(280, rows * (maxCellSize + cellGap));

  return (
    <ChartCard
      {...card}
      height={height ?? defaultHeight}
      series={series}
      legendValues={legendValues}
      isEmpty={data.length === 0}
      exportData={exportData ?? data}
      footer={
        <span>
          1 cell = {unit}
          {footer ? <> · {footer}</> : null}
        </span>
      }
    >
      {(ctx) => (
        <WafflePlot
          ctx={ctx}
          data={data}
          columns={columns}
          rows={rows}
          total={total ?? 0}
          cellGap={cellGap}
          maxCellSize={maxCellSize}
          palette={palette}
          fmt={fmt}
          onItemClick={onItemClick}
          title={card.title}
        />
      )}
    </ChartCard>
  );
}
