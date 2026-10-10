import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import "./globals.css";

export const metadata = {
  title: { default: "LabUNAM", template: "%s | LabUNAM" },
  description:
    "Sistema de Enlace de los Laboratorios Nacionales, Universitarios y Unidades de Apoyo de la UNAM.",
};
const RootLayout = ({ children }) => {
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
