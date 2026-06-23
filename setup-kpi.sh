#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
pnpm --filter @aibyters/charts-kpi add @aibyters/spec@workspace:* @aibyters/layout@workspace:* @aibyters/theme@workspace:* clsx tailwind-merge framer-motion

mkdir -p ~/projects/aibyters/packages/charts-kpi/src
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/kpi/src/* ~/projects/aibyters/packages/charts-kpi/src/

echo "Building KPI package"
npx turbo run build --filter=@aibyters/charts-kpi
