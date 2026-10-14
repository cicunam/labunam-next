// LabUNAM
// Configuración
// next.config (configuración de Next y redirects heredados)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Configuración
const nextConfig = {
  // Las URL del sitio anterior redirigen con 301 explícito; Next conserva la query string.
  async redirects() {
    return [
      ...["nacionales", "universitarios", "unidades", "internacionales"].map((tipo) => ({
        source: `/${tipo}`,
        destination: `/laboratorios?tipo=${tipo}`,
        statusCode: 301,
      })),
      { source: "/buscar", destination: "/laboratorios", statusCode: 301 },
    ];
  },
};
export default nextConfig;
