import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { CATALOG, catalogVersion } from "../renderer/src/catalog";

// Everything is bundled from source (React, Recharts and all @aibyters packages) into one
// script and one stylesheet, so a plain HTML page needs nothing else.
const pkg = (name: string) => path.resolve(__dirname, `../${name}/src/index.ts`);

export default defineConfig({
  plugins: [
    react(),
    {
      // The charts this bundle can draw from query results, for a backend to put in a model's prompt
      name: "aibyters-catalog",
      generateBundle() {
        this.emitFile({ type: "asset", fileName: "catalog.json", source: JSON.stringify({ version: catalogVersion, kinds: CATALOG }, null, 2) + String.fromCharCode(10) });
      },
    },
  ],
  define: { "process.env.NODE_ENV": '"production"' },
  resolve: {
    alias: {
      "@aibyters/renderer": pkg("renderer"),
      "@aibyters/spec": pkg("spec"),
      "@aibyters/theme": pkg("theme"),
      "@aibyters/charts-kpi": pkg("charts-kpi"),
      "@aibyters/charts-bi": pkg("charts-bi"),
      "@aibyters/charts-ai": pkg("charts-ai"),
      "@aibyters/charts-ds": pkg("charts-ds"),
      "@aibyters/layout": pkg("layout"),
      "@aibyters/core": pkg("core"),
      "@aibyters/tokens": pkg("tokens"),
    },
    dedupe: ["react", "react-dom", "recharts"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    sourcemap: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "AIBytersCharts",
      formats: ["iife"],
      fileName: () => "aibyters-charts.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: "aibyters-charts.[ext]",
        inlineDynamicImports: true,
      },
    },
  },
});
