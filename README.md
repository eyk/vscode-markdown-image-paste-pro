# Markdown Image Paste Pro

A professional VS Code extension for pasting images into markdown files.

## Features

- **Quick Image Paste**: Paste images from clipboard directly into markdown files
- **Configurable Paths**: Customize where images are saved
- **Flexible Naming**: Choose between timestamp or random filename generation
- **Automatic Directory Creation**: Image folders are created automatically

## Usage

1. Copy an image to your clipboard
2. Open a markdown file in VS Code
3. Press `Ctrl+Shift+V` (Windows/Linux) or `Cmd+Shift+V` (Mac)
4. The image reference will be inserted at cursor position

Alternatively, use the command palette:
- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Type "Paste Image" and select the command

## Configuration

Configure the extension in VS Code settings:

- `markdownImagePastePro.imagePath`: Folder path for saved images (default: `images`)
- `markdownImagePastePro.imageNamePrefix`: Prefix for image filenames (default: `image-`)
- `markdownImagePastePro.imageNameFormat`: Format for filenames - `timestamp` or `random` (default: `timestamp`)

## Development

To build and run the extension locally:

```bash
npm install
npm run compile
```

Then press F5 in VS Code to launch the Extension Development Host.

## License

See [LICENSE](LICENSE) file for details.