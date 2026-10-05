# Crear un componente

[Volver al índice](README.md)

## Elegir su nivel

- **Átomo:** una pieza básica, como botón o etiqueta.
- **Molécula:** combina piezas genéricas; no conoce laboratorios ni MySQL.
- **Organismo:** reúne contenido o comportamiento del dominio, como una tarjeta
  de laboratorio, el diálogo de filtros o una sección de contacto.

Primero busca si ya existe algo reutilizable. Los componentes y funciones nuevos
se nombran en inglés; las entidades y campos del dominio, textos visibles y URLs
se mantienen en español. No es necesario traducir props existentes al tocar estilos.

## Ejemplo completo: una nota informativa

Este ejemplo no tiene estado ni eventos y no necesita `"use client"`. Crea:

```text
components/atoms/InfoNote/
  InfoNote.tsx
  InfoNote.module.css
  InfoNote.stories.tsx
```

En `InfoNote.tsx`:

```tsx
import styles from "./InfoNote.module.css";

export function InfoNote({ text }: { text: string }) {
  return <p className={styles.note}>{text}</p>;
}
```

`text` es una prop obligatoria de tipo cadena. La función devuelve JSX; `className`
es el equivalente React de `class` en HTML. Las llaves insertan valores JavaScript.

En `InfoNote.module.css`:

```css
.note {
  margin: 0;
  padding: 1rem;
  border-inline-start: 0.25rem solid var(--color-accent);
  border-radius: 0.5rem;
  line-height: 1.5;
}
```

Un CSS Module limita los nombres de clase al componente, evitando colisiones con
otras `.note`. Usa los tokens de `app/globals.css` y los patrones de componentes
vecinos antes de añadir colores o estilos nuevos. No pongas estilos específicos
de esta nota en el CSS global.

En una página u organismo:

```tsx
import { InfoNote } from "@/components/atoms/InfoNote/InfoNote";

// Dentro del JSX del componente:
<InfoNote text="Selecciona una opción para continuar." />
```

El import llega al archivo concreto. No crees `index.ts` para reexportarlo.

## Si necesita interacción

Estado significa un dato que React conserva y cuyo cambio actualiza la interfaz.
Por ejemplo, un organismo genérico `Disclosure` podría alternar contenido:

```tsx
"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

export function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  function toggleOpen() {
    setOpen((current) => !current);
  }
  return <section>
    <button type="button" aria-expanded={open} aria-controls={contentId} onClick={toggleOpen}>
      {title}
    </button>
    <div id={contentId} hidden={!open}>{children}</div>
  </section>;
}
```

`children` es el contenido entre las etiquetas del componente. `useId` evita IDs
duplicados cuando hay varias instancias. El botón nativo ya funciona con teclado;
no lo sustituyas por un `div` con clic. Este ejemplo omite estilos para concentrarse
en la interacción; un componente incorporado al proyecto debe tener su historia
y seguir el diseño existente.

Coloca `"use client"` en la frontera más pequeña que necesite interacción. Una
página que consulta MySQL puede renderizar ese componente y pasarle datos públicos.
No conviertas toda la página a cliente sólo para manejar un botón.

## Antes de darlo por terminado

1. Añadir historias de sus estados relevantes (ver [Storybook](06-storybook.md)).
2. Probar texto largo, móvil, teclado, foco visible y estado vacío si aplica.
3. Mantener la lógica de datos en `lib/`; no consultar MySQL desde un componente cliente.
4. Mantener componentes de hasta 150 líneas separando responsabilidades.
5. Ejecutar lint y build; añadir pruebas cuando exista comportamiento que proteger.

No hace falta una prueba que sólo compruebe que existe una etiqueta `p`. Sí hace
falta proteger reglas, interacciones y regresiones. Para diálogos, verificar
Escape, retorno de foco y navegación es parte del comportamiento.
