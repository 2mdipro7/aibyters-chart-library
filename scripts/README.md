# scripts/

Repository maintenance scripts. All are plain Node ESM (`node scripts/<name>.mjs`), need no
extra dependencies, and are wired into the root `package.json` where a script exists there.

| Script | Root script | Purpose |
| --- | --- | --- |
| `copy-license.mjs` | - | Copies the root `LICENSE` into every `packages/*/` directory so each published tarball carries it (every package lists `LICENSE` in `files`). Idempotent. |
| `release-check.mjs` | - (run in `release.yml`) | Pre-publish gate: runs `copy-license`, then verifies package metadata (license, shared version, exports, files, `publishConfig.access`), workspace links, and that `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts` exist with bare `@aibyters/*` specifiers. Exit 1 lists every problem. |
| `bundle-size.mjs` | `pnpm size` | Markdown table of raw / gzipped size for each package's `dist/index.js` (+ CJS / CSS). `--json` for machine output. |
| `visual-check.mjs` | `pnpm test:visual` | Serves `apps/playground/dist`, screenshots every route in `apps/playground/src/data/chart-registry.ts` at 360 / 768 / 1280 px into `visual/` (git-ignored) using the globally installed Playwright + Chromium, and fails on console errors. Skips with a message when the playground is not built or no browser is available. |

## LICENSE in packages

The root `package.json` has no `prebuild` hook (kept minimal on purpose), so `LICENSE` is not
copied automatically on every build. It is copied:

- by `node scripts/copy-license.mjs` (run it once after cloning, or whenever `LICENSE` changes), and
- by `node scripts/release-check.mjs`, which the release workflow runs before `pnpm publish`.

`packages/*/LICENSE` files are committed copies; keep them identical to the root file.

## Typical local flow

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
node scripts/release-check.mjs
pnpm size
pnpm build:playground && pnpm test:visual
```
