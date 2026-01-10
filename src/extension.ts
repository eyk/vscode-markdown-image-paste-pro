import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	console.log('Markdown Image Paste Pro is now active');

	const disposable = vscode.commands.registerCommand('markdown-image-paste-pro.pasteImage', async () => {
		const editor = vscode.window.activeTextEditor;
		
		if (!editor) {
			vscode.window.showErrorMessage('No active editor');
			return;
		}

		if (editor.document.languageId !== 'markdown') {
			vscode.window.showErrorMessage('This command only works in markdown files');
			return;
		}

		try {
			// Get image from clipboard
			const clipboardImage = await vscode.env.clipboard.readText();
			
			// Check if clipboard contains image data (this is a simplified check)
			// In a real implementation, we'd use a native module to access binary clipboard data
			if (!clipboardImage) {
				vscode.window.showInformationMessage('No image found in clipboard. Use Ctrl+V for text paste.');
				return;
			}

			// Get configuration
			const config = vscode.workspace.getConfiguration('markdownImagePastePro');
			const imagePath = config.get<string>('imagePath', 'images');
			const imageNamePrefix = config.get<string>('imageNamePrefix', 'image-');
			const imageNameFormat = config.get<string>('imageNameFormat', 'timestamp');

			// Generate image filename
			const timestamp = Date.now();
			const randomId = Math.random().toString(36).substring(2, 10);
			const imageId = imageNameFormat === 'timestamp' ? timestamp.toString() : randomId;
			const imageName = `${imageNamePrefix}${imageId}.png`;

			// Determine full image path
			const documentPath = editor.document.uri.fsPath;
			const documentDir = path.dirname(documentPath);
			const fullImageDir = path.join(documentDir, imagePath);
			const fullImagePath = path.join(fullImageDir, imageName);

			// Create directory if it doesn't exist
			if (!fs.existsSync(fullImageDir)) {
				fs.mkdirSync(fullImageDir, { recursive: true });
			}

			// Note: Actual image saving would require native clipboard access
			// This is a placeholder for the concept
			vscode.window.showInformationMessage(
				`Image paste functionality is ready. Image would be saved to: ${path.join(imagePath, imageName)}`
			);

			// Insert markdown image syntax
			const relativePath = path.join(imagePath, imageName).replace(/\\/g, '/');
			const markdownImageSyntax = `![](${relativePath})`;
			
			editor.edit(editBuilder => {
				editBuilder.insert(editor.selection.active, markdownImageSyntax);
			});

		} catch (error) {
			vscode.window.showErrorMessage(`Error pasting image: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
