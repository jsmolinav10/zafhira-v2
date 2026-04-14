"use client";

import { useAuth } from "../context/AuthContext";

export default function FooterClient() {
  const { loginWithGoogle } = useAuth();

  const handleSubscribe = (e) => {
    e.preventDefault();
    loginWithGoogle();
  };

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-newsletter">
          <h3 className="font-serif">Únase al círculo íntimo</h3>
          <p>Reciba invitaciones exclusivas a lanzamientos de colecciones privadas y eventos de alta joyería.</p>
          <form onSubmit={handleSubscribe} className="email-input-group">
            <input type="email" placeholder="Su dirección de email" aria-label="Email para newsletter" required />
            <button type="submit" className="btn-primary" style={{ fontSize: '0.75rem' }}>Suscribirse</button>
          </form>
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
            <img src="/assets/monograma.jpg" alt="Zafhira Seal" style={{ width: '120px', borderRadius: '50%', filter: 'grayscale(0.2) contrast(1.1)' }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--primary)', fontWeight: '600' }}>SELLO DE AUTOR</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 ZAFHIRA JOYERÍA. PRECIOS EN COP.</span>
        <span>Zafhira — Joyería de Autor</span>
      </div>
    </footer>
  );
}
