#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

nvm install 22
nvm use 22
nvm alias default 22

echo "Node: $(node --version)"
echo "NPM: $(npm --version)"

npm install -g pnpm
echo "PNPM: $(pnpm --version)"
