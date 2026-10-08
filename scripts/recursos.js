import sharp from "sharp";
// Los originales y sus licencias se conservan; estas copias sirven la interfaz.
for (const nombre of ["unam", "labunam"]) {
    await sharp(`public/assets/logos/${nombre}.png`).resize({ width: 320, withoutEnlargement: true }).webp({ lossless: true }).toFile(`public/assets/logos/${nombre}.webp`);
}
