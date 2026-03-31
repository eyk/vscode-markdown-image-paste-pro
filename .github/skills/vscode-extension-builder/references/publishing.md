# Publishing Workflow

## Pre-Publish Checklist

1. **Update CHANGELOG.md** - Add new version section with changes
2. **Bump version** in package.json - Follow semantic versioning
3. **Commit changes** - `git commit -m "Bump version to X.Y.Z"`
4. **Push to main** - Automated workflow handles the rest

## Automated GitHub Actions Publishing

**Workflow triggers on push to main:**

```yaml
name: Publish Extension

on:
  push:
    branches: [ main ]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Get version from package.json
        id: version
        run: |
          VERSION=$(node -p "require('./package.json').version")
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          echo "tag=v$VERSION" >> $GITHUB_OUTPUT

      - name: Check if tag exists
        id: tag_check
        run: |
          if git rev-parse "refs/tags/${{ steps.version.outputs.tag }}" >/dev/null 2>&1; then
            echo "exists=true" >> $GITHUB_OUTPUT
            echo "Tag already exists, skipping publish"
          else
            echo "exists=false" >> $GITHUB_OUTPUT
            echo "Will publish ${{ steps.version.outputs.tag }}"
          fi

      - name: Install dependencies
        if: steps.tag_check.outputs.exists == 'false'
        run: npm ci

      - name: Compile
        if: steps.tag_check.outputs.exists == 'false'
        run: npm run compile

      - name: Create Git tag
        if: steps.tag_check.outputs.exists == 'false'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git tag ${{ steps.version.outputs.tag }}
          git push origin ${{ steps.version.outputs.tag }}

      - name: Publish to Marketplace
        if: steps.tag_check.outputs.exists == 'false'
        run: npx @vscode/vsce publish -p ${{ secrets.VSCE_PAT }}
```

**Required GitHub Secret:** `VSCE_PAT` (Personal Access Token from marketplace.visualstudio.com)

**Key features:**
- Checks if version already published (via Git tag)
- Skips re-publishing same version
- Auto-creates Git tags
- Zero manual intervention after version bump

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
