// LabUNAM
// Pruebas de navegador
// paginas.spec (portada, catálogo, ficha, contacto y solicitud de servicio)
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

test("contacto explica el envío deshabilitado y no solicita datos", async ({ page }) => {
  await page.goto("/contacto");
  await expect(page).toHaveTitle("Contacto | LabUNAM");
  await expect(
    page.getByRole("heading", { name: "Contacto", exact: true, level: 1 }),
  ).toBeVisible();
  await expect(page.getByLabel("Correo electrónico", { exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Envío no disponible" })).toBeDisabled();
  await expect(
    page.getByText("El envío de mensajes aún no está disponible.", { exact: false }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
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
  await page.getByRole("link", { name: "Ir a contacto" }).click();
  await expect(page).toHaveURL(/\/contacto$/);
});
test("solicitud asociada a un laboratorio valida el identificador", async ({ page, request }) => {
  await page.goto("/laboratorios?tipo=internacionales");
  const tarjeta = page.locator("[data-details]").first();
  const nombre = await tarjeta.textContent();
  const id = await tarjeta.getAttribute("data-details");
  await page.goto(`/solicitud?laboratorio=${id}`);
  await expect(page.getByRole("heading", { name: nombre, exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Volver al laboratorio" }).click();
  await expect(page).toHaveURL(new RegExp(`/laboratorios/${id}$`));
  expect((await request.get("/solicitud?laboratorio=no-valido")).status()).toBe(404);
  expect((await request.get("/solicitud?laboratorio=999999999")).status()).toBe(404);
});
test("el sobre flotante abre contacto desde cualquier página", async ({ page }) => {
  await page.goto("/laboratorios");
  const sobre = page.getByRole("link", { name: "Contacto", exact: true });
  await expect(sobre).toBeInViewport();
  await page.mouse.wheel(0, 2000);
  await expect(sobre).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await sobre.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contacto$/);
  await expect(
    page.getByRole("heading", { name: "Contacto", exact: true, level: 1 }),
  ).toBeVisible();
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
  const enviar = page.getByRole("button", { name: "Enviar solicitud" });
  await enviar.click();
  await expect(page.getByLabel("Nombre(s)")).toBeFocused();
  await page.getByLabel("Nombre(s)").fill("Persona de Prueba");
  await page.getByLabel("Primer apellido").fill("Ejemplo");
  await page.getByLabel("Correo electrónico").fill("persona@ejemplo.com");
  await page.getByLabel("Teléfono").fill("5512345678");
  await expect(page.getByLabel("Estado")).toHaveCount(0);
  await page.getByLabel("País").fill("mexico");
  await expect(page.getByLabel("Estado")).toBeVisible();
  await page
    .getByLabel("Tipo de solicitante")
    .selectOption({ label: "Institución de educación superior" });
  await expect(page.getByLabel("Dependencia")).toHaveCount(0);
  await page
    .getByRole("combobox", { name: "Institución", exact: true })
    .fill("Universidad Nacional Autónoma de México");
  await expect(page.getByLabel("Dependencia")).toBeVisible();
  await page.getByLabel("Tipo de solicitante").selectOption({ label: "Empresa" });
  await expect(page.getByRole("combobox", { name: "Institución", exact: true })).toHaveCount(0);
  await page.getByLabel("Nombre de la empresa").fill("Empresa de Ejemplo");
  await page.getByRole("radio", { name: "Análisis o prueba" }).check();
  await page
    .getByLabel("¿En cuánto tiempo necesitas el resultado?")
    .selectOption({ label: "Más de 3 días" });
  await expect(page.getByLabel("Cantidad de días")).toBeVisible();
  await page.getByLabel("Cantidad de días").fill("10");
  await page
    .getByLabel("Descripción del análisis o prueba")
    .fill("Análisis de una muestra ficticia.");
  await page.getByLabel("País").fill("Pais inexistente");
  await enviar.click();
  await expect(page.getByLabel("País")).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("");
  await page.getByLabel("País").fill("España");
  await expect(page.getByLabel("Estado")).toHaveCount(0);
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
  await tarjeta.click();
  await page.getByRole("link", { name: "Solicitar un servicio" }).click();
  await expect(page).toHaveURL(new RegExp(`/solicitud\\?laboratorio=${id}$`));
  await expect(page.getByRole("heading", { name: nombre, exact: true })).toBeVisible();
  await expect(
    page.getByText("El envío de solicitudes aún no está disponible", { exact: false }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goBack();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("link", { name: "Solicitar un servicio" }).click();
  await expect(page).toHaveURL(new RegExp(`/solicitud\\?laboratorio=${id}$`));
  await page.reload();
  await expect(page.getByRole("heading", { name: nombre, exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Volver al laboratorio" }).click();
  await expect(page).toHaveURL(new RegExp(`/laboratorios/${id}$`));
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
