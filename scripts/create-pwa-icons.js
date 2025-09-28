// Script pentru crearea iconurilor PWA
// Rulează cu: node scripts/create-pwa-icons.js

const fs = require('fs');
const path = require('path');

// Creează iconuri placeholder ca fișiere PNG simple
// În producție, acestea ar trebui înlocuite cu iconuri reale

const sizes = [192, 256, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Asigură-te că directorul există
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Creează un PNG placeholder simplu pentru fiecare mărime
// Aceasta este o soluție temporară - în producție folosește iconuri reale
sizes.forEach(size => {
  const filename = `icon-${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  // Creează un fișier PNG placeholder (1x1 pixel transparent)
  // În realitate, ar trebui să folosești un tool pentru a converti SVG-ul la PNG
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width = 1
    0x00, 0x00, 0x00, 0x01, // height = 1
    0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    0x1F, 0x15, 0xC4, 0x89, // CRC
    0x00, 0x00, 0x00, 0x0A, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x78, 0x9C, 0x62, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
    0xE2, 0x21, 0xBC, 0x33, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  fs.writeFileSync(filepath, pngHeader);
  console.log(`Created placeholder: ${filename}`);
});

console.log('\n✅ Iconuri PWA placeholder create!');
console.log('📝 IMPORTANT: Înlocuiește aceste placeholder-uri cu iconuri reale pentru producție.');
console.log('🎨 Folosește icon-template.svg ca bază și convertește-l la PNG în mărimile necesare.');
console.log('\n🔧 Tools recomandate pentru conversie SVG → PNG:');
console.log('   • Online: https://convertio.co/svg-png/');
console.log('   • CLI: npm install -g svgexport && svgexport icon-template.svg icon-512.png 512:512');
console.log('   • Photoshop/Figma/Sketch pentru iconuri profesionale');

// Creează și screenshot-uri placeholder pentru manifest
const screenshotsDir = path.join(iconsDir);
const screenshots = [
  { name: 'screenshot-mobile.png', width: 390, height: 844 },
  { name: 'screenshot-desktop.png', width: 1280, height: 720 }
];

screenshots.forEach(({ name }) => {
  const filepath = path.join(screenshotsDir, name);
  fs.writeFileSync(filepath, pngHeader);
  console.log(`Created placeholder screenshot: ${name}`);
});

console.log('\n🚀 PWA setup complet! Rulează npm run build:pwa pentru testare.');
