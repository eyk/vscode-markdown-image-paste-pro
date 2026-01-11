---
name: vscode-extension-creator
description: Specialized knowledge for creating, configuring, testing, and publishing VS Code extensions. Use when creating a new VS Code extension from scratch, setting up extension infrastructure (package.json contributes, activation events, testing), configuring extension publishing (.vscodeignore, vsce, marketplace), debugging extension-specific issues (CI failures, marketplace rendering), or implementing extension best practices.
---

# VS Code Extension Creator

Create, configure, test, and publish VS Code extensions with extension-specific best practices.

## Core Workflow

1. **Initialize** - Create package.json with extension manifest
2. **Implement** - Write extension.ts with activate/deactivate
3. **Test** - Set up @vscode/test-electron with CI
4. **Publish** - Configure .vscodeignore and vsce

## Critical Learnings

### Activation Events
`onCommand:extension.commandId` (load when command executed) preferred over `*` (load on startup)

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
