// LabUNAM
// Pruebas de navegador
// paginas.spec (portada, catálogo, ficha, diálogo de contacto y solicitud de servicio)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { expect, test } from "@playwright/test";
import { FORM_FIELDS } from "../../src/lib/validacionSolicitud/validacionSolicitud.js";

// Pruebas
test("portada muestra tres redes con conteos y cuatro incorporaciones", async ({ page }) => {
  await page.goto("/");
  const redes = page.getByRole("region", { name: "Tres redes, una universidad" });
  await expect(redes.getByRole("link")).toHaveCount(3);
  for (const enlace of await redes.getByRole("link").all()) {
    expect(Number((await enlace.textContent())?.match(/(\d+) laboratorios/)?.[1])).toBeGreaterThan(
      0,
    );
  }
  await expect(
    page.getByRole("region", { name: "Recién incorporados" }).locator("[data-details]"),
  ).toHaveCount(4);
});

test("quitar el chip de rayos x recupera el catálogo completo", async ({ page }) => {
  await page.goto("/laboratorios?q=rayos%20x");
  expect(await page.locator("[data-details]").count()).toBeGreaterThan(0);
  await page.getByRole("link", { name: "Quitar q: rayos x" }).click();
  await expect(page.locator("[data-total]")).toContainText(/6\d\d laboratorios/);
  expect(await page.locator("[data-details]").count()).toBeGreaterThan(600);
});

test("filtrar por sede actualiza URL y reduce resultados", async ({ page }) => {
  await page.goto("/laboratorios");
  const inicial = await page.locator("[data-details]").count();
  await page.getByRole("button", { name: "Filtros", exact: true }).click();
  const modal = page.getByRole("dialog", { name: "Filtros" });
  await modal
    .getByRole("group", { name: "Sede", exact: true })
    .getByRole("radio", { name: /^Ciudad de México/ })
    .check();
  await expect(modal.getByRole("button", { name: /^Ver \d+ laboratorio/ })).toBeEnabled();
  await modal.getByRole("button", { name: /^Ver \d+ laboratorio/ }).click();
  await expect(page).toHaveURL(/sede=ciudad-de-mexico/);
  expect(await page.locator("[data-details]").count()).toBeLessThan(inicial);
});

