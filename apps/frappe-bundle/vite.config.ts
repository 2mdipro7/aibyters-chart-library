import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const pkg = (name: string) => path.resolve(__dirname, `../../packages/${name}/src/index.ts`);

/**
 * Self-contained IIFE bundle for Frappe Desk. Desk has no React, so React, ReactDOM and Recharts
 * are bundled. Output is committed to aibyters_charts/public/dist so `bench get-app` on Frappe
 * Cloud needs no Node build step.
 */
export default defineConfig({
  plugins: [react()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  resolve: {
    alias: {
      "@aibyters/adapters-frappe": pkg("adapters-frappe"),
      "@aibyters/charts-bi": pkg("charts-bi"),
      "@aibyters/charts-ds": pkg("charts-ds"),
      "@aibyters/charts-kpi": pkg("charts-kpi"),
      "@aibyters/core": pkg("core"),
      "@aibyters/layout": pkg("layout"),
      "@aibyters/spec": pkg("spec"),
      "@aibyters/theme": pkg("theme"),
      "@aibyters/tokens": pkg("tokens"),
    },
    dedupe: ["react", "react-dom", "recharts"],
  },
  build: {
    outDir: path.resolve(__dirname, "../frappe-app/aibyters_charts/public/dist"),
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    lib: {
      entry: path.resolve(__dirname, "src/main.tsx"),
      name: "aibyters",
      formats: ["iife"],
      fileName: () => "aib-dashboard.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: (info) => (info.name && info.name.endsWith(".css") ? "aib-dashboard.css" : "[name][extname]"),
      },
    },
  },
});
