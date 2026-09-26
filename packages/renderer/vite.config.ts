import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";

const pkg = (name: string) => path.resolve(__dirname, `../${name}/src/index.ts`);

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  resolve: {
    alias: {
      "@aibyters/spec": pkg("spec"),
      "@aibyters/charts-kpi": pkg("charts-kpi"),
      "@aibyters/charts-bi": pkg("charts-bi"),
      "@aibyters/charts-ai": pkg("charts-ai"),
      "@aibyters/layout": pkg("layout"),
      "@aibyters/core": pkg("core"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "@aibyters/renderer",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom", "recharts", /^@aibyters\//],
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
