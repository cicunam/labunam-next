// LabUNAM
// Scripts
// fotos (genera las variantes WebP de las fotografías originales y su manifiesto)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { readdir, stat, mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { resolve, join } from "node:path";
import sharp from "sharp";
import { selectPhotos } from "./selectPhotos.js";

// Constantes
// --origen= tiene prioridad sobre LABUNAM_FOTOS_ORIGEN; --solo= limita la corrida a IDs separados por comas.
const argumentos = process.argv.slice(2);
const origen =
  argumentos.find((a) => a.startsWith("--origen="))?.slice(9) || process.env.LABUNAM_FOTOS_ORIGEN;
const solo = argumentos
  .find((a) => a.startsWith("--solo="))
  ?.slice(7)
  .split(",");
const destino = resolve("public/fotos");

// Utilidades
// Convierte un original en WebP de 480, 960 y 1440 px sin ampliarlo y devuelve su src y srcset.
async function generatePhoto(
  original, // String - Ruta del archivo original
  carpeta, // String - Identificador del laboratorio; nombra la carpeta de destino
  posicion, // Number - Posición de la foto en la selección; numera los archivos desde 1
) {
  const meta = await sharp(original).metadata();
  const ancho =
    meta.autoOrient?.width ??
    (meta.orientation && meta.orientation >= 5 ? meta.height : meta.width);
  if (!ancho) {
    throw new Error("imagen");
  }
  await mkdir(join(destino, carpeta), { recursive: true });
  const variantes = [];
  for (const solicitado of [480, 960, 1440]) {
    if (solicitado !== 480 && solicitado > ancho) {
      continue;
    }
    const nombre = `${posicion + 1}-${solicitado}.webp`;
    const ruta = join(destino, carpeta, nombre);
    const info = await sharp(original)
      .rotate()
      .resize({ width: solicitado, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`${ruta}.nuevo`);
    await rename(`${ruta}.nuevo`, ruta);
    variantes.push({ src: `/fotos/${carpeta}/${nombre}`, ancho: info.width });
  }
  return {
    src: variantes[Math.min(1, variantes.length - 1)].src,
    srcset: variantes.map((v) => `${v.src} ${v.ancho}w`).join(", "),
  };
}
// Recorre las carpetas numéricas del origen, genera sus fotos y publica el manifiesto.
// No recibe parámetros: lee el origen y la lista --solo= de las constantes del módulo.
async function run() {
  if (!origen || !(await stat(origen)).isDirectory()) {
    throw new Error("origen");
  }
  const manifiesto = solo
    ? JSON.parse(await readFile(join(destino, "manifiesto.json"), "utf8").catch(() => "{}"))
    : {};
  let generadas = 0,
    fallidas = 0;
  for (const carpeta of await readdir(origen, { withFileTypes: true })) {
    if (
      !carpeta.isDirectory() ||
      !/^[1-9]\d*$/.test(carpeta.name) ||
      (solo && !solo.includes(carpeta.name))
    ) {
      continue;
    }
    const directorio = join(origen, carpeta.name);
    const archivos = [];
    for (const entrada of await readdir(directorio, { withFileTypes: true })) {
      if (entrada.isFile()) {
        archivos.push({
          nombre: entrada.name,
          modificado: (await stat(join(directorio, entrada.name))).mtimeMs,
        });
      }
    }
    const fotos = [];
    for (const [posicion, archivo] of selectPhotos(archivos).entries()) {
      try {
        fotos.push(await generatePhoto(join(directorio, archivo.nombre), carpeta.name, posicion));
        generadas++;
      } catch {
        fallidas++;
        console.error(
          `No se pudo procesar la foto ${posicion + 1} del laboratorio ${carpeta.name}.`,
        );
      }
    }
    if (fotos.length) {
      manifiesto[carpeta.name] = fotos;
    } else {
      delete manifiesto[carpeta.name];
    }
  }
  await mkdir(destino, { recursive: true });
  // Publica el manifiesto completo de una vez; una corrida parcial conserva los otros IDs.
  await writeFile(
    join(destino, "manifiesto.json.nuevo"),
    JSON.stringify(manifiesto, null, 2) + "\n",
  );
  await rename(join(destino, "manifiesto.json.nuevo"), join(destino, "manifiesto.json"));
  console.log(
    `${Object.keys(manifiesto).length} laboratorios con fotos · ${generadas} fotos generadas · ${fallidas} fallidas`,
  );
  if (fallidas) {
    process.exitCode = 2;
  }
}

// Ejecución
run().catch(() => {
  console.error(
    "No se pudieron generar las fotos. Revisa la carpeta de origen y los permisos de lectura y escritura.",
  );
  process.exitCode = 1;
});
