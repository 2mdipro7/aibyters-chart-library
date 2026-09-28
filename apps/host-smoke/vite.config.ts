import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const pkg = (name: string) => path.resolve(__dirname, `../../packages/${name}/src/index.ts`);

// Aliases point at source so the smoke test exercises the current working tree without a build.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@aibyters/charts-bi": pkg("charts-bi"),
      "@aibyters/charts-ds": pkg("charts-ds"),
      "@aibyters/charts-kpi": pkg("charts-kpi"),
      "@aibyters/layout": pkg("layout"),
      "@aibyters/spec": pkg("spec"),
      "@aibyters/core": pkg("core"),
      "@aibyters/theme": pkg("theme"),
      "@aibyters/tokens": pkg("tokens"),
    },
    dedupe: ["react", "react-dom", "recharts"],
  },
});
