import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Since sharp is a CommonJS module, we need to use a dynamic import
const sharp = (await import('sharp')).default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/images');

async function compressImages() {
  try {
    const files = await fs.readdir(imagesDir);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        const inputPath = path.join(imagesDir, file);
        const outputPath = path.join(imagesDir, `compressed-${file}`);

        try {
          const info = await sharp(inputPath)
            .jpeg({ quality: 80 })
            .toFile(outputPath);

          console.log(`Compressed ${file}:`, info);

          // Replace original with compressed version
          await fs.rename(outputPath, inputPath);
        } catch (err) {
          console.error(`Error compressing ${file}:`, err);
        }
      }
    }
  } catch (err) {
    console.error('Error reading images directory:', err);
  }
}

compressImages();
