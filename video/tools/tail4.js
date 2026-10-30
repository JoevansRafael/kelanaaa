/* ======================= W0 HOOK (screen space) ======================= */
const hook = win('hook', 0, 8.0, { screen: true });
// research windows piling up ("riset 40 tab browser" is Kelana's own copy)
const RWS = [ // title, search text, kind, photo, dx, dy, rot
  ['Pantai tersembunyi di Bali yang wajib dikunjungi', 'pantai tersembunyi bali', 'photo', 'r_bali', -230, -210, -4],
  ['Harga kapal ke Labuan Bajo berapa sih?', 'harga kapal labuan bajo', 'qa', null, 150, -240, 3],
  ['Itinerary Bromo 3 hari 2 malam', 'itinerary bromo 3h2m', 'photo', 'r_bromo', -60, -70, -2],
  ['Homestay dekat Pink Beach, ada rekomendasi?', 'homestay pink beach', 'rev', null, 230, -30, 4],
  ['Rute Jogja ke Borobudur naik apa?', 'rute jogja borobudur', 'photo', 'r_borobudur', -250, 120, 3],
  ['Budget ke Raja Ampat realistisnya berapa?', 'budget raja ampat', 'photo', 'r_raja', 110, 150, -3],
  ['Cuaca Danau Toba bulan Desember', 'cuaca danau toba desember', 'photo', 'r_toba', -110, 250, 2],
  ['Jam buka tempat wisata di Jogja', 'jam buka wisata jogja', 'rev', null, 210, 260, -5],
];
const RW_T = [0, .5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5], TABS = [3, 8, 13, 19, 24, 30, 35, 40];
RWS.forEach(([ttl, q, kind, ph, dx, dy, rot], i) => {
  let body = '';
  if (kind === 'photo') body = `<img class="ph" src="assets/hook/${ph}.jpg"><div class="sk" style="left:20px;top:282px;width:460px"></div><div class="sk" style="left:20px;top:304px;width:380px"></div>`;
  else if (kind === 'qa') body = [0, 1, 2, 3].map(k => `<div class="av" style="left:20px;top:${118 + k * 52}px"></div><div class="sk" style="left:62px;top:${122 + k * 52}px;width:${300 - k * 30}px"></div><div class="sk" style="left:62px;top:${138 + k * 52}px;width:${400 - k * 40}px;height:8px"></div>`).join('');
  else body = [0, 1, 2, 3].map(k => `<div class="st" style="left:20px;top:${116 + k * 52}px">${'★★★★★☆☆'.slice(k % 2, 5 + (k % 2))}</div><div class="sk" style="left:20px;top:${140 + k * 52}px;width:${470 - k * 50}px"></div>`).join('');
  add(hook.world, `<div class="rw" id="rw${i}" style="left:${1400 - 270 + dx}px;top:${540 - 170 + dy}px">
    <div class="bar"><i class="dot" style="left:16px"></i><i class="dot" style="left:31px"></i><i class="dot" style="left:46px"></i><div class="url"><svg viewBox="0 0 24 24" style="width:12px;height:12px;vertical-align:-2px;margin-right:6px;fill:none;stroke:#64748B;stroke-width:2.6;stroke-linecap:round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/></svg>${q}</div></div>
    <div class="ttl">${ttl}</div>${body}</div>`);
});
add(hook.world, `<div class="t" id="tabc" style="left:140px;top:742px;font-size:30px;font-weight:700;color:#64748B"><span class="m"><span class="mi"><span id="tabn">3</span> tab riset terbuka</span></span></div>`);
const HW = [ // word, line, in, out
  ['Mau', 0, .5, 4.0], ['liburan,', 0, .75, 4.03], ['tapi', 1, 1.25, 4.06], ['malah', 1, 1.5, 4.09], ['<span class="k">bingung?</span>', 2, 2.0, 4.12],
  ['Ujung-ujungnya', 3, 4.5, 6.2], ['malah', 4, 5.0, 6.25], ['gajadi', 4, 5.25, 6.3], ['<span id="lib">liburan?</span>', 4, 5.5, 6.35],
  ['Dibuat', 5, 6.5, 7.75], ['gampang', 5, 6.75, 7.8], ['di', 6, 7.0, 7.8], ['<span id="hlogoSlot" style="display:inline-block;width:326px;height:96px"></span>', 6, 7.25, null], ['aja!', 6, 7.25, 7.85],
];
const HL = [[140, 300, 112], [140, 424, 112], [140, 548, 112], [216, 372, 118], [216, 508, 118], [216, 372, 118], [216, 508, 118]];
{
  let h = '';
  HL.forEach(([x, y, fs], L) => {
    h += `<div class="hook" style="left:${x}px;top:${y}px;font-size:${fs}px" id="hl${L}">` + HW.map((w, i) => w[1] === L ? `<span class="m" id="hw${i}"><span class="mi">${w[0]}</span></span> ` : '').join('') + '</div>';
  });
  add(hook.world, h);
  add(hook.world, `<div class="abs" id="strike" style="height:10px;background:#0F172A;border-radius:5px;transform-origin:0 50%"></div>`);
}
add($('top'), `<img id="hlogo" src="assets/logo.png" style="position:absolute;left:0;top:0;width:326px;transform-origin:0 0;display:none">`);

