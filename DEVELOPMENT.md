# Development Guide

## Project Structure

- `src/extension.ts` - Main extension entry point
- `src/test/` - Test suite (Mocha)
- `package.json` - Extension manifest and dependencies
- `tsconfig.json` - TypeScript configuration


## Prerequisites

- **Node.js** 18.x or 20.x
- **npm** (comes with Node.js)
- **Inkscape** (optional, for icon generation)
  - Windows: `winget install Inkscape.Inkscape`
  - macOS: `brew install inkscape`
  - Linux: `apt install inkscape`


## Setup

```bash
# Once after checkout
npm install
```


## Build & Watch

```bash
# One time compilation
npm run compile

# Watch Mode (recommended during development)
npm run watch
```


## Testing

```bash
# Run all tests
npm test

# Lint code
npm run lint
```


## Debugging

Press `F5` in VS Code to launch the Extension Development Host with the extension loaded.

The extension activates automatically when opening a Markdown file.


## Extension Architecture

### Paste Provider

The extension registers a `DocumentPasteEditProvider` for Markdown files that:

1. Detects image MIME types in clipboard (`image/png`, `image/jpeg`, `image/gif`, `image/bmp`)
2. Prompts for alt-text (pre-filled with timestamp-based suggestion)
3. Prompts for filename (pre-filled with kebab-case version of alt-text)
4. Checks if file exists → prompts to overwrite
5. Saves image to same directory as Markdown file
6. Inserts `![alt-text](filename.ext)` into document


### Helper Functions

- `toKebabCase()` - Converts text to kebab-case (lowercase, alphanumeric + dashes only)
- `getExtensionFromMimeType()` - Maps MIME types to file extensions
- `generateDefaultFilename()` - Creates timestamp-based default filename


## Publishing

See VS Code extension publishing guide: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
