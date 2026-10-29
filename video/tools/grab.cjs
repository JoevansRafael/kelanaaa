// Grab full-res frames from the encoded MP4 at given times: node grab.cjs <mp4> <outDir> t1,t2,...
const fs=require('fs');const { launch, path } = require('./pw.cjs');
(async()=>{const [mp4,out,ts]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});const b=await launch();const p=await b.newPage();
await p.goto('file://'+path.resolve(__dirname,'blank.html'));
const shots=await p.evaluate(async({src,ts})=>{const v=document.createElement('video');v.src=src;v.muted=true;await new Promise(r=>v.onloadeddata=r);
const c=document.createElement('canvas');c.width=1920;c.height=1080;const g=c.getContext('2d');const o={};
for(const t of ts){v.currentTime=t;await new Promise(r=>v.onseeked=r);g.drawImage(v,0,0);o[t]=c.toDataURL('image/jpeg',.85)}return o},{src:'file://'+path.resolve(mp4),ts:ts.split(',').map(Number)});
for(const k in shots)fs.writeFileSync(path.join(out,'g_'+k+'.jpg'),Buffer.from(shots[k].split(',')[1],'base64'));await b.close();})();
