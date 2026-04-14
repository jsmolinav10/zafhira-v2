import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import HeaderClient from "./HeaderClient";
import FooterClient from "./FooterClient";
import "./globals.css";

export const metadata = {
  title: "Zafhira | Joyería de Autor — Alquimia Preciosa",
  description: "Piezas únicas forjadas con la precisión de un latido. Descubra la sofisticación de Zafhira en cada detalle de oro y gemas preciosas.",
  keywords: "joyería, autor, oro, Colombia, lujo, anillos, collares, zafiro, esmeralda",
  icons: {
    icon: "/assets/monograma.jpg",
  },
  openGraph: {
    title: "Zafhira | Joyería de Autor",
    description: "Joyas con alma, creadas para perdurar en el tiempo.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/assets/monograma.jpg" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <HeaderClient />

            <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
              {children}
            </main>

            <FooterClient />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
