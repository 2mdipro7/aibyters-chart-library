# Releasing the open-source library

All AI Byters source packages are MIT licensed. Public source distribution is free; paid technical support and implementation are optional.

## Source release

Keep root and package LICENSE files, package.json license fields and third-party notices with each source release. Build and test from a clean checkout. Never include node_modules, local environment files, registry credentials or private customer data in a source archive.

## Package release

Public npm publication is separate from source availability. Confirm package names and publish credentials first. The release workflow remains manually dispatched; use its dry_run option before publication.

Run pnpm install --frozen-lockfile, pnpm typecheck, pnpm test and pnpm build, then node scripts/release-check.mjs. Public packages use license MIT and publishConfig.access public. Packages still marked private are source-available in the repository but excluded from npm publication until their package exports are ready.

The version tag must match package.json. Retain semantic versioning and test compatibility before updating the release. Registry publish tokens are supplied through repository secrets and are never shipped with the source.

## User installation

Download or clone the source, then follow INSTALL.md for workspace aliases or local package linking. Use public npm install commands only after that package version has actually been published.
