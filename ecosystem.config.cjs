// LabUNAM
// Configuración
// ecosystem.config (proceso de PM2 del portal en el servidor)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// El directorio de trabajo es el enlace `current`, no la versión a la que apunta:
// al reiniciar, PM2 vuelve a resolver el enlace y arranca la versión recién activada.
const base = process.env.LABUNAM_DESPLIEGUE ?? "/srv/labunam-next";

// Configuración
module.exports = {
  apps: [
    {
      name: "labunam-next",
      cwd: `${base}/current`,
      script: "node_modules/next/dist/bin/next",
      // Sólo escucha en local; Apache recibe el tráfico público y lo reenvía.
      args: "start --hostname 127.0.0.1 --port 3000",
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "1G",
      time: true,
    },
  ],
};
