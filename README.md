# Markdown Image Paste Pro

On paste: prompts for alt-text and auto-suggests kebab-case filename from it.

## Usage

Paste images as usual in markdown files - the extension intercepts and prompts for alt-text and filename.


## Project Structure

- `src/extension.ts` - Main extension entry point
- `package.json` - Extension manifest and dependencies
- `tsconfig.json` - TypeScript configuration


## Development

```bash
# Once after checkout
npm install

# One time compilation
npm run compile

# Watch Mode (recommended)
npm run watch

# Run tests
npm test

```

Press `F5` in VS Code to launch the Extension Development Host with the extension loaded.
