// LabUNAM
// Scripts
// app (interfaz local para revisar y aplicar las imágenes candidatas de cada laboratorio)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Utilidades
// Atajo para obtener un elemento de la página por su id.
const $ = (
  id, // String - Atributo id del elemento
) => document.getElementById(id);

// Estado
// Candidatas por laboratorio, selecciones guardadas, posición actual y bloqueo mientras hay una operación en curso.
let labs = [], state = {}, index = 0, busy = false;

// Utilidades
// Escapa los caracteres especiales antes de insertar textos externos en el HTML.
const escape = (
  value, // String | Number - Texto o número que se inserta en el HTML de la revisión
) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
// Laboratorios que corresponden al filtro de estado elegido; no recibe parámetros.
const visible = () => labs.filter(l => {
  const filter = $('filtro').value, status = state[l.idLab]?.estado || 'pendiente';
  return filter === 'todos' || (filter === 'con-candidatas' ? status === 'pendiente' && l.imagenes.length > 0 : status === filter);
});
// Muestra un aviso en la zona de mensajes.
const message = (
  text, // String - Aviso para la persona que revisa
) => { $('mensaje').textContent = text; };

// Interfaz
// Dibuja el laboratorio actual con sus candidatas, el avance y los botones de navegación.
function render() {
  const list = visible(); index = Math.max(0, Math.min(index, list.length - 1));
  const lab = list[index], reviewed = labs.filter(l => state[l.idLab]?.estado && state[l.idLab].estado !== 'pendiente').length;
  $('avance').textContent = reviewed + ' de ' + labs.length + ' revisados';
  $('posicion').textContent = list.length ? (index + 1) + ' de ' + list.length : 'Sin resultados';
  $('anterior').disabled = !index; $('siguiente').disabled = index >= list.length - 1;
  if (!lab) { $('laboratorio').textContent = 'No hay laboratorios en este grupo.'; return; }
  const candidates = [...lab.imagenes, ...(lab.alternativasLogo || [])];
  const selection = state[lab.idLab] || { estado: 'pendiente', elegidas: [], principal: '' };
  $('laboratorio').innerHTML = '<span class="tag">ID ' + lab.idLab + ' · ' + escape(selection.estado) + '</span><h2>' + escape(lab.nombre) + '</h2><a target="_blank" rel="noopener" href="' + escape(lab.origen || 'https://labunam.unam.mx/') + '">Ver página de origen ↗</a><p>' + escape(lab.nota) + '</p><div class="cards">' + candidates.map(i => '<div class="card"><a href="' + escape(i.url) + '" target="_blank" rel="noopener"><img src="' + escape(i.url) + '" alt="' + (i.tipo === 'logo' ? 'Logo candidato por verificar' : 'Fotografía candidata') + '"></a><p class="tag">' + (i.tipo === 'logo' ? 'Logo candidato · confirmar pertenencia' : 'Fotografía') + ' · ' + i.ancho + ' × ' + i.alto + '</p><label><input type="checkbox" name="elegida" value="' + i.id + '"' + (selection.elegidas.includes(i.id) ? ' checked' : '') + '> Incluir</label><label><input type="radio" name="principal" value="' + i.id + '"' + (selection.principal === i.id ? ' checked' : '') + '> Usar como principal</label></div>').join('') + '</div>' + (!candidates.length ? '<p>No se encontraron candidatas específicas. Puedes dejarlo pendiente para otra búsqueda.</p>' : '') + '<footer class="row"><button id="aprobar" class="primary">Guardar y siguiente</button><button id="sin">Sin imagen adecuada</button><button id="pendiente">Dejar pendiente</button></footer><p class="help">Sólo incluye logos que correspondan al laboratorio. Las imágenes descartadas quedan disponibles para cambiar de opinión.</p>';
  $('aprobar').onclick = () => save(lab, 'aprobado');
  $('sin').onclick = () => save(lab, 'sin-imagen');
  $('pendiente').onclick = () => save(lab, 'pendiente');
  document.querySelectorAll('[name=principal]').forEach(r => r.onchange = () => { document.querySelector('[name=elegida][value="' + r.value + '"]').checked = true; });
}

