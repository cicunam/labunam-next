# Servidor de desarrollo y despliegue

[Volver al índice](README.md)

## Dónde vive

El portal de desarrollo se ve en [http://132.248.31.102](http://132.248.31.102), sólo por
HTTP y sin dominio. El dominio y HTTPS se configuran con el servidor de producción.

El servidor es Ubuntu 24.04 con una CPU y 3.7 GB de RAM. Es compartido: Apache también
sirve `labunam.unam.mx` (sitio anterior), `labunamapp`, `admin-stia` y `syslab`. Nada del
portal modifica esos sitios; su configuración vive en archivos propios.

| Pieza | Configuración |
| --- | --- |
| Node 24 LTS | Paquete de NodeSource (`/etc/apt/sources.list.d/nodesource.list`) |
| PM2 | Proceso `labunam-next` de la cuenta `sislabunam`; servicio `pm2-sislabunam` lo levanta al arrancar |
| Next | `next start` en `127.0.0.1:3000`, definido en `ecosystem.config.cjs` |
| Apache | Sitio `labunam-next.conf`: atiende la IP y reenvía a Next sin buffer para conservar el streaming |

## Cómo llega un cambio

Cada mezcla en master ejecuta `.github/workflows/deploy-dev.yml`. El flujo entra por SSH
como `sislabunam` y ejecuta `scripts/deploy.sh` con el commit mezclado:

1. Descarga master de GitHub y comprueba que el commit pertenece a la rama.
2. Extrae el commit en una carpeta nueva de `releases/` y enlaza `shared/.env`.
3. Ejecuta `npm ci` y `npm run build` con prioridad baja para no frenar a los otros sitios.
   Mientras tanto, la versión anterior sigue atendiendo.
4. Cambia el enlace `current` a la versión nueva y reinicia el proceso de PM2.
5. Comprueba que la portada responda. Como la portada consulta MySQL, esto también
   confirma la conexión. Si no responde, regresa a la versión anterior y el flujo falla.
6. Conserva las tres versiones más recientes.

El despliegue no corre lint ni pruebas: esas comprobaciones las hace `ci.yml` en el PR
antes de mezclar, y de nuevo sobre master en paralelo al despliegue, sin detenerlo.
Las mezclas seguidas se despliegan en orden; ninguna cancela a la que está en curso.
El resultado se consulta en la pestaña Actions de GitHub. Un flujo en rojo significa
que el portal sigue en la versión anterior.

## Carpetas en el servidor

| Ruta | Contenido |
| --- | --- |
| `/srv/labunam-next/repo.git` | Clon de GitHub sin árbol de trabajo |
| `/srv/labunam-next/releases/` | Una carpeta por versión (`<fecha>-<commit>`) |
| `/srv/labunam-next/current` | Enlace a la versión activa; PM2 trabaja sobre él |
| `/srv/labunam-next/shared/.env` | Variables del servidor; nunca pasan por el repositorio |
| `/srv/labunam-next/shared/fotos/` | Si existe, se enlaza como `public/fotos` en cada versión |

Las fotografías todavía no están en el servidor: el portal muestra las ilustraciones de
respaldo. Cuando se decida dónde se almacenan, basta con llenar `shared/fotos/`; el
siguiente despliegue la enlaza sin cambiar el script.

## Tareas frecuentes

Entrar al servidor con la cuenta de despliegue:

```sh
ssh sislabunam@132.248.31.102
```

Ver el estado y los registros del portal:

```sh
pm2 ls
pm2 logs labunam-next --lines 100
```

Cambiar variables de entorno. Next las lee al arrancar, así que hay que reiniciar:

```sh
nano /srv/labunam-next/shared/.env
pm2 restart labunam-next
```

Repetir el despliegue de master sin mezclar nada: en GitHub, Actions →
«Despliegue en desarrollo» → Run workflow.

Probar una rama publicada antes de mezclarla, desde la raíz del repositorio local:

```sh
ssh sislabunam@132.248.31.102 "bash -s -- $(git rev-parse HEAD) $(git branch --show-current)" < scripts/deploy.sh
```

La siguiente mezcla en master reemplaza esa prueba.

Volver a una versión anterior sin desplegar:

```sh
cd /srv/labunam-next
ls releases
ln -sfn /srv/labunam-next/releases/<versión> current
pm2 reload labunam-next
```

## Preparar un servidor nuevo

Este procedimiento se usó en el servidor de desarrollo y sirve para producción.

1. Crear una llave sólo para GitHub Actions, guardarla como secreto y borrar la privada:

   ```sh
   mkdir -p ~/labunam-deploy
   ssh-keygen -t ed25519 -N "" -C "github-actions labunam-next" -f ~/labunam-deploy/llave
   gh secret set DEV_SSH_KEY --repo cicunam/labunam-next < ~/labunam-deploy/llave
   rm ~/labunam-deploy/llave
   ```

2. Copiar al servidor la llave pública y `scripts/server-setup.sh`, y ejecutarlo con
   `sudo` desde la cuenta que hará los despliegues. El segundo argumento es el dominio o
   la IP que atenderá Apache:

   ```sh
   sudo bash server-setup.sh llave.pub 132.248.31.102
   ```

   Instala Node 24 y PM2, crea `/srv/labunam-next`, autoriza la llave con `restrict`
   (sólo ejecutar comandos) y habilita el sitio de Apache. Se puede repetir sin efectos
   duplicados.

3. Escribir las variables de `.env.example` en `/srv/labunam-next/shared/.env`.
   El servidor debe tener permiso de conexión a MySQL.

4. Configurar los secretos restantes de GitHub y mezclar o ejecutar el flujo:

| Secreto | Valor |
| --- | --- |
| `DEV_SSH_HOST` | IP o dominio del servidor |
| `DEV_SSH_USER` | Cuenta de despliegue |
| `DEV_SSH_KEY` | Llave privada del paso 1 |
| `DEV_SSH_KNOWN_HOSTS` | Salida de `ssh-keyscan -t ed25519 <host>`, tras comparar la huella |

## Decisiones y límites

- Los despliegues usan `sislabunam`, que también administra los otros sitios del servidor.
  Se aceptó ese alcance para la llave de GitHub en lugar de crear un usuario exclusivo.
  La llave no permite terminal interactiva ni reenvío de puertos.
- Compilar ocupa la única CPU durante unos minutos. La prioridad baja reduce el efecto
  sobre los otros sitios, pero no lo elimina.
- La caché del catálogo vive en el proceso: cada despliegue o reinicio la vacía y la
  primera visita vuelve a consultar MySQL.
- El certificado comodín `*.cic.unam.mx` instalado en el servidor vence el 24 de
  noviembre de 2026. Tomarlo en cuenta si el portal se publica con un subdominio del CIC.
