# Publishing Workflow

## .vscodeignore Rules

```
.vscode/**
.vscode-test/**
.github/**
src/**               # Exclude source
**/*.ts              # Exclude TypeScript
!out/**/*.d.ts       # Include type definitions
**/*.map             # Exclude source maps
node_modules/**
*.vsix
.git/**
tsconfig.json
.eslintrc.js
.gitignore
```

**Critical patterns:**
- `**/*.ts` excludes all TypeScript
- `!out/**/*.d.ts` re-includes compiled declarations

## vsce Commands

### Install
```bash
npm install -g @vscode/vsce
```

### Package
```bash
vsce package
# Creates extension-name-1.0.0.vsix
```

### Publish
```bash
vsce publish
```

### Personal Access Token
1. https://dev.azure.com
2. User Settings → Personal Access Tokens
3. Create token with Marketplace (Manage) scope

## Marketplace README

**Images must use absolute URLs:**
```markdown
![Screenshot](https://raw.githubusercontent.com/user/repo/main/images/demo.png)
```

Relative paths work in GitHub but NOT in VS Code Extension Manager.

## Version Bumping
```bash
vsce publish patch  # 1.0.0 → 1.0.1
vsce publish minor  # 1.0.0 → 1.1.0
vsce publish major  # 1.0.0 → 2.0.0
```
