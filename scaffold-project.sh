#!/bin/bash
set -e

PROJECT_DIR="$HOME/projects/aibyters"

echo "=== Creating project at $PROJECT_DIR ==="
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# ─── Root config files ───

cat > package.json << 'HEREDOC'
{
  "name": "aibyters-visual-intelligence",
  "version": "0.0.1",
  "private": true,
  "description": "AI Byters Visual Intelligence Library — Reusable BI + Decision Intelligence Visual Platform",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "lint": "turbo run lint",
    "storybook": "pnpm --filter storybook dev",
    "clean": "turbo run clean"
  },
  "keywords": ["visualization", "dashboard", "bi", "decision-intelligence", "charts", "react"],
  "author": "AI Byters",
  "license": "UNLICENSED"
}
HEREDOC

cat > pnpm-workspace.yaml << 'HEREDOC'
packages:
  - "packages/*"
  - "apps/*"
HEREDOC

cat > turbo.json << 'HEREDOC'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] },
    "clean": { "cache": false }
  }
}
HEREDOC

cat > tsconfig.base.json << 'HEREDOC'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
HEREDOC

cat > .npmrc << 'HEREDOC'
shamefully-hoist=false
strict-peer-dependencies=false
auto-install-peers=true
HEREDOC

cat > .gitignore << 'HEREDOC'
node_modules/
dist/
*.tsbuildinfo
.turbo/
storybook-static/
.DS_Store
Thumbs.db
desktop.ini
.env
.env.local
.env.*.local
*.log
npm-debug.log*
pnpm-debug.log*
HEREDOC

cat > .gitattributes << 'HEREDOC'
* text=auto eol=lf
*.png binary
*.jpg binary
*.svg text
*.ico binary
HEREDOC

echo "✓ Root config files created"

# ─── Package scaffolding function ───

create_package() {
  local name=$1
  local full_name=$2
  local has_react=$3
  local dir="packages/$name"

  mkdir -p "$dir/src"

  # package.json
  cat > "$dir/package.json" << HEREDOC
{
  "name": "$full_name",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" }
  },
  "scripts": {
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "clean": "rimraf dist"
  },
  "files": ["dist"]
}
HEREDOC

  # tsconfig.json
  cat > "$dir/tsconfig.json" << 'HEREDOC'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
HEREDOC

  # vite.config.ts
  if [ "$has_react" = "true" ]; then
    cat > "$dir/vite.config.ts" << 'HEREDOC'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});
HEREDOC
  else
    cat > "$dir/vite.config.ts" << 'HEREDOC'
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
  },
});
HEREDOC
  fi

  # src/index.ts
  echo "export {};" > "$dir/src/index.ts"

  echo "  ✓ $full_name"
}

# ─── Create all packages ───

echo ""
echo "=== Creating packages ==="

# Non-React packages
create_package "spec" "@aibyters/spec" "false"
create_package "tokens" "@aibyters/tokens" "false"
create_package "core" "@aibyters/core" "false"
create_package "testing" "@aibyters/testing" "false"
create_package "adapters-frappe" "@aibyters/adapters-frappe" "false"

# React packages
create_package "theme" "@aibyters/theme" "true"
create_package "svg" "@aibyters/svg" "true"
create_package "charts-kpi" "@aibyters/charts-kpi" "true"
create_package "charts-bi" "@aibyters/charts-bi" "true"
create_package "charts-ds" "@aibyters/charts-ds" "true"
create_package "charts-ai" "@aibyters/charts-ai" "true"
create_package "layout" "@aibyters/layout" "true"

# ─── Create apps ───

echo ""
echo "=== Creating apps ==="

# Storybook app
mkdir -p apps/storybook
cat > apps/storybook/package.json << 'HEREDOC'
{
  "name": "storybook",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build",
    "clean": "rimraf storybook-static"
  }
}
HEREDOC
echo "  ✓ storybook"

# Playground app
mkdir -p apps/playground
cat > apps/playground/package.json << 'HEREDOC'
{
  "name": "playground",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rimraf dist"
  }
}
HEREDOC
echo "  ✓ playground"

# ─── Copy reference files from Windows ───

echo ""
echo "=== Copying reference files from Windows ==="
WINDOWS_SRC="/mnt/c/Users/mmdip/Documents/projects/aibyters"

if [ -d "$WINDOWS_SRC/logo" ]; then
  cp -r "$WINDOWS_SRC/logo" "$PROJECT_DIR/logo"
  echo "  ✓ logo/"
fi

if [ -d "$WINDOWS_SRC/context" ]; then
  cp -r "$WINDOWS_SRC/context" "$PROJECT_DIR/context"
  echo "  ✓ context/"
fi

if [ -f "$WINDOWS_SRC/Plan.md" ]; then
  cp "$WINDOWS_SRC/Plan.md" "$PROJECT_DIR/Plan.md"
  echo "  ✓ Plan.md"
fi

# ─── Init Git ───

echo ""
echo "=== Initializing Git ==="
git init
git add -A
git commit -m "chore(repo): initialize monorepo with pnpm + Turborepo

- Root configs: pnpm-workspace.yaml, turbo.json, tsconfig.base.json
- 12 package scaffolds (spec, tokens, theme, core, svg, charts-kpi, charts-bi, charts-ds, charts-ai, layout, adapters-frappe, testing)
- 2 app scaffolds (storybook, playground)
- Reference files (Plan.md, logo, brand guidelines)"

echo ""
echo "=== Done! Project scaffolded at $PROJECT_DIR ==="
echo ""
ls -la
echo ""
echo "Packages:"
ls -la packages/
echo ""
echo "Apps:"
ls -la apps/
