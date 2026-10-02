import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
