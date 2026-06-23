#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
pnpm --filter @aibyters/core add @aibyters/spec@workspace:*

echo "=== Copying core files ==="
mkdir -p ~/projects/aibyters/packages/core/src/scales
mkdir -p ~/projects/aibyters/packages/core/src/layout
mkdir -p ~/projects/aibyters/packages/core/src/data
mkdir -p ~/projects/aibyters/packages/core/src/interactions

cp -r /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/core/src/* ~/projects/aibyters/packages/core/src/

echo "=== Building core ==="
npx turbo run build --filter=@aibyters/core
