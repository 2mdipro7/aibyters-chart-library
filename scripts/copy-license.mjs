#!/usr/bin/env node
/**
 * Copies the root LICENSE into every packages/<name>/ directory so it ships inside each
 * published tarball (each package lists "LICENSE" in its "files" field).
 *
 * Usage: node scripts/copy-license.mjs
 * Also invoked by scripts/release-check.mjs. Safe to run repeatedly (idempotent).
 */
import { copyFileSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "LICENSE");

export function copyLicense({ log = console.log } = {}) {
  if (!existsSync(source)) throw new Error(`Root LICENSE not found at ${source}`);
  const licenseText = readFileSync(source, "utf8");
  const packagesDir = join(root, "packages");
  const copied = [];
  for (const name of readdirSync(packagesDir, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    const dir = join(packagesDir, name.name);
    if (!existsSync(join(dir, "package.json"))) continue;
    const target = join(dir, "LICENSE");
    if (existsSync(target) && readFileSync(target, "utf8") === licenseText) continue;
    copyFileSync(source, target);
    copied.push(name.name);
  }
  log(copied.length ? `LICENSE copied into: ${copied.join(", ")}` : "LICENSE already up to date in every package");
  return copied;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  copyLicense();
}
