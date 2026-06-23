#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/charts-kpi/src/*.tsx ~/projects/aibyters/packages/charts-kpi/src/
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/charts-kpi/src/index.ts ~/projects/aibyters/packages/charts-kpi/src/
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/src/App.tsx ~/projects/aibyters/apps/playground/src/

npx turbo run build --filter=@aibyters/charts-kpi --force
