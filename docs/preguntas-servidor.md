# Preguntas para quien administra el servidor

LabUNAM 2.1 se reconstruye en Next.js. El sitio PHP actual corre con Apache 2.4 en
Ubuntu 20.04 (desarrollo: `132.248.31.71`; producción: `labunam.unam.mx`). Necesitamos
confirmar estos puntos antes de comenzar el Hito 2:

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

Estado: pendientes de respuesta. Esta lista está preparada para que Raúl la
comparta; no se ha enviado a nadie.

Si instalar Node, mantener el proceso o configurar el proxy no es viable, hay que
decidir con Raúl la alternativa `output: 'export'` y filtrado del catálogo en el
cliente antes de construir las páginas. No se cambia la arquitectura de forma
implícita.
