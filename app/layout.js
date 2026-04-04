import { CartProvider } from "../context/CartContext";
import "./globals.css";

export const metadata = {
  title: "Zafhira | Joyería de Autor",
  description: "The Velvet Gallery - Joyas con alma, creadas para perdurar en el tiempo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          {/* Header Minimalist from the design system */}
          <header style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '2rem 10%', 
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            width: '100%',
            zIndex: 10
          }}>
            <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              <a href="/">Inicio</a>
              <a href="/catalogo">Colecciones</a>
            </nav>
            <div style={{ fontFamily: 'Noto Serif, serif', fontSize: '1.5rem', color: 'var(--primary-gold)' }}>
              ZAFHIRA
            </div>
            <div style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              <a href="/checkout">Carrito</a>
            </div>
          </header>

          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
