import React from "react";
import { createRoot, type Root } from "react-dom/client";
// ThemeProvider imports global.css itself.
import { createFrappeClient, FrappeDashboard, mountDashboard, type DashboardSpec } from "@aibyters/adapters-frappe";

declare global {
  interface Window {
    aibyters: typeof api;
    frappe?: any;
  }
}

interface MountOptions {
  hideHeader?: boolean;
  compact?: boolean;
  onTitle?: (title: string) => void;
}

const roots = new WeakMap<Element, Root>();

function Banner({ text, tone }: { text: string; tone: "warn" | "info" }) {
  return (
    <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, marginBottom: 12, background: tone === "warn" ? "var(--yellow-50, #fff8e1)" : "var(--blue-50, #eef5ff)", color: "var(--text-color, #333)", border: "1px solid var(--border-color, #ddd)" }}>
      {text}
    </div>
  );
}

function ByName({ name, opts }: { name: string; opts: MountOptions }) {
  const [state, setState] = React.useState<{ spec?: DashboardSpec; license?: any; error?: string }>({});
  const client = React.useMemo(() => createFrappeClient(), []);
  React.useEffect(() => {
    client
      .call("aibyters_charts.api.get_dashboard", { name })
      .then((r: any) => {
        setState({ spec: r.spec, license: r.license });
        opts.onTitle?.(r.title);
      })
      .catch((e: any) => setState({ error: e?.message ?? String(e) }));
  }, [name]);
  if (state.error) return <Banner tone="warn" text={state.error} />;
  if (!state.spec) return <div style={{ padding: 24, color: "var(--text-muted, #777)" }}>Loading…</div>;
  const truncated = (state.spec as any)._truncated as number | undefined;
  const lic = state.license ?? {};
  return (
    <div>
      {lic.valid === false && <Banner tone="warn" text={lic.message ?? "Licence invalid; running on the free tier."} />}
      {truncated ? <Banner tone="info" text={`${truncated} widget(s) hidden on the free tier. Upgrade in AIB Settings to show all widgets.`} /> : null}
      <FrappeDashboard spec={state.spec} client={client} hideHeader={opts.hideHeader} />
      {!lic.limits?.white_label && (
        <div style={{ textAlign: "right", fontSize: 11, color: "var(--text-light, #999)", marginTop: 8 }}>Powered by AI Byters Charts</div>
      )}
    </div>
  );
}

function mountDashboardByName(el: Element, name: string, opts: MountOptions = {}) {
  let root = roots.get(el);
  if (!root) {
    root = createRoot(el);
    roots.set(el, root);
  }
  root.render(<ByName name={name} opts={opts} />);
  return () => {
    roots.get(el)?.unmount();
    roots.delete(el);
  };
}

const api = {
  version: "0.1.0",
  mountDashboard,
  mountDashboardByName,
  createFrappeClient,
};

window.aibyters = api;
export default api;
