"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function HeaderClient() {
  const { cart, isLoaded } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="glass-header">
      <nav>
        <Link href="/">Inicio</Link>
        <Link href="/catalogo">Catálogo</Link>
        <Link href="/nosotros">Sobre Nosotros</Link>
        <Link href="/contacto">Contacto</Link>
      </nav>
      
      <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.3s var(--ease-out)' }}>
        <img 
          src="/assets/logo_zafhira.png" 
          alt="Zafhira" 
          style={{ height: '70px', width: 'auto', objectFit: 'contain', transition: 'transform 0.3s ease' }} 
          className="logo-img"
        />
      </Link>

      <nav>
        <Link href="/checkout" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          CARRITO 
          {isLoaded && itemCount > 0 && (
            <span style={{ 
              background: 'var(--primary)', 
              color: 'var(--on-primary)', 
              borderRadius: '50%', 
              width: '18px', 
              height: '18px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.65rem',
              fontWeight: '700'
            }}>
              {itemCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