// Gestores de evento
// Envía JSON al servidor local y lanza el mensaje de error que devuelva.
async function post(
  path, // String - Ruta del servidor local: /guardar o /aplicar
  data, // Object - Cuerpo de la petición, que se envía como JSON
) {
  const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) {throw Error(result.error);}
  return result;
}
// Valida y guarda la selección del laboratorio; con el filtro «todos» avanza al siguiente.
async function save(
  lab, // Object - Laboratorio candidato; se usa lab.idLab
  estado, // String - Decisión de la revisión: aprobado, sin-imagen o pendiente
) {
  if (busy) {return;}
  const elegidas = [...document.querySelectorAll('[name=elegida]:checked')].map(i => i.value);
  const principal = document.querySelector('[name=principal]:checked')?.value || (elegidas.length === 1 ? elegidas[0] : '');
  if (estado === 'aprobado' && (!elegidas.length || elegidas.length > 3 || !elegidas.includes(principal))) {return message('Selecciona entre una y tres imágenes e indica la principal.');}
  const seleccion = { estado, elegidas: estado === 'aprobado' ? elegidas : [], principal: estado === 'aprobado' ? principal : '' };
  busy = true;
  try {
    await post('/guardar', { id: lab.idLab, seleccion }); state[lab.idLab] = seleccion;
    if ($('filtro').value === 'todos') {index++;}
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

// Estado
// Temporizador de la siguiente consulta de progreso.
let timer;

// Gestores de evento
// Consulta /estado y muestra el avance o el resultado de la última aplicación; no recibe parámetros.
async function progress() {
  clearTimeout(timer);
  try {
    const status = await (await fetch('/estado')).json();
    busy = status.estado === 'ejecutando';
    $('aplicar').disabled = busy;
    if (busy) {
      message('Aplicando: ' + status.procesados + ' de ' + status.total + ' laboratorios. Ahora: ' + status.laboratorio);
      timer = setTimeout(progress, 1000);
    } else if (status.estado === 'error') {message(status.mensaje);}
    else {
      const result = status.resultado || status.ultimo;
      if (result) {message('Última aplicación: ' + result.aplicados.length + ' aplicados, ' + (result.sinCambios?.length || 0) + ' sin cambios, ' + result.errores.length + ' fallidos.' + (result.errores.length ? ' IDs pendientes: ' + result.errores.map(e => e.idLab).join(', ') : ' Puedes revisar el catálogo.'));}
    }
  } catch {
    message('No se pudo consultar el progreso. Reintentando…');
    timer = setTimeout(progress, 3000);
  }
}
$('aplicar').onclick = async () => {
  if (busy) {return;}
  const count = Object.values(state).filter(s => s.estado === 'aprobado').length;
  if (!count) {return message('Primero aprueba las imágenes de algún laboratorio.');}
  busy = true; $('aplicar').disabled = true; message('Iniciando importación…');
  try { await post('/aplicar', {}); await progress(); }
  catch (error) { message(error.message); busy = false; $('aplicar').disabled = false; }
};
// Descarga candidatas, selecciones y progreso de búsqueda, y vuelve al primer laboratorio.
async function load() {
  if (busy) {return;}
  try {
    const data = await (await fetch('/api')).json(); labs = data.labs; state = data.state; index = 0;
    $('rastreo').textContent = data.progreso ? 'Búsqueda: ' + data.progreso.revisados + ' de ' + data.progreso.objetivo + ' laboratorios revisados.' : '';
    render();
  } catch { message('No se pudo cargar la revisión. Recarga la página.'); }
}
$('recargar').onclick = load;

// Ejecución
await load();
await progress();
