import { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@aibyters/theme";
import { Grid, GridItem, FilterBar } from "@aibyters/layout";
import { createFrappeClient, type FrappeClient, type FrappeClientOptions } from "./api";
import { frappeThemeOverrides, onFrappeThemeChange, readFrappeTheme } from "./theme";
import { parseDashboardSpec, type DashboardSpec, type WidgetSpec } from "./spec";
import { WidgetRenderer } from "./widgets";

export interface FrappeDashboardProps {
  /** Parsed spec or JSON string (as stored in the "AIB Dashboard" DocType). */
  spec: DashboardSpec | string | Record<string, any>;
  client?: FrappeClient;
  clientOptions?: FrappeClientOptions;
  /** Initial global filter values. */
  filters?: Record<string, any>;
  /** Override drilldown handling (default: `frappe.set_route` / `window.location`). */
  onDrill?: (widget: WidgetSpec, datum: any) => void;
  /** Hide the title/filter header (when the Desk page already shows them). */
  hideHeader?: boolean;
  /** Theme to use when not inside Desk. Default follows `<html data-theme>`. */
  theme?: "light" | "dark" | "system";
  className?: string;
}

/**
 * Config-driven dashboard that renders inside Frappe Desk (or any page) and inherits the Desk
 * theme. Data flows through the site's own permissions because every source is fetched with the
 * logged-in session (`frappe.xcall`) or the supplied API key.
 */
export function FrappeDashboard({ spec: input, client: givenClient, clientOptions, filters: initialFilters, onDrill, hideHeader, theme, className }: FrappeDashboardProps) {
  const spec = useMemo(() => parseDashboardSpec(input as any), [input]);
  const client = useMemo(() => givenClient ?? createFrappeClient(clientOptions), [givenClient, clientOptions]);
  const [filters, setFilters] = useState<Record<string, any>>(() => ({ ...Object.fromEntries(spec.filters.filter((f) => f.default !== undefined).map((f) => [f.fieldname, f.default])), ...initialFilters }));
  const [deskTheme, setDeskTheme] = useState<"light" | "dark">(() => (theme === "light" || theme === "dark" ? theme : readFrappeTheme()));
  useEffect(() => {
    if (theme === "light" || theme === "dark") return;
    return onFrappeThemeChange(setDeskTheme);
  }, [theme]);

  const overrides = useMemo(() => frappeThemeOverrides(spec.theme), [spec.theme]);
  const drill = onDrill ?? defaultDrill;
  const activeFilters = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "")), [filters]);

  return (
    <ThemeProvider theme={deskTheme} overrides={overrides} unstyled className={className}>
      <div className="aib-dashboard" style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
        {!hideHeader && (spec.description || spec.filters.length > 0) && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
            {spec.description && <p style={{ margin: 0, color: "var(--vi-color-text-secondary)", fontSize: 13 }}>{spec.description}</p>}
            {spec.filters.length > 0 && (
              <FilterBar>
                {spec.filters.map((f) => (
                  <label key={f.fieldname} style={{ display: "inline-flex", flexDirection: "column", gap: 2, fontSize: 12, color: "var(--vi-color-text-secondary)" }}>
                    {f.label}
                    <input
                      type={f.fieldtype === "Date" ? "date" : "text"}
                      list={f.fieldtype === "Select" ? `aib-opts-${f.fieldname}` : undefined}
                      value={filters[f.fieldname] ?? ""}
                      onChange={(ev) => setFilters((s) => ({ ...s, [f.fieldname]: ev.target.value }))}
                      style={{ font: "inherit", padding: "6px 8px", borderRadius: 6, border: "1px solid var(--vi-color-surface-border)", background: "var(--vi-color-surface-card)", color: "var(--vi-color-text-primary)", minHeight: 32 }}
                    />
                    {f.fieldtype === "Select" && f.options && (
                      <datalist id={`aib-opts-${f.fieldname}`}>{f.options.split("\n").filter(Boolean).map((o) => <option key={o} value={o} />)}</datalist>
                    )}
                  </label>
                ))}
              </FilterBar>
            )}
          </div>
        )}
        <Grid columns={spec.columns as any} minColumnWidth={spec.minColumnWidth}>
          {spec.widgets.map((w) => (
            <GridItem key={w.id} colSpan={w.span}>
              <WidgetRenderer spec={w} client={client} globalFilters={activeFilters} onDrill={drill} />
            </GridItem>
          ))}
        </Grid>
      </div>
    </ThemeProvider>
  );
}

function defaultDrill(widget: WidgetSpec, datum: any) {
  if (!widget.drilldown) return;
  const target = widget.drilldown.replace(/\{(\w+)\}/g, (_, k) => encodeURIComponent(String(datum?.[k] ?? datum?.payload?.[k] ?? "")));
  const frappe = typeof window !== "undefined" ? window.frappe : undefined;
  if (frappe?.set_route && target.startsWith("/app/")) frappe.set_route(target.replace(/^\/app\//, "").split("/"));
  else if (typeof window !== "undefined") window.location.href = target;
}
