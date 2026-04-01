import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import sharp from 'sharp';

export function activate(context: vscode.ExtensionContext) {
	const output = vscode.window.createOutputChannel('Markdown Image Paste Pro');

	const provider = vscode.languages.registerDocumentPasteEditProvider(
		{ language: 'markdown' },
		new MarkdownImagePasteProvider(output),
		{
			// Use a specific kind to take precedence over default paste handler
			providedPasteEditKinds: [vscode.DocumentDropOrPasteEditKind.Empty.append('markdown', 'image')],
			pasteMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp', 'image/avif']
		}
	);

	context.subscriptions.push(provider);
}

export function deactivate() {}

class MarkdownImagePasteProvider implements vscode.DocumentPasteEditProvider {
	constructor(private output: vscode.OutputChannel) {}

	async provideDocumentPasteEdits(
		document: vscode.TextDocument,
		ranges: readonly vscode.Range[],
		dataTransfer: vscode.DataTransfer,
		context: vscode.DocumentPasteEditContext,
		token: vscode.CancellationToken
	): Promise<vscode.DocumentPasteEdit[] | undefined> {
		// Check if clipboard contains image data
		const imageItem = this.getImageFromDataTransfer(dataTransfer);
		if (!imageItem) {
			return undefined; // Let default paste handler take over (no image detected)
		}

		const { mimeType, data } = imageItem;
		this.output.appendLine(`Image detected: ${mimeType}`);

		// Read settings
		const config = vscode.workspace.getConfiguration('markdownImagePastePro');
		const defaultFormat = config.get<string>('defaultFormat', 'png');
		const promptForFormat = config.get<boolean>('promptForFormat', false);

		// Dialog 1: Prompt for alt-text
		const defaultFilename = this.generateDefaultFilename();
		const altText = await vscode.window.showInputBox({
			prompt: 'Enter alt-text for the image',
			placeHolder: 'Image description',
			value: defaultFilename,
			valueSelection: [0, defaultFilename.length]
		});

		if (altText === undefined) {
			// User cancelled - return empty edit to prevent default paste
			const emptyEdit = new vscode.DocumentPasteEdit(
				'',
				'Cancel',
				vscode.DocumentDropOrPasteEditKind.Empty.append('markdown', 'image')
			);
			return [emptyEdit];
		}

		// Dialog 2: Prompt for filename with kebab-case suggestion from alt-text
		// Loop until user provides a valid filename or cancels
		const suggestedFilename = this.toKebabCase(altText);
		const documentDir = path.dirname(document.uri.fsPath);

		// Determine target format
		let targetFormat = defaultFormat;
		if (promptForFormat) {
			const formats = ['png', 'webp', 'jpeg', 'avif'];
			const items: vscode.QuickPickItem[] = formats.map(f => ({
				label: f.toUpperCase(),
				description: f === defaultFormat ? '(default)' : undefined,
				picked: f === defaultFormat
			}));

			const picked = await vscode.window.showQuickPick(items, {
				placeHolder: 'Select image format',
			});

			if (picked === undefined) {
				const emptyEdit = new vscode.DocumentPasteEdit(
					'',
					'Cancel',
					vscode.DocumentDropOrPasteEditKind.Empty.append('markdown', 'image')
				);
				return [emptyEdit];
			}

			targetFormat = picked.label.toLowerCase();
		}

		const extension = this.getExtensionFromFormat(targetFormat);

		let fullFilename: string;
		let imagePath: string;

		while (true) {
			const filenameInput = await vscode.window.showInputBox({
				prompt: 'Enter filename (without extension)',
				placeHolder: 'filename',
				value: suggestedFilename,
				valueSelection: [0, suggestedFilename.length]
			});

			if (filenameInput === undefined) {
				// User cancelled - return empty edit to prevent default paste
				const emptyEdit = new vscode.DocumentPasteEdit(
					'',
					'Cancel',
					vscode.DocumentDropOrPasteEditKind.Empty.append('markdown', 'image')
				);
				return [emptyEdit];
			}

			fullFilename = `${filenameInput}${extension}`;
			imagePath = path.join(documentDir, fullFilename);

			// Check if file already exists
			try {
				await fs.access(imagePath);
				// File exists - ask user if they want to overwrite
				const overwrite = await vscode.window.showWarningMessage(
					`File "${fullFilename}" already exists. Overwrite?`,
					{ modal: true },
					'Yes'
				);

				if (overwrite === 'Yes') {
					break; // Continue with overwrite
				}
				// If dismissed (ESC), loop back to filename prompt
			} catch {
				// File does not exist - we can proceed
				break;
			}
		}

		try {
			const fileData = data.asFile();
			if (fileData) {
				const rawBuffer = Buffer.from(await fileData.data());
				const { buffer: convertedBuffer, format: actualFormat } = await this.convertImage(rawBuffer, mimeType, targetFormat);

				// If conversion changed the format (fallback), update filename and path
				if (actualFormat !== targetFormat) {
					const actualExtension = this.getExtensionFromFormat(actualFormat);
					const baseFilename = fullFilename.replace(/\.[^.]+$/, '');
					fullFilename = `${baseFilename}${actualExtension}`;
					imagePath = path.join(documentDir, fullFilename);
				}

				await fs.writeFile(imagePath, convertedBuffer);
				this.output.appendLine(`Image saved: ${imagePath}`);
			} else {
				throw new Error('Failed to read image data');
			}
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to save image: ${error}`);
			// Error occurred - return empty edit to prevent default paste
			const emptyEdit = new vscode.DocumentPasteEdit(
				'',
				'Error',
				vscode.DocumentDropOrPasteEditKind.Empty.append('markdown', 'image')
			);
			return [emptyEdit];
		}

		// Create markdown image syntax with original alt-text
		const markdownLink = `![${altText.trim()}](${fullFilename})`;

		const edit = new vscode.DocumentPasteEdit(
			markdownLink,
			'Insert Image',
			vscode.DocumentDropOrPasteEditKind.Empty.append('markdown', 'image')
		);
		return [edit];
	}

	// Extract image data from DataTransfer, returns {mimeType, data} or undefined
	private getImageFromDataTransfer(dataTransfer: vscode.DataTransfer): { mimeType: string; data: vscode.DataTransferItem } | undefined {
		const imageMimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp', 'image/avif'];

		for (const mimeType of imageMimeTypes) {
			const item = dataTransfer.get(mimeType);
			if (item) {
				return { mimeType, data: item };
			}
		}

		return undefined;
	}

	// Convert text to kebab-case: lowercase, a-z0-9- only, collapse multiple dashes
	private toKebabCase(text: string): string {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric sequences with single dash
			.replace(/^-+|-+$/g, '');     // Remove leading/trailing dashes
	}

	// Map MIME type to file extension
	private getExtensionFromMimeType(mimeType: string): string {
		/* eslint-disable @typescript-eslint/naming-convention */
		const mapping: Record<string, string> = {
			'image/png': '.png',
			'image/jpeg': '.jpg',
			'image/gif': '.gif',
			'image/bmp': '.bmp',
			'image/webp': '.webp',
			'image/avif': '.avif'
		};
		/* eslint-enable @typescript-eslint/naming-convention */
		return mapping[mimeType] || '.png';
	}

	// Map format name to file extension
	private getExtensionFromFormat(format: string): string {
		const mapping: Record<string, string> = {
			'png': '.png',
			'webp': '.webp',
			'jpeg': '.jpg',
			'avif': '.avif'
		};
		return mapping[format] || '.png';
	}

	// Map MIME type to format name
	private getFormatFromMimeType(mimeType: string): string {
		/* eslint-disable @typescript-eslint/naming-convention */
		const mapping: Record<string, string> = {
			'image/png': 'png',
			'image/jpeg': 'jpeg',
			'image/gif': 'gif',
			'image/bmp': 'bmp',
			'image/webp': 'webp',
			'image/avif': 'avif'
		};
		/* eslint-enable @typescript-eslint/naming-convention */
		return mapping[mimeType] || 'png';
	}

	// Convert image buffer to target format, returns { buffer, format }
	// On failure: falls back to PNG and shows warning with Report Issue / Revert buttons
	private async convertImage(
		buffer: Buffer,
		sourceMimeType: string,
		targetFormat: string
	): Promise<{ buffer: Buffer; format: string }> {
		const sourceFormat = this.getFormatFromMimeType(sourceMimeType);

		// No conversion needed if source matches target
		if (sourceFormat === targetFormat) {
			return { buffer, format: targetFormat };
		}

		// PNG target: no lossy conversion, just re-encode
		if (targetFormat === 'png') {
			try {
				const converted = await sharp(buffer).png().toBuffer();
				return { buffer: converted, format: 'png' };
			} catch {
				// PNG re-encode failed — return original buffer as-is
				return { buffer, format: sourceFormat };
			}
		}

		try {
			let pipeline = sharp(buffer);

			switch (targetFormat) {
				case 'webp':
					pipeline = pipeline.webp({ quality: 90 });
					break;
				case 'jpeg':
					pipeline = pipeline.jpeg({ quality: 92 });
					break;
				case 'avif':
					pipeline = pipeline.avif({ quality: 80 });
					break;
			}

			const converted = await pipeline.toBuffer();
			return { buffer: converted, format: targetFormat };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			this.output.appendLine(`Conversion to ${targetFormat} failed: ${errorMessage}`);

			// Build pre-filled GitHub issue URL
			const issueTitle = encodeURIComponent(`Conversion to ${targetFormat} failed`);
			const issueBody = encodeURIComponent(
				`**Environment**\n` +
				`- OS: ${process.platform} ${process.arch}\n` +
				`- VS Code: ${vscode.version}\n` +
				`- Target format: ${targetFormat}\n` +
				`- Source MIME: ${sourceMimeType}\n\n` +
				`**Error**\n` +
				`\`\`\`\n${errorMessage}\n\`\`\`\n\n` +
				`**Steps to reproduce**\n` +
				`1. Paste image into Markdown file\n`
			);
			const issueUrl = `https://github.com/eyk/vscode-markdown-image-paste-pro/issues/new?title=${issueTitle}&body=${issueBody}`;

			const action = await vscode.window.showWarningMessage(
				`Conversion to ${targetFormat.toUpperCase()} failed — image saved as PNG instead. This is likely a bug.`,
				'Report Issue',
				'Revert to PNG'
			);

			if (action === 'Report Issue') {
				vscode.env.openExternal(vscode.Uri.parse(issueUrl));
			} else if (action === 'Revert to PNG') {
				const config = vscode.workspace.getConfiguration('markdownImagePastePro');
				await config.update('defaultFormat', 'png', vscode.ConfigurationTarget.Global);
			}

			// Fallback: return original buffer as PNG
			return { buffer, format: 'png' };
		}
	}

	// Generate timestamp-based default filename for initial suggestion
	private generateDefaultFilename(): string {
		const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
		return `image-${timestamp}`;
	}
}
