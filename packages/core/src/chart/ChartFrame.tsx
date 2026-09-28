import React, { useEffect, useMemo, useRef, useState } from "react";
import { useContainerSize } from "../layout/use-container-size";
import { ChartContext, type ChartContextValue } from "./ChartContext";
import { ChartLegend } from "./ChartLegend";
import { ChartEmptyState, ChartErrorState, ChartSkeleton } from "./ChartState";
import { responsiveSettings, useIsTouchDevice, usePrefersReducedMotion } from "./responsive";
import { resolveLegend, type BaseChartProps, type SeriesDescriptor } from "./types";
import { useSeriesVisibility } from "./useSeriesVisibility";

export interface ChartFrameProps
  extends Pick<BaseChartProps, "height" | "aspectRatio" | "minHeight" | "legend" | "loading" | "error" | "emptyMessage" | "ariaLabel" | "animate" | "footer" | "style" | "className"> {
  /** Series shown in the legend. Omit or pass [] for single-series charts. */
  series?: SeriesDescriptor[];
  /** Optional trailing values per legend item (e.g. "42%"). */
  legendValues?: Record<string, string>;
  /** When true, renders the empty state instead of children. */
  isEmpty?: boolean;
  /** Called when the legend toggles a series. */
  onSeriesToggle?: (key: string, hidden: boolean) => void;
  /**
   * Plot content. A render function receives the chart context (measured size, responsive
   * settings, hidden series) so charts can adapt margins and ticks to the real width.
   */
  children: React.ReactNode | ((ctx: ChartContextValue) => React.ReactNode);
}

const DEFAULT_HEIGHT = 280;

/**
 * Layout shell for every chart.
 *
 * Guarantees:
 *  - The plot always gets exactly `height` px (or `aspectRatio` × width when height="auto").
 *  - The legend is normal flow content outside the SVG, so it can never overlap marks or
 *    spill into the next dashboard widget.
 *  - Side legends collapse to the bottom below ~640px of container width.
 *  - Loading / error / empty states share one look across all chart packages.
 */
export function ChartFrame({
  height = DEFAULT_HEIGHT,
  aspectRatio = 16 / 9,
  minHeight = 160,
  legend,
  series = [],
  legendValues,
  loading,
  error,
  isEmpty,
  emptyMessage,
  ariaLabel,
  animate,
  footer,
  style,
  className,
  onSeriesToggle,
  children,
}: ChartFrameProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const { width, height: measuredHeight } = useContainerSize(plotRef);
  const isTouch = useIsTouchDevice();
  const reducedMotion = usePrefersReducedMotion();
  const settings = useMemo(() => responsiveSettings(width, isTouch), [width, isTouch]);
  // Animate on first paint only: a resize, orientation change or legend toggle must not replay
  // the mount animation (it reads as flicker and costs battery on mobile).
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (width === 0) return;
    const t = setTimeout(() => setSettled(true), 800);
    return () => clearTimeout(t);
  }, [width === 0]);

  const seriesKeys = useMemo(() => series.map((s) => s.key), [series]);
  const visibility = useSeriesVisibility(seriesKeys);

  const legendOpts = resolveLegend(legend);
  let position = legendOpts.position;
  if ((position === "left" || position === "right") && settings.collapseSideLegend) position = "bottom";
  const showLegend = position !== "none" && series.length > 0 && !loading && !error && !isEmpty;

  const fill = height === "fill";
  const resolvedHeight = fill
    ? Math.max(minHeight, measuredHeight || minHeight)
    : height === "auto"
      ? Math.max(minHeight, Math.round((width || 320) / aspectRatio))
      : Math.max(minHeight, height);

  const ctx: ChartContextValue = useMemo(
    () => ({
      width,
      height: resolvedHeight,
      settings,
      isTouch,
      reducedMotion,
      animate: !settled && (animate === undefined ? !reducedMotion : animate && !reducedMotion),
      hiddenSeries: visibility.hidden,
      highlightedSeries: visibility.highlighted,
    }),
    [width, resolvedHeight, settings, isTouch, reducedMotion, animate, settled, visibility.hidden, visibility.highlighted]
  );

  const sideLegend = position === "left" || position === "right";

  const legendNode = showLegend ? (
    <ChartLegend
      series={series}
      hidden={visibility.hidden}
      highlighted={visibility.highlighted}
      onToggle={(k) => {
        visibility.toggle(k);
        onSeriesToggle?.(k, !visibility.hidden.has(k));
      }}
      onHighlight={visibility.setHighlighted}
      position={position}
      interactive={legendOpts.interactive}
      maxRows={legendOpts.maxRows}
      align={legendOpts.align}
      fontSize={settings.fontSize}
      maxItems={settings.legendMaxItems}
      isTouch={isTouch}
      values={legendValues}
      availableWidth={sideLegend ? undefined : width}
    />
  ) : null;

  let body: React.ReactNode;
  if (loading) body = <ChartSkeleton height={resolvedHeight} />;
  else if (error) body = <ChartErrorState error={error} />;
  else if (isEmpty) body = <ChartEmptyState message={emptyMessage} />;
  else body = typeof children === "function" ? children(ctx) : children;

  return (
    <ChartContext.Provider value={ctx}>
      <div
        className={`vi-chart-frame ${className ?? ""}`.trim()}
        role="figure"
        aria-label={ariaLabel}
        data-breakpoint={settings.breakpoint}
        style={{
          display: "flex",
          flexDirection: sideLegend ? (position === "left" ? "row-reverse" : "row") : position === "top" ? "column-reverse" : "column",
          alignItems: sideLegend ? "center" : "stretch",
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          ...(fill ? { flex: "1 1 auto", minHeight: 0 } : {}),
          ...style,
        }}
      >
        <div
          ref={plotRef}
          className="vi-chart-plot"
          style={{
            position: "relative",
            width: sideLegend ? undefined : "100%",
            flex: sideLegend ? "1 1 auto" : undefined,
            minWidth: 0,
            height: fill ? undefined : resolvedHeight,
            ...(fill ? { flex: "1 1 auto", minHeight } : {}),
            // Prevent any stray absolutely-positioned child (e.g. Recharts wrappers) from escaping.
            overflow: "hidden",
            // Touch: let the page scroll vertically while the chart handles horizontal gestures.
            touchAction: "pan-y",
          }}
        >
          {body}
        </div>
        {legendNode}
        {footer && (
          <div className="vi-chart-footer" style={{ fontSize: 11, color: "var(--vi-color-text-muted)", paddingTop: 8 }}>
            {footer}
          </div>
        )}
      </div>
    </ChartContext.Provider>
  );
}
