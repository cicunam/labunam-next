import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const arg = (name, fallback) => process.argv.find(a => a.startsWith(name + '='))?.slice(name.length + 1) || fallback;
const port = Number(arg('--puerto', '8767'));
const stateDir = resolve(arg('--estado', '.revision-fotos'));
const output = resolve(arg('--destino', 'public/fotos'));
let labs = JSON.parse(await readFile(join(stateDir, 'candidatas.json'), 'utf8').catch(() => readFile(join(here, 'candidatas.json'), 'utf8')));
await mkdir(stateDir, { recursive: true });
const stateFile = join(stateDir, 'seleccion.json');
let state = JSON.parse(await readFile(stateFile, 'utf8').catch(() => '{}'));
let busy = false;
async function atomic(path, data) {
  await writeFile(path + '.nuevo', JSON.stringify(data, null, 2) + '\n');
  await rename(path + '.nuevo', path);
}
function validate(id, value) {
  const lab = labs.find(l => String(l.idLab) === id);
  if (!lab || !value || !['pendiente', 'sin-imagen', 'aprobado'].includes(value.estado)) throw Error('Selección inválida.');
  const allowed = new Set([...lab.imagenes, ...(lab.alternativasLogo || [])].map(i => i.id));
  if (!Array.isArray(value.elegidas) || value.elegidas.length > 3 || new Set(value.elegidas).size !== value.elegidas.length || value.elegidas.some(i => !allowed.has(i))) throw Error('Imágenes inválidas.');
  if (value.estado === 'aprobado' && (!value.elegidas.length || !value.elegidas.includes(value.principal))) throw Error('Elige una imagen principal.');
  return { estado: value.estado, elegidas: value.elegidas, principal: value.principal || '', actualizado: new Date().toISOString() };
}
async function download(url) {
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(20000) });
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw Error('No se pudo descargar una imagen.');
  const chunks = []; let length = 0;
  for await (const chunk of response.body) {
    length += chunk.length;
    if (length > 20 * 1024 * 1024) throw Error('Imagen demasiado grande.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
async function apply() {
  await mkdir(output, { recursive: true });
  const manifestPath = join(output, 'manifiesto-web.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8').catch(() => '{}'));
  const applied = [], errors = [], unchanged = [];
  for (const lab of labs) {
    const selection = state[lab.idLab];
    if (selection?.estado !== 'aprobado') continue;
    const images = [...selection.elegidas].sort((a, b) => Number(b === selection.principal) - Number(a === selection.principal));
    const existing = manifest[lab.idLab];
    const candidates = images.map(id => [...lab.imagenes, ...(lab.alternativasLogo || [])].find(i => i.id === id));
    if (existing?.length === candidates.length && candidates.every((image, i) => image && existing[i].imagenOriginal === image.url && existing[i].tipo === image.tipo)) {
      unchanged.push(lab.idLab); continue;
    }
    try {
      const photos = [];
      for (const id of images) {
        const candidate = [...lab.imagenes, ...(lab.alternativasLogo || [])].find(i => i.id === id);
        const bytes = await download(candidate.url);
        const hash = createHash('sha256').update(bytes).update(candidate.tipo).digest('hex').slice(0,16);
        const folder = join(output, 'web', String(lab.idLab));
        await mkdir(folder, { recursive: true });
        const variants = [];
        const meta = await sharp(bytes, { limitInputPixels: 40000000 }).metadata();
        const width = meta.autoOrient?.width || meta.width;
        for (const size of [480, 960, 1440]) {
          if (size !== 480 && size > width) continue;
          const filename = hash + '-' + size + '.webp';
          const pipeline = sharp(bytes, { limitInputPixels: 40000000 }).rotate();
          const resized = candidate.tipo === 'logo'
            ? pipeline.resize({ width: size, height: Math.round(size * 2 / 3), fit: 'contain', background: '#ffffff', withoutEnlargement: true })
            : pipeline.resize({ width: size, withoutEnlargement: true });
          const info = await resized.webp({ quality: 80 }).toFile(join(folder, filename));
          variants.push({ src: '/fotos/web/' + lab.idLab + '/' + filename, width: info.width });
        }
        photos.push({ src: variants[Math.min(1, variants.length - 1)].src, srcset: variants.map(v => v.src + ' ' + v.width + 'w').join(', '), origen: lab.origen, imagenOriginal: candidate.url, tipo: candidate.tipo, autorizacion: lab.autorizacion });
      }
      manifest[lab.idLab] = photos; applied.push(lab.idLab);
    } catch { errors.push({ idLab: lab.idLab, mensaje: 'No se pudo descargar o convertir. Se conservó la versión anterior.' }); }
  }
  // Sólo publica cada laboratorio si se completaron todas sus imágenes.
  await atomic(manifestPath, manifest);
  const result = { aplicados: applied, sinCambios: unchanged, errores: errors, fecha: new Date().toISOString() };
  await atomic(join(stateDir, 'ultima-aplicacion.json'), result);
  return result;
}
const server = createServer(async (req, res) => {
  const send = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
  try {
    if (req.headers.host !== '127.0.0.1:' + port && req.headers.host !== 'localhost:' + port) return send(403, { error: 'Host no permitido.' });
    if (req.method === 'GET' && req.url === '/api') {
      labs = JSON.parse(await readFile(join(stateDir, 'candidatas.json'), 'utf8').catch(() => readFile(join(here, 'candidatas.json'), 'utf8')));
      const progreso = JSON.parse(await readFile(join(stateDir, 'progreso.json'), 'utf8').catch(() => 'null'));
      return send(200, { labs, state, progreso });
    }
    if (req.method === 'GET' && ['/', '/index.html', '/app.js'].includes(req.url)) {
      const js = req.url === '/app.js';
      res.writeHead(200, { 'Content-Type': js ? 'text/javascript' : 'text/html', 'Cache-Control': 'no-store' });
      return res.end(await readFile(join(here, js ? 'app.js' : 'index.html')));
    }
    if (req.method !== 'POST' || req.headers.origin !== 'http://' + req.headers.host) return send(403, { error: 'Petición no permitida.' });
    if (busy) return send(409, { error: 'Espera a que termine la operación actual.' });
    busy = true;
    try {
      if (req.url === '/aplicar') return send(200, await apply());
      if (req.url !== '/guardar') return send(404, {});
      let body = '';
      for await (const chunk of req) { body += chunk; if (body.length > 20000) throw Error('Petición demasiado grande.'); }
      const { id, seleccion } = JSON.parse(body);
      const next = { ...state, [id]: validate(String(id), seleccion) };
      await atomic(stateFile, next); state = next;
      send(200, { ok: true });
    } finally { busy = false; }
  } catch { send(400, { error: 'No se pudo completar la operación. Revisa la selección e inténtalo de nuevo.' }); }
});
server.listen(port, '127.0.0.1', () => console.log('Revisión local: http://127.0.0.1:' + port));
