import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {query} from '../../lib/db/db.ts';

await mkdir('.revision-fotos',{recursive:true});
try {
  const base=JSON.parse(await readFile('public/fotos/manifiesto.json','utf8').catch(()=>'{}'));
  const web=JSON.parse(await readFile('public/fotos/manifiesto-web.json','utf8').catch(()=>'{}'));
  const rows=await query('SELECT idLab, labNombre, webLab, marcaAutorizaInfoWeb FROM r_seccion1 WHERE activo=1 AND idTpLab IN (1,2,3,4) ORDER BY idLab');
  const pending=rows.filter(l=>!base[l.idLab]?.length&&!web[l.idLab]?.length);
  await writeFile('.revision-fotos/pendientes.json',JSON.stringify(pending,null,2));
  console.log(pending.length+' laboratorios sin imagen.');
} finally { await globalThis.poolLabunam?.end(); }
async function run(command,args){
  await new Promise((resolve,reject)=>{
    const child=spawn(command,args,{stdio:'inherit'});
    child.once('error',reject);
    child.once('exit',code=>code===0?resolve():reject(Error('La búsqueda no terminó correctamente.')));
  });
}
await run('python3',['scripts/revision-fotos/explorar.py']);
await run(process.execPath,['scripts/revision-fotos/verificar.mjs']);
await run(process.execPath,['scripts/revision-fotos/depurar.mjs']);
