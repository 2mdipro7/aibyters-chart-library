#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
pnpm --filter @aibyters/theme add workspace:@aibyters/tokens
pnpm --filter @aibyters/theme add clsx tailwind-merge
