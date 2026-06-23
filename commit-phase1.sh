#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters
cp /mnt/c/Users/mmdip/Documents/projects/aibyters/packages/theme/src/env.d.ts ~/projects/aibyters/packages/theme/src/

npx turbo run build --filter=@aibyters/theme

git add packages/theme packages/tokens packages/spec pnpm-lock.yaml
git commit -m "feat(spec,tokens,theme): add data contracts and design token system"

echo "Phase 1 committed."
