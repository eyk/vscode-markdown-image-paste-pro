# Markdown Image Paste Pro

[![Tests](https://github.com/eyk/vscode-markdown-image-paste-pro/actions/workflows/test.yml/badge.svg)](https://github.com/eyk/vscode-markdown-image-paste-pro/actions/workflows/test.yml)
[![VS Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/eyk.vscode-markdown-image-paste-pro)](https://marketplace.visualstudio.com/items?itemName=eyk.vscode-markdown-image-paste-pro)
[![VS Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/eyk.vscode-markdown-image-paste-pro)](https://marketplace.visualstudio.com/items?itemName=eyk.vscode-markdown-image-paste-pro)
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
- **Collision handling** — warns on existing files, allows overwrite or jumps back to rename
- **Clean abort** — ESC at any prompt cancels entirely (no image inserted), retry paste anytime
- **Zero configuration** — works out of the box


## Planned Features

Additional image format support (WebP, JPEG) is under consideration. If you'd like to see this feature, show your interest by:
- ⭐ Starring the project on [GitHub](https://github.com/eyk/vscode-markdown-image-paste-pro)
- ⭐ Rating the extension on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=eyk.vscode-markdown-image-paste-pro&ssr=false#review-details)

**Preview of planned configuration:**

```json
{
  "markdownImagePastePro.defaultFormat": "png",  // png | webp | jpeg
  "markdownImagePastePro.promptForFormat": false  // if true, adds format picker (↑/↓ navigation, default pre-selected)
}
```

With `promptForFormat` enabled, workflow becomes: Alt-text → Enter → Filename → Enter → Format (↑/↓) → Enter


## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for setup, build instructions, and architecture details.


## License

The source code and strings are licensed under the [MIT License](https://github.com/eyk/vscode-markdown-image-paste-pro/blob/main/LICENSE).


## Open Issues

- [ ] Change package description
- [ ] WebP support