#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
rm -f ~/projects/aibyters/packages/charts-kpi/src/*.stories.tsx
rm -f /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/charts-kpi/src/*.stories.tsx
rm -f /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/kpi/src/*.stories.tsx
npx turbo run build --filter=@aibyters/charts-kpi --force
