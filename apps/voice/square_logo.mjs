import fs from 'fs';
import sharp from 'sharp';

const inputPath = 'C:/Users/jhons/Downloads/work/SIULK-VOICE/LOGO.png';
const outputPath = 'C:/Users/jhons/Downloads/work/SIULK-VOICE/public/logo.png';

async function optimizeLogo() {
    try {
        await sharp(inputPath)
            .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png({ quality: 100 })
            .toFile(outputPath);

        console.log('Logo successfully squared and saved to public/logo.png!');
    } catch (err) {
        console.error('Error optimizing logo:', err);
    }
}

optimizeLogo();
