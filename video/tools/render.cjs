// Full render: 60 fps, 3 subframes/frame blended (tmix equivalent), H.264 + Opus in MP4, plus WAV.
// usage: node render.cjs [workers=6] [from=0] [to=3360]
const fs = require('fs');
const { launch, path } = require('./pw.cjs');
const { mux } = require('./mp4.cjs');
const ROOT = path.resolve(__dirname, '..'), SUB = path.join(ROOT, 'out/sub');
const FPS = 60, DUR = +(process.env.DUR || 56), NF = FPS * DUR, SUBS = 3;
const W = +(process.argv[2] || 6), FROM = +(process.argv[3] || 0), TO = +(process.argv[4] || NF);
const subPath = (i, k) => path.join(SUB, `${String(i).padStart(5, '0')}_${k}.jpg`);

async function renderFrames(browser) {
  fs.mkdirSync(SUB, { recursive: true });
  const todo = []; for (let i = FROM; i < TO; i++) if (!fs.existsSync(subPath(i, SUBS - 1))) todo.push(i);
  console.log('frames to render', todo.length);
  let next = 0, done = 0; const t0 = Date.now();
  await Promise.all([...Array(W)].map(async () => {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage(); p.on('pageerror', e => console.log('PAGEERROR', e.message));
    await p.goto('file://' + path.join(ROOT, process.env.PAGE || 'kelana.html')); await p.evaluate(() => window.__ready);
    while (next < todo.length) {
      const i = todo[next++];
      for (let k = 0; k < SUBS; k++) {
        const t = Math.max(0, (i + (k - (SUBS - 1) / 2) / SUBS) / FPS);   // shutter centred on the frame
        await p.evaluate(t => window.seek(t), t);
        fs.writeFileSync(subPath(i, k), await p.screenshot({ type: 'jpeg', quality: 94 }));
      }
      if (++done % 120 === 0) console.log(`rendered ${done}/${todo.length} (${((Date.now() - t0) / done).toFixed(0)} ms/frame)`);
    }
    await ctx.close();
  }));
}

async function encode(browser) {
  const p = await (await browser.newContext()).newPage();
  p.on('pageerror', e => console.log('ENC PAGEERROR', e.message)); p.on('console', m => console.log('enc:', m.text()));
  await p.goto('file://' + path.join(__dirname, 'encode.html'));
  console.log('rendering soundtrack');
  const a = await p.evaluate(() => window.audio());
  fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'out/' + (process.env.OUT || 'kelana') + '_soundtrack.wav'), Buffer.from(a.wav, 'base64'));
  console.log('wav written, peak', a.peak.toFixed(3), 'opus packets', a.chunks.length);
  await p.evaluate(b => window.vinit(b), +(process.env.BITRATE || 18e6));
  const video = [];
  for (let i = 0; i < NF; i++) {
    const urls = [...Array(SUBS)].map((_, k) => 'file://' + subPath(i, k));
    const out = await p.evaluate(({ i, urls }) => window.vframe(i, urls), { i, urls });
    out.forEach(c => video.push({ ts: c.ts, key: c.key, d: Buffer.from(c.d, 'base64') }));
    if (i % 600 === 0) console.log('encoded', i);
  }
  const fl = await p.evaluate(() => window.vflush());
  fl.chunks.forEach(c => video.push({ ts: c.ts, key: c.key, d: Buffer.from(c.d, 'base64') }));
  // sanity: presentation order must equal decode order (no B-frames)
  for (let i = 1; i < video.length; i++) if (video[i].ts <= video[i - 1].ts) throw new Error('non-monotonic timestamps at ' + i);
  const audio = a.chunks.map(c => ({ dur: c.dur, d: Buffer.from(c.d, 'base64') }));
  const mp4 = mux({ width: 1920, height: 1080, fps: FPS, video, avcC: Buffer.from(fl.desc, 'base64'), audio, opusHead: a.desc ? Buffer.from(a.desc, 'base64') : null });
  fs.writeFileSync(path.join(ROOT, 'out/' + (process.env.OUT || 'kelana') + '_explainer.mp4'), mp4);
  console.log('mp4 written', (mp4.length / 1e6).toFixed(1), 'MB, video samples', video.length, 'keyframes', video.filter(v => v.key).length);
}

(async () => {
  const browser = await launch();
  if (process.env.SKIP_FRAMES !== '1') await renderFrames(browser);
  if (FROM === 0 && TO === NF) await encode(browser);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
