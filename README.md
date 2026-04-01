# Markdown Image Paste Pro

[![Tests](https://github.com/eyk/vscode-markdown-image-paste-pro/actions/workflows/test.yml/badge.svg)](https://github.com/eyk/vscode-markdown-image-paste-pro/actions/workflows/test.yml)
[![VS Marketplace Version](https://vsmarketplacebadges.dev/version-short/eyk.vscode-markdown-image-paste-pro.svg)](https://marketplace.visualstudio.com/items?itemName=eyk.vscode-markdown-image-paste-pro)
[![VS Marketplace Installs](https://vsmarketplacebadges.dev/installs-short/eyk.vscode-markdown-image-paste-pro.svg)](https://marketplace.visualstudio.com/items?itemName=eyk.vscode-markdown-image-paste-pro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/eyk/vscode-markdown-image-paste-pro/blob/main/LICENSE)

On paste: prompts for alt-text and auto-suggests kebab-case filename from it.

Tired of generic GUID filenames cluttering your repository after pasting screenshots? This extension intercepts the paste operation before the file is created, prompting once for a descriptive name — the image is saved with the right filename from the start.

This extension follows a minimal-intervention philosophy — it intercepts the image paste flow only to prompt for alt-text and filename, then integrates seamlessly with VS Code's standard behavior. This design ensures maximum stability and implements what should ideally be core functionality.

After pasting an image, you're prompted to enter alt-text:
![Example 1](https://raw.githubusercontent.com/eyk/vscode-markdown-image-paste-pro/main/images/example-1.png)

The filename is auto-suggested based on your alt-text:
![Example 2](https://raw.githubusercontent.com/eyk/vscode-markdown-image-paste-pro/main/images/example-2.png)

The file is saved and the markdown link is inserted:
![Example 3](https://raw.githubusercontent.com/eyk/vscode-markdown-image-paste-pro/main/images/example-3.png)


## Features

- **Single prompt upfront** — enter human-friendly alt-text (spaces allowed), auto-generates filename suggestion
- **Filename auto-derived** — kebab-case generated from alt-text, confirm with Enter or customize as needed
- **Format conversion** — convert pasted images to WebP, JPEG, or AVIF for smaller file sizes
- **Collision handling** — warns on existing files, allows overwrite or jumps back to rename
- **Clean abort** — ESC at any prompt cancels entirely (no image inserted), retry paste anytime
- **Zero configuration** — works out of the box with PNG (original behavior)


## Configuration

```json
{
  "markdownImagePastePro.defaultFormat": "png",   // png | webp | jpeg | avif
  "markdownImagePastePro.promptForFormat": false  // if true, adds format picker after filename prompt
}
```

| Setting | Values | Default | Description |
|---------|--------|---------|-------------|
| `defaultFormat` | `png`, `webp`, `jpeg`, `avif` | `png` | Target format for pasted images. Images are converted from clipboard format (usually PNG). |
| `promptForFormat` | `true`, `false` | `false` | Shows a format picker (↑/↓ navigation) after the filename prompt. The default format is pre-selected. |

With `promptForFormat` enabled, workflow becomes: Alt-text → Enter → Filename → Enter → Format (↑/↓) → Enter

**Quality defaults** (not configurable): WebP 90, JPEG 92, AVIF 80 — optimized for screenshots and documentation images.

If conversion fails (e.g. platform incompatibility), the image is saved as PNG with a warning notification offering to report the issue or revert settings.

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for setup, build instructions, and architecture details.


## License

The source code and strings are licensed under the [MIT License](https://github.com/eyk/vscode-markdown-image-paste-pro/blob/main/LICENSE).


## To-Do

- Simplify paste, only one `Enter` for default behaviour and `Ctrl + Enter` for options: The plan is to register a custom command in a VS Code extension and bind it to Ctrl+Enter via contributes.keybindings, scoped by an appropriate when clause (identified using Developer: Inspect Context Keys) so the shortcut only triggers when the prompt input is focused.
- user.email
