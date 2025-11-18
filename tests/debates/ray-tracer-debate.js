
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { test } from 'node:test';

// Dusk: Legacy CJS, direct require from the built file
import Dusk from '../../../legacy/build/glm-js.js';

// Day: Modern CJS, requires building first
const dayPath = path.resolve(process.cwd(), './dist/modern-glm-js.cjs');
if (!fs.existsSync(dayPath)) {
    console.log('Modern CJS build not found. Building...');
    execSync('npm run cjs');
}
import Day from '../../../dist/modern-glm-js.cjs';


// Dawn: Modern ESM, direct import from source
import Dawn from '../../../implementation/index.js';

test('Ray Tracer Tri-Debate', { skip: !process.env.RUN_DEBATE }, (t) => {
    console.log('Running debate script...');

    const width = 256;
    const height = 256;
    const sphereRadius = 0.5;

    // Generic function to render a sphere using a given glm library
    function renderSphere(glm, sphereCenter, lightDir) {
        const pixels = new Uint8ClampedArray(width * height * 4);
        const cameraOrigin = glm.vec3(0, 0, 1);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const u = (x - width / 2) / width;
                const v = (y - height / 2) / height;

                const rayDir = glm.normalize(glm.vec3(u, v, -1));

                const oc = glm.sub(cameraOrigin, sphereCenter);
                const a = glm.dot(rayDir, rayDir);
                const b = 2.0 * glm.dot(oc, rayDir);
                const c = glm.dot(oc, oc) - sphereRadius * sphereRadius;
                const discriminant = b * b - 4 * a * c;

                let color = glm.vec3(0.1, 0.1, 0.1); // Background color

                if (discriminant > 0) {
                    const t = (-b - Math.sqrt(discriminant)) / (2.0 * a);
                    if (t > 0.0) {
                        const hitPoint = glm.add(cameraOrigin, glm.mul(rayDir, t));
                        const normal = glm.normalize(glm.sub(hitPoint, sphereCenter));
                        const diff = Math.max(glm.dot(normal, lightDir), 0.0);
                        color = glm.mul(glm.vec3(0.4, 0.6, 0.8), diff);
                    }
                }

                const i = (y * width + x) * 4;
                pixels[i] = color.x * 255;
                pixels[i + 1] = color.y * 255;
                pixels[i + 2] = color.z * 255;
                pixels[i + 3] = 255;
            }
        }
        return pixels;
    }

    // Render with each library
    const duskPixels = renderSphere(Dusk, Dusk.vec3(0, 0, -1), Dusk.normalize(Dusk.vec3(0.5, -1, -0.5)));
    const dayPixels = renderSphere(Day, Day.vec3(0, 0, -1), Day.normalize(Day.vec3(0.5, -1, -0.5)));
    const dawnPixels = renderSphere(Dawn, Dawn.vec3(0, 0, -1), Dawn.normalize(Dawn.vec3(0.5, -1, -0.5)));

    // Generate HTML with canvas
    const finalWidth = width * 3;
    const htmlContent = `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0;">
    <canvas id="canvas" width="${finalWidth}" height="${height}"></canvas>
    <script>
        const duskPixels = new Uint8ClampedArray([${duskPixels.toString()}]);
        const dayPixels = new Uint8ClampedArray([${dayPixels.toString()}]);
        const dawnPixels = new Uint8ClampedArray([${dawnPixels.toString()}]);

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const duskImageData = new ImageData(duskPixels, ${width}, ${height});
        const dayImageData = new ImageData(dayPixels, ${width}, ${height});
        const dawnImageData = new ImageData(dawnPixels, ${width}, ${height});

        ctx.putImageData(duskImageData, 0, 0);
        ctx.putImageData(dayImageData, ${width}, 0);
        ctx.putImageData(dawnImageData, ${width * 2}, 0);
    </script>
</body>
</html>
`;

    fs.writeFileSync('debate.html', htmlContent);
    console.log('Generated debate.html');

    try {
        console.log('Taking screenshot with puppeteer...');
        execSync(`npx puppeteer screenshot debate.html debate.png --viewport-width ${finalWidth} --viewport-height ${height}`);
        console.log('Screenshot saved to debate.png');
    } catch (error) {
        console.error('Error taking screenshot with puppeteer:', error.message);
        console.error('Please ensure you have an internet connection for npx to fetch puppeteer.');
    }
});
