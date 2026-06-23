#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters

# Fix: Add packageManager field to root package.json
node -e "
const pkg = require('./package.json');
pkg.packageManager = 'pnpm@11.5.2';
require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('✓ Added packageManager field');
"

# Disable turbo telemetry
npx turbo telemetry disable 2>/dev/null

echo ""
echo "=== Running turbo build ==="
npx turbo run build

echo ""
echo "=== Running turbo typecheck ==="
npx turbo run typecheck

echo ""
echo "=== Verifying pnpm workspace ==="
pnpm list -r --depth 0

echo ""
echo "=== Phase 0 Complete ==="
