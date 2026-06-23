#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters

pnpm --filter @aibyters/core add zustand d3-scale d3-array d3-shape d3-time d3-time-format d3-format @aibyters/spec@workspace:*
pnpm --filter @aibyters/core add -D @types/d3-scale @types/d3-array @types/d3-shape @types/d3-time @types/d3-time-format @types/d3-format

pnpm --filter @aibyters/theme add workspace:@aibyters/tokens clsx tailwind-merge

pnpm --filter @aibyters/layout add clsx tailwind-merge @aibyters/theme@workspace:*

pnpm --filter @aibyters/svg add @aibyters/spec@workspace:* @aibyters/core@workspace:* @aibyters/theme@workspace:* clsx tailwind-merge framer-motion

pnpm --filter @aibyters/charts-kpi add @aibyters/spec@workspace:* @aibyters/layout@workspace:* @aibyters/theme@workspace:* clsx tailwind-merge framer-motion

pnpm --filter @aibyters/charts-bi add @aibyters/spec@workspace:* @aibyters/core@workspace:* @aibyters/layout@workspace:* recharts lucide-react clsx tailwind-merge framer-motion
pnpm --filter @aibyters/charts-ds add @aibyters/spec@workspace:* @aibyters/core@workspace:* @aibyters/layout@workspace:* recharts lucide-react clsx tailwind-merge framer-motion

pnpm install

npx turbo run build --force --filter="!storybook"
