# Instrucciones compartidas — LabUNAM 2.1

## Contexto y alcance

- Este es el portal público Next.js de LabUNAM para la CIC/UNAM.
- Confirmar que se trabaja en `labunam-next` antes de editar o ejecutar Git.
- Leer `README.md` para operación y pendientes; `docs/decisiones-tecnicas.md`
  para la arquitectura y `docs/preguntas-servidor.md` para acuerdos de infraestructura.
- Las instrucciones explícitas de Raúl tienen prioridad sobre las convenciones
  del proyecto. No convertir una preferencia técnica en una aprobación adicional.

## Entorno y datos

- Node 24 LTS; usar la versión de `.nvmrc`, npm y `package-lock.json`.
- Raúl administra `.env`. No leer, imprimir, copiar ni incorporar credenciales a
  código, logs, capturas o commits. Usar `.env.example` como referencia de variables;
  la carga normal del entorno por Next y los scripts está permitida.
- MySQL es de sólo lectura. No crear migraciones ni modificar el esquema o los
  registros reales como parte del trabajo del portal.
- No enviar al cliente campos de personas ni detalles internos de conexión.
  Historias y pruebas usan datos ficticios.
- Conservar `public/fotos/` y `.revision-fotos/`: están fuera de Git, pero contienen
  imágenes aplicadas y decisiones editoriales. No tratarlas como temporales.
- El revisor de imágenes es una herramienta local, no una ruta pública del portal.

## Organización y nombres

- Atomic Design en `src/components/atoms`, `molecules` y `organisms`.
- Una carpeta por componente: `Component/Component.jsx`, su CSS Module e historia.
  Una carpeta por módulo en `src/lib/`, con pruebas y fixtures junto al módulo.
- Componentes y funciones en inglés. Conservar nombres de entidades y
  campos del dominio en español; textos visibles y URLs también en español.
- Imports al archivo concreto, sin barriles `index.js`.
- Átomos y moléculas no importan catálogo ni lógica de datos del dominio. Cálculo y datos
  pertenecen a `src/lib/`, sin React.
- Priorizar componentes con una responsabilidad y props claras. Las 150 líneas son una
  referencia para revisar responsabilidades, no un límite: nunca comprimir JSX o quitar comentarios para cumplirlo.
- Usar `npm run format` y conservar llaves en todos los `if`. Separar imports, preparación
  de datos, eventos y JSX. Explicar en español las decisiones complejas y sus invariantes.
- Server Components por defecto. Añadir una frontera cliente sólo si se necesita
  interacción. Conservar el renderizado servidor de catálogo y ficha individual.
- CSS Modules junto al componente; globales sólo en `src/app/globals.css` para tokens,
  reset, tipografía y retícula. Reutilizar tokens, fuente local y assets existentes.
- Comentarios en español que expliquen decisiones, no repitan el código.

## Decisiones técnicas

- App Router y JavaScript; código en `src/` y alias `@/` a esa carpeta.
- Seguir las dependencias y restricciones documentadas en README. No introducir
  gestores de estado, Tailwind, CSS-in-JS, HOCs o webpack personalizado.
- Middleware, Server Actions, `next/image`, rutas paralelas/interceptadas, ISR y
  APIs `unstable_*` requieren una razón documentada antes de adoptarse.
- Imágenes con `img`, `srcSet`, `sizes` y carga diferida cuando corresponda.
  `sharp` pertenece a los scripts, no a las rutas web ni componentes.
- Mantener el pool único y la caché en memoria del catálogo con carga concurrente
  compartida y respaldo de la última copia válida; no introducir otra caché de Next.
- Los cinco redirects heredados son 301 explícitos, no 308; preservar query strings.

## Comportamientos que deben conservarse

- El modal de laboratorio cambia la URL y preserva filtros, posición e historial.
  Cerrar/Escape/Atrás/Adelante deben funcionar. Recargar la URL abre la ficha directa.
- CTA principal «Solicitar un servicio»; sitio web secundario junto al CTA.
  El formulario no envía nada hasta implementar y validar su backend.
- Fotografías antes que logos aprobados; sin imágenes, ilustración por área única
  o general si hay varias o ninguna. Logos completos, sin recorte.
- Tarjetas con imagen protagonista y texto breve; no incorporar de nuevo listados
  extensos de servicios/equipos en ellas sin solicitud de diseño.
- Carrusel deslizable con mouse y touch, infinito, avance cada siete segundos e
  indicador amarillo progresivo. Sin pill de pausa. Conservar pausas por interacción,
  visibilidad y movimiento reducido, así como navegación por teclado y enlaces.
- No declarar las noticias de ejemplo como contenido institucional definitivo.

## Validación y entrega

- Elegir comprobaciones según el cambio. Para lógica: pruebas unitarias pertinentes;
  para interacción: Playwright en 375/1024/1400 px y revisión visual.
- En cambios de código ejecutar lint y build; ampliar pruebas ante fallos o riesgos
  concretos. Para documentación basta comprobar exactitud, rutas y diff.
- Verificar Escape, foco, teclado, desbordamiento e imágenes al modificar diálogos
  o componentes visuales; actualizar historias cuando cambien sus estados.
- Para comprobar producción, construir e iniciar un puerto libre y pasar
  `PLAYWRIGHT_BASE_URL` a las pruebas. No detener procesos ajenos.
- No silenciar hallazgos de accesibilidad. El contraste blanco/naranja tiene una
  excepción de marca documentada; no extenderla a otros elementos.
- Distinguir pruebas ejecutadas ahora de resultados históricos. No declarar cumplido
  el presupuesto de 120 KB: sigue pendiente. No actualizar cifras sin medir.
- Commits cortos en español, minúsculas, una línea y sin trailers de atribución.
  No hacer push salvo petición. Preservar cambios ajenos y datos locales ignorados.
- Actualizar README al cambiar operación o decisiones. Mantener aquí las reglas
  comunes y en CLAUDE.md la orientación específica, evitando duplicarlas.

## Documentación de la versión instalada de Next

Conservar el bloque siguiente, gestionado por Next. Consultar su documentación
local antes de cambiar código relacionado con el framework.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
