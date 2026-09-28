import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Root Vitest configuration for the workspace (`pnpm test` runs `vitest run` here).
 *
 * - `*.test.ts`  -> node environment (pure utilities: scales, label layout, schemas, formatters)
 * - `*.test.tsx` -> jsdom environment (React components)
 *
 * `@aibyters/*` resolves straight to each package's `src/index.ts`, mirroring the `paths` in
 * tsconfig.base.json, so tests never require a prior `pnpm build`.
 */
const packagesDir = resolve(__dirname, "packages");
const alias = Object.fromEntries(
  readdirSync(packagesDir)
    .filter((name) => existsSync(resolve(packagesDir, name, "package.json")))
    .map((name) => [`@aibyters/${name}`, resolve(packagesDir, name, "src/index.ts")])
);

const include = ["packages/**/src/**/*.test.{ts,tsx}", "packages/**/src/__tests__/**/*.test.{ts,tsx}"];
const exclude = ["**/node_modules/**", "**/dist/**", "apps/**"];

export default defineConfig({
  resolve: { alias },
  esbuild: { jsx: "automatic" },
  test: {
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: include.map((p) => p.replace("{ts,tsx}", "ts")),
          exclude,
        },
      },
      {
        extends: true,
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: include.map((p) => p.replace("{ts,tsx}", "tsx")),
          exclude,
        },
      },
    ],
  },
});
