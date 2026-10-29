// Minimal MP4 (ISO BMFF) muxer: one H.264 track (avcC) + one Opus track (dOps).
const u32 = n => { const b = Buffer.alloc(4); b.writeUInt32BE(n >>> 0); return b; };
const u16 = n => { const b = Buffer.alloc(2); b.writeUInt16BE(n & 0xffff); return b; };
const u8 = n => Buffer.from([n & 0xff]);
const str = s => Buffer.from(s, 'latin1');
const box = (type, ...parts) => { const body = Buffer.concat(parts.flat()); return Buffer.concat([u32(8 + body.length), str(type), body]); };
const full = (type, v, flags, ...parts) => box(type, u8(v), Buffer.from([(flags >> 16) & 255, (flags >> 8) & 255, flags & 255]), ...parts);
const MATRIX = Buffer.concat([0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000].map(u32));

function stbl(entry, durs, sizes, syncs, chunkOffset) {
  // stts run-length
  const runs = []; for (const d of durs) { const l = runs[runs.length - 1]; if (l && l[1] === d) l[0]++; else runs.push([1, d]); }
  const parts = [
    full('stsd', 0, 0, u32(1), entry),
    full('stts', 0, 0, u32(runs.length), ...runs.map(([c, d]) => Buffer.concat([u32(c), u32(d)]))),
  ];
  if (syncs) parts.push(full('stss', 0, 0, u32(syncs.length), ...syncs.map(u32)));
  parts.push(full('stsc', 0, 0, u32(1), u32(1), u32(sizes.length), u32(1)));
  parts.push(full('stsz', 0, 0, u32(0), u32(sizes.length), ...sizes.map(u32)));
  parts.push(full('stco', 0, 0, u32(1), u32(chunkOffset)));
  return box('stbl', ...parts);
}
function trak({ id, handler, timescale, duration, movieDurMs, width, height, entry, durs, sizes, syncs, offset, audio }) {
  const tkhd = full('tkhd', 0, 3, u32(0), u32(0), u32(id), u32(0), u32(movieDurMs), u32(0), u32(0), u16(0), u16(audio ? 1 : 0), u16(audio ? 0x0100 : 0), u16(0), MATRIX, u32(width << 16), u32(height << 16));
  const mdhd = full('mdhd', 0, 0, u32(0), u32(0), u32(timescale), u32(duration), u16(0x55c4), u16(0));
  const hdlr = full('hdlr', 0, 0, u32(0), str(handler), u32(0), u32(0), u32(0), str(audio ? 'SoundHandler\0' : 'VideoHandler\0'));
  const mhd = audio ? full('smhd', 0, 0, u16(0), u16(0)) : full('vmhd', 0, 1, u16(0), u16(0), u16(0), u16(0));
  const dinf = box('dinf', full('dref', 0, 0, u32(1), full('url ', 0, 1)));
  const elst = audio && audio.preSkip ? box('edts', full('elst', 0, 0, u32(1), u32(movieDurMs), u32(audio.preSkip), u16(1), u16(0))) : null;
  return box('trak', tkhd, ...(elst ? [elst] : []), box('mdia', mdhd, hdlr, box('minf', mhd, dinf, stbl(entry, durs, sizes, syncs, offset))));
}
function avc1Entry(w, h, avcC) {
  const name = Buffer.alloc(32); return box('avc1', Buffer.alloc(6), u16(1), u16(0), u16(0), u32(0), u32(0), u32(0), u16(w), u16(h), u32(0x00480000), u32(0x00480000), u32(0), u16(1), name, u16(0x18), u16(0xffff), box('avcC', avcC));
}
function opusEntry(preSkip, sr = 48000, ch = 2) {
  const dOps = box('dOps', u8(0), u8(ch), u16(preSkip), u32(sr), u16(0), u8(0));
  return box('Opus', Buffer.alloc(6), u16(1), u32(0), u32(0), u16(ch), u16(16), u16(0), u16(0), u32(sr << 16), dOps);
}
function mux({ width, height, fps, video, avcC, audio, opusHead }) {
  const vts = 60000, vdur = Math.round(vts / fps);
  const vSizes = video.map(c => c.d.length), vSync = video.map((c, i) => (c.key ? i + 1 : 0)).filter(Boolean);
  const vDurs = video.map(() => vdur);
  const aSizes = audio.map(c => c.d.length), aDurs = audio.map(c => Math.round(c.dur * 48000 / 1e6));
  let preSkip = 312; if (opusHead && opusHead.length >= 12 && opusHead.slice(0, 8).toString('latin1') === 'OpusHead') preSkip = opusHead.readUInt16LE(10);
  const vDuration = vdur * video.length, aDuration = aDurs.reduce((a, b) => a + b, 0);
  const movieDurMs = Math.round(video.length / fps * 1000);
  const ftyp = box('ftyp', str('isom'), u32(512), str('isom'), str('iso2'), str('avc1'), str('mp41'), str('Opus'));
  const build = (vOff, aOff) => box('moov',
    full('mvhd', 0, 0, u32(0), u32(0), u32(1000), u32(movieDurMs), u32(0x00010000), u16(0x0100), u16(0), u32(0), u32(0), MATRIX, Buffer.alloc(24), u32(3)),
    trak({ id: 1, handler: 'vide', timescale: vts, duration: vDuration, movieDurMs, width, height, entry: avc1Entry(width, height, avcC), durs: vDurs, sizes: vSizes, syncs: vSync, offset: vOff }),
    trak({ id: 2, handler: 'soun', timescale: 48000, duration: aDuration, movieDurMs, width: 0, height: 0, entry: opusEntry(preSkip), durs: aDurs, sizes: aSizes, syncs: null, offset: aOff, audio: { preSkip } }));
  const moovLen = build(0, 0).length;
  const vOff = ftyp.length + moovLen + 8, aOff = vOff + vSizes.reduce((a, b) => a + b, 0);
  const moov = build(vOff, aOff);
  const mdatBody = Buffer.concat([...video.map(c => c.d), ...audio.map(c => c.d)]);
  return Buffer.concat([ftyp, moov, u32(8 + mdatBody.length), str('mdat'), mdatBody]);
}
module.exports = { mux };
