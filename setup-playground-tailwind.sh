#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
pnpm --filter playground add -D tailwindcss postcss autoprefixer

cat << 'EOF' > ~/projects/aibyters/apps/playground/tailwind.config.js
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

cat << 'EOF' > ~/projects/aibyters/apps/playground/postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

cp /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/src/index.css ~/projects/aibyters/apps/playground/src/
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/src/main.tsx ~/projects/aibyters/apps/playground/src/

echo "Restarting playground..."
cd apps/playground
pnpm run dev
