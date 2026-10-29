// Prepare the Figma exports as page images for the v2 video.
// Each screen is cropped to its content (black side bars removed) and resized so that
// 1 world unit = 1 px of a 1280-wide page. Writes assets/scr/<name>.jpg and assets/scr/screens.json.
const fs = require('fs');
const { launch, path } = require('./pw.cjs');
const REPO = process.env.REPO || path.resolve(__dirname, '../..');
const OUT = path.resolve(__dirname, '../assets/scr');
fs.mkdirSync(OUT, { recursive: true });
const u = f => 'file://' + f.split('/').map(encodeURIComponent).join('/');
const W = 'ui figma wisatawan/', M = 'ui figma mitra/';
const JOBS = [
  ['landing', W + 'Landing page wisatawan.png', 1920],
  ['susun1', W + 'susun_manual1 (1).png', 2560],
  ['susun2', W + 'susun_manual2 (1).png', 2560],
  ['susun3', W + 'susun_manual3 (1).png', 2560],
  ['forum', W + 'forumm (1).png', 2560],
  ['booking', W + 'booking_landing (1).png', 2560],
  ['mitra1', M + 'daftar mitra 1.png', 2560],
  ['mitra2', M + 'daftar mitra 2.png', 2560],
  ['mitra3', M + 'daftar mitra 3.png', 2560],
  ['mitra4', M + 'daftar mitra 4.png', 2560],
  ['dash', M + 'dashboard mitra.png', 2560],
];
(async () => {
  const b = await launch();
  const p = await b.newPage();
  await p.goto(u(path.resolve(__dirname, 'blank.html')));
  const meta = {};
  for (const [name, src, outW] of JOBS) {
    const r = await p.evaluate(async ({ url, outW }) => {
      const im = new Image(); im.src = url; await im.decode();
      const w = im.naturalWidth, h = im.naturalHeight;
      // find non-black columns on a row near the top (side bars are pure black)
      const probe = document.createElement('canvas'); probe.width = w; probe.height = 1;
      const pg = probe.getContext('2d'); pg.drawImage(im, 0, Math.round(h * 0.02), w, 1, 0, 0, w, 1);
      const d = pg.getImageData(0, 0, w, 1).data; let x0 = 0, x1 = w - 1;
      const dark = x => d[x * 4] + d[x * 4 + 1] + d[x * 4 + 2] < 30;
      while (x0 < w && dark(x0)) x0++; while (x1 > 0 && dark(x1)) x1--;
      const cw = x1 - x0 + 1, s = outW / cw, oh = Math.round(h * s);
      const c = document.createElement('canvas'); c.width = outW; c.height = oh;
      const g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
      g.drawImage(im, x0, 0, cw, h, 0, 0, outW, oh);
      const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.9));
      const buf = new Uint8Array(await blob.arrayBuffer()); let s64 = '';
      for (let i = 0; i < buf.length; i += 0x8000) s64 += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      return { x0, cw, srcW: w, srcH: h, outW, outH: oh, worldH: h * 1280 / cw, jpg: btoa(s64) };
    }, { url: u(path.join(REPO, src)), outW });
    fs.writeFileSync(path.join(OUT, name + '.jpg'), Buffer.from(r.jpg, 'base64')); delete r.jpg;
    meta[name] = r; console.log(name, JSON.stringify(r));
  }
  fs.writeFileSync(path.join(OUT, 'screens.json'), JSON.stringify(meta, null, 1));
  await b.close();
})();
