// Kelana soundtrack — 120 BPM, D minor (Dm9 · Bbmaj7 · Fmaj7 · Cadd9), rendered with OfflineAudioContext.
// Kick on every beat, impact on every scene change, UI ticks on cursor clicks.
async function renderMusic() {
  const SR = 48000, D = 75.0, B = 0.5;
  const HITS = [8, 15.5, 19.5, 23.5, 25, 31.5, 34.5, 40.5, 43.5, 48.5, 58, 61, 65.5, 68, 72], BIG = 55, DIM = [48.5, 55], PAY = [55, 58], BUILD = [53, 55], VO = [58, 68];
  const ctx = new OfflineAudioContext(2, Math.round(SR * D), SR);
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  const noise = (sec) => { const b = ctx.createBuffer(1, Math.round(SR * sec), SR), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rnd(); return b; };
  const NZ = noise(3);

  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -12; comp.knee.value = 6; comp.ratio.value = 3.5; comp.attack.value = .004; comp.release.value = .12;
  const master = ctx.createGain(); master.gain.value = .82; master.connect(comp); comp.connect(ctx.destination);
  // final fade on the last 0.4 s
  master.gain.setValueAtTime(.82, D - .45); master.gain.linearRampToValueAtTime(0, D);
  // reverb send
  const ir = ctx.createBuffer(2, SR * 2.4, SR); for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = rnd() * Math.pow(1 - i / d.length, 3.2); }
  const verb = ctx.createConvolver(); verb.buffer = ir; const verbG = ctx.createGain(); verbG.gain.value = .22; verb.connect(verbG); verbG.connect(master);
  // music bus with sidechain ducking from the kick
  const bus = ctx.createGain(); bus.connect(master); bus.connect(verb);
  for (let b = 0; b < D / B; b++) { const t = b * B, hit = HITS.includes(t) || t === BIG; bus.gain.setValueAtTime(hit ? .2 : .45, t); bus.gain.linearRampToValueAtTime(1, t + (hit ? .45 : .28)); }
  const drums = ctx.createGain(); drums.gain.value = 1; drums.connect(master);

  const nsrc = (t, dur, dest, rate = 1) => { const s = ctx.createBufferSource(); s.buffer = NZ; s.playbackRate.value = rate; s.connect(dest); s.start(t, (Math.abs(rnd()) * 1.5), dur + .05); return s; };
  const env = (g, t, a, peak, d) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); };

  function kick(t, amp = .95) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(165, t); o.frequency.exponentialRampToValueAtTime(46, t + .12);
    env(g, t, .002, amp, .42); o.connect(g); g.connect(drums); o.start(t); o.stop(t + .5);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500; const cg = ctx.createGain(); env(cg, t, .001, .18 * amp, .012); hp.connect(cg); cg.connect(drums); nsrc(t, .03, hp);
  }
  function clap(t, amp = .32) {
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = .9; const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); [0, .011, .022].forEach(o => { g.gain.setValueAtTime(amp, t + o); g.gain.exponentialRampToValueAtTime(amp * .2, t + o + .009); });
    g.gain.setValueAtTime(amp, t + .03); g.gain.exponentialRampToValueAtTime(.0001, t + .22);
    bp.connect(g); g.connect(drums); const s = ctx.createGain(); s.gain.value = .5; g.connect(s); s.connect(verb); nsrc(t, .25, bp);
  }
  function hat(t, amp = .1, dec = .035, f = 8000) { const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = f; const g = ctx.createGain(); env(g, t, .001, amp, dec); hp.connect(g); g.connect(drums); nsrc(t, dec + .02, hp); }
  function bass(t, f, dur, amp = .3) {
    const o = ctx.createOscillator(), s = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = 'sawtooth'; o.frequency.value = f; s.type = 'sine'; s.frequency.value = f;
    lp.type = 'lowpass'; lp.Q.value = 4; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(180, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + .008); g.gain.setValueAtTime(amp, t + dur - .03); g.gain.linearRampToValueAtTime(0, t + dur);
    const sg = ctx.createGain(); sg.gain.value = .9; o.connect(lp); lp.connect(g); s.connect(sg); sg.connect(g); g.connect(bus); o.start(t); s.start(t); o.stop(t + dur + .01); s.stop(t + dur + .01);
  }
  function pad(t, fs, dur, amp = .05, cut = 1300) {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cut; lp.Q.value = .5; const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + .35); g.gain.setValueAtTime(amp, t + dur - .25); g.gain.linearRampToValueAtTime(0, t + dur + .2);
    lp.connect(g); g.connect(bus);
    fs.forEach(f => [-7, 7].forEach(dt => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt; o.connect(lp); o.start(t); o.stop(t + dur + .25); }));
  }
  function pluck(t, f, amp = .07, open = 3200) {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = 'square'; o.frequency.value = f; o2.type = 'triangle'; o2.frequency.value = f * 2;
    lp.type = 'lowpass'; lp.Q.value = 2; lp.frequency.setValueAtTime(open, t); lp.frequency.exponentialRampToValueAtTime(500, t + .2);
    env(g, t, .003, amp, .28); o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(bus); o.start(t); o2.start(t); o.stop(t + .35); o2.stop(t + .35);
  }
  function impact(t, big = false) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(big ? 95 : 80, t); o.frequency.exponentialRampToValueAtTime(32, t + .7);
    env(g, t, .003, big ? .9 : .85, big ? 1.1 : .7); o.connect(g); g.connect(drums); o.start(t); o.stop(t + 1.3);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(3000, t); lp.frequency.exponentialRampToValueAtTime(200, t + .6);
    const ng = ctx.createGain(); env(ng, t, .002, big ? .4 : .45, big ? .9 : .55); lp.connect(ng); ng.connect(drums); ng.connect(verb); nsrc(t, 1, lp);
    if (big) { const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5000; const cg = ctx.createGain(); env(cg, t, .002, .16, 2.2); hp.connect(cg); cg.connect(master); cg.connect(verb); nsrc(t, 2.4, hp, .8); }
  }
  function riser(t0, t1, amp = .16) {
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 3; bp.frequency.setValueAtTime(300, t0); bp.frequency.exponentialRampToValueAtTime(6000, t1);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(amp, t1 - .02); g.gain.linearRampToValueAtTime(0, t1 + .02);
    bp.connect(g); g.connect(master); const s = ctx.createBufferSource(); s.buffer = NZ; s.loop = true; s.connect(bp); s.start(t0); s.stop(t1 + .05);
  }
  function whoosh(t, dur = .3, amp = .06) { const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.5; bp.frequency.setValueAtTime(600, t); bp.frequency.exponentialRampToValueAtTime(3500, t + dur); const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + dur * .6); g.gain.linearRampToValueAtTime(0, t + dur); bp.connect(g); g.connect(master); nsrc(t, dur, bp); }
  function tick(t) { [[2100, .05, .012], [3400, .03, .006]].forEach(([f, a, d]) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = f; env(g, t, .0008, a, d); o.connect(g); g.connect(master); o.start(t); o.stop(t + .03); }); }

  const CH = [
    { root: 73.42, notes: [146.83, 174.61, 220.0, 261.63, 329.63] },  // Dm9
    { root: 58.27, notes: [116.54, 146.83, 174.61, 220.0, 261.63] },  // Bbmaj7
    { root: 87.31, notes: [174.61, 220.0, 261.63, 329.63, 392.0] },   // Fmaj7
    { root: 65.41, notes: [130.81, 164.81, 196.0, 293.66, 392.0] },   // Cadd9
  ];
  const ARP = [0, 2, 4, 3, 1, 3, 2, 4, 0, 2, 4, 3, 2, 4, 3, 1];
  const nBars = D / 2;
  for (let bar = 0; bar < nBars; bar++) {
    const t = bar * 2, c = CH[bar % 4];
    const build = t >= BUILD[0] && t < BUILD[1], payoff = t >= PAY[0] && t < PAY[1], outro = t >= 73, vo = t >= VO[0] && t < VO[1], dim = t >= DIM[0] && t < DIM[1];
    pad(t, c.notes, 2, t < 8 ? .03 : payoff ? .055 : dim ? .05 : .045, t < 8 ? 800 : payoff ? 2200 : dim ? 600 : 1400);
    if (payoff) pad(t, c.notes.slice(2).map(f => f * 2), 2, .018, 3000);
    for (let s = 0; s < 16; s++) {
      const ts = t + s * .125;
      // bass: offbeat 8ths (house), out during the last half-bar of the build
      if (t >= 8 && !dim && s % 2 === 0 && s % 4 === 2 && ts < 74.5) bass(ts, c.root, .22, payoff ? .34 : .3);
      if (s % 4 === 0 && t >= 16 && !outro && !dim && !vo) bass(ts, c.root * 2, .1, .12);
      // arp
      const arpOn = (t >= 8 && !dim) || (build && ts >= 53.5);
      if (arpOn) pluck(ts, c.notes[ARP[s]] * 2, build ? .04 + .04 * (ts - 53) / 2 : payoff ? .075 : vo ? .035 : t < 16 ? .05 : .06, build ? 1200 + 3000 * (ts - 53) / 2 : payoff ? 4200 : outro ? 2200 : 2600);
      // hats
      if (t >= 2 && !dim && s % 4 === 2 && ts < 74.5) hat(ts, .11, .045);
      if (t >= 16 && !outro && !dim && !vo && s % 2 === 1) hat(ts, .035, .02, 10000);
    }
    // clap on 2 and 4
    if (t >= 8 && !dim && t < 73) { clap(t + .5); clap(t + 1.5); }
  }
  // kick on every beat
  for (let b = 0; b < D / B; b++) { const tb = b * B; kick(tb, tb >= DIM[0] && tb < DIM[1] ? .7 : tb >= PAY[0] && tb < PAY[1] ? 1 : tb < 8 ? .8 : tb >= VO[0] && tb < VO[1] ? .8 : .92); }
  // build: snare roll and riser into the payoff
  for (let i = 0; i < 8; i++) clap(54 + i * .125, .1 + .2 * i / 8);
  riser(53.0, 55.0, .17);
  riser(7.0, 8.0, .1);          // into the reveal of the landing page
  // scene-change hits
  HITS.forEach(t => impact(t));
  impact(BIG, true);
  // UI sounds
  [15.5, 17.0, 18.0, 19.5, 20.5, 21.0, 21.5, 22.5, 23.5, 29.0, 30.5, 36.5, 38.5, 46.5, 56.3, 57.9, 58.8, 60.15, 60.95, 61.95, 62.55, 65.4, 66.4, 67.85, 71.4].forEach(tick);
  for (let i = 0; i < 39; i++) if (i % 3 !== 2) tick(36.75 + i / 32 + .004);
  for (let i = 0; i < 20; i++) tick(58.95 + i / 24 + .004);
  for (let i = 0; i < 13; i++) tick(60.3 + i / 24 + .004);
  [0, .5, 1, 1.5, 2, 2.5, 3, 3.5].forEach(t => whoosh(t, .35, .035));   // research windows pile up
  whoosh(3.95, .6, .06);
  [14.25, 27.2, 29.0, 35.0, 44.0, 62.9, 69.4].forEach(t => whoosh(t, .5, .05));
  whoosh(9.6, 3.8, .025);   // the long smooth scroll
  return ctx.startRendering();
}

function wavFromBuffer(buf) {
  const n = buf.length, ch = buf.numberOfChannels, sr = buf.sampleRate, out = new DataView(new ArrayBuffer(44 + n * ch * 2));
  const ws = (o, s) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
  ws(0, 'RIFF'); out.setUint32(4, 36 + n * ch * 2, true); ws(8, 'WAVE'); ws(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, ch, true);
  out.setUint32(24, sr, true); out.setUint32(28, sr * ch * 2, true); out.setUint16(32, ch * 2, true); out.setUint16(34, 16, true); ws(36, 'data'); out.setUint32(40, n * ch * 2, true);
  const C = [...Array(ch)].map((_, i) => buf.getChannelData(i)); let o = 44, peak = 0;
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) peak = Math.max(peak, Math.abs(C[c][i]));
  const g = peak > .98 ? .98 / peak : 1;
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) { const v = Math.max(-1, Math.min(1, C[c][i] * g)); out.setInt16(o, v < 0 ? v * 32768 : v * 32767, true); o += 2; }
  return { wav: new Uint8Array(out.buffer), peak, gain: g };
}
