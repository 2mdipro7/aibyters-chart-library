#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters

# Sync Vite configs for all packages
for pkg in layout theme charts-kpi charts-bi charts-ds core spec; do
  if [ -f /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/$pkg/vite.config.ts ]; then
    cp /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/$pkg/vite.config.ts ~/projects/aibyters/packages/$pkg/
  fi
  # Sync src folders
  if [ -d /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/$pkg/src ]; then
    cp -r /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/$pkg/src/* ~/projects/aibyters/packages/$pkg/src/
  fi
done

# Sync playground App.tsx
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/apps/playground/src/App.tsx ~/projects/aibyters/apps/playground/src/

# Run full rebuild
npx turbo run build --force