/* ======================= W1 LANDING ======================= */
const landing = win('landing', 8.0, 15.5, { img: 'landing' });

/*@MID_DEFS@*/
// real photos from the repo on the itinerary cards (replace the flat illustrations)
const TH = [['padar.jpg', 691], ['pink_beach.jpg', 824], ['komodo.jpg', 956]];
add(s3.world, TH.map(([f, y]) => `<img src="assets/${f}" class="abs" style="left:203px;top:${y}px;width:76px;height:76px;border-radius:11px;object-fit:cover">`).join(''));
add($('sManta'), `<img src="assets/manta.jpg" class="abs" style="left:167px;top:21px;width:76px;height:76px;border-radius:11px;object-fit:cover">`);

/* ======================= W7 PROBLEM (screen space, navy) ======================= */
const pb = win('problem', 48.5, 55.0, { screen: true, bg: '#0E4673' });
add(pb.world, `
  <div class="q" style="left:160px;top:380px;color:#fff;font-size:120px"><span class="m" id="s0"><span class="mi">Sementara itu,</span></span></div>
  <div class="q" style="left:160px;top:516px;color:#fff;font-size:120px"><span class="m" id="s1"><span class="mi">di sisi lain…</span></span></div>
  <div class="pr" style="left:160px;top:340px"><span class="m" id="p0"><span class="mi">Pendapatan UMKM &</span></span></div>
  <div class="pr" style="left:160px;top:432px"><span class="m" id="p1"><span class="mi">pemandu lokal</span></span></div>
  <div class="pr" style="left:160px;top:524px"><span class="m" id="p2"><span class="mi">malah menurun.</span></span></div>
  <div class="t" style="left:160px;top:650px;font-size:32px;font-weight:600;color:#9CC9EE"><span class="m" id="p6"><span class="mi">Susah ketemu wisatawan.</span></span></div>
  <div class="pr" style="left:160px;top:384px"><span class="m" id="p3"><span class="mi">Lewat Kelana Mitra,</span></span></div>
  <div class="pr" style="left:160px;top:476px"><span class="m" id="p4"><span class="mi">langsung <span style="color:#45ABFF">terhubung</span></span></span></div>
  <div class="pr" style="left:160px;top:568px"><span class="m" id="p5"><span class="mi">ke wisatawan.</span></span></div>
  <svg class="abs" style="left:1240px;top:300px;width:540px;height:480px" viewBox="0 0 540 480">
    <path id="lnDown" d="M10 90 C 90 100, 120 150, 180 190 S 300 330, 360 400" fill="none" stroke="#ffffff" stroke-opacity=".55" stroke-width="10" stroke-linecap="round"/>
    <path id="lnUp" d="M360 400 C 410 420, 430 300, 460 230 S 510 90, 530 40" fill="none" stroke="#45ABFF" stroke-width="10" stroke-linecap="round"/>
    <circle id="lnDot" cx="0" cy="0" r="14" fill="#45ABFF"/>
  </svg>
`);

/* ======================= W8–W11 MITRA (slower, room for voice-over) ======================= */
const m1 = win('mitra1', 55.0, 58.0, { img: 'mitra1' });
add(m1.world, `<div class="abs" id="pmCover" style="left:257px;top:370px;width:766px;height:96px;background:#F8FAFC">
  <div class="tile" style="left:3px;top:3px;width:760px;height:90px;border-radius:14px"></div>
  <div class="abs" style="left:24px;top:24px;width:48px;height:48px;border-radius:12px;background:#EAF4FE;display:flex;align-items:center;justify-content:center">${svg('compass', 'width:22px;height:22px;fill:none;stroke:#35A8FF;stroke-width:1.8')}</div>
  <div class="t" style="left:84px;top:27px;font-size:16.5px;font-weight:700">Pemandu wisata</div>
  <div class="t" style="left:84px;top:52px;font-size:14px;color:#64748B">Jasa memandu harian atau per-trip, dengan tarif per hari.</div></div>`);
const m2 = win('mitra2', 58.0, 61.0, { img: 'mitra2' });
add(m2.world, `${patch(296, 446, 326, 34, '#fff')}<div class="t" id="mType" style="left:302px;top:451px;font-size:16.5px"></div>
  ${patch(661, 446, 326, 34, '#fff')}<div class="t" id="mType2" style="left:667px;top:451px;font-size:16.5px"></div>`);
