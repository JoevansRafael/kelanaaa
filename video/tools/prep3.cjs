// Downscale repo photos used inside the hook's "research" browser windows -> assets/hook/
const fs = require('fs'); const { launch, path } = require('./pw.cjs');
const REPO = process.env.REPO || path.resolve(__dirname, '../..'); const OUT = path.resolve(__dirname, '../assets/hook');
fs.mkdirSync(OUT, { recursive: true });
const u = f => 'file://' + f.split('/').map(encodeURIComponent).join('/');
const J = [['pantai bali.jpg', 'r_bali'], ['bromo.jpg', 'r_bromo'], ['candi_borobudur.jpg', 'r_borobudur'], ['raja ampat.jpg', 'r_raja'], ['danau_toba.jpg', 'r_toba'], ['tugu jogja.jpg', 'r_jogja']];
(async () => { const b = await launch(); const p = await b.newPage(); await p.goto(u(path.resolve(__dirname, 'blank.html')));
  for (const [s, d] of J) { const r = await p.evaluate(async url => { const im = new Image(); im.src = url; await im.decode(); const c = document.createElement('canvas'); c.width = 600; c.height = Math.round(im.naturalHeight * 600 / im.naturalWidth); const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', .85); }, u(path.join(REPO, 'asset foto-foto', s)));
    fs.writeFileSync(path.join(OUT, d + '.jpg'), Buffer.from(r.split(',')[1], 'base64')); }
  await b.close(); })();
