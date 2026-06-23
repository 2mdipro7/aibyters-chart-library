#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters

git config user.email "dev@aibyters.com"
git config user.name "AI Byters"
git branch -m main
git add -A
git commit -m "chore(repo): initialize monorepo with pnpm + Turborepo

- Root configs: pnpm-workspace.yaml, turbo.json, tsconfig.base.json
- 12 package scaffolds (spec, tokens, theme, core, svg, charts-kpi, charts-bi, charts-ds, charts-ai, layout, adapters-frappe, testing)
- 2 app scaffolds (storybook, playground)
- Reference files (Plan.md, logo, brand guidelines)"

echo ""
echo "=== Git log ==="
git log --oneline

echo ""
echo "=== Project tree ==="
find . -maxdepth 3 -not -path './.git/*' -not -path './node_modules/*' -not -path './logo/*' -not -path './context/*' | sort
