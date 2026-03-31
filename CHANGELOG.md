# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [1.0.2] - 2026-01-11

### Added
- Automated publishing workflow via GitHub Actions

### Changed
- Optimized test workflow to run only on pull requests (removed redundant post-merge execution)
- Updated vscode-extension-builder skill with publishing workflow and CI best practices

## [1.0.1] - 2026-01-11

### Changed
- Minor improvements to extension metadata, CI configuration, and code cleanup

## [1.0.0] - 2026-01-11

### Initial Release

- Alt-text prompt on image paste with human-friendly input (spaces allowed)
- Auto-generated kebab-case filename derived from alt-text
- Customizable filename with instant preview
- File collision detection with overwrite confirmation
- Clean abort on ESC (no fallback to default paste behavior)
- Images saved next to Markdown file with proper relative paths
- Zero configuration required

[1.0.2]: https://github.com/eyk/vscode-markdown-image-paste-pro/releases/tag/v1.0.2
[1.0.1]: https://github.com/eyk/vscode-markdown-image-paste-pro/releases/tag/v1.0.1
[1.0.0]: https://github.com/eyk/vscode-markdown-image-paste-pro/releases/tag/v1.0.0
