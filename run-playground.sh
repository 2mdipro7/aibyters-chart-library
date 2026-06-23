#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
pnpm --filter playground add react react-dom vite @vitejs/plugin-react @aibyters/theme@workspace:* @aibyters/layout@workspace:* @aibyters/charts-kpi@workspace:* @aibyters/spec@workspace:*

mkdir -p ~/projects/aibyters/apps/playground/src
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/src/* ~/projects/aibyters/apps/playground/src/
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/index.html ~/projects/aibyters/apps/playground/ 2>/dev/null || true
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/vite.config.ts ~/projects/aibyters/apps/playground/ 2>/dev/null || true

cat << 'EOF' > ~/projects/aibyters/apps/playground/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Byters Playground</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

cat << 'EOF' > ~/projects/aibyters/apps/playground/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
EOF

echo "Starting playground"
cd apps/playground
pnpm run dev
