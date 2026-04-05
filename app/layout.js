import { CartProvider } from "../context/CartContext";
import "./globals.css";

export const metadata = {
  title: "ATELIER JOYERÍA | Zafhira — Joyería de Autor",
  description: "Piezas únicas forjadas con la precisión de un latido. Descubra la sofisticación de Zafhira en cada detalle de oro y gemas preciosas.",
  keywords: "joyería, autor, oro, Colombia, lujo, anillos, collares, zafiro, esmeralda",
  openGraph: {
    title: "ATELIER JOYERÍA | Zafhira",
    description: "Joyas con alma, creadas para perdurar en el tiempo.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          {/* Glassmorphism Header — The Glass Rule */}
          <header className="glass-header">
            <nav>
              <a href="/">Inicio</a>
              <a href="/catalogo">Catálogo</a>
              <a href="/nosotros">Sobre Nosotros</a>
              <a href="/contacto">Contacto</a>
            </nav>
            <a href="/" className="logo">ZAFHIRA</a>
            <nav>
              <a href="/checkout">Carrito</a>
            </nav>
          </header>

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
                <h4>Legal</h4>
                <ul>
                  <li><a href="/terminos">Terms &amp; Conditions</a></li>
                  <li><a href="/privacidad">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 ATELIER JOYERÍA. PRECIOS EN COP.</span>
              <span>Zafhira — Joyería de Autor</span>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
