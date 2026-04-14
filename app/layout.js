import { CartProvider } from "../context/CartContext";
import HeaderClient from "./HeaderClient";
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
        <CartProvider>
          <HeaderClient />

          <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
            {children}
          </main>

          {/* Footer — Faithful to Stitch Model */}
          <footer className="site-footer">
            <div className="footer-grid">
              <div className="footer-newsletter">
                <h3 className="font-serif">Únase al círculo íntimo</h3>
                <p>Reciba invitaciones exclusivas a lanzamientos de colecciones privadas y eventos de alta joyería.</p>
                <div className="email-input-group">
                  <input type="email" placeholder="Su dirección de email" aria-label="Email para newsletter" />
                  <button className="btn-primary" style={{ fontSize: '0.75rem' }}>Suscribirse</button>
                </div>
              </div>
              <div className="footer-links">
                <h4>Navegación</h4>
                <ul>
                  <li><a href="/">Inicio</a></li>
                  <li><a href="/catalogo">Catálogo</a></li>
                  <li><a href="/nosotros">Sobre Nosotros</a></li>
                  <li><a href="/contacto">Contacto</a></li>
                </ul>
              </div>
              <div className="footer-links">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <img src="/assets/monograma.jpg" alt="Zafhira Seal" style={{ width: '60px', borderRadius: '50%', filter: 'grayscale(0.2) contrast(1.1)' }} />
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--primary)', fontWeight: '600' }}>SELLO DE AUTOR</span>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 ZAFHIRA JOYERÍA. PRECIOS EN COP.</span>
              <span>Zafhira — Joyería de Autor</span>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
