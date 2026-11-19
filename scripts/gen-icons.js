const sharp = require('sharp');
const src = './public/icons/icon-source.png';
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
Promise.all([
  ...sizes.map(s => sharp(src).resize(s, s).png().toFile(`./public/icons/icon-${s}.png`).then(() => console.log(s + 'x' + s + ' done'))),
  sharp(src).resize(180, 180).png().toFile('./public/icons/apple-touch-icon.png').then(() => console.log('apple-touch-icon done')),
]).catch(console.error);
