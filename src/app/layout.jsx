// LabUNAM
// Páginas
// Layout raíz (estructura común de todas las páginas)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componentes
import { Header, Footer } from "@/components";

// Estilos
import "./globals.css";

// Configuración de Next
export const metadata = {
  title: { default: "LabUNAM", template: "%s | LabUNAM" },
  description:
    "Sistema de Enlace de los Laboratorios Nacionales, Universitarios y Unidades de Apoyo de la UNAM.",
};

// Definición de la página
const RootLayout = ({
  children, // ReactNode - Contenido de la página activa, que se coloca entre cabecera y pie
}) => {
  // Interfaz
  return (
    <html lang="es">
      <body>
        <Header />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
