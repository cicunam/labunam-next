import {readFile,writeFile,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const file='.revision-fotos/candidatas.json';
const labs=JSON.parse(await readFile(file,'utf8'));
const state=JSON.parse(await readFile('.revision-fotos/seleccion.json','utf8').catch(()=>'{}'));
const cache=new Map();
const urls=[...new Set(labs.flatMap(l=>[...l.imagenes,...(l.alternativasLogo||[])].map(i=>i.url)))];
let done=0;
async function check(url){
 try{
  const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(12000)});
  if(!r.ok||!r.headers.get('content-type')?.startsWith('image/')){throw Error();}
  const chunks=[];let size=0;
  for await(const c of r.body){size+=c.length;if(size>12e6){throw Error();}chunks.push(c);}
  const bytes=Buffer.concat(chunks),meta=await sharp(bytes,{limitInputPixels:40000000}).metadata();
  cache.set(url,{w:meta.width,h:meta.height,hash:createHash('sha256').update(bytes).digest('hex')});
 }catch{cache.set(url,null);}
 done++;if(done%30===0){console.log(done+'/'+urls.length+' imágenes comprobadas');}
}
let next=0;
await Promise.all(Array.from({length:6},async()=>{while(next<urls.length){await check(urls[next++]);}}));
const repeated=new Map();
for(const l of labs){
 const hashes=new Set([...l.imagenes,...(l.alternativasLogo||[])].map(i=>cache.get(i.url)?.hash).filter(Boolean));
 for(const h of hashes){repeated.set(h,(repeated.get(h)||0)+1);}
}
let removed=0;
for(const l of labs){
 if(state[l.idLab]?.estado==='aprobado'){continue;}
 const seen=new Set();
 const valid=i=>{
  const m=cache.get(i.url);
  if(!m||m.w<(i.tipo==='logo'?180:320)||m.h<(i.tipo==='logo'?70:180)||repeated.get(m.hash)>=4||seen.has(m.hash)){removed++;return false;}
  seen.add(m.hash);i.ancho=m.w;i.alto=m.h;return true;
 };
 l.imagenes=l.imagenes.filter(valid);
 l.alternativasLogo=(l.alternativasLogo||[]).filter(valid);
 if(!l.imagenes.length&&l.alternativasLogo.length){l.imagenes=l.alternativasLogo;l.alternativasLogo=[];}
 if(!l.imagenes.length&&l.estado==='Candidatas para revisión'){
  l.estado='Sin candidata en esta revisión';
  l.nota='Se detectaron imágenes, pero no superaron la comprobación de acceso, tamaño o duplicados institucionales. Requiere revisión manual.';
 }
}
labs.sort((a,b)=>Number(!a.imagenes.length)-Number(!b.imagenes.length)||a.idLab-b.idLab);
await writeFile(file+'.nuevo',JSON.stringify(labs,null,2));await rename(file+'.nuevo',file);
await writeFile('.revision-fotos/verificacion.json',JSON.stringify({urls:urls.length,descartadas:removed,laboratoriosConCandidatas:labs.filter(l=>l.imagenes.length).length,imagenes:labs.reduce((n,l)=>n+l.imagenes.length+(l.alternativasLogo?.length||0),0)},null,2));
console.log(await readFile('.revision-fotos/verificacion.json','utf8'));