test("ficha tiene URL propia, título, metadatos y pestañas", async ({ page }) => {
  await page.goto("/laboratorios?tipo=internacionales");
  const tarjeta = page.locator("[data-details]").first();
  const titulo = await tarjeta.textContent();
  await tarjeta.click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: titulo, exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/laboratorios\/\d+$/);
  await page.goBack();
  await expect(page).toHaveURL(/tipo=internacionales/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(tarjeta).toBeFocused();
  await page.goForward();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Cerrar ficha" }).click();
  await expect(page).toHaveURL(/tipo=internacionales/);
  await tarjeta.click();
  await page.reload();
  await expect(page).toHaveURL(/\/laboratorios\/\d+$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(titulo);
  await expect(page).toHaveTitle(`${titulo} | LabUNAM`);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Consulta sus servicios/,
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("tab", { name: "Ubicación" }).click();
  await expect(page.getByRole("tabpanel")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(titulo);
});

test("la navegación lleva a solicitud", async ({ page }) => {
  await page.goto("/");
  const menu = page.getByRole("navigation", { name: "Principal" });
  await expect(menu.getByRole("link", { name: "Contacto" })).toHaveCount(0);
  if (await menu.isVisible()) {
    await menu.getByRole("link", { name: "Solicitud" }).click();
  } else {
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page
      .getByRole("navigation", { name: "Navegación" })
      .getByRole("link", { name: "Solicitud" })
      .click();
  }
  await expect(page).toHaveURL(/\/solicitud$/);
  await expect(page).toHaveTitle("Solicitud | LabUNAM");
  await expect(
    page.getByRole("heading", { name: "Solicitud de servicio", level: 1 }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // En /solicitud el sobre flotante no aparece: el diálogo se abre desde la columna de orientación.
  await expect(page.getByRole("button", { name: "Contacto", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Ir a contacto" }).click();
  await expect(page.getByRole("dialog", { name: "Escríbenos" })).toBeVisible();
});
test("solicitud asociada a un laboratorio llega con el laboratorio de interés y valida el identificador", async ({
  page,
  request,
}) => {
  await page.goto("/laboratorios?tipo=internacionales");
  const tarjeta = page.locator("[data-details]").first();
  const nombre = await tarjeta.textContent();
  const id = await tarjeta.getAttribute("data-details");
  await page.goto(`/solicitud?laboratorio=${id}`);
  const campo = page.getByRole("combobox", { name: "Laboratorio de interés" });
  await expect(campo).toHaveValue(nombre);
  await expect(page.locator('input[name="id_laboratorio"]')).toHaveValue(id);
  await expect(page.getByRole("link", { name: /Ver la ficha del laboratorio/ })).toHaveAttribute(
    "href",
    `/laboratorios/${id}`,
  );
  // Vacío significa «necesito orientación»: no viaja ningún laboratorio.
  await campo.fill("");
  await expect(page.locator('input[name="id_laboratorio"]')).toHaveValue("");
  await expect(page.getByRole("link", { name: /Ver la ficha del laboratorio/ })).toHaveCount(0);
  expect((await request.get("/solicitud?laboratorio=no-valido")).status()).toBe(404);
  expect((await request.get("/solicitud?laboratorio=999999999")).status()).toBe(404);
});
test("el sobre flotante abre el diálogo de contacto sin enviar datos", async ({ page }) => {
  await page.goto("/laboratorios");
  const sobre = page.getByRole("button", { name: "Contacto", exact: true });
  const dialogo = page.getByRole("dialog", { name: "Escríbenos" });
  await expect(sobre).toBeInViewport();
  await page.mouse.wheel(0, 2000);
  await expect(sobre).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(dialogo).toBeHidden();

  // Teclado: se abre con Enter y Escape lo cierra devolviendo el foco al sobre.
  await sobre.focus();
  await page.keyboard.press("Enter");
  await expect(dialogo).toBeVisible();
  await expect(page).toHaveURL(/\/laboratorios$/);
  await expect(dialogo.getByLabel("Correo electrónico")).toBeDisabled();
  await expect(dialogo.getByRole("button", { name: "Envío no disponible" })).toBeDisabled();
  await expect(
    dialogo.getByText("El envío de mensajes aún no está disponible.", { exact: false }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialogo).toBeHidden();
  await expect(sobre).toBeFocused();

  // El botón de cerrar y el enlace a la solicitud también cierran el diálogo.
  await sobre.click();
  await dialogo.getByRole("button", { name: "Cerrar contacto" }).click();
  await expect(dialogo).toBeHidden();
  await sobre.click();
  await dialogo.getByRole("link", { name: "Haz una solicitud" }).click();
  await expect(page).toHaveURL(/\/solicitud$/);
  await expect(dialogo).toBeHidden();
});
test("el formulario de solicitud muestra campos según las opciones y no envía datos", async ({
  page,
}) => {
  const envios = [];
  page.on("request", (peticion) => {
    if (peticion.method() !== "GET") {
      envios.push(peticion.url());
    }
  });
  await page.goto("/solicitud");
  // El diálogo de contacto también tiene campos; las búsquedas se limitan al formulario de la página.
  const main = page.getByRole("main");
  const enviar = page.getByRole("button", { name: "Enviar solicitud" });
  await enviar.click();
  await expect(main.getByLabel("Nombre(s)")).toBeFocused();
  await main.getByLabel("Nombre(s)").fill("Persona de Prueba");
  await main.getByLabel("Primer apellido").fill("Ejemplo");
  await main.getByLabel("Correo electrónico").fill("persona@ejemplo.com");
  await main.getByLabel("Teléfono").fill("5512345678");
  await expect(main.getByRole("combobox", { name: "Estado" })).toHaveCount(0);
  await main.getByRole("combobox", { name: "País" }).fill("mexico");
  await expect(main.getByRole("combobox", { name: "Estado" })).toBeVisible();
  await page
    .getByLabel("Tipo de solicitante")
    .selectOption({ label: "Institución de educación superior" });
  await expect(main.getByRole("combobox", { name: "Dependencia" })).toHaveCount(0);
  await page
    .getByRole("combobox", { name: "Institución", exact: true })
    .fill("Universidad Nacional Autónoma de México");
  await expect(main.getByRole("combobox", { name: "Dependencia" })).toBeVisible();
  await main.getByLabel("Tipo de solicitante").selectOption({ label: "Empresa" });
  await expect(page.getByRole("combobox", { name: "Institución", exact: true })).toHaveCount(0);
  await main.getByLabel("Nombre de la empresa").fill("Empresa de Ejemplo");
  await page.getByRole("radio", { name: "Análisis o prueba" }).check();
  await page
    .getByLabel("¿En cuánto tiempo necesitas el resultado?")
    .selectOption({ label: "Más de 3 días" });
  await expect(main.getByLabel("Cantidad de días")).toBeVisible();
  await main.getByLabel("Cantidad de días").fill("10");
  await page
    .getByLabel("Descripción del análisis o prueba")
    .fill("Análisis de una muestra ficticia.");
  await main.getByRole("combobox", { name: "País" }).fill("Pais inexistente");
  await enviar.click();
  await expect(main.getByRole("combobox", { name: "País" })).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("");
  await main.getByRole("combobox", { name: "País" }).fill("España");
  await expect(main.getByRole("combobox", { name: "Estado" })).toHaveCount(0);
  await enviar.click();
  await expect(page.getByRole("status")).toContainText("no se envió información");
  // Los nombres del formulario deben coincidir con los que acepta la validación del servidor.
  const nombres = await page.locator("form").evaluate((form) => [...new FormData(form).keys()]);
  expect(nombres.filter((nombre) => !FORM_FIELDS.includes(nombre))).toEqual([]);
  const aviso = page.getByRole("link", { name: /aviso de privacidad integral/ });
  await expect(aviso).toHaveAttribute("href", "https://avisos-privacidad.cic.unam.mx/");
  await expect(aviso).toHaveAttribute("target", "_blank");
  expect(envios).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("laboratorio de interés distingue homónimos por su entidad y guarda el elegido", async ({
  page,
  request,
}) => {
  const sugerir = async (q) =>
    (await (await request.get(`/api/laboratorios/sugerencias?q=${encodeURIComponent(q)}`)).json())
      .laboratorios;
  const laboratorios = await sugerir("difraccion de rayos x");
  expect(laboratorios.length).toBeLessThanOrEqual(15);
  expect(Object.keys(laboratorios[0]).sort()).toEqual(["entidad", "idLab", "nombre"]);
  expect(await sugerir("m")).toEqual([]);
  // Dos laboratorios del catálogo comparten nombre y sólo los distingue su entidad.
  const nombre = laboratorios.find(
    (item, index) => laboratorios.findIndex((otro) => otro.nombre === item.nombre) !== index,
  )?.nombre;
  expect(nombre).toBeTruthy();
  const [, segundo] = laboratorios.filter((item) => item.nombre === nombre);

  await page.goto("/solicitud");
  const campo = page.getByRole("combobox", { name: "Laboratorio de interés" });
  const oculto = page.locator('input[name="id_laboratorio"]');
  const lista = page.getByRole("listbox", { name: "Sugerencias de laboratorio de interés" });
  await campo.fill("difraccion de rayos x");
  // Cada opción muestra el nombre y, debajo, la entidad.
  const opcion = lista.getByRole("option").filter({ hasText: segundo.entidad }).filter({
    hasText: nombre,
  });
  await expect(opcion).toHaveCount(1);
  await opcion.click();
  await expect(lista).toBeHidden();
  await expect(campo).toHaveValue(nombre);
  await expect(oculto).toHaveValue(String(segundo.idLab));
  // Bajo el campo quedan la entidad del elegido y el enlace a su ficha.
  const ficha = page.getByRole("link", { name: /Ver la ficha del laboratorio/ });
  await expect(ficha).toHaveAttribute("href", `/laboratorios/${segundo.idLab}`);
  await expect(ficha.locator("..")).toContainText(segundo.entidad);
  // Editar el texto borra la elección; un nombre repetido escrito a mano no basta.
  await campo.fill(`${nombre} `);
  await campo.fill(nombre);
  await expect(oculto).toHaveValue("");
  expect(await campo.evaluate((input) => input.validationMessage)).toBe(
    "Elige un laboratorio de la lista o deja el campo vacío.",
  );
  // Un texto que no corresponde a ninguna sugerencia también bloquea el envío.
  await campo.fill("Laboratorio que no existe");
  await expect(oculto).toHaveValue("");
  expect(await campo.evaluate((input) => input.validationMessage)).toBe(
    "Elige un laboratorio de la lista o deja el campo vacío.",
  );
});
test("el formulario advierte los mismos errores de texto que valida el servidor", async ({
  page,
}) => {
  await page.goto("/solicitud");
  // El diálogo de contacto también tiene campos; las búsquedas se limitan al formulario de la página.
  const main = page.getByRole("main");
  const mensaje = (campo) => campo.evaluate((input) => input.validationMessage);
  const correo = main.getByLabel("Correo electrónico");
  await correo.fill("a@b");
  expect(await mensaje(correo)).toBe("Escribe un correo electrónico válido.");
  await correo.fill("persona@ejemplo.com");
  expect(await mensaje(correo)).toBe("");
  // La longitud se mide sin los espacios sobrantes, como en el servidor.
  const nombre = main.getByLabel("Nombre(s)");
  await nombre.fill("  A  ");
  expect(await mensaje(nombre)).toBe("Debe tener entre 2 y 50 caracteres.");
  await page.getByRole("radio", { name: "Capacitación" }).check();
  const descripcion = main.getByLabel("Descripción de la capacitación");
  await descripcion.fill("Más información en www.ejemplo.com");
  expect(await mensaje(descripcion)).toBe("No incluyas enlaces ni etiquetas HTML.");
  await page
    .getByLabel("Tipo de solicitante")
    .selectOption({ label: "Institución de educación superior" });
  const institucion = page.getByRole("combobox", { name: "Institución", exact: true });
  await institucion.fill("Universidad <b>Nueva</b>");
  await expect.poll(() => mensaje(institucion)).toBe("No incluyas enlaces ni etiquetas HTML.");
  // Al enviar, el primer campo con error recibe el foco y no se anuncia ningún envío.
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(nombre).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("");
});
test("laboratorio de interés sugiere los mismos laboratorios que el buscador del catálogo", async ({
  page,
  request,
}) => {
  // «rayos x» aparece sobre todo en equipos y servicios, no sólo en nombres.
  const { laboratorios } = await (
    await request.get("/api/laboratorios/sugerencias?q=rayos%20x")
  ).json();
  await page.goto("/laboratorios?q=rayos%20x");
  const tarjetas = page.locator("[data-details]");
  await expect(tarjetas.first()).toBeVisible();
  const catalogo = await tarjetas.evaluateAll((nodos) =>
    nodos.map((nodo) => Number(nodo.getAttribute("data-details"))),
  );
  expect(laboratorios.map(({ idLab }) => idLab)).toEqual(catalogo.slice(0, laboratorios.length));
  expect(laboratorios.length).toBe(Math.min(15, catalogo.length));
});
test("país y estado usan el autocompletado del portal con teclado y sin desbordarse", async ({
  page,
}) => {
  await page.goto("/solicitud");
  const main = page.getByRole("main");
  const pais = main.getByRole("combobox", { name: "País" });
  const lista = page.getByRole("listbox", { name: "Sugerencias de país" });
  // Al enfocar sin texto se puede recorrer la lista completa, como un selector.
  await pais.focus();
  await expect(lista).toBeVisible();
  expect(await lista.getByRole("option").count()).toBeGreaterThan(100);
  // Filtra sin acentos y se elige con flechas y Enter; la clave viaja en el campo oculto.
  await pais.fill("mexi");
  await expect(lista.getByRole("option")).toHaveCount(1);
  await expect(lista.getByRole("option").first().locator("mark")).toHaveText("Mexi");
  await page.keyboard.press("ArrowDown");
  await expect(pais).toHaveAttribute("aria-activedescendant", "request-pais-option-0");
  await page.keyboard.press("Enter");
  await expect(lista).toBeHidden();
  await expect(pais).toHaveValue("Mexico");
  await expect(main.locator('input[name="id_pais"]')).toHaveValue("MEX");
  // La lista queda dentro de la pantalla y debajo del campo.
  const estado = main.getByRole("combobox", { name: "Estado" });
  await estado.fill("ja");
  const sugerencias = page.getByRole("listbox", { name: "Sugerencias de estado" });
  await expect(sugerencias).toBeVisible();
  const campo = await estado.boundingBox();
  const caja = await sugerencias.boundingBox();
  expect(caja.y).toBeGreaterThanOrEqual(campo.y + campo.height);
  expect(caja.x).toBeGreaterThanOrEqual(0);
  expect(caja.x + caja.width).toBeLessThanOrEqual(page.viewportSize().width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(sugerencias).toBeHidden();
  await expect(estado).toBeFocused();
});
test("la ruta de instituciones sugiere por siglas y no busca textos cortos", async ({
  request,
}) => {
  const unam = await (await request.get("/api/solicitudes/instituciones?q=unam")).json();
  expect(unam.instituciones[0]).toMatchObject({
    nombre: "Universidad Nacional Autonoma de Mexico",
    siglas: "UNAM",
  });
  expect(unam.instituciones.length).toBeLessThanOrEqual(15);
  expect(
    (await (await request.get("/api/solicitudes/instituciones?q=u")).json()).instituciones,
  ).toEqual([]);
});
test("una ficha inexistente responde 404", async ({ request }) => {
  expect((await request.get("/laboratorios/no-valido")).status()).toBe(404);
  expect((await request.get("/laboratorios/999999999")).status()).toBe(404);
});

test("solicitud de servicio conserva el laboratorio y explica que el formulario está pendiente", async ({
  page,
}) => {
  await page.goto("/laboratorios?tipo=internacionales");
  const tarjeta = page.locator("[data-details]").first();
  const nombre = await tarjeta.textContent();
  const id = await tarjeta.getAttribute("data-details");
  const campo = page.getByRole("combobox", { name: "Laboratorio de interés" });
  await tarjeta.click();
  await page.getByRole("link", { name: "Solicitar un servicio" }).click();
  await expect(page).toHaveURL(new RegExp(`/solicitud\\?laboratorio=${id}$`));
  await expect(campo).toHaveValue(nombre);
  await expect(
    page.getByText("El envío de solicitudes aún no está disponible", { exact: false }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goBack();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("link", { name: "Solicitar un servicio" }).click();
  await expect(page).toHaveURL(new RegExp(`/solicitud\\?laboratorio=${id}$`));
  await page.reload();
  await expect(campo).toHaveValue(nombre);
});
test("cerrar el modal conserva posición y filtros", async ({ page }) => {
  await page.goto("/laboratorios?q=microscopia");
  const tarjeta = page.locator("[data-details]").last();
  await tarjeta.scrollIntoViewIfNeeded();
  await tarjeta.evaluate((elemento) =>
    elemento.addEventListener(
      "click",
      () => {
        elemento.setAttribute("data-scroll-prueba", String(scrollY));
      },
      { once: true },
    ),
  );
  await tarjeta.click();
  const posicion = Number(await tarjeta.getAttribute("data-scroll-prueba"));
  await expect(page).toHaveURL(/\/laboratorios\/\d+$/);
  await expect(page.getByRole("link", { name: "Solicitar un servicio" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/laboratorios\?q=microscopia$/);
  await expect(tarjeta).toBeFocused();
  expect(Math.abs((await page.evaluate(() => scrollY)) - posicion)).toBeLessThan(3);
});
