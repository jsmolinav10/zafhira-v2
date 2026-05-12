"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function FooterClient() {
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus(null);
    const result = await loginWithEmail(email);

    if (result?.error) {
      setStatus("error");
      setStatusMsg("Error al suscribirse. Intenta de nuevo.");
    } else {
      setStatus("success");
      setStatusMsg("✓ Revisa tu correo para confirmar tu suscripción.");
      setEmail("");
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-newsletter">
          <h3 className="font-serif">Únase al círculo íntimo</h3>
          <p>Reciba invitaciones exclusivas a lanzamientos de colecciones privadas y eventos de alta joyería.</p>
          <form onSubmit={handleSubscribe} className="email-input-group">
            <input
              type="email"
              placeholder="Su dirección de email"
              aria-label="Email para newsletter"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ fontSize: '0.75rem' }}>Suscribirse</button>
          </form>
          {status && (
            <p style={{
              marginTop: '0.75rem',
              fontSize: '0.8rem',
              color: status === 'success' ? '#51cf66' : '#ff6b6b',
            }}>
              {statusMsg}
            </p>
          )}
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
          <Link href="/admin" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textDecoration: 'none', cursor: 'pointer' }}>
            <img src="/assets/monograma.jpg" alt="Zafhira Seal" style={{ width: '120px', borderRadius: '50%', filter: 'grayscale(0.2) contrast(1.1)' }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--primary)', fontWeight: '600' }}>SELLO DE AUTOR</span>
          </Link>
          <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1.5rem', justifyContent: 'center' }}>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/zafhirajoyeria/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Zafhira"
              style={{ color: 'var(--on-surface-variant)', transition: 'color 0.3s, transform 0.3s', display: 'inline-flex' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--on-surface-variant)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@zafhira.joyeria"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok de Zafhira"
              style={{ color: 'var(--on-surface-variant)', transition: 'color 0.3s, transform 0.3s', display: 'inline-flex' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--on-surface-variant)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2 6.34 6.34 0 0 0 9.49 21.5a6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 3.76.92V6.69z"/>
              </svg>
            </a>
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
