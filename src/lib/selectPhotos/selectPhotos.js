function getPriority(nombre) {
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
function getTimestamp(archivo) {
  const marca = archivo.nombre.match(/^(\d{10,13})[_-]/)?.[1];
  return marca ? Number(marca) * (marca.length === 10 ? 1000 : 1) : 0;
}
export function selectPhotos(archivos) {
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
