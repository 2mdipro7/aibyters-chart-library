#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters/apps/playground
pnpm remove @tailwindcss/vite tailwindcss
pnpm add -D tailwindcss@^3.4.0 postcss autoprefixer

cat << 'EOF' > tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/*/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

cat << 'EOF' > postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

cat << 'EOF' > vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
EOF

cat << 'EOF' > src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "@aibyters/theme/dist/index.css";
EOF

cp src/index.css /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/src/index.css
cp tailwind.config.js /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/
cp postcss.config.js /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/
cp vite.config.ts /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/

pnpm run dev
