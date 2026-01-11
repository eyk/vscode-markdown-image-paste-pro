const { readFileSync, writeFileSync } = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

async function convertSvgToPng() {
  const svgPath = 'icon.svg';
  const pngPath = 'icon.png';
  const size = 128;

  // Using Inkscape if available
  try {
    await execPromise(`inkscape "${svgPath}" --export-width=${size} --export-type=png --export-filename="${pngPath}"`);
    console.log('✓ Converted with Inkscape');
  } catch (e) {
    console.error('Inkscape not found. Install: winget install Inkscape.Inkscape');
    console.error('Alternative: Use https://cloudconvert.com/svg-to-png');
    process.exit(1);
  }
}

convertSvgToPng();
