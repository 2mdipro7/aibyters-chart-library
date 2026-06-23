#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "Syncing from Windows to WSL..."
cp -rf /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/* ~/projects/aibyters/packages/
cp -rf /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/* ~/projects/aibyters/apps/

cd ~/projects/aibyters
echo "Rebuilding..."
npx turbo run build --force --filter="!storybook"
