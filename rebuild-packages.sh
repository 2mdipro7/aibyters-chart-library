#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
npx turbo run build --force --filter=@aibyters/charts-bi --filter=@aibyters/charts-ds
