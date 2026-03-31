---
name: vscode-extension-builder
description: Specialized knowledge for creating, configuring, testing, and publishing VS Code extensions. Use when creating a new VS Code extension from scratch, setting up extension infrastructure (package.json contributes, activation events, testing), configuring extension publishing (.vscodeignore, vsce, marketplace), debugging extension-specific issues (CI failures, marketplace rendering), or implementing extension best practices.
---

# VS Code Extension Creator

Create, configure, test, and publish VS Code extensions with extension-specific best practices.

## Core Workflow

1. **Initialize** - Create package.json with extension manifest
2. **Implement** - Write extension.ts with activate/deactivate
3. **Test** - Set up @vscode/test-electron with CI
4. **Publish** - Bump version, update CHANGELOG, push to main → automated publishing

## Publishing Process

1. Update CHANGELOG.md with new version section
2. Bump version in package.json (semantic versioning)
3. Commit and push to main
4. GitHub Actions automatically:
   - Creates Git tag
   - Publishes to marketplace (if version not already published)
   - Skips if tag exists (idempotent)

## Critical Learnings

### Activation Events
`onCommand:extension.commandId` (load when command executed) preferred over `*` (load on startup)

### CI Test Workflow
Tests run on `pull_request` only, not on `push` to main (avoids redundant post-merge execution)

### .vscodeignore
```
**/*.ts          # Exclude TypeScript
!out/**/*.d.ts   # Include declarations
```

### Linux CI Testing
Requires `xvfb-run -a npm test` for GUI tests

### Marketplace README
Use absolute GitHub URLs: `https://raw.githubusercontent.com/user/repo/main/images/demo.png`

### Version Matching
`@types/vscode` version must match `engines.vscode`

## References

- **[package.json](references/package-json.md)** - Extension manifest, contributes schema
- **[testing](references/testing.md)** - @vscode/test-electron, CI setup
- **[publishing](references/publishing.md)** - vsce, .vscodeignore rules
- **[pitfalls](references/pitfalls.md)** - Common mistakes