const m3 = win('mitra3', 61.0, 65.5, { img: 'mitra3' });
add(m3.world, `
  <div class="abs" id="ktpB" style="left:285px;top:432px;width:345px;height:170px;border:2px solid #0F172A;border-radius:14px"></div>
  <div class="abs" id="nibB" style="left:650px;top:432px;width:345px;height:170px;border:2px solid #0F172A;border-radius:14px"></div>
  <div class="abs" id="ktpOk" style="left:592px;top:446px;width:26px;height:26px;border-radius:13px;background:#0F172A;display:flex;align-items:center;justify-content:center">${svg('check', 'width:15px;height:15px;fill:none;stroke:#fff;stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round')}</div>
  <div class="abs" id="nibOk" style="left:957px;top:446px;width:26px;height:26px;border-radius:13px;background:#0F172A;display:flex;align-items:center;justify-content:center">${svg('check', 'width:15px;height:15px;fill:none;stroke:#fff;stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round')}</div>
  <div class="abs" id="vStrip" data-s="mitra3,960,725" style="left:300px;top:679px;width:686px;height:56px">
    ${[['Dokumen diterima', 12], ['Dicek tim Kelana', 246], ['Mitra terverifikasi', 468]].map(([l, x], k) => `<div class="stp" style="left:${x}px;top:15px"><i class="o"></i><i class="f" id="vf${k}">${svg('check', 'width:14px;height:14px;fill:none;stroke:#fff;stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round')}</i>${l}</div>`).join('')}
    <div class="abs" id="vl0" style="left:190px;top:28px;width:44px;height:2px;background:#0F172A;transform-origin:0 50%"></div>
    <div class="abs" id="vl1" style="left:410px;top:28px;width:44px;height:2px;background:#0F172A;transform-origin:0 50%"></div>
  </div>`);
const m4 = win('mitra4', 65.5, 68.0, { img: 'mitra4' });
add(m4.world, `<div class="abs" id="upl" style="left:285px;top:716px;width:710px;height:170px;border-radius:14px;border:1.5px dashed #CBD5E1;background:#F8FAFC">
  ${['padar.jpg', 'pink_beach.jpg', 'komodo.jpg'].map((f, k) => `<img src="assets/${f}" id="up${k}" class="abs" style="left:${40 + k * 220}px;top:22px;width:200px;height:126px;border-radius:10px;object-fit:cover;transform-origin:50% 100%">`).join('')}
  <div class="t" style="left:672px;top:70px;font-size:13px;font-weight:700;color:#0F172A;text-align:right;right:20px"></div></div>`);

/* ======================= W12 DASHBOARD ======================= */
const ds = win('dash', 68.0, 72.0, { img: 'dash' });
const BARS = [343, 420, 496, 573, 650, 726, 803];
add(ds.world, `${patch(306, 420, 540, 150, '#fff')}${BARS.map((x, i) => `<div class="abs" id="bar${i}" style="left:${x - 22}px;top:0;width:44px;border-radius:6px 6px 3px 3px;background:${i === 4 ? '#35A8FF' : '#B4DCFF'};transform-origin:50% 100%"></div>`).join('')}
  <div class="abs" id="bdgL" style="left:40px;top:819px;width:115px;height:3px;border-radius:2px;background:#0F172A;transform-origin:0 50%"></div>
  <div class="abs" id="okBtn" style="left:1051px;top:751px;width:170px;height:42px;background:#fff">
    <div class="abs" style="left:2px;top:2px;width:120px;height:38px;border-radius:19px;background:#0F172A;color:#fff;font-size:13px;font-weight:700;line-height:38px;padding-left:38px">Diterima</div>
    <div class="abs" style="left:16px;top:12px;width:18px;height:18px">${svg('check', 'width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round')}</div></div>`);

/* ======================= W13 END ======================= */
const en = win('end', 72.0, 75.0, { screen: true });
add(en.world, `
  <img id="elogo" src="assets/logo.png" class="abs" style="left:${960 - 330}px;top:236px;width:660px;transform-origin:50% 50%">
  <div class="t" style="left:0;width:1920px;text-align:center;top:520px;font-size:76px;font-weight:800;letter-spacing:-.045em"><span class="m" id="e0"><span class="mi">Liburan gak pake</span></span> <span class="m" id="e1"><span class="mi">ribet!</span></span></div>
  <div class="abs" id="eBtn" style="left:0;top:672px;height:72px;border-radius:36px;background:#0F172A;transform-origin:50% 50%"></div>
  <div class="t" style="left:0;width:1920px;text-align:center;top:690px;font-size:26px;font-weight:700;color:#fff"><span class="m" id="e2"><span class="mi" id="eIgTxt"><svg viewBox="0 0 24 24" style="width:28px;height:28px;vertical-align:-6px;margin-right:12px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle id="eIgDot" cx="17.3" cy="6.7" r="1.2" fill="#fff" stroke="none"/></svg>@kelanaainaja</span></span></div>
`);

