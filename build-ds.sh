#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
# Sync charts-ds
mkdir -p ~/projects/aibyters/packages/charts-ds/src
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/charts-ds/package.json ~/projects/aibyters/packages/charts-ds/
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/charts-ds/vite.config.ts ~/projects/aibyters/packages/charts-ds/
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/charts-ds/src/*.tsx ~/projects/aibyters/packages/charts-ds/src/
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/charts-ds/src/*.ts ~/projects/aibyters/packages/charts-ds/src/

# Sync playground App.tsx
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/src/App.tsx ~/projects/aibyters/apps/playground/src/

# Install the new dependency in playground
cd ~/projects/aibyters/apps/playground
pnpm add @aibyters/charts-ds@workspace:*

cd ~/projects/aibyters
# Build the data science charts package
npx turbo run build --filter=@aibyters/charts-ds --force
