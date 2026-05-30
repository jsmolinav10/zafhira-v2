import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import HeaderClient from "./HeaderClient";
import FooterClient from "./FooterClient";
import WhatsAppButton from "./WhatsAppButton";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

export const metadata = {
  title: "Zafhira | Anillos de Matrimonio y Joyería Personalizada en Bogotá",
  description: "Taller de joyería personalizada por Jhoan Sebastian en Bogotá, Colombia. Anillos de matrimonio, anillos de 15 años y cadenas en oro 18kt y plata.",
  keywords: "anillos de matrimonio bogotá, anillos personalizados bogotá, joyería bogotá, cadenas de oro 18kt colombia, joyero Jhoan Sebastian, Zafhira Bogotá",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Zafhira | Taller de Joyería en Bogotá por Jhoan Sebastian",
    description: "Anillos de matrimonio y joyas en oro 18K hechas a medida en Bogotá, Colombia.",
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
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXX"} />
      </body>
    </html>
  );
}
