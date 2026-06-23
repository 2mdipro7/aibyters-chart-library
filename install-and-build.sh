#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters/apps/playground
pnpm add -D tailwindcss postcss autoprefixer @vitejs/plugin-react vite
pnpm add recharts lucide-react clsx tailwind-merge framer-motion react react-dom
cd ~/projects/aibyters
pnpm install
npx turbo run build --force --filter="!storybook"
