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
        <Link href="/nosotros">Sobre Nosotros</Link>
        <Link href="/contacto">Contacto</Link>
      </nav>
      
      <Link href="/" className="logo center-logo">
        <img 
          src="/assets/logo_zafhira_new.png" 
          alt="Zafhira" 
          className="logo-img"
        />
      </Link>

      <nav>
        {!authLoading && (
          user ? (
            <button onClick={logout} className="nav-btn">CERRAR SESIÓN</button>
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
