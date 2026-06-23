#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
pnpm --filter @aibyters/layout add clsx tailwind-merge @aibyters/theme@workspace:*

echo "=== Copying layout files ==="
mkdir -p ~/projects/aibyters/packages/layout/src/grid
mkdir -p ~/projects/aibyters/packages/layout/src/card
mkdir -p ~/projects/aibyters/packages/layout/src/filter

cp -r /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/layout/src/* ~/projects/aibyters/packages/layout/src/

echo "=== Building Layout package ==="
npx turbo run build --filter=@aibyters/layout

echo "=== Committing Phase 2 ==="
git add packages/core packages/svg packages/layout pnpm-lock.yaml
git commit -m "feat(core,svg,layout): add headless core, svg primitives and layout system"

echo "Phase 2 committed."
