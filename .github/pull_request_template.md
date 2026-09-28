## Summary

<!-- What changed and why. Link the issue if there is one. -->

## Type of change

- [ ] Bug fix
- [ ] New chart / feature
- [ ] Refactor (no behaviour change)
- [ ] Build / packaging / CI
- [ ] Documentation

## Checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes (new behaviour is covered by a unit test)
- [ ] `pnpm build` passes and `dist/index.d.ts` still references `@aibyters/*` as bare specifiers
- [ ] Charts were checked at 360 / 768 / 1280 px (`pnpm test:visual` or the playground)
- [ ] Public API changes are documented in `CHANGELOG.md`
- [ ] No new runtime dependency was added without declaring it as a `peerDependency` (React, Recharts, Leaflet, ...)

## Screenshots

<!-- Before / after for visual changes, light and dark theme. -->
