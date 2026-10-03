import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pestana } from "./Pestana";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
const meta = {
  title: "Moléculas/Pestana",
  component: Pestana,
  args: { id: "pestana", panelId: "panel", seleccionada: true, children: "Servicios" },
} satisfies Meta<typeof Pestana>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Grupo: Story = {
  render: function GrupoPestanas() {
    const [activa, setActiva] = useState(0);
    const nombres = ["Servicios", "Equipamiento", "Distinciones"];
    return <div><div role="tablist" aria-label="Información" style={{ display: "flex", gap: 24, maxWidth: "90vw", overflowX: "auto" }}>
      {nombres.map((nombre, posicion) => <Pestana key={nombre} id={`pestana-${posicion}`} panelId={`panel-${posicion}`} seleccionada={activa === posicion} onClick={() => setActiva(posicion)} onKeyDown={(event) => {
        let siguiente = posicion;
        if (event.key === "ArrowRight") siguiente = (posicion + 1) % nombres.length;
        else if (event.key === "ArrowLeft") siguiente = (posicion + nombres.length - 1) % nombres.length;
        else if (event.key === "Home") siguiente = 0;
        else if (event.key === "End") siguiente = nombres.length - 1;
        else return;
        event.preventDefault(); setActiva(siguiente);
        event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]")[siguiente].focus();
      }}>{nombre}</Pestana>)}
    </div>{nombres.map((nombre, posicion) => <div key={nombre} id={`panel-${posicion}`} role="tabpanel" aria-labelledby={`pestana-${posicion}`} hidden={activa !== posicion} tabIndex={0}>Sin información registrada todavía.</div>)}</div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "Servicios" }));
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Equipamiento" })).toHaveAttribute("aria-selected", "true");
  },
};
