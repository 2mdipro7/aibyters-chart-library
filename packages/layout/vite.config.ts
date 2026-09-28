import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

/**
 * Library build for layout.
 * Emits dist/index.js (ESM), dist/index.cjs (CommonJS), dist/index.d.ts and, when the
 * package imports CSS, dist/index.css. Every dependency, peerDependency and @aibyters/*
 * package is left external so consumers dedupe React and share one copy of each library.
 */
const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf8")) as {
  name: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const externals = Array.from(
  new Set([
    "react",
    "react-dom",
    "react/jsx-runtime",
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ])
);

/** Bare specifiers and their sub-paths are external; CSS imports are always bundled into dist/index.css. */
const isExternal = (id: string): boolean =>
  !id.endsWith(".css") && externals.some((dep) => id === dep || id.startsWith(`${dep}/`));

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: resolve(__dirname, "tsconfig.json"),
      // Keep "@aibyters/*" as bare specifiers in the emitted .d.ts (tsconfig paths are for typecheck only).
      pathsToAliases: false,
      // Only this package's sources are emitted; sibling packages reached through tsconfig paths are not copied into dist.
      include: ["src"],
      entryRoot: resolve(__dirname, "src"),
      exclude: ["**/*.test.*", "**/__tests__/**"],
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: pkg.name,
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: isExternal,
      output: {
        assetFileNames: (asset) => (asset.name === "style.css" ? "index.css" : asset.name ?? "[name][extname]"),
      },
    },
  },
});
