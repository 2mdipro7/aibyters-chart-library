#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters/apps/playground
pnpm add @aibyters/theme @aibyters/layout @aibyters/charts-bi @aibyters/charts-ds @aibyters/charts-kpi @aibyters/spec
cd ~/projects/aibyters
npx turbo run build --force --filter="!storybook"
