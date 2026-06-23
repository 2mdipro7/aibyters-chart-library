#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
cp -r /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/spec/src/* ~/projects/aibyters/packages/spec/src/
cp -r /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/theme/src/* ~/projects/aibyters/packages/theme/src/
cp -r /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/tokens/src/* ~/projects/aibyters/packages/tokens/src/

npx turbo run build --force
