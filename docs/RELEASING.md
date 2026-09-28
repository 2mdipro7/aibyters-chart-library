# Releasing `@aibyters/*`

This document covers versioning, publishing to a private registry, how licensees consume the
packages, and how to verify a release.

## 1. Versioning

- **Semantic Versioning** (`MAJOR.MINOR.PATCH`). Breaking API or visual-contract changes bump
  `MAJOR` (or `MINOR` while we are on `0.x`), new charts / props bump `MINOR`, fixes bump `PATCH`.
- **One version for the whole library.** Every `packages/*/package.json` carries the same
  `version` as the root `package.json`. Packages depend on each other with `workspace:*`, which
  pnpm rewrites to the exact published version at publish time, so a licensee installing
  `@aibyters/charts-bi@0.2.0` always gets `@aibyters/core@0.2.0`.
- `scripts/release-check.mjs` fails when any package version differs from the root version.

### Bumping

```bash
# from a clean main branch
NEW=0.2.0
pnpm -r --filter './packages/**' exec -- pnpm version $NEW --no-git-tag-version
pnpm version $NEW --no-git-tag-version          # root package.json
# update CHANGELOG.md: move the [Unreleased] section under a new [0.2.0] heading
git commit -am "release: v$NEW"
git tag "v$NEW"
git push origin main "v$NEW"
```

Then run the **Release** workflow (GitHub -> Actions -> Release -> *Run workflow*) with
`tag = v0.2.0`. Use `dry_run = true` first on a new registry.

## 2. Private registry

The packages are proprietary (`"license": "SEE LICENSE IN LICENSE"`, `publishConfig.access:
"restricted"`). They must be published to a registry that only licensees can read:

| Registry | `NPM_REGISTRY` | Notes |
| --- | --- | --- |
| GitHub Packages | `https://npm.pkg.github.com` | Scope must match the GitHub owner. Token needs `write:packages`; readers need `read:packages`. |
| Verdaccio (self-hosted) | `https://npm.example.com` | Restrict `@aibyters/*` access to authenticated users in `config.yaml`. |
| Artifactory / Nexus | `https://artifactory.example.com/artifactory/api/npm/aibyters/` | Create an npm-local repo for the scope and a per-licensee read permission. |
| npmjs.org (org private packages) | `https://registry.npmjs.org` (default) | Requires a paid org; packages stay `restricted`. |

Repository configuration for `.github/workflows/release.yml`:

- **Secret** `NPM_TOKEN`: a publish token with write access to the `@aibyters` scope.
- **Variable** `NPM_REGISTRY` (optional): the registry URL; defaults to `https://registry.npmjs.org`.
- Optionally protect the `release` environment with required reviewers.

The workflow checks out the tag, verifies it matches the workspace version, runs typecheck,
tests and `pnpm build`, executes `node scripts/release-check.mjs` (which also copies `LICENSE`
into every package), writes an `~/.npmrc` for the registry, and runs

```bash
pnpm -r --filter './packages/**' publish --no-git-checks --access restricted
```

### Publishing manually

```bash
pnpm install --frozen-lockfile
pnpm build
node scripts/release-check.mjs
export NPM_REGISTRY=https://npm.pkg.github.com
printf '@aibyters:registry=%s\n//npm.pkg.github.com/:_authToken=%s\n' "$NPM_REGISTRY" "$NPM_TOKEN" >> ~/.npmrc
pnpm -r --filter './packages/**' publish --no-git-checks --access restricted
```

`--no-git-checks` is required because the tag checkout is detached. Never publish from a dirty
working tree.

## 3. How licensees consume the packages

Licensees receive a read-only token for the registry. In their project root:

```ini
# .npmrc
@aibyters:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${AIBYTERS_NPM_TOKEN}
```

(For Verdaccio / Artifactory replace the host and path, e.g.
`//artifactory.example.com/artifactory/api/npm/aibyters/:_authToken=...`.)

Then:

```bash
export AIBYTERS_NPM_TOKEN=...            # keep it out of version control
npm install @aibyters/core @aibyters/theme @aibyters/charts-bi react react-dom recharts
```

Peer dependencies are installed by the licensee, so React and chart engines are shared with the
host application:

| Package | Peer dependencies |
| --- | --- |
| all React packages | `react`, `react-dom` (`^18.2 || ^19`) |
| `charts-bi`, `charts-ds` | `recharts` |
| `charts-geo` | `leaflet`, `react-leaflet`, `react-simple-maps` |
| `charts-flow` | `@xyflow/react`, `lucide-react` |
| `charts-infographics` | `lucide-react` |
| `svg` | `framer-motion` |

Packages that ship CSS (`theme`, `charts-flow`, `charts-geo`) expose it as
`import "@aibyters/<name>/styles.css"`.

Both ESM (`import`) and CommonJS (`require`) entry points are provided; TypeScript picks up
`dist/index.d.ts` through the `exports` map (`moduleResolution: bundler | node16 | nodenext`).

## 4. Verifying a release

1. **Registry listing** - every package appears with the new version:
   ```bash
   for p in core spec tokens theme layout svg charts-bi charts-ds charts-kpi charts-ai charts-geo charts-network charts-flow charts-infographics adapters-frappe testing; do
     npm view "@aibyters/$p" version --registry "$NPM_REGISTRY"
   done
   ```
2. **Tarball contents** - `npm pack @aibyters/core --registry "$NPM_REGISTRY" && tar tzf aibyters-core-*.tgz`
   must list `package/dist/index.js`, `index.cjs`, `index.d.ts` and `package/LICENSE`, and nothing
   from `src/`.
3. **Resolved workspace ranges** - `npm view @aibyters/charts-bi dependencies --registry "$NPM_REGISTRY"`
   must show concrete versions (e.g. `"@aibyters/core": "0.2.0"`), never `workspace:*`.
4. **Fresh install smoke test** - in an empty directory with the `.npmrc` above:
   ```bash
   npm init -y && npm install @aibyters/core @aibyters/charts-bi react react-dom recharts
   node -e "console.log(Object.keys(require('@aibyters/core')).length, 'exports (cjs)')"
   node --input-type=module -e "import * as m from '@aibyters/core'; console.log(Object.keys(m).length, 'exports (esm)')"
   ```
5. **Types** - `dist/index.d.ts` references sibling packages as `@aibyters/<name>` (bare
   specifiers). `scripts/release-check.mjs` enforces this before publish.
6. **Visual** - `pnpm build:playground && pnpm test:visual` on the release commit; screenshots
   land in `visual/`. Attach the `playground-dist` CI artifact to the GitHub release if wanted.
7. **Bundle size** - compare the `bundle-size` table in the workflow summary with the previous
   release; unexpected growth usually means a dependency was bundled instead of left external.

## 5. Rolling back

Registries do not allow re-publishing a version. Publish a `PATCH` release with the fix, or
`npm deprecate "@aibyters/<name>@0.2.0" "use 0.2.1"` on every package, and tell licensees.
