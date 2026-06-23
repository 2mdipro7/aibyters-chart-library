#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

killall node
killall pnpm

cd ~/projects/aibyters/apps/playground
pnpm run dev --force
