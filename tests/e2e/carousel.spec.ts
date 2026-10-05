import { expect, test } from "@playwright/test";

test("arrastra noticias, cruza ambos extremos y conserva enlaces al hacer clic", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: page.viewportSize()!.width === 1400 ? "reduce" : "no-preference" });
  await page.goto("/");
  const carousel = page.locator("[data-carrusel][data-listo]");
  await carousel.scrollIntoViewIfNeeded();
  const track = carousel.locator("[data-slides]");
  const bounds = (await track.boundingBox())!;
  const x = bounds.x + bounds.width / 2, y = bounds.y + bounds.height / 2;
  const touch = page.viewportSize()!.width < 744;
  const session = touch ? await page.context().newCDPSession(page) : null;
  if (session) await session.send("Emulation.setTouchEmulationEnabled", { enabled: true });
  async function swipe(direction: number) {
    if (session) {
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
      for (let step = 1; step <= 8; step++) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + direction * step * 20, y }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    } else {
      await page.mouse.move(x, y); await page.mouse.down();
      await page.mouse.move(x + direction * 160, y, { steps: 8 });
      await page.mouse.up();
    }
  }
  for (const expected of [2, 3, 1, 2]) {
    await swipe(-1);
    await expect(carousel.getByRole("button", { name: `Ir a noticia ${expected}` })).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => carousel.locator('[data-slide][data-activo][data-copy]').count()).toBe(0);
    await expect.poll(() => track.evaluate(el => {
      const active = el.querySelector<HTMLElement>("[data-activo]")!;
      return Math.abs(el.scrollLeft - active.offsetLeft + (el.clientWidth - active.offsetWidth) / 2);
    })).toBeLessThan(2);
    await expect(page).toHaveURL(/\/$/);
  }
  for (const expected of [1, 3]) {
    await swipe(1);
    await expect(carousel.getByRole("button", { name: `Ir a noticia ${expected}` })).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => carousel.locator('[data-slide][data-activo][data-copy]').count()).toBe(0);
    await expect.poll(() => track.evaluate(el => {
      const active = el.querySelector<HTMLElement>("[data-activo]")!;
      return Math.abs(el.scrollLeft - active.offsetLeft + (el.clientWidth - active.offsetWidth) / 2);
    })).toBeLessThan(2);
  }
  await expect(carousel.getByRole("link")).toHaveCount(3);
  if (session) { await session.send("Emulation.setTouchEmulationEnabled", { enabled: false }); await session.detach(); }
  await carousel.locator('[data-activo] a').click();
  await expect(page).toHaveURL(/laboratorios\?tipo=unidades/);
});
