import { Header } from "@/components/organisms/Header/Header";
import { Footer } from "@/components/organisms/Footer/Footer";
import { FloatingContact } from "@/components/organisms/FloatingContact/FloatingContact";
import "./globals.css";
export const metadata = {
    title: { default: "LabUNAM", template: "%s | LabUNAM" },
    description: "Sistema de Enlace de los Laboratorios Nacionales, Universitarios y Unidades de Apoyo de la UNAM.",
};
export default function RootLayout({ children }) {
    return (<html lang="es">
      <body>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>);
}
