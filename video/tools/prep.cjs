// Prepare assets: downscale photos/logo, sample brand colors from the Figma exports.
const fs = require('fs');
const { launch, path } = require('./pw.cjs');
const REPO = path.resolve(__dirname, '../..');
const OUT = path.resolve(__dirname, '../assets');
fs.mkdirSync(OUT, { recursive: true });
const u = (f) => 'file://' + f.split('/').map(encodeURIComponent).join('/');

(async () => {
  const b = await launch();
  const p = await b.newPage();
  await p.goto(u(path.resolve(__dirname, 'blank.html')));
  const jobs = [
    ['asset foto-foto/padar.jpg', 'padar.jpg', 900],
    ['asset foto-foto/pink_beach.jpg', 'pink_beach.jpg', 600],
    ['asset foto-foto/pulau komodo.jpg', 'komodo.jpg', 600],
    ['asset foto-foto/manta point.jpg', 'manta.jpg', 600],
    ['asset foto-foto/labuan bajo.jpg', 'labuan_bajo.jpg', 900],
  ];
  for (const [src, dst, w] of jobs) {
    const d = await p.evaluate(async ({ url, w }) => {
      const im = new Image(); im.src = url; await im.decode();
      const s = w / im.naturalWidth; const c = document.createElement('canvas');
      c.width = w; c.height = Math.round(im.naturalHeight * s);
      const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, c.width, c.height);
      return c.toDataURL('image/jpeg', 0.9);
    }, { url: u(path.join(REPO, src)), w });
    fs.writeFileSync(path.join(OUT, dst), Buffer.from(d.split(',')[1], 'base64'));
  }
  // Logo: keep alpha, trim to content box, 1600px wide.
  const info = await p.evaluate(async ({ url }) => {
    const im = new Image(); im.src = url; await im.decode();
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const D = g.getImageData(0, 0, c.width, c.height).data;
    let x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0, cnt = {}, opaque = 0, transparent = 0;
    for (let y = 0; y < c.height; y += 1) for (let x = 0; x < c.width; x += 1) {
      const i = (y * c.width + x) * 4; const a = D[i + 3];
      if (a > 128) { opaque++; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y;
        if ((x + y) % 97 === 0) { const k = D[i] + ',' + D[i + 1] + ',' + D[i + 2]; cnt[k] = (cnt[k] || 0) + 1; } } else transparent++;
    }
    const W = 1600, s = W / (x1 - x0 + 1);
    const o = document.createElement('canvas'); o.width = W; o.height = Math.round((y1 - y0 + 1) * s);
    const og = o.getContext('2d'); og.imageSmoothingQuality = 'high';
    og.drawImage(c, x0, y0, x1 - x0 + 1, y1 - y0 + 1, 0, 0, o.width, o.height);
    const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { box: [x0, y0, x1, y1], opaque, transparent, top, png: o.toDataURL('image/png'), size: [o.width, o.height] };
  }, { url: u(path.join(REPO, 'asset foto-foto/logo kelana.png')) });
  fs.writeFileSync(path.join(OUT, 'logo.png'), Buffer.from(info.png.split(',')[1], 'base64'));
  delete info.png; console.log('logo', JSON.stringify(info));
  // Sample UI colors at known points (scaled preview coordinates -> source px).
  const samples = await p.evaluate(async ({ url }) => {
    const im = new Image(); im.src = url; await im.decode();
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = 3000;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const s = im.naturalWidth / 1280; const pick = (x, y) => Array.from(g.getImageData(Math.round(x * s), Math.round(y * s), 1, 1).data.slice(0, 3)).map(v => v.toString(16).padStart(2, '0')).join('');
    return { daftarBtn: pick(1004, 20), jelajahBtn: pick(250, 396), bg: pick(900, 520), heroTitle: pick(262, 160), beres: pick(250, 245), menit: pick(500, 245), body: pick(245, 292) };
  }, { url: u(path.join(REPO, 'ui figma wisatawan/Landing page wisatawan.png')) });
  console.log('colors', JSON.stringify(samples));
  await b.close();
})();
