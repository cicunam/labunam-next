# Crear un componente

[Volver al índice](README.md)

## Elegir su nivel

- **Átomo:** una pieza básica, como botón o etiqueta.
- **Molécula:** combina piezas genéricas; no conoce laboratorios ni MySQL.
- **Organismo:** reúne contenido o comportamiento del dominio, como una tarjeta
  de laboratorio, el diálogo de filtros o una sección de contacto.

Primero busca si ya existe algo reutilizable. Los componentes, props y funciones nuevos
se nombran en inglés; las entidades y campos del dominio, textos visibles y URLs
se mantienen en español. Los props de interfaz se escriben en inglés (`label`, `size`, `selected`, `criteria`).
Se conserva `laboratorio` como entidad y sus campos en español; por ejemplo,
`<ActiveChip label="Sede" value={laboratorio.sedeNombre} />`.

## Declaración y exportación

Usamos arrow functions con nombre para componentes y `export default Nombre;` al
final del archivo. Conservamos el nombre del componente al importarlo: con llaves
desde el barril `@/components`, sin llaves al importar directamente su archivo.
La declaración arrow y el export default también aplican a páginas y layouts,
incluidos los componentes de servidor `async`.

Los hooks y las funciones auxiliares pueden conservar declaraciones `function` y
exportaciones nombradas. Los exports de Next (`metadata`, `generateMetadata`,
`dynamic`, `GET`, etc.) conservan sus nombres y su formato requerido. Las historias
de Storybook también conservan su metadata por defecto y sus historias nombradas.

## Ejemplo completo: una nota informativa

Este ejemplo no tiene estado ni eventos y no necesita `"use client"`. Crea:

```text
src/components/atoms/InfoNote/
  InfoNote.jsx
  InfoNote.module.css
  InfoNote.stories.jsx
```

En `InfoNote.jsx`:

```jsx
import styles from "./InfoNote.module.css";
const InfoNote = ({ text }) => {
  return <p className={styles.note}>{text}</p>;
};

export default InfoNote;
```

`text` es la prop donde pasamos el texto; el ejemplo espera una cadena. La función devuelve JSX; `className`
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
otras `.note`. Usa los tokens de `src/app/globals.css` y los patrones de componentes
vecinos antes de añadir colores o estilos nuevos. No pongas estilos específicos
de esta nota en el CSS global.

Añade su reexport al único barril, `src/components/index.js`:

```js
export { default as InfoNote } from "./atoms/InfoNote/InfoNote";
```

En una página o layout:

```jsx
import { InfoNote } from "@/components";
// Dentro del JSX del componente:
<InfoNote text="Selecciona una opción para continuar." />;
```

Dentro de otro componente o de una historia, importa el archivo directamente:

```jsx
import InfoNote from "@/components/atoms/InfoNote/InfoNote";
```

Así evitamos el ciclo componente → barril → componente. Las cargas diferidas
(`lazy`/`import()`) también conservan la ruta directa. No crees barriles por nivel
o por componente ni añadas `"use client"` al barril central: cada componente
interactivo declara su propia frontera. El barril sólo reexporta componentes;
hooks, fixtures, historias y utilidades quedan fuera.

## Si necesita interacción

Estado significa un dato que React conserva y cuyo cambio actualiza la interfaz.
Por ejemplo, un organismo genérico `Disclosure` podría alternar contenido:

```jsx
"use client";
import { useId, useState } from "react";
const Disclosure = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  function toggleOpen() {
    setOpen((current) => !current);
  }
  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={toggleOpen}
      >
        {title}
      </button>
      <div
        id={contentId}
        hidden={!open}
      >
        {children}
      </div>
    </section>
  );
};

export default Disclosure;
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
3. Mantener la lógica de datos en `src/lib/`; no consultar MySQL desde un componente cliente.
4. Usar 150 líneas como señal para revisar responsabilidades, no como límite rígido. Nunca comprimir JSX para reducir líneas.
5. Ejecutar lint y build; añadir pruebas cuando exista comportamiento que proteger.

No hace falta una prueba que sólo compruebe que existe una etiqueta `p`. Sí hace
falta proteger reglas, interacciones y regresiones. Para diálogos, verificar
Escape, retorno de foco y navegación es parte del comportamiento.

## Código fácil de mantener

- Ejecutar `npm run format`; comprobar con `npm run format:check`.
- Separar imports, estado/datos, funciones de eventos e interfaz con líneas en blanco.
- Usar llaves en todos los `if`, aunque tengan una sola instrucción.
- Extraer eventos con varios pasos a funciones con nombre, por ejemplo `clearSearch`.
- Guardar un hook específico junto al componente. `useSearchSuggestions` es el ejemplo
  del buscador; no crear un hook para una operación que ya es fácil de entender.
- Comentar en español decisiones, supuestos y casos difíciles. Un comentario debe
  explicar por qué se conserva una caché o una entrada de historial, no repetir un `setState`.
- En funciones de datos complejas, describir qué reciben y qué devuelven. Actualizar
  el comentario si cambia la regla; evitar bloques de código viejo comentado.

Ejemplo del criterio de comentarios:

```js
// Compartimos la carga para evitar consultas duplicadas ante peticiones simultáneas.
if (pendingCatalog) {
  return pendingCatalog;
}
```

La portada (`src/app/page.jsx`) muestra cómo componer secciones de servidor y
pasar sólo los datos necesarios a los componentes interactivos.

ESLint verifica esta convención con `npm run lint`: componentes arrow y
`export default Nombre;` como última instrucción. Las historias de Storybook,
los hooks, las utilidades y los endpoints quedan fuera de esta regla de componentes.
Los exports propios de Next, como `metadata` y `generateMetadata`, pueden aparecer
antes del export por defecto. Prettier se encarga del formato; ESLint valida la estructura.

La convención de inglés incluye valores de variantes (`tone="neutral"`,
`size="small"`), clases CSS (`.badge`, `.button`), variables, tokens y atributos
técnicos. Los textos visibles y comentarios permanecen en español. Los nombres
y campos de entidades también conservan su contrato, por ejemplo `laboratorio.nombre`.
