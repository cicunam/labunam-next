import { expect, test } from "@playwright/test";

test("catálogo real, filtros vacíos y retícula adaptable", async ({ page }) => {
  await page.goto("/laboratorios?q=microscopia&tipo=nacionales");
  await expect(page.locator("[data-total]")).toHaveText("7 laboratorios");
  await expect(page.locator("[data-ficha]")).toHaveCount(7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Filtros", exact: true }).click();
  const modal = page.getByRole("dialog", { name: "Filtros", exact: true });
  await expect(modal).toBeVisible();
  expect(await modal.locator('input[type="radio"]:disabled').count()).toBeGreaterThan(0);
  await modal.getByRole("group", { name: "Área", exact: true }).getByRole("radio", { name: /^Biología/ }).check();
  await expect(modal.getByRole("button", { name: /^Ver \d+ laboratorio/ })).toBeEnabled();
  await modal.getByRole("button", { name: /^Ver \d+ laboratorio/ }).click();
  await expect(page).toHaveURL(/disciplina=biologia/);
  expect(new URL(page.url()).searchParams.get("q")).toBe("microscopia");
  expect(new URL(page.url()).searchParams.get("tipo")).toBe("nacionales");
  await page.goto("/laboratorios?q=busqueda-sin-coincidencias-xyz");
  await expect(page.getByRole("heading", { name: "Ningún laboratorio coincide con esta búsqueda" })).toBeVisible();
});

test("ficha solicita JSON una vez, navega pestañas y devuelve el foco", async ({ page }) => {
  let solicitudes = 0;
  page.on("request", (request) => { if (/\/api\/laboratorios\/\d+$/.test(request.url())) solicitudes++; });
  await page.goto("/laboratorios?q=microscopia&tipo=nacionales");
  const tarjeta = page.locator("[data-ficha]").first();
  await tarjeta.click();
  const ficha = page.getByRole("dialog");
  await expect(ficha.getByRole("tab", { name: "Servicios", exact: true })).toBeVisible();
  await ficha.getByRole("tab", { name: "Servicios", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(ficha.getByRole("tab", { name: "Equipamiento" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Escape");
  await expect(tarjeta).toBeFocused();
  await tarjeta.click();
  await expect(ficha.getByRole("tab", { name: "Servicios", exact: true })).toBeVisible();
  expect(solicitudes).toBe(1);
});

test("busca con sugerencias, atajo y recientes", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("/");
  const campo = page.getByRole("combobox", { name: "Qué buscas" });
  await expect(campo).toBeFocused();
  await campo.fill("micros");
  await expect(page.getByRole("listbox", { name: "Sugerencias" })).toBeVisible();
  const opcion = await page.getByRole("listbox", { name: "Sugerencias" }).getByRole("option").first().textContent();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/laboratorios\?q=/);
  expect(new URL(page.url()).searchParams.get("q")).toBe(opcion);
  await page.waitForLoadState("networkidle");
  await campo.fill(""); await campo.focus();
  await expect(page.getByRole("listbox", { name: "Sugerencias" }).getByRole("option").first()).toContainText("reciente");
});

test("carrusel permite paginar y cabecera permite volver al buscador", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const carrusel = page.getByRole("region", { name: "Noticias destacadas" });
  await carrusel.scrollIntoViewIfNeeded();
  await expect(carrusel.getByRole("button", { name: /Pausar|Reanudar/ })).toHaveCount(0);
  await carrusel.getByRole("button", { name: "Ir a noticia 2" }).click();
  await expect(carrusel.getByRole("button", { name: "Ir a noticia 2" })).toHaveAttribute("aria-pressed", "true");
  await carrusel.getByRole("button", { name: "Ir a noticia 3" }).click();
  await expect(carrusel.getByRole("button", { name: "Ir a noticia 3" })).toHaveAttribute("aria-pressed", "true");
  await carrusel.getByRole("button", { name: "Ir a noticia 1" }).click();
  await expect(carrusel.getByRole("button", { name: "Ir a noticia 1" })).toHaveAttribute("aria-pressed", "true");
  if (page.viewportSize()!.width >= 744) {
    await page.getByRole("button", { name: "Abrir el buscador" }).click();
    await expect(page.getByRole("combobox", { name: "Qué buscas" })).toBeFocused();
  }
});

test("API sólo expone campos públicos y valida identificadores", async ({ request, page }) => {
  expect((await request.get("/api/laboratorios/invalido")).status()).toBe(400);
  expect((await request.get("/api/laboratorios/999999999")).status()).toBe(404);
  await page.goto("/laboratorios?tipo=internacionales");
  const id = await page.locator("[data-ficha]").first().getAttribute("data-ficha");
  const respuesta = await request.get(`/api/laboratorios/${id}`);
  expect(respuesta.status()).toBe(200);
  expect(Object.keys(await respuesta.json()).sort()).toEqual(["idLab", "nombre", "tipo", "entidad", "sedeNombre", "ubicacion", "mapa", "servicios", "equipos", "distinciones", "sitio", "galeria"].sort());
});


test("una ficha fallida puede reintentarse sin conservar el error", async ({ page }) => {
  let intentos = 0;
  await page.route("**/api/laboratorios/*", async (route) => {
    intentos++;
    if (intentos === 1) await route.fulfill({ status: 503, json: { error: "No disponible" } });
    else await route.continue();
  });
  await page.goto("/laboratorios?tipo=internacionales");
  const tarjeta = page.locator("[data-ficha]").first();
  await tarjeta.click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("No se pudo cargar la ficha");
  await page.keyboard.press("Escape"); await tarjeta.click();
  await expect(page.getByRole("tab", { name: "Servicios", exact: true })).toBeVisible();
  expect(intentos).toBe(2);
});

test("limpiar todo restablece filtros pendientes y búsqueda aplicada", async ({ page }) => {
  for (const ruta of ["/laboratorios", "/laboratorios?q=microscopia&tipo=nacionales"]) {
    await page.goto(ruta);
    await page.getByRole("button", { name: "Filtros", exact: true }).click();
    const modal = page.getByRole("dialog", { name: "Filtros", exact: true });
    await modal.getByRole("group", { name: "Sede", exact: true }).getByRole("radio", { name: /^Ciudad de México/ }).check();
    await modal.getByRole("button", { name: "Limpiar todo", exact: true }).click();
    for (const grupo of await modal.getByRole("group").all()) {
      await expect(grupo.getByRole("radio", { name: "Cualquiera", exact: true })).toBeChecked();
    }
    const aplicar = modal.getByRole("button", { name: /^Ver 6\d\d laboratorios$/ });
    await expect(aplicar).toBeEnabled();
    await aplicar.click();
    await expect(page.locator("[data-total]")).toContainText(/6\d\d laboratorios/);
    await expect(page.getByRole("combobox", { name: "Qué buscas" })).toHaveValue("");
    await expect(page.getByLabel("Red", { exact: true })).toHaveValue("");
    await expect(page.getByLabel("Sede", { exact: true })).toHaveValue("");
  }
});
