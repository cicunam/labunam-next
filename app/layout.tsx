import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cabecera } from "@/components/organisms/Cabecera";
import { Pie } from "@/components/organisms/Pie";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "LabUNAM", template: "%s | LabUNAM" },
  description: "Sistema de Enlace de los Laboratorios Nacionales, Universitarios y Unidades de Apoyo de la UNAM.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Cabecera />
        <main id="contenido">{children}</main>
        <Pie />
      </body>
    </html>
  );
}
