# Preparar el entorno

[Volver al índice](README.md)

## Qué necesitas

Acceso al repositorio, Git, Node 24 LTS y npm. La versión exacta de Node está en
`.nvmrc`. Si usas nvm, desde la carpeta del proyecto:

```sh
nvm install
nvm use
npm ci
```

`npm ci` instala las versiones del lockfile. Úsalo al preparar un clon o cuando
cambie `package-lock.json`; no es necesario repetirlo cada vez que arrancas.
Si no tienes nvm, instala la versión indicada de Node con el mecanismo de tu
sistema. Comprueba `node --version` y `npm --version` antes de seguir.

Trabajamos en **labunam-next**. Todos los comandos de esta guía se ejecutan
desde la raíz del repositorio.

## Configuración local

Coordina con Raúl el acceso a la base y la creación de `.env`, siguiendo los nombres
de `.env.example`. No sobrescribas un `.env` existente ni publiques sus valores.

| Variable | Uso |
| --- | --- |
| `LABUNAM_DB_HOST` | Servidor MySQL |
| `LABUNAM_DB_NAME` | Base de datos |
| `LABUNAM_DB_USER` / `LABUNAM_DB_PASS` | Credenciales de consulta |
| `LABUNAM_CATALOGO_SEGUNDOS` | Duración de caché; 600 por defecto |
| `LABUNAM_FOTOS_ORIGEN` | Carpeta local de imágenes originales de micrositios |

Las variables de conexión sólo pertenecen al servidor. No usar `NEXT_PUBLIC_`
para ellas: ese prefijo permite exponer valores al navegador.

## Levantar el portal

```sh
npm run dev
```

Abre [el portal local](http://localhost:3000). Mantén la terminal abierta; los cambios
se reflejan durante el desarrollo. `Ctrl+C` detiene ese proceso. Reinicia después
de cambiar configuración de entorno si el proceso sigue usando valores anteriores.

La portada y el catálogo requieren acceso a MySQL. Sin ese acceso puedes avanzar
con Storybook y las pruebas unitarias. Las imágenes aplicadas no están en Git;
su ausencia en un clon nuevo produce ilustraciones de respaldo.

## Desarrollo frente a producción

`dev` recompila al editar y muestra herramientas de diagnóstico. Para comprobar
el resultado que realmente se ejecutará en producción:

```sh
npm run build
npm start -- --hostname 127.0.0.1 --port 3007
```

`build` genera `.next/`; `start` sirve esa compilación. Un cambio posterior necesita
otro build. Esto sólo inicia una instancia local, no despliega en la UNAM.
Usa un puerto libre; no detengas procesos de otro integrante para liberar uno.

## Problemas habituales

| Síntoma | Qué revisar |
| --- | --- |
| `nvm: command not found` | nvm no está instalado o no se cargó en esa terminal |
| Error de versión de Node | Ejecutar `nvm use` en esta terminal |
| Puerto ocupado | Revisar qué proceso lo usa o elegir otro puerto |
| Catálogo no disponible | Configuración local, permisos y acceso de red a MySQL; no pegar credenciales en mensajes |
| Cambios SQL no aparecen de inmediato | La caché del catálogo dura 600 segundos por defecto |
| Sólo aparecen ilustraciones | Faltan imágenes/manifiestos locales; consultar la guía de imágenes |
| Playwright no encuentra Chromium | Ejecutar `npx playwright install chromium` |

Los comandos completos y los límites conocidos están en el [README principal](../README.md).
