const $ = id => document.getElementById(id);
let labs = [], state = {}, index = 0, busy = false;
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const visible = () => labs.filter(l => $('filtro').value === 'todos' || (state[l.idLab]?.estado || 'pendiente') === $('filtro').value);
const message = text => { $('mensaje').textContent = text; };
function render() {
  const list = visible(); index = Math.max(0, Math.min(index, list.length - 1));
  const lab = list[index], reviewed = labs.filter(l => state[l.idLab]?.estado && state[l.idLab].estado !== 'pendiente').length;
  $('avance').textContent = reviewed + ' de ' + labs.length + ' revisados';
  $('posicion').textContent = list.length ? (index + 1) + ' de ' + list.length : 'Sin resultados';
  $('anterior').disabled = !index; $('siguiente').disabled = index >= list.length - 1;
  if (!lab) { $('laboratorio').textContent = 'No hay laboratorios en este grupo.'; return; }
  const selection = state[lab.idLab] || { estado: 'pendiente', elegidas: [], principal: '' };
  $('laboratorio').innerHTML = '<span class="tag">ID ' + lab.idLab + ' · ' + escape(selection.estado) + '</span><h2>' + escape(lab.nombre) + '</h2><a target="_blank" rel="noopener" href="' + escape(lab.origen) + '">Ver página de origen ↗</a><p>' + escape(lab.nota) + '</p><div class="cards">' + lab.imagenes.map(i => '<div class="card"><a href="' + escape(i.url) + '" target="_blank" rel="noopener"><img src="' + escape(i.url) + '" alt="' + (i.tipo === 'logo' ? 'Logo candidato del laboratorio' : 'Fotografía candidata') + '"></a><p class="tag">' + (i.tipo === 'logo' ? 'Logo propio · alternativa a las fotos' : 'Fotografía') + ' · ' + i.ancho + ' × ' + i.alto + '</p><label><input type="checkbox" name="elegida" value="' + i.id + '"' + (selection.elegidas.includes(i.id) ? ' checked' : '') + '> Incluir</label><label><input type="radio" name="principal" value="' + i.id + '"' + (selection.principal === i.id ? ' checked' : '') + '> Usar como principal</label></div>').join('') + '</div>' + (!lab.imagenes.length ? '<p>No se encontraron candidatas específicas. Puedes dejarlo pendiente para otra búsqueda.</p>' : '') + '<footer class="row"><button id="aprobar" class="primary">Guardar y siguiente</button><button id="sin">Sin imagen adecuada</button><button id="pendiente">Dejar pendiente</button></footer><p class="help">Sólo incluye logos que correspondan al laboratorio. Las imágenes descartadas quedan disponibles para cambiar de opinión.</p>';
  $('aprobar').onclick = () => save(lab, 'aprobado');
  $('sin').onclick = () => save(lab, 'sin-imagen');
  $('pendiente').onclick = () => save(lab, 'pendiente');
  document.querySelectorAll('[name=principal]').forEach(r => r.onchange = () => { document.querySelector('[name=elegida][value="' + r.value + '"]').checked = true; });
}
async function post(path, data) {
  const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) throw Error(result.error);
  return result;
}
async function save(lab, estado) {
  if (busy) return;
  const elegidas = [...document.querySelectorAll('[name=elegida]:checked')].map(i => i.value);
  const principal = document.querySelector('[name=principal]:checked')?.value || (elegidas.length === 1 ? elegidas[0] : '');
  if (estado === 'aprobado' && (!elegidas.length || elegidas.length > 3 || !elegidas.includes(principal))) return message('Selecciona entre una y tres imágenes e indica la principal.');
  const seleccion = { estado, elegidas: estado === 'aprobado' ? elegidas : [], principal: estado === 'aprobado' ? principal : '' };
  busy = true;
  try {
    await post('/guardar', { id: lab.idLab, seleccion }); state[lab.idLab] = seleccion;
    if ($('filtro').value === 'todos') index++;
    render(); message('Revisión guardada en este equipo.');
  } catch (error) { message(error.message); } finally { busy = false; }
}
$('filtro').onchange = () => { index = 0; render(); };
$('anterior').onclick = () => { index--; render(); };
$('siguiente').onclick = () => { index++; render(); };
$('exportar').onclick = () => {
  const link = document.createElement('a'), url = URL.createObjectURL(new Blob([JSON.stringify({ labs, state }, null, 2)], { type: 'application/json' }));
  link.href = url; link.download = 'revision-labunam.json'; link.click(); URL.revokeObjectURL(url);
};
$('aplicar').onclick = async () => {
  if (busy) return;
  const count = Object.values(state).filter(s => s.estado === 'aprobado').length;
  if (!count) return message('Primero aprueba las imágenes de algún laboratorio.');
  if (!confirm('¿Aplicar las imágenes aprobadas de ' + count + ' laboratorios al catálogo local?')) return;
  busy = true; $('aplicar').disabled = true; message('Descargando y optimizando las imágenes aprobadas…');
  try {
    const result = await post('/aplicar', {});
    message('Aplicados: ' + result.aplicados.length + '. Fallidos: ' + result.errores.length + (result.errores.length ? '. IDs: ' + result.errores.map(e => e.idLab).join(', ') : '. Puedes revisar el catálogo.'));
  } catch (error) { message(error.message); } finally { busy = false; $('aplicar').disabled = false; }
};
try { const data = await (await fetch('/api')).json(); labs = data.labs; state = data.state; render(); }
catch { message('No se pudo cargar la revisión. Recarga la página.'); }
