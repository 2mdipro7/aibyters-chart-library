#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cp /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/theme/package.json ~/projects/aibyters/packages/theme/package.json
cd ~/projects/aibyters/apps/playground
pnpm run dev
