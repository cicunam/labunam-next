# Decisiones técnicas

[Volver a la guía del equipo](README.md)

## Objetivo

Facilitar que investigadores, empresas y otras instituciones encuentren capacidades
científicas de la UNAM y consulten laboratorios. El código debe ser legible para un
equipo familiarizado con React que está incorporando Next.js.

## Plataforma y estructura

- Next.js con App Router, React y TypeScript. Las versiones exactas se fijan en
  `package-lock.json`; Node se declara en `.nvmrc` y `package.json`.
- Páginas y layouts en `app/`, sin `src/`. Usar las convenciones de la versión
  instalada; consultar `node_modules/next/dist/docs/` antes de asumir APIs antiguas.
- Componentes de servidor por defecto; fronteras cliente pequeñas para interacción.
- Atomic Design y una carpeta por componente con CSS Module e historia.
- Datos y funciones sin React en `lib/`, con pruebas junto al módulo.
- Componentes y funciones en inglés; entidades del dominio y textos en español.
- Imports directos, sin barriles. Componentes de hasta 150 líneas, extrayendo
  responsabilidades cuando sea necesario, sin comprimir el código artificialmente.

## Dependencias y estilos

Se usan mysql2 para datos, sharp para scripts de imágenes, Vitest, Playwright y
Storybook con su integración de Next y accesibilidad. Reutilizar estas herramientas
antes de añadir dependencias.

No se usan Redux, Zustand, Jotai, Tailwind, CSS-in-JS, HOCs, `any` ni configuración
personalizada de webpack. Middleware, Server Actions, `next/image`, rutas paralelas
o interceptadas, ISR y APIs `unstable_*` requieren una justificación documentada
antes de introducirse.

CSS Modules junto a componentes o páginas. CSS global sólo para tokens, reset,
fuente y retícula. Inter y sus licencias se sirven como recursos del proyecto.
La interfaz es española (`lang="es"`); otros idiomas requieren contenido traducido
completo y una decisión de producto.

## Datos y navegación

MySQL se consulta sólo en servidor y en modo lectura. No modificar el esquema o
registros como parte del portal. No exponer campos personales ni detalles internos
de conexión. Credenciales fuera de Git, según `.env.example`.

El catálogo tiene caché en memoria, 600 segundos por defecto, con carga concurrente
compartida y respaldo de la última copia válida. La búsqueda y facetas se calculan
sobre los datos normalizados. No se envía todo el catálogo de capacidades al cliente.

Filtros aplicados en la URL, navegación compartible y formulario GET. El modal de
ficha conserva historial, posición y filtros; la URL directa renderiza una página.
Las rutas heredadas responden con 301 explícitos, conservando query strings.

## Imágenes y accesibilidad

Imágenes responsivas con `img`, `srcSet`, `sizes` y carga diferida cuando corresponde.
Por esa decisión se desactiva sólo la regla ESLint `@next/next/no-img-element`.
sharp se utiliza en scripts, no en componentes o rutas web.

Fotografías reales, logos propios aprobados e ilustraciones de respaldo según
disponibilidad. No presentar fotos genéricas como imágenes del laboratorio.
Conservar los originales y las decisiones editoriales fuera de Git.

Verificar teclado, foco, Escape, movimiento reducido y desbordamiento. El contraste
blanco/naranja del botón de marca es una excepción de diseño conocida; no ocultar
otros hallazgos de accesibilidad ni extender esa excepción.

## Validación y rendimiento

Vitest para reglas y datos simulados; Playwright para flujos completos a 375, 1024
y 1400 px; Storybook para estados de componentes. Ejecutar lint y build en cambios
de código y las pruebas relevantes. Los ejemplos no contienen personas reales.

Objetivo de rendimiento móvil: Lighthouse ≥ 90 y JS+CSS ≤ 120 KB gzip. El límite
de peso sigue sin alcanzarse. El informe en `rendimiento.json` conserva una medición
fechada; no representa automáticamente el estado de cada nueva versión.

La suma documentada recomprime los JS/CSS descargados por Lighthouse con gzip, sin
cabeceras HTTP, imágenes, fuentes ni HTML. Una aplicación mínima con Next 16.3.8 y
React 19.2.8 dio 133,529 bytes gzip de scripts, por lo que el límite requiere revisar
el presupuesto o la arquitectura. No declarar satisfecho el criterio sin medir.

## Operación

El despliegue requiere un proceso Node supervisado, proxy Apache y conservación de
imágenes/manifiestos entre versiones. Los detalles pendientes se recogen en
[preguntas de servidor](preguntas-servidor.md). Las noticias definitivas, el envío
de solicitudes y la aceptación institucional siguen pendientes, según el README.