/* ---------- caption pill + cursor (top layer) ---------- */
const CAPS = [
  [8.3, 9.7, 'Landing page wisatawan'], [10.9, 12.3, 'Keindahan terbaik seringkali tersembunyi'], [13.3, 14.35, 'Template itinerary siap pakai'],
  /*@CAPS_MID@*/,
  [55.4, 58.0, 'Daftar mitra · 1 Pilih tipe: pemandu, UMKM, atau operator'], [58.25, 61.0, 'Daftar mitra · 2 Isi data usaha'],
  [61.25, 63.35, 'Daftar mitra · 3 Verifikasi identitas'], [63.35, 65.5, 'KTP & sertifikat dicek langsung tim Kelana'],
  [65.75, 68.0, 'Daftar mitra · 4 Pasang layanan pertamamu'],
  [68.25, 69.5, 'Dashboard mitra · pendapatan'], [69.5, 70.6, 'Profil mitra bertanda Terverifikasi'], [70.6, 71.95, 'Booking dari wisatawan langsung masuk'],
];
add($('top'), `<div id="cap"></div><div id="capt">${CAPS.map((c, i) => `<div class="c m" id="cp${i}"><span class="mi">${c[2]}</span></div>`).join('')}</div>
<svg id="cur" viewBox="0 0 34 34"><path d="M3 3 L3 27 L9.5 21 L13.6 30.4 L17.6 28.7 L13.6 19.6 L22.5 19.6 Z" fill="#0F172A" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`);

/* =====================================================================
   Cameras
   ===================================================================== */
function camTrack(start, moves) { return { start, moves }; }
function camEval(tr, t) {
  let s = { ...tr.start };
  for (const [a, b, cx, cy, z, e] of tr.moves) {
    if (t >= b) { s = { cx, cy, z }; continue; }
    if (t > a) { const q = E[e || 'inout']((t - a) / (b - a)); s = { cx: lerp(s.cx, cx, q), cy: lerp(s.cy, cy, q), z: lerp(s.z, z, q) }; }
    break;
  }
  return s;
}
function camAt(w, t) {
  if (w.screen) { const P = Math.pow(1.04, clamp((t - w.t0) / (w.t1 - w.t0))); return { cx: 960, cy: 540, z: 1, Z: P }; }
  const c = camEval(w.cam, t); c.Z = c.z * Math.pow(1.04, clamp((t - w.t0) / (w.t1 - w.t0))); return c;
}
const proj = (w, x, y, t) => { const c = camAt(w, t); return [960 + (x - c.cx) * c.Z, 540 + (y - c.cy) * c.Z]; };

const LS = 1280 / (2566 / 3);
const LY = v => v * LS, LX = v => (v - 213.33) * LS;
landing.cam = camTrack({ cx: 640, cy: 360, z: 1.5 }, [
  [9.6, 11.0, 640, LY(810), 1.55, 'inout'],          // hero -> keindahan terbaik (hidden gems)
  [11.0, 12.2, 640, LY(880), 1.55, 'inout'],         // slow drift over the cards
  [12.2, 13.4, 640, LY(1680), 1.55, 'inout'],        // -> template siap pakai
  [14.25, 15.0, 760, LY(4200) + 150, 1.9, 'expoio'], // fast scroll straight to the footer
]);
/*@MID_CAMS@*/
m1.cam = camTrack({ cx: 640, cy: 460, z: 1.5 }, [[55.6, 56.4, 640, 430, 1.75, 'inout'], [57.0, 57.7, 700, 580, 1.6, 'inout']]);
m2.cam = camTrack({ cx: 640, cy: 520, z: 1.55 }, [[58.3, 58.9, 645, 470, 1.85, 'inout'], [60.3, 60.85, 700, 700, 1.6, 'inout']]);
m3.cam = camTrack({ cx: 640, cy: 540, z: 1.55 }, [[61.3, 61.9, 640, 517, 1.85, 'inout'], [62.9, 63.5, 640, 690, 2.2, 'inout'], [64.95, 65.35, 760, 780, 1.6, 'inout']]);
m4.cam = camTrack({ cx: 640, cy: 600, z: 1.5 }, [[65.8, 66.4, 640, 800, 1.75, 'inout'], [67.2, 67.65, 760, 900, 1.7, 'inout']]);
ds.cam = camTrack({ cx: 760, cy: 260, z: 1.6 }, [
  [68.4, 69.1, 573, 480, 2.0, 'inout'],
  [69.4, 70.0, 124, 828, 2.4, 'inout'],
  [70.4, 71.0, 840, 772, 1.85, 'inout'],
  [71.6, 72.0, 760, 700, 1.6, 'inout'],
]);

