import { expect, test } from "@playwright/test";
test("recorre áreas con flechas y conserva la búsqueda al seleccionar", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/laboratorios?q=Autoclave&disciplina=biologia");
  const track = page.getByRole("navigation", { name: "Disciplina", exact: true });
  const next = page.getByRole("button", { name: "Ver más disciplinas", exact: true });
  const overflow = await track.evaluate((el) => el.scrollWidth > el.clientWidth);
  if (overflow) {
    await expect(next).toBeVisible();
  }
  while (await track.evaluate((el) => el.scrollWidth - el.clientWidth - el.scrollLeft >= 8)) {
    const target = await track.evaluate((el) =>
      Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + el.clientWidth * 0.8),
    );
    await next.click();
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeCloseTo(target, 0);
    await expect
      .poll(() => next.isVisible())
      .toBe(await track.evaluate((el) => el.scrollWidth - el.clientWidth - el.scrollLeft >= 8));
  }
  await expect(next).toBeHidden();
  const last = track.getByRole("link", { name: "Humanidades", exact: true });
  const bounds = await track.boundingBox();
  const end = await last.boundingBox();
  expect(end.x).toBeGreaterThanOrEqual(bounds.x - 1);
  expect(end.x + end.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
  await last.click();
  await expect(page).toHaveURL(/disciplina=humanidades/);
  expect(new URL(page.url()).searchParams.get("q")).toBe("Autoclave");
  const previous = page.getByRole("button", { name: "Ver disciplinas anteriores" });
  if (overflow) {
    await expect(previous).toBeVisible();
  }
  while (await track.evaluate((el) => el.scrollLeft >= 8)) {
    const target = await track.evaluate((el) => Math.max(0, el.scrollLeft - el.clientWidth * 0.8));
    await previous.click();
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeCloseTo(target, 0);
    await expect
      .poll(() => previous.isVisible())
      .toBe(await track.evaluate((el) => el.scrollLeft >= 8));
  }
  await expect(previous).toBeHidden();
  await track.getByRole("link", { name: "Todas", exact: true }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get("disciplina")).toBeNull();
  expect(new URL(page.url()).searchParams.get("q")).toBe("Autoclave");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("permite deslizar las áreas con el dedo en móvil", async ({ page }) => {
  test.skip(page.viewportSize().width !== 375);
  await page.goto("/laboratorios");
  const track = page.getByRole("navigation", { name: "Disciplina", exact: true });
  await track.scrollIntoViewIfNeeded();
  const box = await track.boundingBox();
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setTouchEmulationEnabled", { enabled: true });
  const x = box.x + box.width - 20,
    y = box.y + box.height / 2;
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let step = 1; step <= 8; step++) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - step * 20, y }],
    });
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(50);
  await expect(page.getByRole("button", { name: "Ver disciplinas anteriores" })).toBeVisible();
  await session.detach();
});
test("arrastra áreas con el cursor sin activar enlaces", async ({ page }) => {
  await page.goto("/laboratorios");
  const track = page.getByRole("navigation", { name: "Disciplina", exact: true });
  await track.scrollIntoViewIfNeeded();
  const box = await track.boundingBox();
  const overflow = await track.evaluate((el) => el.scrollWidth - el.clientWidth);
  if (overflow === 0) {
    await expect(page.getByRole("button", { name: "Ver más disciplinas" })).toBeHidden();
    return;
  }
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 150, y, { steps: 10 });
  await page.mouse.up();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
  await expect(page).toHaveURL(/\/laboratorios$/);
  const firstVisible = track.getByRole("link").filter({ visible: true });
  const links = await firstVisible.all();
  let selected = false;
  for (const link of links) {
    const rect = await link.boundingBox();
    if (rect.x >= box.x && rect.x + rect.width <= box.x + box.width) {
      const href = await link.getAttribute("href");
      await link.click();
      await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"));
      selected = true;
      break;
    }
  }
  expect(selected).toBe(true);
});
