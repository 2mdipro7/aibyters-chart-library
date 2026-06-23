#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters

echo "=== Copying theme files ==="
mkdir -p ~/projects/aibyters/packages/theme/src/themes
cp -r /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/theme/src/* ~/projects/aibyters/packages/theme/src/

echo "=== Installing theme dependencies ==="
pnpm --filter @aibyters/theme add workspace:@aibyters/tokens
pnpm --filter @aibyters/theme add clsx tailwind-merge

echo "=== Verifying theme build ==="
npx turbo run build --filter=@aibyters/theme

echo "=== Committing Phase 1 ==="
git add -A
git commit -m "feat(spec,tokens,theme): add data contracts and design token system"
