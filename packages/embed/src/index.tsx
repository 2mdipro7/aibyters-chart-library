import { createRoot, type Root } from "react-dom/client";
import { ThemeProvider } from "@aibyters/theme";
import { SpecChart, components, registerComponent, planChart, formatCell, formatMoney, formatNumber, CATALOG, type RenderPlan } from "@aibyters/renderer";
import { isValidChartSpec, isValidDataFrame, formatValue, type ChartSpec, type DataFrame } from "@aibyters/spec";
import { BulletChart, RiskMatrixChart } from "@aibyters/charts-bi";
import { ForecastBand, HeatmapChart } from "@aibyters/charts-ds";

// Components the planner never selects but hosts draw directly through renderComponent().
registerComponent("ForecastBand", ForecastBand);
registerComponent("HeatmapChart", HeatmapChart);
registerComponent("RiskMatrixChart", RiskMatrixChart);
registerComponent("BulletChart", BulletChart);

export interface ThemeOptions {
  theme?: "dark" | "light";
  /** CSS custom properties for the chart root, e.g. { "--vi-color-surface-card": "var(--card-bg)" } to match the host page. */
  overrides?: Record<string, string>;
  className?: string;
}

export interface RenderOptions extends ThemeOptions {
  spec: ChartSpec;
  frame: DataFrame;
  currencySymbol?: string;
  locale?: string;
  /**
   * Presentation props for the chart component: variant ("plain" drops the card chrome), height
   * (px, "auto" or "fill"), legend (false or { position, maxRows }), dataLabels, colors, animate.
   */
  chart?: Record<string, unknown>;
  /** Receives the plan; its `warnings` say when the chart differs from the spec. */
  onPlan?: (plan: RenderPlan) => void;
}

export interface RenderComponentOptions extends ThemeOptions {
  /** A name from `components`, e.g. "DeltaCard", "ColumnChart" or "ForecastBand". */
  component: string;
  /** Props passed straight to that component; the host owns their semantics. */
  props: Record<string, unknown>;
}

const roots = new WeakMap<Element, Root>();

function rootFor(el: Element): Root {
  let root = roots.get(el);
  if (!root) {
    root = createRoot(el as HTMLElement);
    roots.set(el, root);
  }
  return root;
}

function themed(options: ThemeOptions, children: React.ReactNode) {
  return (
    <ThemeProvider
      theme={options.theme ?? "dark"}
      className={["aibyters-embed", options.className].filter(Boolean).join(" ")}
      overrides={{ "--vi-color-surface-background": "transparent", ...options.overrides }}
    >
      {children}
    </ThemeProvider>
  );
}

/** Draw (or redraw) a chart inside `el`. Returns the plan so the host can read its warnings at once. */
export function render(el: Element, options: RenderOptions): RenderPlan {
  if (!isValidChartSpec(options.spec)) throw new Error("AIBytersCharts.render: the spec is not a valid ChartSpec");
  if (!isValidDataFrame(options.frame)) throw new Error("AIBytersCharts.render: the frame is not a valid DataFrame");

  const plan = planChart(options.spec, options.frame, { currencySymbol: options.currencySymbol, locale: options.locale });
  rootFor(el).render(
    themed(
      options,
      <SpecChart
        spec={options.spec}
        frame={options.frame}
        currencySymbol={options.currencySymbol}
        locale={options.locale}
        chartProps={options.chart}
        onPlan={options.onPlan}
      />
    )
  );
  return plan;
}

/**
 * Draw (or redraw) one named component inside `el` with explicit props, bypassing the planner.
 * For hosts that already hold a value, a delta or a series in their own shape and must keep it
 * (an explicit KPI with stale history, a supplied fractional delta, a forecast with real bounds).
 * An element has one React root whichever of render / renderComponent drew it last.
 */
export function renderComponent(el: Element, options: RenderComponentOptions): void {
  const Component = components[options.component];
  if (!Component) throw new Error(`AIBytersCharts.renderComponent: unknown component "${options.component}"`);
  rootFor(el).render(themed(options, <Component {...options.props} />));
}

export function unmount(el: Element): void {
  const root = roots.get(el);
  if (root) {
    root.unmount();
    roots.delete(el);
  }
}

/** True when `el` currently holds a chart drawn by render or renderComponent. */
export function isMounted(el: Element): boolean {
  return roots.has(el);
}

export const version = "0.3.0";

const api = {
  render,
  renderComponent,
  unmount,
  isMounted,
  planChart,
  formatCell,
  formatMoney,
  formatNumber,
  formatValue,
  catalog: CATALOG,
  /** Names renderComponent accepts. */
  componentNames: (): string[] => Object.keys(components),
  version,
};

declare global {
  interface Window {
    AIBytersCharts?: typeof api;
  }
}

window.AIBytersCharts = api;