/* ---------- cursor ---------- */
const FOOT = [LX(735), LY(4325)];
const UK = [
/*@UK_MID@*/
  { t: 54.6, s: [2050, 1250] },
  { t: 56.2, w: 'mitra1', p: [640, 420], e: 'inout' },
  { t: 56.3, w: 'mitra1', p: [640, 420] },
  { t: 57.7, w: 'mitra1', p: [900, 720], e: 'inout' },
  { t: 58.0, w: 'mitra1', p: [900, 720] },
  { t: 58.7, w: 'mitra2', p: [470, 470], e: 'inout' },
  { t: 59.8, w: 'mitra2', p: [470, 470] },
  { t: 60.15, w: 'mitra2', p: [820, 470], e: 'inout' },
  { t: 60.6, w: 'mitra2', p: [820, 470] },
  { t: 60.9, w: 'mitra2', p: [905, 877], e: 'inout' },
  { t: 61.0, w: 'mitra2', p: [905, 877] },
  { t: 61.85, w: 'mitra3', p: [458, 520], e: 'inout' },
  { t: 62.0, w: 'mitra3', p: [458, 520] },
  { t: 62.45, w: 'mitra3', p: [822, 520], e: 'inout' },
  { t: 62.7, w: 'mitra3', p: [822, 520] },
  { t: 63.3, s: [1500, 1150], e: 'inout' },
  { t: 64.9, s: [1500, 1150] },
  { t: 65.35, w: 'mitra3', p: [910, 821], e: 'inout' },
  { t: 65.5, w: 'mitra3', p: [910, 821] },
  { t: 66.3, w: 'mitra4', p: [640, 860], e: 'inout' },
  { t: 66.5, w: 'mitra4', p: [640, 860] },
  { t: 67.75, w: 'mitra4', p: [922, 965], e: 'inout' },
  { t: 68.0, w: 'mitra4', p: [922, 965] },
  { t: 68.8, s: [1750, 1150], e: 'inout' },
  { t: 70.5, s: [1750, 1150] },
  { t: 71.3, w: 'dash', p: [1100, 774], e: 'inout' },
  { t: 71.85, w: 'dash', p: [1104, 778] },
  { t: 72.0, w: 'dash', p: [1104, 778] },
  { t: 72.6, s: [2100, 1300], e: 'in' },
];
const CUR_WIN = [[14.6, 24.2], [27.6, 31.7], [34.9, 41.1], [45.6, 48.9], [54.6, 72.7]];
const PRESS = [/*@PRESS_MID@*/, [56.3, 56.4], [57.9, 58.0], [58.75, 58.85], [60.15, 60.25], [60.95, 61.05], [61.95, 62.05], [62.55, 62.65], [65.4, 65.5], [66.4, 66.5], [67.85, 67.95], [71.4, 71.5]];
function curAt(t) {
  const res = k => (k.w ? proj(WINS[k.w], k.p[0], k.p[1], t) : k.s);
  let i = 1; while (i < UK.length && UK[i].t <= t) i++;
  if (i >= UK.length) return res(UK[UK.length - 1]);
  const a = UK[i - 1], b = UK[i];
  if (t < a.t) return res(a);
  if (!b.e) return res(a);
  const q = E[b.e]((t - a.t) / (b.t - a.t)), pa = res(a), pb = res(b);
  return [lerp(pa[0], pb[0], q), lerp(pa[1], pb[1], q)];
}

/* ---------- transitions ---------- */
const revDur = id => .9;
const revEase = p => { const a = E.inout(p), b = E.expo(p); return lerp(a, b, .35); };
let TR = [];
const ORIG = {
  susun1: [FOOT[0], FOOT[1], 'landing'], susun2: [770, 1242, 'susun1'], loading: [760, 1152, 'susun2'],
  qForum: [248, 517, 'susun3'], problem: [640, 726, 'booking'], mitra2: [900, 720, 'mitra1'], mitra3: [905, 877, 'mitra2'],
  mitra4: [910, 821, 'mitra3'], dash: [922, 965, 'mitra4'], end: [1104, 778, 'dash'],
};
function buildTransitions() {
  ORDER.forEach(w => {
    if (w.id === 'hook') return;
    let o = [960, 540]; const c = ORIG[w.id];
    if (c) o = proj(WINS[c[2]], c[0], c[1], w.t0);
    TR.push({ w, t: w.t0, x: o[0], y: o[1], d: revDur(w.id) });
  });
}
const setTR = (id, x, y) => { const r = TR.find(r => r.w.id === id); r.x = x; r.y = y; };

function typed(s, t0, cps, t) { const n = clamp(Math.floor((t - t0) * cps), 0, s.length); return t < t0 ? '' : s.slice(0, n); }
function caret(t, t0, t1) { return t >= t0 && t < t1 ? '<span style="display:inline-block;width:1.5px;height:1.1em;vertical-align:-.18em;margin-left:1px;background:#0F172A"></span>' : ''; }
const up = (el, tin, tout, t) => {
  const pin = SPR(seg(t, tin, .7)), pout = tout == null ? 0 : E.expoIn(seg(t, tout, .35));
  const mi = el.firstElementChild;
  el.style.visibility = t <= tin || pout >= 1 ? 'hidden' : '';
  mi.style.transform = `translateY(${((1 - pin) - pout) * 115}%)`;
};
function setBlur(fid, gid, el, sx, sy) {
  if (sx < .4 && sy < .4) { el.style.filter = 'none'; return; }
  $(gid).setAttribute('stdDeviation', `${sx.toFixed(2)} ${sy.toFixed(2)}`); el.style.filter = `url(#${fid})`;
}
const BL = .3;
const pop = (el, t0, d = .45) => { const p = SPR(seg(t, t0, d)); el.style.transform = `scale(${p})`; el.style.visibility = t > t0 ? '' : 'hidden'; };
let t = 0;

