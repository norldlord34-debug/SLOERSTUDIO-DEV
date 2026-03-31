import fs from 'fs';
import sharp from 'sharp';

const inputPath = 'C:/Users/jhons/Downloads/work/SIULK-VOICE/public/logo.png';
const outputPath = 'C:/Users/jhons/Downloads/work/SIULK-VOICE/public/logo_optimized.png';

async function optimizeLogo() {
    try {
        await sharp(inputPath)
            .resize(512, 512, { fit: 'inside' })
            .png({ quality: 90, compressionLevel: 9 })
            .toFile(outputPath);

        // Overwrite original
        fs.renameSync(outputPath, inputPath);
        console.log('Logo successfully optimized and resized!');
    } catch (err) {
        console.error('Error optimizing logo:', err);
    }
}

optimizeLogo();
