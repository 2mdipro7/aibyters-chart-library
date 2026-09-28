#!/usr/bin/env node
/**
 * Prints the raw and gzipped size of each packages/<name>/dist/index.js (plus index.cjs and
 * index.css when present) as a Markdown table. Run after `pnpm build`:
 *
 *   node scripts/bundle-size.mjs            # table on stdout
 *   node scripts/bundle-size.mjs --json     # machine-readable
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = join(root, "packages");
const json = process.argv.includes("--json");

const fmt = (bytes) => (bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} kB` : `${bytes} B`);
const measure = (file) => {
  if (!existsSync(file)) return null;
  const buf = readFileSync(file);
  return { raw: statSync(file).size, gzip: gzipSync(buf, { level: 9 }).length };
};

const rows = [];
for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const dir = join(packagesDir, entry.name);
  const pkgFile = join(dir, "package.json");
  if (!existsSync(pkgFile)) continue;
  const pkg = JSON.parse(readFileSync(pkgFile, "utf8"));
  rows.push({
    name: pkg.name,
    esm: measure(join(dir, "dist", "index.js")),
    cjs: measure(join(dir, "dist", "index.cjs")),
    css: measure(join(dir, "dist", "index.css")),
  });
}

if (json) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const missing = rows.filter((r) => !r.esm);
console.log("### Bundle size (after `pnpm build`)\n");
console.log("| Package | ESM raw | ESM gzip | CJS gzip | CSS gzip |");
console.log("| --- | ---: | ---: | ---: | ---: |");
let totalGzip = 0;
for (const r of rows) {
  if (!r.esm) {
    console.log(`| ${r.name} | _not built_ | | | |`);
    continue;
  }
  totalGzip += r.esm.gzip;
  console.log(`| ${r.name} | ${fmt(r.esm.raw)} | ${fmt(r.esm.gzip)} | ${r.cjs ? fmt(r.cjs.gzip) : "-"} | ${r.css ? fmt(r.css.gzip) : "-"} |`);
}
console.log(`| **Total (ESM gzip)** | | **${fmt(totalGzip)}** | | |`);
if (missing.length) console.log(`\n_${missing.length} package(s) have no dist/index.js; run \`pnpm build\` first._`);
