// Checks that the final MP4 decodes in Chromium: duration, size, video and audio decoding.
const { launch, path } = require('./pw.cjs');
(async()=>{const b=await launch();const p=await b.newPage();
await p.goto('file://'+path.resolve(__dirname,'blank.html'));
const r=await p.evaluate(async(src)=>{const v=document.createElement('video');v.src=src;v.muted=true;document.body.appendChild(v);
await new Promise((res,rej)=>{v.onloadedmetadata=res;v.onerror=()=>rej('decode error')});
const info={duration:v.duration,width:v.videoWidth,height:v.videoHeight};
v.currentTime=50;await new Promise(r=>v.onseeked=r);await v.play();await new Promise(r=>setTimeout(r,2500));
info.audioBytesDecoded=v.webkitAudioDecodedByteCount;info.videoBytesDecoded=v.webkitVideoDecodedByteCount;info.droppedFrames=v.getVideoPlaybackQuality().droppedVideoFrames;return info;},'file://'+path.resolve(__dirname,'../out/' + (process.env.OUT || 'kelana') + '_explainer.mp4'));
console.log(JSON.stringify(r));await b.close();})();
