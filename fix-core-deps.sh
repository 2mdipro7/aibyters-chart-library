#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
pnpm --filter @aibyters/core add zustand d3-scale d3-array d3-shape d3-time d3-time-format d3-format @aibyters/spec@workspace:*
pnpm --filter @aibyters/core add -D @types/d3-scale @types/d3-array @types/d3-shape @types/d3-time @types/d3-time-format @types/d3-format

npx turbo run build --filter=@aibyters/core
