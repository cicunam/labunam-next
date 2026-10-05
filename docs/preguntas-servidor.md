# Preguntas para quien administra el servidor

LabUNAM 2.1 se reconstruye en Next.js. El sitio PHP actual corre con Apache 2.4 en
Ubuntu 20.04 (desarrollo: `132.248.31.71`; producción: `labunam.unam.mx`). Estas son las preguntas de infraestructura del plan:

1. ¿Se puede instalar Node LTS en desarrollo y producción? La base usa Node 24 LTS.
   ¿Quién se encarga de instalarlo y actualizarlo?
2. ¿Cómo se mantendrá vivo el proceso Node después de reiniciar el servidor:
   `systemd`, `pm2` u otro mecanismo? ¿Quién podrá reiniciarlo al desplegar?
3. ¿Apache puede hacer proxy inverso con `mod_proxy` desde el dominio al puerto
   local donde escuche Node?
4. ¿Cómo se despliega hoy PHP: copia manual, `git pull` u otro canal? Necesitamos
   adaptar ese canal para instalar dependencias, ejecutar `npm run build` y
   reiniciar el proceso.
5. ¿La carpeta real `labunam/micrositio/img` será legible por el usuario que corra
   Node y genere las fotos?
6. ¿Existe un servidor de desarrollo con URL pública para que Ivonne y la CIC
   revisen el resultado? ¿Cuál sería la URL?

## Respuestas y acuerdos — 2 de octubre de 2026

- Raúl tiene acceso al servidor y ya administra API con PM2. Se propone reutilizar
  PM2 para LabUNAM; falta verificar Node 24, el arranque automático y Apache.
- La configuración de infraestructura está a cargo del responsable del servidor.
- La carpeta de fotos será legible por el proceso de Node: confirmado por Raúl.
- Producción: `https://labunam.unam.mx/`. Desarrollo: una IP, pendiente de precisar
  para LabUNAM y confirmar acceso desde la red de la CIC.
- No existe todavía un flujo de despliegue de LabUNAM. Como referencia se revisaron
  las acciones de `cicapi-csgca`: `master` despliega en `132.248.31.71` y
  `production` en `132.248.31.74`, mediante rsync, SSH y PM2. Esos destinos son de la
  API; no se asume que ambos serán los de LabUNAM.
- Adaptación prevista: Node 24, dependencias de compilación, `npm run build`,
  proceso y puerto propios, activación de la nueva versión sólo tras compilar,
  conservación de fotos y de las rutas de micrositios PHP en Apache.

La configuración de las acciones de la API no acredita la versión de Node ni los
módulos de Apache instalados en el servidor. No se accedió al servidor ni se cambió
su configuración.

Si instalar Node, mantener el proceso o configurar el proxy no es viable, hay que
decidir con Raúl la alternativa `output: 'export'` y filtrado del catálogo en el
cliente antes de construir las páginas. No se cambia la arquitectura de forma
implícita.
