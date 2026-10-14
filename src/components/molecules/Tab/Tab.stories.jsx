// LabUNAM
// Historias
// Tab.stories (pestañas de la ficha con navegación por teclado)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

// Componentes
import Tab from "./Tab";

// Configuración de la historia
const meta = {
  title: "Moléculas/Tab",
  component: Tab,
  args: { id: "pestana", panelId: "panel", selected: true, children: "Servicios" },
};
export default meta;

// Historias
// Grupo de pestañas con paneles, flechas, Inicio y Fin
const Group = {
  // Lista de pestañas controlada por estado local, como en la ficha de laboratorio
  render: function TabGroup() {
    const [activeIndex, setActive] = useState(0);
    const names = ["Servicios", "Equipamiento", "Distinciones"];
    return (
      <div>
        <div
          role="tablist"
          aria-label="Información"
          style={{ display: "flex", gap: 24, maxWidth: "90vw", overflowX: "auto" }}
        >
          {names.map((name, position) => (
            <Tab
              key={name}
              id={`tab-${position}`}
              panelId={`panel-${position}`}
              selected={activeIndex === position}
              onClick={() => setActive(position)}
              onKeyDown={(event) => {
                let nextIndex = position;
                if (event.key === "ArrowRight") {
                  nextIndex = (position + 1) % names.length;
                } else if (event.key === "ArrowLeft") {
                  nextIndex = (position + names.length - 1) % names.length;
                } else if (event.key === "Home") {
                  nextIndex = 0;
                } else if (event.key === "End") {
                  nextIndex = names.length - 1;
                } else {
                  return;
                }
                event.preventDefault();
                setActive(nextIndex);
                event.currentTarget.parentElement
                  ?.querySelectorAll("[role=tab]")
                  [nextIndex].focus();
              }}
            >
              {name}
            </Tab>
          ))}
        </div>
        {names.map((name, position) => (
          <div
            key={name}
            id={`panel-${position}`}
            role="tabpanel"
            aria-labelledby={`tab-${position}`}
            hidden={activeIndex !== position}
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
export { Group };
