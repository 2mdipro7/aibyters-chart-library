#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/projects/aibyters

echo "=== Installing root dev dependencies ==="
pnpm add -Dw turbo typescript rimraf
pnpm add -Dw vite @vitejs/plugin-react vite-plugin-dts
pnpm add -Dw vitest @testing-library/react @testing-library/jest-dom jsdom
pnpm add -Dw @types/react @types/react-dom
pnpm add -w react react-dom

echo ""
echo "=== Verifying install ==="
echo "Node: $(node --version)"
echo "PNPM: $(pnpm --version)"
echo "Turbo: $(npx turbo --version 2>/dev/null || echo 'checking...')"

echo ""
echo "=== Running turbo build ==="
npx turbo run build 2>&1 || echo "Build had issues (expected with empty exports)"

echo ""
echo "=== Running turbo typecheck ==="
npx turbo run typecheck 2>&1 || echo "Typecheck had issues"

echo ""
echo "=== DONE ==="