/* =====================================================================
   seek(t)
   ===================================================================== */
window.seek = function (tt) {
  t = clamp(tt, 0, DUR);
  let active = null;
  ORDER.forEach((w, i) => {
    const next = ORDER[i + 1];
    const tr = TR.find(r => r.w === w), ntr = next && TR.find(r => r.w === next);
    const start = tr ? tr.t : 0, gone = ntr ? ntr.t + ntr.d + .02 : 1e9;
    const on = t >= start && t < gone;
    w.el.style.display = on ? '' : 'none';
    if (!on) return;
    active = w; w.el.style.zIndex = i;
    const c = camAt(w, t);
    if (w.screen) { w.world.style.transformOrigin = '960px 540px'; w.world.style.transform = `scale(${c.Z})`; }
    else w.world.style.transform = `translate(${960 - c.cx * c.Z}px,${540 - c.cy * c.Z}px) scale(${c.Z})`;
    if (tr && t < tr.t + tr.d) {
      const R = Math.max(...[[0, 0], [1920, 0], [0, 1080], [1920, 1080]].map(([x, y]) => Math.hypot(x - tr.x, y - tr.y))) + 20;
      w.el.style.clipPath = `circle(${(revEase(seg(t, tr.t, tr.d)) * R).toFixed(1)}px at ${tr.x.toFixed(1)}px ${tr.y.toFixed(1)}px)`;
    } else w.el.style.clipPath = 'none';
    if (!w.screen) {
      const dt = 1 / 60, a = camAt(w, t - dt), b = camAt(w, t);
      const vx = Math.abs((b.cx - a.cx) * b.Z), vy = Math.abs((b.cy - a.cy) * b.Z) + Math.abs(b.Z - a.Z) * 120;
      setBlur('fCam', 'gCam', w.world, Math.min(vx * .05, 2.5), Math.min(vy * .05, 3));
    }
  });
  ORDER.forEach(w => { if (w !== active && w.world.style.filter !== 'none') w.world.style.filter = 'none'; });

  /* ---- hook ---- */
  if (t >= 8.62) $('hlogo').style.display = 'none';
  if (t < 8.7) {
    HW.forEach((w, i) => up($('hw' + i), w[2], w[3], t));
    HL.forEach((_, L) => $('hl' + L).style.display = (L <= 2 ? t < 4.6 : L <= 4 ? t >= 4.4 && t < 7.0 : t >= 6.4) ? '' : 'none');
    RWS.forEach((r, i) => {
      const el = $('rw' + i), t0 = RW_T[i], p = SPR(seg(t, t0, .6)), out = E.expoIn(seg(t, 3.95 + i * .035, .5));
      el.style.visibility = t > t0 && out < 1 ? '' : 'hidden';
      el.style.clipPath = `inset(0 0 ${(1 - clamp(p)) * 100}% 0 round 14px)`;
      el.style.transform = `translateY(${(1 - p) * 70 + out * 1100}px) rotate(${r[6] * (.6 + .4 * p) + out * r[6] * 2}deg) scale(${.94 + .06 * p})`;
    });
    let n = 0; RW_T.forEach((t0, i) => { if (t >= t0 + .05) n = TABS[i]; }); $('tabn').textContent = n || 3;
    up($('tabc').firstElementChild, .3, 4.0, t);
    const s = $('strike'); const p = E.expo(seg(t, 6.0, .35)) * (1 - E.expoIn(seg(t, 6.35, .25)));
    s.style.left = G.lib.x + 'px'; s.style.top = (G.lib.y + G.lib.h * .52) + 'px'; s.style.width = G.lib.w + 'px';
    s.style.transform = `scaleX(${p})`; s.style.display = p > 0 ? '' : 'none';
    const lg = $('hlogo');
    lg.style.display = t >= 7.25 && t < 8.62 ? '' : 'none';
    if (t >= 7.25 && t < 8.62) {
      const P = camAt(hook, t).Z;
      const sx = 960 + (G.slot.x - 960) * P, sy = 540 + (G.slot.y - 540) * P, sw = G.slot.w * P;
      const tgt = proj(landing, G.navLogo[0], G.navLogo[1], 8.62), tz = camAt(landing, 8.62).Z;
      const f = SPR(seg(t, 7.8, .8)), grow = SPR(seg(t, 7.25, .55));
      const x = lerp(sx, tgt[0], f), y = lerp(sy, tgt[1], f), w = lerp(sw, G.navLogo[2] * tz, f) * Math.max(.001, grow);
      lg.style.width = w + 'px'; lg.style.transform = `translate(${x}px,${y + (1 - grow) * 30}px)`;
    }
  }

/*@MID_SEEK@*/
  /* ---- problem ---- */
  if (t >= 48.5 && t < 56.0) {
    up($('s0'), 48.85, 50.3, t); up($('s1'), 49.15, 50.35, t);
    up($('p0'), 50.75, 52.75, t); up($('p1'), 51.0, 52.8, t); up($('p2'), 51.25, 52.85, t); up($('p6'), 51.75, 52.9, t);
    up($('p3'), 53.25, null, t); up($('p4'), 53.5, null, t); up($('p5'), 53.75, null, t);
    const dn = $('lnDown'), L1 = G.lnDown, uq = $('lnUp'), L2 = G.lnUp;
    const a = E.inout(seg(t, 50.9, 1.4)), b = E.inout(seg(t, 53.3, 1.2));
    dn.style.strokeDasharray = L1; dn.style.strokeDashoffset = L1 * (1 - a);
    uq.style.strokeDasharray = L2; uq.style.strokeDashoffset = L2 * (1 - b);
    const pt = b > 0 ? uq.getPointAtLength(L2 * b) : dn.getPointAtLength(Math.max(.01, L1 * a));
    const dot = $('lnDot'); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
    dot.setAttribute('r', 14 * SPR(seg(t, 50.9, .5)));
    dot.setAttribute('fill', b > 0 ? '#45ABFF' : '#ffffff');
  }
  /* ---- mitra ---- */
  if (t >= 55 && t < 59) {
    $('pmCover').style.clipPath = `circle(${(1 - E.expo(seg(t, 56.3, .5))) * 820}px at 380px 48px)`;
    $('pmCover').style.visibility = t >= 56.85 ? 'hidden' : '';
  }
  if (t >= 58 && t < 62) {
    $('mType').innerHTML = typed('Komodo Sail by Yanto', 58.95, 24, t) + caret(t, 58.85, 60.15);
    $('mType2').innerHTML = typed('Yanto Nugraha', 60.3, 24, t) + caret(t, 60.25, 61.0);
  }
  if (t >= 61 && t < 66.5) {
    pop($('ktpOk'), 62.0); pop($('nibOk'), 62.6);
    $('ktpB').style.visibility = t > 62.0 ? '' : 'hidden'; $('nibB').style.visibility = t > 62.6 ? '' : 'hidden';
    $('ktpB').style.clipPath = `circle(${E.expo(seg(t, 62.0, .5)) * 260}px at 173px 85px)`;
    $('nibB').style.clipPath = `circle(${E.expo(seg(t, 62.6, .5)) * 260}px at 173px 85px)`;
    const vs = $('vStrip'); vs.style.visibility = t > 63.4 ? '' : 'hidden'; vs.style.clipPath = `inset(0 ${(1 - E.inout(seg(t, 63.4, .35))) * 100}% 0 0)`;
    [63.75, 64.25, 64.75].forEach((tf, k) => pop($('vf' + k), tf, .4));
    $('vl0').style.transform = `scaleX(${E.inout(seg(t, 63.85, .4))})`; $('vl1').style.transform = `scaleX(${E.inout(seg(t, 64.35, .4))})`;
  }
  if (t >= 65.5 && t < 69) {
    const u = $('upl'); u.style.visibility = t > 66.5 ? '' : 'hidden'; u.style.clipPath = `circle(${E.expo(seg(t, 66.5, .55)) * 760}px at 355px 144px)`;
    [66.65, 66.85, 67.05].forEach((tf, k) => { const p = SPR(seg(t, tf, .5)); $('up' + k).style.transform = `translateY(${(1 - p) * 30}px) scale(${.9 + .1 * p})`; $('up' + k).style.clipPath = `inset(${(1 - clamp(p)) * 100}% 0 0 0 round 10px)`; });
  }
  /* ---- dashboard ---- */
  if (t >= 68.0) {
    BARS.forEach((x, i) => { const h = i === 4 ? 130 : 62, p = SPR(seg(t, 68.6 + i * .08, .6)); const b = $('bar' + i); b.style.top = (566 - h) + 'px'; b.style.height = h + 'px'; b.style.transform = `scaleY(${Math.max(0, p)})`; });
    $('bdgL').style.transform = `scaleX(${E.inout(seg(t, 69.9, .5)) * (1 - E.expoIn(seg(t, 70.5, .3)))})`;
    const ok = $('okBtn'), p = E.expo(seg(t, 71.4, .45));
    ok.style.visibility = t >= 71.4 ? '' : 'hidden'; ok.style.clipPath = `circle(${p * 180}px at 50px 21px)`;
  }
  /* ---- end ---- */
  if (t >= 72.0) {
    const g = SPR(seg(t, 72.2, .8)); $('elogo').style.transform = `scale(${.86 + .14 * g})`; $('elogo').style.clipPath = `inset(0 ${(1 - E.inout(seg(t, 72.2, .8))) * 100}% 0 0)`;
    up($('e0'), 72.9, null, t); up($('e1'), 73.25, null, t);
    const bb = SPR(seg(t, 73.75, .7)); const eb = $('eBtn'); eb.style.left = (960 - G.igW / 2) + 'px'; eb.style.width = G.igW + 'px';
    eb.style.transform = `scaleX(${bb})`; eb.style.visibility = t > 73.75 ? '' : 'hidden';
    up($('e2'), 73.95, null, t);
    $('eIgDot').setAttribute('r', 1.2 + 1.0 * [74.5, 75.0].reduce((s, b) => s + bump(t, b), 0));
  }

  /* ---- caption pill ---- */
  {
    CAPS.forEach((c, i) => { const el = $('cp' + i); if (t < c[0] - .01 || t > c[1] + .45) { el.style.visibility = 'hidden'; return; } up(el, c[0] + .12, c[1] - .02, t); });
    let ci = -1; for (let i = 0; i < CAPS.length; i++) if (t >= CAPS[i][0] - .1) ci = i;
    let W = 0;
    if (ci >= 0) {
      const c = CAPS[ci], prevEnd = ci > 0 ? CAPS[ci - 1][1] : -9, fresh = c[0] - prevEnd > .3;
      const k = SPR(seg(t, c[0] - .1, .65));
      W = fresh ? G.capW[ci] * k : lerp(G.capW[ci - 1], G.capW[ci], k);
      const last = ci === CAPS.length - 1 || CAPS[ci + 1][0] - c[1] > .3;
      if (last) W *= 1 - E.expoIn(seg(t, c[1] + .05, .35));
    }
    const pill = $('cap'); pill.style.width = W + 'px'; pill.style.display = W > 1 ? '' : 'none';
    $('capt').style.display = pill.style.display;
  }

  /* ---- cursor ---- */
  {
    const cu = $('cur'), on = CUR_WIN.some(([a, b]) => t >= a && t < b);
    cu.style.display = on ? '' : 'none';
    if (on) {
      const [x, y] = curAt(t);
      const pr = PRESS.reduce((m, [a, b]) => Math.max(m, t < a ? 0 : t < b ? E.expo(seg(t, a, .06)) : 1 - E.expo(seg(t, b, .12))), 0);
      cu.style.transform = `translate(${x - 3}px,${y - 3}px) scale(${1 - .16 * pr})`;
      const [px, py] = curAt(t - 1 / 60);
      setBlur('fCur', 'gCur', cu, Math.min(Math.abs(x - px) * BL, 12), Math.min(Math.abs(y - py) * BL, 12));
    }
  }
};

