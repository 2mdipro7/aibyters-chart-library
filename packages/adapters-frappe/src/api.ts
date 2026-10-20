/**
 * Thin, dependency-free client for Frappe's REST / RPC endpoints.
 * Inside Desk it reuses `window.frappe` (session + CSRF); outside it falls back to `fetch`
 * with `credentials: "include"` and the `X-Frappe-CSRF-Token` header when available.
 */

declare global {
  interface Window {
    frappe?: any;
  }
}

export interface FrappeClientOptions {
  /** Base URL for the site when running outside Desk (e.g. a portal). Defaults to same origin. */
  baseUrl?: string;
  /** API key/secret auth for server-to-server or external dashboards. */
  apiKey?: string;
  apiSecret?: string;
}

export class FrappeApiError extends Error {
  constructor(message: string, public status: number, public body?: any) {
    super(message);
  }
}

export function createFrappeClient(opts: FrappeClientOptions = {}) {
  const base = (opts.baseUrl ?? "").replace(/\/$/, "");

  async function call<T = any>(method: string, args: Record<string, any> = {}): Promise<T> {
    // Prefer the Desk runtime: it handles CSRF, session expiry and the loading indicator.
    if (!opts.baseUrl && !opts.apiKey && typeof window !== "undefined" && window.frappe?.xcall) {
      return window.frappe.xcall(method, args);
    }
    const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
    if (opts.apiKey && opts.apiSecret) headers.Authorization = `token ${opts.apiKey}:${opts.apiSecret}`;
    const csrf = typeof window !== "undefined" ? window.frappe?.csrf_token : undefined;
    if (csrf) headers["X-Frappe-CSRF-Token"] = csrf;
    const res = await fetch(`${base}/api/method/${method}`, { method: "POST", headers, credentials: "include", body: JSON.stringify(args) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new FrappeApiError(body?.exception || body?.message || `Frappe call failed (${res.status})`, res.status, body);
    return body.message as T;
  }

  return {
    call,
    /** Runs a Query/Script Report with filters. */
    runReport: (reportName: string, filters: Record<string, any> = {}, ignorePrepared = true) =>
      call("frappe.desk.query_report.run", { report_name: reportName, filters, ignore_prepared_report: ignorePrepared ? 1 : 0 }),
    /** `frappe.client.get_list` with explicit fields. */
    getList: <T = Record<string, any>>(doctype: string, params: { fields?: string[]; filters?: any; order_by?: string; limit_page_length?: number; group_by?: string } = {}) =>
      call<T[]>("frappe.client.get_list", { doctype, fields: params.fields ?? ["name"], filters: params.filters ?? {}, order_by: params.order_by, limit_page_length: params.limit_page_length ?? 500, group_by: params.group_by }),
    /** Dashboard Chart data as Desk computes it (respects the chart's own filters/time span). */
    getDashboardChart: (chartName: string, extra: Record<string, any> = {}) =>
      call("frappe.desk.doctype.dashboard_chart.dashboard_chart.get", { chart_name: chartName, refresh: 1, ...extra }),
    /** Number Card value. */
    getNumberCard: (cardName: string) => call("frappe.desk.doctype.number_card.number_card.get_result", { doc: { name: cardName } }),
    /** The app's own aggregation endpoint (see the Frappe app `aibyters_charts.api.query`). */
    query: (spec: Record<string, any>) => call("aibyters_charts.api.query", { spec }),
  };
}

export type FrappeClient = ReturnType<typeof createFrappeClient>;
