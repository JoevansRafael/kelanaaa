// node crop.cjs <img> x y w h out   (world coords, 1280-wide page)
const fs=require('fs');const { launch, path } = require('./pw.cjs');
(async()=>{const [img,x,y,w,h,out]=process.argv.slice(2);const b=await launch();const p=await b.newPage();
await p.goto('file://'+path.resolve(__dirname,'blank.html'));
const d=await p.evaluate(async({url,x,y,w,h})=>{const im=new Image();im.src=url;await im.decode();const s=im.naturalWidth/1280;
const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const g=c.getContext('2d');g.drawImage(im,x*s,y*s,w*s,h*s,0,0,w*2,h*2);
g.strokeStyle='rgba(255,0,255,.5)';g.fillStyle='#f0f';g.font='12px monospace';
for(let gx=Math.ceil(x/20)*20;gx<x+w;gx+=20){g.beginPath();g.moveTo((gx-x)*2,0);g.lineTo((gx-x)*2,gx%100?8:20);g.stroke();if(gx%100==0)g.fillText(gx,(gx-x)*2+2,30)}
for(let gy=Math.ceil(y/20)*20;gy<y+h;gy+=20){g.beginPath();g.moveTo(0,(gy-y)*2);g.lineTo(gy%100?8:20,(gy-y)*2);g.stroke();if(gy%100==0)g.fillText(gy,22,(gy-y)*2+4)}
return c.toDataURL('image/jpeg',.85)},{url:'file://'+path.resolve(__dirname,'../assets/scr/'+img+'.jpg'),x:+x,y:+y,w:+w,h:+h});
fs.writeFileSync(out,Buffer.from(d.split(',')[1],'base64'));await b.close();})();
