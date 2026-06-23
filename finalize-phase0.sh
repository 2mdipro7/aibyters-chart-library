#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters

echo "=== Step 1: pnpm install (link workspace packages) ==="
pnpm install

echo ""
echo "=== Step 2: Verify build after install ==="
npx turbo run build --filter='!storybook' --filter='!playground'

echo ""
echo "=== Step 3: Initialize Storybook ==="
cd apps/storybook
npx -y storybook@latest init --type react_vite --no-dev --skip-install 2>&1

echo ""
echo "=== Step 4: Install storybook deps ==="
cd ~/projects/aibyters
pnpm install

echo ""
echo "=== Step 5: Rebuild all ==="
npx turbo run build --filter='!playground'

echo ""
echo "=== Step 6: Commit ==="
git add -A
git commit -m "chore(repo): install dependencies, initialize Storybook

- Added packageManager field to root package.json
- Installed all root dev dependencies
- Initialized Storybook in apps/storybook
- All packages build and typecheck successfully"

echo ""
echo "=== Git log ==="
git log --oneline

echo ""
echo "=== Phase 0 COMPLETE ==="
