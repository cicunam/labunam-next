# Trabajar con Storybook

[Volver al índice](README.md)

## Para qué sirve

Storybook muestra componentes aislados de la aplicación. Una **historia** es un
estado reproducible: texto largo, botón deshabilitado, ficha cargando, resultado
vacío. Sirve para desarrollar y revisar diseño sin entrar al portal ni consultar
MySQL. No reemplaza comprobar que el componente funciona dentro de la página real.

```sh
npm run storybook
```

Abre [Storybook local](http://localhost:6006). Puedes dejarlo corriendo junto al
portal (3000) en otra terminal. `Ctrl+C` detiene sólo el proceso de esa terminal.

## Crear la historia de InfoNote

Siguiendo el [ejemplo de componente](03-componentes.md), escribe
`src/components/atoms/InfoNote/InfoNote.stories.jsx`:

```jsx
import InfoNote from "./InfoNote";
const meta = {
  title: "Átomos/InfoNote",
  component: InfoNote,
  args: { text: "Selecciona una opción para continuar." },
};
export default meta;
export const Default = {};
export const LongText = {
  args: {
    text: "Puedes consultar la información del laboratorio y revisar sus servicios antes de iniciar una solicitud de contacto.",
  },
};
```

`title` determina dónde aparece en el menú. `component` indica qué se renderiza.
`args` contiene sus props; cada exportación define una historia. Los ejemplos
usan objetos JavaScript normales, sin anotaciones de tipos.

No hay que registrar cada archivo manualmente: `.storybook/main.js` busca
`src/components/**/*.stories.jsx`. Si no aparece, verifica el nombre y la extensión.

## Controles y eventos

En **Controls** puedes cambiar las props que Storybook detecta. Para una lista
cerrada añade `argTypes`, tomando `Button.stories.jsx` como ejemplo.
Si el componente recibe un callback, usa `fn()` de `storybook/test` como valor
del callback en la historia. Así se registra la interacción sin ejecutar servicios
reales. No uses solicitudes reales ni datos personales para simular un estado.

Para organismos, reutiliza fixtures de `src/components/organisms/fixtures/` cuando
corresponda. Un componente asíncrono que depende directamente de MySQL no debe
llevar esa dependencia a Storybook: muestra la pieza visual con datos ficticios.

## Revisión visual y accesibilidad

1. Selecciona una historia en el menú lateral.
2. En la barra de viewport revisa Móvil (375), Tableta (1024) y Escritorio (1400).
3. Prueba texto largo y estados relevantes desde Controls o sus historias.
4. Usa Tab, Enter, Espacio y Escape donde corresponda; comprueba foco visible.
5. Abre el panel de accesibilidad y revisa los hallazgos, no sólo el aspecto visual.
6. Comprueba el resultado integrado en el portal.

El selector de viewport ya viene integrado; no instales el antiguo addon de
viewport. `.storybook/preview.js` importa `src/app/globals.css` y define los anchos;
`public/` se sirve como directorio de assets. Fuente y tokens deben coincidir con
el portal.

Existe una excepción documentada para contraste blanco/naranja en `Button`.
No copies su `a11y.test: "todo"` al crear otras historias: los problemas nuevos
se corrigen o se discuten explícitamente.

## Compilar Storybook

```sh
npm run build-storybook
```

Produce `storybook-static/`, ignorado por Git. Compilar no publica el resultado ni
prueba automáticamente todas las interacciones. Los avisos históricos sobre
`use client` y tamaño de chunks están documentados en el README; distingue esos
avisos de errores nuevos que impidan construir o visualizar una historia.
