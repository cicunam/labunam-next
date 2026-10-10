import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function readPhotos() {
  try {
    const base = JSON.parse(
      await readFile(join(process.cwd(), "public/fotos/manifiesto.json"), "utf8").catch(() => "{}"),
    );
    const web = JSON.parse(
      await readFile(join(process.cwd(), "public/fotos/manifiesto-web.json"), "utf8").catch(
        () => "{}",
      ),
    );
    const manifiesto = { ...web, ...base };
    return manifiesto;
  } catch {
    return {};
  }
}
