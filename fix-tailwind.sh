#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
pnpm --filter playground add -D @tailwindcss/vite tailwindcss

cat << 'EOF' > ~/projects/aibyters/apps/playground/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173
  }
})
EOF

rm ~/projects/aibyters/apps/playground/postcss.config.js || true
rm ~/projects/aibyters/apps/playground/tailwind.config.js || true
