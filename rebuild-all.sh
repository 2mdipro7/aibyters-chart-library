#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd /mnt/c/Users/mmdip/Documents/projects/aibyters
# Run turbo but exclude storybook so failure doesn't abort
npx turbo run build --force --filter="!storybook"
