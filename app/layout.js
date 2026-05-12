import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import HeaderClient from "./HeaderClient";
import FooterClient from "./FooterClient";
import WhatsAppButton from "./WhatsAppButton";
import "./globals.css";

export const metadata = {
  title: "Zafhira | Anillos de Matrimonio y Joyería Personalizada en Oro 18kt",
  description: "Joyería personalizada por Jhoan Sebastian. Anillos de matrimonio, anillos de 15 años y cadenas en oro 18kt y plata. Más que una joya, inmortalizamos tus mejores momentos.",
  keywords: "anillos de matrimonio, anillos de 15 años, cadenas de oro 18kt, accesorios en plata, joyería personalizada, joyero Jhoan Sebastian, Zafhira",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Zafhira | Joyería Personalizada por Jhoan Sebastian",
    description: "Anillos de matrimonio y joyas en oro 18kt hechas a medida. Inmortalizamos tus mejores momentos.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <CartProvider>
            <HeaderClient />

            <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
              {children}
            </main>

            <FooterClient />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
