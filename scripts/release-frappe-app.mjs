#!/usr/bin/env node
/**
 * Exports apps/frappe-app to a standalone repository (the Marketplace does not accept
 * monorepo subdirectories) using a history-preserving `git subtree split`.
 *
 *   node scripts/release-frappe-app.mjs --remote <git url> [--branch main] [--dir ../aibyters_charts]
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => (a.startsWith("--") ? [a.slice(2), arr[i + 1]] : [])).filter((x) => x.length));
const remote = args.remote;
const branch = args.branch ?? "main";
const dir = resolve(args.dir ?? "../aibyters_charts");
if (!remote) {
  console.error("--remote <git url> is required");
  process.exit(1);
}
const run = (cmd, cwd) => execSync(cmd, { stdio: "inherit", cwd });

const splitBranch = `frappe-app-split-${Date.now()}`;
run(`git subtree split --prefix apps/frappe-app -b ${splitBranch}`);
if (!existsSync(dir)) run(`git clone ${remote} ${dir}`);
run(`git -C ${dir} fetch ${process.cwd()} ${splitBranch}:${splitBranch}`);
run(`git -C ${dir} checkout -B ${branch} ${splitBranch}`);
run(`git -C ${dir} push -u origin ${branch}`);
run(`git branch -D ${splitBranch}`);
console.log(`\nExported to ${dir} (${branch}). Tag the release there: git tag vX.Y.Z && git push --tags`);
