import { expect, test } from "@playwright/test";

test("cabecera, pie y menú funcionan con teclado", async ({ page }) => {
  const errores: string[] = [];
  page.on("pageerror", (error) => errores.push(error.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { name: "Encuentra el laboratorio que necesitas", exact: true })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toContainText("Coordinación de la Investigación Científica");
  const medidas = await page.evaluate(() => ({ ancho: innerWidth, contenido: document.documentElement.scrollWidth }));
  expect(medidas.contenido).toBeLessThanOrEqual(medidas.ancho);
  const boton = page.getByRole("button", { name: /Abrir menú|Cerrar menú/ });
  const menu = page.getByRole("navigation", { name: "Navegación", exact: true });
  await expect(menu).toBeHidden();
  await boton.click();
  await expect(menu).toBeVisible();
  await expect(boton).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(menu.getByRole("link", { name: "Inicio", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(menu.getByRole("link", { name: "Unidades de apoyo", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(boton).toBeFocused();
  expect(errores).toEqual([]);
});

test("las rutas heredadas conservan sus parámetros en un 301", async ({ request }) => {
  for (const tipo of ["nacionales", "universitarios", "unidades", "internacionales"]) {
    const respuesta = await request.get(`/${tipo}?q=rayos%20x&sede=sonora`, { maxRedirects: 0 });
    expect(respuesta.status()).toBe(301);
    const destino = new URL(respuesta.headers().location, "http://127.0.0.1:3000");
    expect(destino.pathname).toBe("/laboratorios");
    expect(destino.searchParams.get("tipo")).toBe(tipo);
    expect(destino.searchParams.get("q")).toBe("rayos x");
    expect(destino.searchParams.get("sede")).toBe("sonora");
  }
  const respuesta = await request.get("/buscar?q=microscopia&tipo=nacionales", { maxRedirects: 0 });
  expect(respuesta.status()).toBe(301);
  const destino = new URL(respuesta.headers().location, "http://127.0.0.1:3000");
  expect(destino.pathname).toBe("/laboratorios");
  expect(destino.searchParams.get("q")).toBe("microscopia");
  expect(destino.searchParams.get("tipo")).toBe("nacionales");
});
