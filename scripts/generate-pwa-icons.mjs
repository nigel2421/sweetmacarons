import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Since sharp is a CommonJS module, we need to use a dynamic import
const sharp = (await import('sharp')).default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../public/images/logo.jpeg');
const publicDir = path.join(__dirname, '../public');

async function generateIcons() {
  try {
    const sizes = [192, 512];
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `pwa-${size}x${size}.png`);
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      console.log(`Generated ${outputPath}`);
    }
    
    // Apple touch icon (180x180)
    const applePath = path.join(publicDir, 'apple-touch-icon.png');
    await sharp(inputPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(applePath);
    console.log(`Generated ${applePath}`);
    
    // Favicon png version
    const faviconPath = path.join(publicDir, 'logo.png');
    await sharp(inputPath)
      .resize(32, 32)
      .png()
      .toFile(faviconPath);
    console.log(`Updated favicon-png at ${faviconPath}`);

  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();
