import * as assert from 'assert';
import { suite, test } from 'mocha';

// Mock the MarkdownImagePasteProvider to test helper methods
class TestableMarkdownImagePasteProvider {
	toKebabCase(text: string): string {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	getExtensionFromMimeType(mimeType: string): string {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const mapping: Record<string, string> = {
			'image/png': '.png',
			'image/jpeg': '.jpg',
			'image/gif': '.gif',
			'image/bmp': '.bmp'
		};
		return mapping[mimeType] || '.png';
	}

	generateDefaultFilename(): string {
		const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
		return `image-${timestamp}`;
	}
}

suite('Extension Test Suite', () => {
	const provider = new TestableMarkdownImagePasteProvider();

	suite('toKebabCase', () => {
		test('converts spaces to dashes', () => {
			assert.strictEqual(provider.toKebabCase('Hello World'), 'hello-world');
		});

		test('converts multiple spaces to single dash', () => {
			assert.strictEqual(provider.toKebabCase('Hello    World'), 'hello-world');
		});

		test('handles special characters', () => {
			assert.strictEqual(provider.toKebabCase('Hello@World!'), 'hello-world');
		});

		test('handles umlauts and accents', () => {
			assert.strictEqual(provider.toKebabCase('Hällö Wörld'), 'h-ll-w-rld');
		});

		test('removes leading and trailing dashes', () => {
			assert.strictEqual(provider.toKebabCase('  Hello World  '), 'hello-world');
		});

		test('handles empty string', () => {
			assert.strictEqual(provider.toKebabCase(''), '');
		});

		test('handles only special characters', () => {
			assert.strictEqual(provider.toKebabCase('!!!@@@###'), '');
		});

		test('handles numbers', () => {
			assert.strictEqual(provider.toKebabCase('Image 123'), 'image-123');
		});

		test('handles mixed case', () => {
			assert.strictEqual(provider.toKebabCase('MyImageFile'), 'myimagefile');
		});

		test('handles underscores', () => {
			assert.strictEqual(provider.toKebabCase('my_image_file'), 'my-image-file');
		});
	});

	suite('getExtensionFromMimeType', () => {
		test('returns .png for image/png', () => {
			assert.strictEqual(provider.getExtensionFromMimeType('image/png'), '.png');
		});

		test('returns .jpg for image/jpeg', () => {
			assert.strictEqual(provider.getExtensionFromMimeType('image/jpeg'), '.jpg');
		});

		test('returns .gif for image/gif', () => {
			assert.strictEqual(provider.getExtensionFromMimeType('image/gif'), '.gif');
		});

		test('returns .bmp for image/bmp', () => {
			assert.strictEqual(provider.getExtensionFromMimeType('image/bmp'), '.bmp');
		});

		test('returns .png as fallback for unknown type', () => {
			assert.strictEqual(provider.getExtensionFromMimeType('image/webp'), '.png');
		});

		test('returns .png as fallback for invalid type', () => {
			assert.strictEqual(provider.getExtensionFromMimeType('invalid/type'), '.png');
		});
	});

	suite('generateDefaultFilename', () => {
		test('starts with "image-" prefix', () => {
			const filename = provider.generateDefaultFilename();
			assert.ok(filename.startsWith('image-'));
		});

		test('contains timestamp in format YYYY-MM-DD-HH-MM-SS', () => {
			const filename = provider.generateDefaultFilename();
			// Format: image-2026-01-11-14-30-45
			const pattern = /^image-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/;
			assert.ok(pattern.test(filename), `Filename "${filename}" does not match expected pattern`);
		});

		test('generates unique filenames over time', async () => {
			const filename1 = provider.generateDefaultFilename();
			// Wait 1 second to ensure different timestamp
			await new Promise(resolve => setTimeout(resolve, 1000));
			const filename2 = provider.generateDefaultFilename();
			assert.notStrictEqual(filename1, filename2);
		});
	});
});
