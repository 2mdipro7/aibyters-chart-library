#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
pnpm --filter storybook add -D @storybook/react-vite @storybook/react @storybook/addon-links @storybook/addon-essentials @storybook/addon-interactions @storybook/blocks storybook react react-dom vite
pnpm --filter storybook add @aibyters/theme@workspace:*

echo "=== Copying storybook config ==="
cp -r /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/storybook/.storybook ~/projects/aibyters/apps/storybook/
