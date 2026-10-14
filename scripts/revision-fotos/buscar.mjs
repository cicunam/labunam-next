// LabUNAM
// Scripts
// buscar (prepara la lista de laboratorios sin imagen y encadena exploración, verificación y depuración)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';

// Conexión
import {query} from '../../src/server/config/dbconnection.js';

// Ejecución
// Guarda los laboratorios activos sin fotos en ningún manifiesto; el pool se cierra aunque falle la consulta.
await mkdir('.revision-fotos',{recursive:true});
try {
  const base=JSON.parse(await readFile('public/fotos/manifiesto.json','utf8').catch(()=>'{}'));
  const web=JSON.parse(await readFile('public/fotos/manifiesto-web.json','utf8').catch(()=>'{}'));
  const rows=await query('SELECT idLab, labNombre, webLab, marcaAutorizaInfoWeb FROM r_seccion1 WHERE activo=1 AND idTpLab IN (1,2,3,4) ORDER BY idLab');
  const pending=rows.filter(l=>!base[l.idLab]?.length&&!web[l.idLab]?.length);
  await writeFile('.revision-fotos/pendientes.json',JSON.stringify(pending,null,2));
  console.log(pending.length+' laboratorios sin imagen.');
} finally { await globalThis.poolLabunam?.end(); }

// Utilidades
// Ejecuta un proceso hijo con la salida en la terminal y falla si no termina con código 0.
async function run(
  command, // String - Ejecutable del proceso hijo
  args, // Array - Argumentos (String) del ejecutable
){
  await new Promise((resolve,reject)=>{
    const child=spawn(command,args,{stdio:'inherit'});
    child.once('error',reject);
    child.once('exit',code=>code===0?resolve():reject(Error('La búsqueda no terminó correctamente.')));
  });
}

// Ejecución
await run('python3',['scripts/revision-fotos/explorar.py']);
await run(process.execPath,['scripts/revision-fotos/verificar.mjs']);
await run(process.execPath,['scripts/revision-fotos/depurar.mjs']);
