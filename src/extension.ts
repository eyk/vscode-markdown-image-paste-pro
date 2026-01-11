import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';

export function activate(context: vscode.ExtensionContext) {
	const output = vscode.window.createOutputChannel('Markdown Image Paste Pro');

	const provider = vscode.languages.registerDocumentPasteEditProvider(
		{ language: 'markdown' },
		new MarkdownImagePasteProvider(output),
		{
			// Use a specific kind to take precedence over default paste handler
			providedPasteEditKinds: [vscode.DocumentDropOrPasteEditKind.Empty.append('markdown', 'image')],
			pasteMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp']
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
		const extension = this.getExtensionFromMimeType(mimeType);
		const documentDir = path.dirname(document.uri.fsPath);

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
				const buffer = await fileData.data();
				await fs.writeFile(imagePath, Buffer.from(buffer));
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
		const imageMimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];

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
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const mapping: Record<string, string> = {
			'image/png': '.png',
			'image/jpeg': '.jpg',
			'image/gif': '.gif',
			'image/bmp': '.bmp'
		};
		return mapping[mimeType] || '.png';
	}

	// Generate timestamp-based default filename for initial suggestion
	private generateDefaultFilename(): string {
		const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
		return `image-${timestamp}`;
	}
}
