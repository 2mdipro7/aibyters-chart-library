#!/usr/bin/env node
/**
 * Pre-publish gate for every workspace package under packages/*.
 *
 * Run after `pnpm build`:  node scripts/release-check.mjs
 * Exit code 1 (with one line per problem) when any package is not publishable.
 *
 * Checks, per package:
 *   - package.json: license "SEE LICENSE IN LICENSE", version equals the root version,
 *     exports["."].types, main/module/types point at dist, "files" includes dist and LICENSE,
 *     publishConfig.access is "restricted", no "private": true
 *   - workspace links: every "workspace:*" dependency names an existing package
 *     (pnpm rewrites the range on publish, so only its existence is verified)
 *   - build output: dist/index.js, dist/index.cjs, dist/index.d.ts exist and the .d.ts does not
 *     reach into sibling packages with relative paths (must stay "@aibyters/<name>")
 *   - LICENSE present in the package directory (copied from the root when missing)
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { copyLicense } from "./copy-license.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = join(root, "packages");
const rootPkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

copyLicense();

const packages = readdirSync(packagesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(packagesDir, d.name, "package.json")))
  .map((d) => ({ dir: join(packagesDir, d.name), name: d.name, pkg: JSON.parse(readFileSync(join(packagesDir, d.name, "package.json"), "utf8")) }));
const workspaceNames = new Set(packages.map((p) => p.pkg.name));

const problems = [];
const ok = [];
const fail = (name, msg) => problems.push(`${name}: ${msg}`);

for (const { dir, name, pkg } of packages) {
  if (pkg.private === true) {
    ok.push(`${name} (private, skipped)`);
    continue;
  }
  const before = problems.length;

  if (pkg.license !== "SEE LICENSE IN LICENSE") fail(name, `license must be "SEE LICENSE IN LICENSE" (got ${JSON.stringify(pkg.license)})`);
  if (pkg.version !== rootPkg.version) fail(name, `version ${pkg.version} does not match root version ${rootPkg.version}`);
  if (!pkg.exports?.["."]?.types) fail(name, `exports["."].types is missing`);
  if (!pkg.exports?.["."]?.import) fail(name, `exports["."].import is missing`);
  if (!pkg.exports?.["."]?.require) fail(name, `exports["."].require is missing`);
  if (!pkg.types?.startsWith("./dist/")) fail(name, `"types" must point into dist`);
  if (!pkg.main?.startsWith("./dist/")) fail(name, `"main" must point into dist`);
  if (!pkg.module?.startsWith("./dist/")) fail(name, `"module" must point into dist`);
  if (!Array.isArray(pkg.files) || !pkg.files.includes("dist")) fail(name, `"files" must include "dist"`);
  if (!Array.isArray(pkg.files) || !pkg.files.includes("LICENSE")) fail(name, `"files" must include "LICENSE"`);
  if (pkg.publishConfig?.access !== "restricted") fail(name, `publishConfig.access must be "restricted"`);
  if (!pkg.description) fail(name, `description is missing`);
  if (pkg.sideEffects === undefined) fail(name, `sideEffects must be declared (false or a list of CSS globs)`);

  for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
    for (const [dep, range] of Object.entries(pkg[field] ?? {})) {
      if (String(range).startsWith("workspace:") && !workspaceNames.has(dep)) fail(name, `${field}.${dep} is "${range}" but no such workspace package exists`);
      if (dep.startsWith("@aibyters/") && !String(range).startsWith("workspace:") && !/^\d|^[\^~]/.test(String(range))) fail(name, `${field}.${dep} has an unusual range "${range}"`);
    }
  }
  if (pkg.devDependencies) {
    for (const [dep, range] of Object.entries(pkg.devDependencies)) {
      if (String(range).startsWith("workspace:") && !workspaceNames.has(dep)) fail(name, `devDependencies.${dep} is "${range}" but no such workspace package exists`);
    }
  }

  for (const file of ["index.js", "index.cjs", "index.d.ts"]) {
    if (!existsSync(join(dir, "dist", file))) fail(name, `dist/${file} is missing (run "pnpm build" first)`);
  }
  const dts = join(dir, "dist", "index.d.ts");
  if (existsSync(dts)) {
    const text = readFileSync(dts, "utf8");
    const escape = /(?:from|import)\s*\(?\s*["']((?:\.\.\/)+[^"']+)["']/g;
    for (const m of text.matchAll(escape)) fail(name, `dist/index.d.ts escapes the package with "${m[1]}" (expected a bare "@aibyters/*" specifier)`);
    const nested = /from\s+["']\.\/[^"']*\/src\/index["']/;
    if (nested.test(text)) fail(name, `dist/index.d.ts re-exports "./<pkg>/src/index"; set dts({ include: ["src"], entryRoot }) in vite.config.ts`);
  }
  for (const cssExport of Object.keys(pkg.exports ?? {}).filter((k) => k.endsWith(".css"))) {
    const target = pkg.exports[cssExport];
    if (!existsSync(join(dir, target))) fail(name, `exports["${cssExport}"] -> ${target} does not exist`);
  }
  if (!existsSync(join(dir, "LICENSE"))) fail(name, `LICENSE is missing after copy-license (check permissions)`);

  if (problems.length === before) ok.push(name);
}

console.log(`\nRelease check for ${packages.length} packages (root version ${rootPkg.version})`);
for (const name of ok) console.log(`  ok    ${name}`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  FAIL  ${p}`);
  process.exit(1);
}
console.log("\nAll packages are publishable.");
