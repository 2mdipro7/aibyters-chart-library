#!/usr/bin/env node
/**
 * Visual smoke check for the playground.
 *
 * Serves apps/playground/dist with a tiny static server, opens every route from
 * apps/playground/src/data/chart-registry.ts in headless Chromium at 360 / 768 / 1280 px,
 * writes a screenshot per route and width into visual/ (git-ignored) and fails when any page
 * logs a console error or an uncaught exception.
 *
 *   pnpm build && pnpm build:playground && node scripts/visual-check.mjs
 *
 * Options
 *   --widths 360,768,1280   override the widths
 *   --filter kpi            only routes whose path contains the text
 *   --chrome <path>         override the Chromium executable
 *   --strict                also fail on third-party requests that fail (fonts, map tiles);
 *                           by default those are printed as warnings only
 *
 * Playwright is resolved from the global npm prefix (`npm root -g`) so the workspace does not
 * carry a browser as a dependency; the Chromium binary defaults to the Playwright cache at
 * /opt/pw-browsers/chromium-1194/chrome-linux/chrome (or $CHROME_PATH). The script exits 0 with
 * a clear message when the playground was not built or Playwright / Chromium is not installed,
 * so it is safe to run in environments that lack a browser.
 */
import { execSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "apps", "playground", "dist");
const registryFile = join(root, "apps", "playground", "src", "data", "chart-registry.ts");
const outDir = join(root, "visual");

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const widths = (argValue("--widths") ?? "360,768,1280").split(",").map((w) => Number(w.trim())).filter(Boolean);
const filter = argValue("--filter");
const strict = args.includes("--strict");
const chromePath = argValue("--chrome") ?? process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

function skip(message) {
  console.log(`visual-check: skipped - ${message}`);
  process.exit(0);
}

if (!existsSync(join(distDir, "index.html"))) skip(`${distDir}/index.html not found. Run "pnpm build && pnpm build:playground" first.`);
if (!existsSync(registryFile)) skip(`${registryFile} not found.`);

// --- routes -------------------------------------------------------------------------------
const registrySource = readFileSync(registryFile, "utf8");
const routes = [...registrySource.matchAll(/path:\s*['"`]([^'"`]+)['"`]/g)]
  .map((m) => m[1])
  .filter((p, i, all) => all.indexOf(p) === i)
  .filter((p) => !filter || p.includes(filter));
if (routes.length === 0) skip("no routes found in chart-registry.ts");

// --- playwright ---------------------------------------------------------------------------
let chromium;
try {
  const globalRoot = execSync("npm root -g", { encoding: "utf8" }).trim();
  const entry = join(globalRoot, "playwright", "index.mjs");
  if (!existsSync(entry)) skip(`playwright is not installed globally (${entry}). Run "npm i -g playwright".`);
  ({ chromium } = await import(pathToFileURL(entry).href));
} catch (err) {
  skip(`could not load playwright: ${err.message}`);
}
if (!existsSync(chromePath)) skip(`Chromium not found at ${chromePath}. Set CHROME_PATH or pass --chrome.`);

// --- static server ------------------------------------------------------------------------
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};
const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let file = resolve(distDir, `.${decodeURIComponent(url.pathname)}`);
  if (!file.startsWith(distDir)) {
    res.writeHead(403).end();
    return;
  }
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(distDir, "index.html"); // SPA fallback
  const stream = createReadStream(file);
  stream.once("open", () => {
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
    stream.pipe(res);
  });
  stream.once("error", (err) => {
    // dist can disappear while the check runs (a concurrent rebuild); answer 500 and let the page report it.
    if (!res.headersSent) res.writeHead(err.code === "ENOENT" ? 404 : 500, { "content-type": "text/plain" });
    res.end(`${err.code ?? "error"}: ${file}`);
  });
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

// --- run ----------------------------------------------------------------------------------
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: chromePath, headless: true, args: ["--no-sandbox", "--disable-gpu"] });
const failures = [];
const externalWarnings = new Set();
let shots = 0;
const started = Date.now();

try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      const external = [];
      const isLocal = (url) => url.startsWith(base);
      page.on("console", (msg) => {
        if (msg.type() !== "error") return;
        const url = msg.location()?.url ?? "";
        // "Failed to load resource" for a third-party origin (fonts, tiles) is environment noise, not a chart bug.
        if (/^Failed to load resource/.test(msg.text()) && url && !isLocal(url)) external.push(`${msg.text()} <${url}>`);
        else errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(`uncaught: ${err.message}`));
      page.on("requestfailed", (req) => {
        const line = `request failed: ${req.url()} (${req.failure()?.errorText})`;
        (isLocal(req.url()) || strict ? errors : external).push(line);
      });
      page.on("response", (res) => {
        if (res.status() >= 400 && (isLocal(res.url()) || strict)) errors.push(`HTTP ${res.status()}: ${res.url()}`);
      });
      const slug = route.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-") || "home";
      try {
        // The playground uses HashRouter, so every route is served from index.html.
        await page.goto(`${base}/#${route}`, { waitUntil: "networkidle", timeout: 30_000 });
        await page.waitForTimeout(400); // let ResizeObserver-driven charts settle
        await page.screenshot({ path: join(outDir, `${slug}-${width}.png`), fullPage: true });
        shots++;
      } catch (err) {
        errors.push(`navigation: ${err.message}`);
      }
      if (errors.length) failures.push({ route, width, errors });
      for (const e of external) externalWarnings.add(e.split("\n")[0]);
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (externalWarnings.size) {
  console.warn(`visual-check: ${externalWarnings.size} third-party request(s) failed (ignored, pass --strict to fail):`);
  for (const w of [...externalWarnings].slice(0, 10)) console.warn(`  - ${w}`);
}
console.log(`visual-check: ${shots} screenshots for ${routes.length} routes x ${widths.join("/")} px written to ${outDir} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
if (failures.length) {
  console.error(`\n${failures.length} page(s) logged errors:`);
  for (const f of failures) {
    console.error(`  ${f.route} @ ${f.width}px`);
    for (const e of [...new Set(f.errors)]) console.error(`     - ${e.split("\n")[0]}`);
  }
  process.exit(1);
}
console.log("visual-check: no console errors.");
