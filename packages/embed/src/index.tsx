import { createRoot, type Root } from "react-dom/client";
import { ThemeProvider } from "@aibyters/theme";
import { SpecChart, planChart, formatCell, formatMoney, formatNumber, CATALOG, type RenderPlan } from "@aibyters/renderer";
import { isValidChartSpec, isValidDataFrame, type ChartSpec, type DataFrame } from "@aibyters/spec";

export interface RenderOptions {
  spec: ChartSpec;
  frame: DataFrame;
  theme?: "dark" | "light";
  /** CSS custom properties for the chart root, e.g. { "--vi-color-surface-card": "var(--card-bg)" } to match the host page. */
  overrides?: Record<string, string>;
  currencySymbol?: string;
  locale?: string;
  className?: string;
  /**
   * Presentation props for the chart component: variant ("plain" drops the card chrome), height
   * (px, "auto" or "fill"), legend (false or { position, maxRows }), dataLabels, colors, animate.
   */
  chart?: Record<string, unknown>;
  /** Receives the plan; its `warnings` say when the chart differs from the spec. */
  onPlan?: (plan: RenderPlan) => void;
}

const roots = new WeakMap<Element, Root>();

/** Draw (or redraw) a chart inside `el`. Returns the plan so the host can read its warnings at once. */
export function render(el: Element, options: RenderOptions): RenderPlan {
  if (!isValidChartSpec(options.spec)) throw new Error("AIBytersCharts.render: the spec is not a valid ChartSpec");
  if (!isValidDataFrame(options.frame)) throw new Error("AIBytersCharts.render: the frame is not a valid DataFrame");

  let root = roots.get(el);
  if (!root) {
    root = createRoot(el as HTMLElement);
    roots.set(el, root);
  }
  const plan = planChart(options.spec, options.frame, { currencySymbol: options.currencySymbol, locale: options.locale });
  root.render(
    <ThemeProvider
      theme={options.theme ?? "dark"}
      className="aibyters-embed"
      overrides={{ "--vi-color-surface-background": "transparent", ...options.overrides }}
    >
      <SpecChart
        spec={options.spec}
        frame={options.frame}
        currencySymbol={options.currencySymbol}
        locale={options.locale}
        className={options.className}
        chartProps={options.chart}
        onPlan={options.onPlan}
      />
    </ThemeProvider>
  );
  return plan;
}

export function unmount(el: Element): void {
  const root = roots.get(el);
  if (root) {
    root.unmount();
    roots.delete(el);
  }
}

export const version = "0.2.0";

const api = { render, unmount, planChart, formatCell, formatMoney, formatNumber, catalog: CATALOG, version };

declare global {
  interface Window {
    AIBytersCharts?: typeof api;
  }
}

window.AIBytersCharts = api;
