
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs/promises';
import path from 'node:path';

async function generateIcons() {
  console.log('Generating PWA icons...');
  try {
    const svgPath = path.resolve('public/favicon.svg');
    const svgBuffer = await fs.readFile(svgPath);

    // Convert to string to modify width/height for resizing if needed,
    // but resvg handles scaling.
    const svgString = svgBuffer.toString();

    const sizes = [192, 512];

    for (const size of sizes) {
      const resvg = new Resvg(svgString, {
        fitTo: { mode: 'width', value: size },
      });
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      const outputPath = path.resolve(`public/icon-${size}.png`);
      await fs.writeFile(outputPath, pngBuffer);
      console.log(`Generated ${outputPath}`);
    }
    console.log('Icons generated successfully.');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
