#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
git checkout -b feat/phase-1-contracts-and-tokens

echo "Installing zod in @aibyters/spec"
pnpm --filter @aibyters/spec add zod
