"use client";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function HeaderClient() {
  const { cart, isLoaded: cartLoaded } = useCart();
  const { user, loginWithGoogle, logout, loading: authLoading } = useAuth();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="glass-header">
      <nav>
        <Link href="/">Inicio</Link>
        <Link href="/catalogo">Catálogo</Link>
        {/* <Link href="/arma-tu-anillo" style={{ color: 'var(--primary)', fontWeight: 600 }}>Arma tu Anillo ✨</Link> */}
        <Link href="/guias">Guías y Consejos</Link>
        <Link href="/nosotros" style={{ whiteSpace: 'nowrap', color: 'var(--primary)', fontWeight: 600 }}>
          Sobre Nosotros ✨
        </Link>
      </nav>
      
      <Link href="/" className="logo center-logo">
        <img 
          src="/assets/logo_zafhira_new.png" 
          alt="Zafhira" 
          className="logo-img"
        />
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Social Links */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginRight: '1rem' }}>
          <a
            href="https://www.instagram.com/zafhirajoyeria/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Zafhira"
            style={{ color: 'var(--on-surface-variant)', transition: 'color 0.3s, transform 0.3s', display: 'inline-flex' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--on-surface-variant)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@zafhira.joyeria"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok de Zafhira"
            style={{ color: 'var(--on-surface-variant)', transition: 'color 0.3s, transform 0.3s', display: 'inline-flex' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--on-surface-variant)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2 6.34 6.34 0 0 0 9.49 21.5a6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 3.76.92V6.69z"/>
            </svg>
          </a>
        </div>

        {!authLoading && (
          user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="nav-btn" style={{ cursor: 'default', opacity: 0.7, fontSize: '0.65rem' }}>
                {user.email?.split('@')[0]}
              </span>
              <button onClick={logout} className="nav-btn">CERRAR SESIÓN</button>
            </div>
          ) : (
            <button onClick={loginWithGoogle} className="nav-btn">MI CUENTA</button>
          )
        )}

        <Link href="/checkout" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          CARRITO 
          {cartLoaded && itemCount > 0 && (
            <span className="cart-badge">
              {itemCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
