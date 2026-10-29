// Downscale huge Figma exports into readable JPEG slices for inspection.
// usage: node preview.cjs <outDir> <width> <sliceHeight> <img...>
const fs = require('fs');
const { launch, path } = require('./pw.cjs');

(async () => {
  const [outDir, W, SH, ...imgs] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const b = await launch();
  const p = await b.newPage();
  await p.goto('file://' + path.resolve(__dirname, 'blank.html'));
  for (const img of imgs) {
    const url = 'file://' + path.resolve(img).split('/').map(encodeURIComponent).join('/');
    const parts = await p.evaluate(async ({ url, W, SH }) => {
      const im = new Image(); im.src = url; await im.decode();
      const s = W / im.naturalWidth, H = Math.round(im.naturalHeight * s);
      const out = [];
      for (let y = 0; y < H; y += SH) {
        const h = Math.min(SH, H - y);
        const c = document.createElement('canvas'); c.width = W; c.height = h;
        const g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
        g.drawImage(im, 0, y / s, im.naturalWidth, h / s, 0, 0, W, h);
        out.push(c.toDataURL('image/jpeg', 0.85));
      }
      return out;
    }, { url, W: +W, SH: +SH });
    const base = path.basename(img).replace(/\.[a-z]+$/i, '').replace(/[^a-z0-9]+/gi, '_');
    parts.forEach((d, i) => fs.writeFileSync(path.join(outDir, `${base}_${i}.jpg`), Buffer.from(d.split(',')[1], 'base64')));
    console.log(base, parts.length);
  }
  await b.close();
})();
