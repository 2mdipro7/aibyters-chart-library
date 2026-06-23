#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
pnpm --filter @aibyters/svg add @aibyters/spec@workspace:* @aibyters/core@workspace:* @aibyters/theme@workspace:* clsx tailwind-merge framer-motion

echo "=== Copying SVG files ==="
mkdir -p ~/projects/aibyters/packages/svg/src/axes
mkdir -p ~/projects/aibyters/packages/svg/src/surface
mkdir -p ~/projects/aibyters/packages/svg/src/legend
mkdir -p ~/projects/aibyters/packages/svg/src/tooltip

cp -r /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/svg/src/* ~/projects/aibyters/packages/svg/src/

echo "=== Building SVG package ==="
npx turbo run build --filter=@aibyters/svg
