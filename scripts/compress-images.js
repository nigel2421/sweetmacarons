const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Error reading images directory:', err);
    return;
  }

  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const inputPath = path.join(imagesDir, file);
      const outputPath = path.join(imagesDir, `compressed-${file}`);

      sharp(inputPath)
        .jpeg({ quality: 80 })
        .toFile(outputPath, (err, info) => {
          if (err) {
            console.error(`Error compressing ${file}:`, err);
          } else {
            console.log(`Compressed ${file}:`, info);
            // Replace original with compressed version
            fs.rename(outputPath, inputPath, err => {
              if (err) console.error(`Error renaming ${file}:`, err);
            });
          }
        });
    }
  });
});
