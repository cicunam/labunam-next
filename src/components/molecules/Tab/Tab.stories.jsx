import { Tab } from "./Tab";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  title: "Moléculas/Tab",
  component: Tab,
  args: { id: "pestana", panelId: "panel", seleccionada: true, children: "Servicios" },
};
export default meta;
export const Grupo = {
  render: function TabGroup() {
    const [activa, setActive] = useState(0);
    const nombres = ["Servicios", "Equipamiento", "Distinciones"];
    return (
      <div>
        <div
          role="tablist"
          aria-label="Información"
          style={{ display: "flex", gap: 24, maxWidth: "90vw", overflowX: "auto" }}
        >
          {nombres.map((nombre, posicion) => (
            <Tab
              key={nombre}
              id={`pestana-${posicion}`}
              panelId={`panel-${posicion}`}
              seleccionada={activa === posicion}
              onClick={() => setActive(posicion)}
              onKeyDown={(event) => {
                let siguiente = posicion;
                if (event.key === "ArrowRight") {
                  siguiente = (posicion + 1) % nombres.length;
                } else if (event.key === "ArrowLeft") {
                  siguiente = (posicion + nombres.length - 1) % nombres.length;
                } else if (event.key === "Home") {
                  siguiente = 0;
                } else if (event.key === "End") {
                  siguiente = nombres.length - 1;
                } else {
                  return;
                }
                event.preventDefault();
                setActive(siguiente);
                event.currentTarget.parentElement
                  ?.querySelectorAll("[role=tab]")
                  [siguiente].focus();
              }}
            >
              {nombre}
            </Tab>
          ))}
        </div>
        {nombres.map((nombre, posicion) => (
          <div
            key={nombre}
            id={`panel-${posicion}`}
            role="tabpanel"
            aria-labelledby={`pestana-${posicion}`}
            hidden={activa !== posicion}
            tabIndex={0}
          >
            Sin información registrada todavía.
          </div>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "Servicios" }));
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Equipamiento" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};
