// LabUNAM
// Pruebas unitarias
// api.test (URL pedida y reacción a cada respuesta de las rutas de API)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { afterEach, expect, it, vi } from "vitest";
import { fetchFilterCounts, fetchLaboratorioDetails } from "./api";

// Simulaciones
// fetch se sustituye para comprobar la URL pedida sin levantar el servidor.
const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);
afterEach(() => {
  fetchMock.mockReset();
});

// Pruebas
it("pide la ficha por su id y devuelve el JSON", async () => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ idLab: 7 }) });
  expect(await fetchLaboratorioDetails(7)).toEqual({ idLab: 7 });
  expect(fetchMock).toHaveBeenCalledWith("/api/laboratorios/7");
});
it("avisa con un mensaje visible cuando la ficha no responde bien", async () => {
  fetchMock.mockResolvedValue({ ok: false });
  await expect(fetchLaboratorioDetails(7)).rejects.toThrow("No se pudo cargar la ficha.");
});
it("pide los conteos sólo con los criterios no vacíos y pasa la señal de cancelación", async () => {
  const controller = new AbortController();
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ total: 2, filters: [] }) });
  expect(
    await fetchFilterCounts({ q: "rayos x", tipo: "", sede: "queretaro" }, controller.signal),
  ).toEqual({ total: 2, filters: [] });
  expect(fetchMock).toHaveBeenCalledWith("/api/filtros?q=rayos+x&sede=queretaro", {
    signal: controller.signal,
  });
});
it("avisa cuando los conteos no responden bien", async () => {
  fetchMock.mockResolvedValue({ ok: false });
  await expect(fetchFilterCounts({}, new AbortController().signal)).rejects.toThrow(
    "No se pudieron actualizar los conteos.",
  );
});
