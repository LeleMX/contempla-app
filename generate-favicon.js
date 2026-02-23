const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, 'public', 'logo.jpg');
const svgPath = path.join(__dirname, 'public', 'logo.svg');

if (fs.existsSync(imgPath)) {
    const base64Data = fs.readFileSync(imgPath).toString('base64');
    const mimeType = 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
    <clipPath id="circleMask">
      <circle cx="50" cy="50" r="50" />
    </clipPath>
    <image width="100" height="100" href="${dataUri}" clip-path="url(#circleMask)" preserveAspectRatio="xMidYMid slice" />
  </svg>`;

    fs.writeFileSync(svgPath, svgContent);
    console.log('Rounded favicon SVG created at public/logo.svg');
} else {
    console.log('Error: logo.jpg not found in public directory.');
    process.exit(1);
}
