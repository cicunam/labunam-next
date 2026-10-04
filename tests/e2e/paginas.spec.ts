import { expect, test } from "@playwright/test";

test("portada muestra tres redes con conteos y cuatro incorporaciones", async ({ page }) => {
  await page.goto("/");
  const redes = page.getByRole("region", { name: "Tres redes, una universidad" });
  await expect(redes.getByRole("link")).toHaveCount(3);
  for (const enlace of await redes.getByRole("link").all()) expect(Number((await enlace.textContent())?.match(/(\d+) laboratorios/)?.[1])).toBeGreaterThan(0);
  await expect(page.getByRole("region", { name: "Recién incorporados" }).locator("[data-ficha]")).toHaveCount(4);
});

test("quitar el chip de rayos x recupera el catálogo completo", async ({ page }) => {
  await page.goto("/laboratorios?q=rayos%20x");
  expect(await page.locator("[data-ficha]").count()).toBeGreaterThan(0);
  await page.getByRole("link", { name: "Quitar q: rayos x" }).click();
  await expect(page.locator("[data-total]")).toContainText(/6\d\d laboratorios/);
  expect(await page.locator("[data-ficha]").count()).toBeGreaterThan(600);
});

test("filtrar por sede actualiza URL y reduce resultados", async ({ page }) => {
  await page.goto("/laboratorios");
  const inicial = await page.locator("[data-ficha]").count();
  await page.getByRole("button", { name: "Filtros", exact: true }).click();
  const modal = page.getByRole("dialog", { name: "Filtros" });
  await modal.getByRole("group", { name: "Sede", exact: true }).getByRole("radio", { name: /^Ciudad de México/ }).check();
  await expect(modal.getByRole("button", { name: /^Ver \d+ laboratorio/ })).toBeEnabled();
  await modal.getByRole("button", { name: /^Ver \d+ laboratorio/ }).click();
  await expect(page).toHaveURL(/sede=ciudad-de-mexico/);
  expect(await page.locator("[data-ficha]").count()).toBeLessThan(inicial);
});

test("ficha tiene URL propia, título, metadatos y pestañas", async ({ page }) => {
  await page.goto("/laboratorios?tipo=internacionales");
  const tarjeta = page.locator("[data-ficha]").first();
  const titulo = await tarjeta.textContent();
  await tarjeta.click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: titulo!, exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Abrir página de la ficha" }).click();
  await expect(page).toHaveURL(/\/laboratorios\/\d+$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(titulo!);
  await expect(page).toHaveTitle(`${titulo} | LabUNAM`);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Consulta sus servicios/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("tab", { name: "Ubicación" }).click();
  await expect(page.getByRole("tabpanel")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload(); await expect(page.getByRole("heading", { level: 1 })).toHaveText(titulo!);
});

test("contacto explica el envío deshabilitado y no solicita datos", async ({ page }) => {
  await page.goto("/contacto");
  await expect(page).toHaveTitle("Contacto | LabUNAM");
  await expect(page.getByRole("heading", { name: "Contacto", exact: true, level: 1 })).toBeVisible();
  await expect(page.getByLabel("Correo electrónico", { exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Envío no disponible" })).toBeDisabled();
  await expect(page.getByText("El envío de mensajes aún no está disponible.", { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("una ficha inexistente responde 404", async ({ request }) => {
  expect((await request.get("/laboratorios/no-valido")).status()).toBe(404);
  expect((await request.get("/laboratorios/999999999")).status()).toBe(404);
});
