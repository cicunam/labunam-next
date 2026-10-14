// LabUNAM
// Utilidades compartidas
// selectPhotos (elección de fotografías originales por nombre de archivo)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Utilidades

// Peso de una foto según su nombre: carruseles por número, luego fondo, infraestructura y antecedentes.
function getPriority(
  nombre, // String - Nombre del archivo original
) {
  const n = nombre.toLowerCase();
  const carrusel = n.match(/carrusel\s*(\d+)/);
  if (carrusel) {
    return 100 + Number(carrusel[1]);
  }
  if (n.includes("fondo")) {
    return 200;
  }
  if (n.includes("infra")) {
    return 300;
  }
  if (n.includes("antece")) {
    return 400;
  }
  return 500;
}
// Marca de tiempo en milisegundos del prefijo del nombre (segundos o milisegundos), o 0 si no tiene.
function getTimestamp(
  archivo, // Object - Archivo original; se lee archivo.nombre
) {
  const marca = archivo.nombre.match(/^(\d{10,13})[_-]/)?.[1];
  return marca ? Number(marca) * (marca.length === 10 ? 1000 : 1) : 0;
}

// Definición del módulo
// Hasta tres imágenes por prioridad; de cada carrusel repetido conserva la subida más reciente.
export function selectPhotos(
  archivos, // Array - Archivos originales (Object) con nombre y modificado (fecha del archivo)
) {
  const posiciones = new Map();
  const otras = [];
  for (const archivo of archivos) {
    if (!/\.(jpe?g|png|webp)$/i.test(archivo.nombre)) {
      continue;
    }
    const peso = getPriority(archivo.nombre);
    if (peso < 200) {
      const previa = posiciones.get(peso);
      if (
        !previa ||
        getTimestamp(archivo) > getTimestamp(previa) ||
        (getTimestamp(archivo) === getTimestamp(previa) && archivo.modificado > previa.modificado)
      ) {
        posiciones.set(peso, archivo);
      }
    } else {
      otras.push(archivo);
    }
  }
  return [...posiciones.values(), ...otras]
    .sort(
      (a, b) =>
        getPriority(a.nombre) - getPriority(b.nombre) || a.nombre.localeCompare(b.nombre, "es"),
    )
    .slice(0, 3);
}
