# Common Pitfalls

## Version Mismatch
❌ `engines.vscode: ^1.85.0` with `@types/vscode: ^1.80.0`
✅ Both must match

## Activation Events
❌ `activationEvents: ["*"]` - Loads on startup, slows VS Code
✅ `activationEvents: ["onCommand:..."]` - Loads when needed

## .vscodeignore Missing Patterns
❌ Missing `**/*.ts` - Ships source code
❌ Missing `!out/**/*.d.ts` - Missing type definitions
✅ Exclude source, include declarations

## README Images
❌ `![](images/demo.png)` - Broken in Extension Manager
✅ `![](https://raw.githubusercontent.com/.../demo.png)` - Works everywhere

## Linux CI
❌ `npm test` on Linux - GUI tests fail
✅ `xvfb-run -a npm test` - Provides virtual display

## Main Entry Point
❌ `"main": "./src/extension.ts"` - Points to source
✅ `"main": "./out/extension.js"` - Points to compiled code

## TypeScript Module
❌ `"module": "ESNext"` - VS Code expects CommonJS
✅ `"module": "CommonJS"` - Required for extensions
