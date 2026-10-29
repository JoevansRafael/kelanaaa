// Render still frames at given times. usage: node frames.cjs <outDir> <t1,t2,...|beats> [scale]
const fs = require('fs');
const { launch, path } = require('./pw.cjs');
(async () => {
  const [outDir, spec, scale = '0.5'] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const times = spec === 'beats' ? Array.from({ length: +(process.env.NB || 112) }, (_, i) => i * 0.5 + 0.25) : spec.split(',').map(Number);
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('console', m => console.log('page:', m.text()));
  p.on('pageerror', e => console.log('PAGEERROR', e.message));
  await p.goto('file://' + path.resolve(__dirname, '../' + (process.env.PAGE || 'kelana.html')));
  await p.evaluate(() => window.__ready);
  for (const t of times) {
    await p.evaluate(t => window.seek(t), t);
    const buf = await p.screenshot({ type: 'jpeg', quality: 80 });
    fs.writeFileSync(path.join(outDir, `f_${t.toFixed(2).padStart(5, '0')}.jpg`), buf);
  }
  // contact sheets: 4x4 grid per sheet
  const files = fs.readdirSync(outDir).filter(f => f.startsWith('f_')).sort();
  const s = +scale, W = 1920 * s, H = 1080 * s;
  for (let i = 0; i < files.length; i += 16) {
    const chunk = files.slice(i, i + 16);
    const html = `<body style="margin:0;background:#333;width:${W * 4}px">${chunk.map(f => `<div style="position:relative;display:inline-block;width:${W}px;height:${H}px;outline:1px solid #f0f"><img src="data:image/jpeg;base64,${fs.readFileSync(path.resolve(outDir, f)).toString("base64")}" style="width:100%;height:100%"><span style="position:absolute;left:4px;top:2px;font:bold 16px monospace;color:#f0f">${f.slice(2, 7)}</span></div>`).join('')}</body>`;
    const sp = await b.newPage({ viewport: { width: W * 4, height: H * Math.ceil(chunk.length / 4) } });
    await sp.setContent(html); await sp.waitForTimeout(300);
    await sp.screenshot({ path: path.join(outDir, `sheet_${String(i / 16).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 80 });
    await sp.close();
  }
  await b.close();
})();
