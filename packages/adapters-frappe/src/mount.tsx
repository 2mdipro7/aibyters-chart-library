import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { FrappeDashboard, type FrappeDashboardProps } from "./FrappeDashboard";

const roots = new WeakMap<Element, Root>();

/**
 * Imperative mount for non-React hosts (Frappe Desk pages, Custom Blocks, portal pages).
 * Calling it again on the same element re-renders in place; returns an unmount function.
 */
export function mountDashboard(el: Element, props: FrappeDashboardProps): () => void {
  let root = roots.get(el);
  if (!root) {
    root = createRoot(el);
    roots.set(el, root);
  }
  root.render(React.createElement(FrappeDashboard, props));
  return () => {
    roots.get(el)?.unmount();
    roots.delete(el);
  };
}
