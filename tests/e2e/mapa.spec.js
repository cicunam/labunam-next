import { expect, test } from "@playwright/test";

test("el mapa selecciona estados y abre el catálogo correspondiente", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Encuentra laboratorios por estado" });
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole("button")).toHaveCount(32);
  const selector = section.getByLabel("Selecciona un estado");
  await selector.selectOption("queretaro");
  await expect(section.getByRole("heading", { name: "Querétaro", exact: true })).toBeVisible();
  const estado = section.getByRole("button", { name: /^Querétaro:/ });
  await expect(estado).toHaveAttribute("aria-pressed", "true");
  const total = Number((await estado.getAttribute("aria-label")).match(/: (\d+)/)[1]);
  expect(total).toBeGreaterThan(0);
  // Activar un estado con Enter comprueba el equivalente de teclado.
  const sonora = section.getByRole("button", { name: /^Sonora:/ });
  await sonora.focus();
  await page.keyboard.press("Enter");
  await expect(selector).toHaveValue("sonora");
  await selector.selectOption("queretaro");
  await section.getByRole("link", { name: "Ver laboratorios en Querétaro", exact: true }).click();
  await expect(page).toHaveURL(/\/laboratorios\?sede=queretaro$/);
  await expect(page.getByText(`${total} laboratorios`, { exact: true })).toBeVisible();
});

test("el mapa responde al clic y muestra estados sin registros sin ofrecer resultados falsos", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Encuentra laboratorios por estado" });
  const sonora = section.getByRole("button", { name: /^Sonora:/ });
  await sonora.click();
  await expect(section.getByLabel("Selecciona un estado")).toHaveValue("sonora");
  await section.getByLabel("Selecciona un estado").selectOption("aguascalientes");
  await expect(section.getByText("Todavía no hay laboratorios registrados", { exact: false })).toBeVisible();
  await expect(section.getByRole("link", { name: /^Ver laboratorios en/ })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
