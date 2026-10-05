import {readFile,writeFile,rename} from 'node:fs/promises';
const file='.revision-fotos/candidatas.json';
const labs=JSON.parse(await readFile(file,'utf8'));
const state=JSON.parse(await readFile('.revision-fotos/seleccion.json','utf8').catch(()=>'{}'));
const institutional=/biomedicas(?:-retina)?\.png|logo-vector-iim|logoicml|logomy|manchalogowebenes|logo-enes|logo-geofisica|logo-cfata|logomatem|logoiiw|logocovi|logo_ib_o|logo-inb|logo-ciga|facmed|di_bco|475_w|gmailogo|logopsicologia|logo_psico|logo_dimeies|creative-commons|idea_wild|logo-vinculacion|diseno-industrial_blanco|\/img\/di\.png|logo%20ie%20blanco|paginas_personales_logo/i;
const excluded=new Set([15,23,27]);
for(const lab of labs){
 if(state[lab.idLab]?.estado==='aprobado')continue;
 const before=lab.imagenes.length;
 const keep=i=>{
  const label=i.url+' '+(i.alt||'');
  if(institutional.test(label))return false;
  if(i.tipo==='logo'&&/instituto|facultad|divisi[oó]n|ENES|CIGA|ICF/i.test(i.alt||''))return false;
  return true;
 };
 lab.imagenes=excluded.has(lab.idLab)?[]:lab.imagenes.filter(keep);
 lab.alternativasLogo=excluded.has(lab.idLab)?[]:(lab.alternativasLogo||[]).filter(keep);
 if(!lab.imagenes.length&&lab.alternativasLogo.length){lab.imagenes=lab.alternativasLogo;lab.alternativasLogo=[];}
 if(before&&!lab.imagenes.length){lab.nota='La revisión detectó imágenes generales, institucionales o de otro espacio. Pendiente de una fuente específica del laboratorio.';lab.estado='Sin candidata en esta revisión';}
}
labs.sort((a,b)=>Number(!a.imagenes.length)-Number(!b.imagenes.length)||a.idLab-b.idLab);
await writeFile(file+'.nuevo',JSON.stringify(labs,null,2));await rename(file+'.nuevo',file);
const stats={laboratorios:labs.length,pendientesConImagenes:labs.filter(l=>l.imagenes.length&&state[l.idLab]?.estado!=='aprobado').length,
 aprobadosConservados:labs.filter(l=>state[l.idLab]?.estado==='aprobado').length,
 imagenes:labs.reduce((n,l)=>n+l.imagenes.length+(l.alternativasLogo?.length||0),0),
 logos:labs.flatMap(l=>[...l.imagenes,...(l.alternativasLogo||[])]).filter(i=>i.tipo==='logo').length};
await writeFile('.revision-fotos/resumen.json',JSON.stringify(stats,null,2));
console.log(stats);
