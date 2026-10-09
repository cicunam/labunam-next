# Imágenes y entrega de cambios

[Volver al índice](README.md)

## De dónde vienen las imágenes

Hay dos manifiestos en `public/fotos/`: `manifiesto.json` para originales de los
micrositios y `manifiesto-web.json` para imágenes revisadas de sus páginas web.
Un manifiesto es un índice JSON que relaciona el ID del laboratorio con archivos
y variantes de tamaño. El original tiene prioridad por laboratorio sobre el web.
Dentro de la selección se muestran fotos antes que logos.

Si no hay imágenes, `src/lib/fotos/fotos.js` elige un SVG de
`public/assets/respaldos/`. Un área única obtiene su icono; varias o ninguna usan
el general. No sustituirlo por una fotografía genérica que parezca del laboratorio.
Los logos se muestran completos, sin recorte.

## Generar originales

Con la carpeta real disponible y configurada por Raúl:

```sh
npm run fotos
# Carpeta explícita:
npm run fotos -- --origen=/ruta/a/micrositio/img
# Sólo algunos IDs, conservando el resto del manifiesto:
npm run fotos -- --origen=/ruta/a/micrositio/img --solo=18,100
```

El script no modifica los originales. Genera hasta tres imágenes por laboratorio,
corrige orientación y produce WebP en anchos 480/960/1440 sin agrandar imágenes
pequeñas. Una ejecución completa reconstruye el manifiesto original; una parcial
conserva los otros IDs. Por eso debes comprobar el origen antes de ejecutar una
corrida completa. No elimina el manifiesto web.

El código de salida es 0 al terminar sin fallos, 2 si fallaron imágenes y 1 si no
pudo iniciar o publicar. Lee el resumen de la terminal antes de asumir que terminó.

## Buscar y revisar imágenes web

```sh
npm run fotos:buscar
npm run fotos:revisar
```

La búsqueda requiere Node 24, Python 3, acceso a MySQL y a las páginas. Produce candidatas,
no imágenes publicadas automáticamente. Abre el [revisor local](http://127.0.0.1:8767).

1. Revisar que la imagen corresponde al laboratorio y es adecuada.
2. Elegir hasta tres, indicando la principal. Se permiten logos propios cuando no
   haya fotos adecuadas; no confundirlos con logos generales de una institución.
3. Pulsar «Guardar y siguiente». Cambiar de registro por sí solo no guarda.
4. Pulsar «Aplicar aprobadas al catálogo» para importar lo aprobado.
5. Revisar progreso y resultado, incluidos errores. La importación continúa en
   segundo plano y su estado se consulta desde la interfaz.
6. Recargar el portal para ver las imágenes aplicadas.

Guardar y aplicar son pasos diferentes. Una revisión nueva no retira automáticamente
una imagen ya importada. Si falla una importación, se conserva la versión anterior
de ese laboratorio. La autorización comunicada por Raúl está registrada en el
flujo existente; no asumir que autoriza incorporar cualquier imagen de Internet.

## Qué no viaja en un commit

`public/fotos/` contiene resultados generados. `.revision-fotos/` contiene la lista
ampliada, cachés y decisiones editoriales. Ambas están ignoradas y deben conservarse
por un canal acordado con Raúl al cambiar de equipo o desplegar. No usar `git clean`
sobre archivos ignorados ni borrarlas como si fueran cachés desechables.

Un clon nuevo incluye los SVG de respaldo, pero no las fotos aprobadas. Compilar
Next no descarga ni reconstruye automáticamente esas imágenes.

## Preparar una entrega

- Revisar el diff para que contenga sólo cambios intencionales y ningún secreto.
- Actualizar la historia si cambia un componente, y la guía si cambia un procedimiento.
- Ejecutar las comprobaciones pertinentes de la [guía de pruebas](05-pruebas.md).
- Explicar qué cambió, dónde revisarlo y qué pruebas se ejecutaron.
- Hacer un commit corto en español, minúsculas y sin trailers; coordinar la rama
  y el push con el equipo. No confundir commit local con publicación del portal.

El despliegue todavía no está automatizado en este repositorio. La configuración
de Node, PM2, Apache, rutas PHP y persistencia de imágenes se acuerda con Raúl;
consulta [los acuerdos de servidor](preguntas-servidor.md) antes de intervenir.