/* ---------- boot ---------- */
const G = {};
window.__ready = (async () => {
  await document.fonts.load('800 40px PJS'); await document.fonts.load('400 16px PJS'); await document.fonts.ready;
  await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  const sample = async (img, x, y) => { const im = new Image(); im.src = `assets/scr/${img}.jpg`; await im.decode(); const s = im.naturalWidth / 1280; const c = document.createElement('canvas'); c.width = 1; c.height = 1; const g = c.getContext('2d'); g.drawImage(im, x * s, y * s, 1, 1, 0, 0, 1, 1); const d = g.getImageData(0, 0, 1, 1).data; return `rgb(${d[0]},${d[1]},${d[2]})`; };
  WINS.problem.el.style.background = await sample('susun3', 1200 / 2, 3402 / 2);
  for (const el of document.querySelectorAll('[data-s]')) { const [img, x, y] = el.dataset.s.split(','); el.style.background = await sample(img, +x, +y); }
  ORDER.forEach(w => w.el.style.display = '');
  const rect = id => $(id).getBoundingClientRect();
  const lib = rect('lib'); G.lib = { x: lib.left, y: lib.top, w: lib.width, h: lib.height };
  const sl = rect('hlogoSlot'); G.slot = { x: sl.left, y: sl.top + 6, w: sl.width };
  G.navLogo = [80, 27, 59];
  G.capW = CAPS.map((c, i) => $('cp' + i).firstElementChild.getBoundingClientRect().width + 64);
  G.lnDown = $('lnDown').getTotalLength(); G.lnUp = $('lnUp').getTotalLength();
  G.igW = rect('eIgTxt').width + 76;
  const qfk = rect('qfK'), qbk = rect('qbK');
  buildTransitions();
  window.seek(8.0); { const r = rect('hlogo'); setTR('landing', r.left + r.width / 2, r.top + r.height / 2); }
  { const r = rect('lnUp'); setTR('mitra1', r.right - 8, r.top + 8); }
  const P = 1.04, sc = (v, c) => c + (v - c) * P;
  setTR('forum', sc(qfk.left + qfk.width / 2, 960), sc(qfk.top + qfk.height / 2, 540));
  setTR('booking', sc(qbk.left + qbk.width / 2, 960), sc(qbk.top + qbk.height / 2, 540));
  setTR('susun3', 960, 430);
  { const p = proj(fo, 493 + 220, 1216 - 160 + 20, 40.5); setTR('qBook', p[0], p[1]); }
  window.seek(0);
  return true;
})();
</script>
</body>
</html>
