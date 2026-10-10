import { Header } from "@/components/organisms/Header/Header";
import { Footer } from "@/components/organisms/Footer/Footer";
import "./globals.css";

export const metadata = {
  title: { default: "LabUNAM", template: "%s | LabUNAM" },
  description:
    "Sistema de Enlace de los Laboratorios Nacionales, Universitarios y Unidades de Apoyo de la UNAM.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
