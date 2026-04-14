"use client";

import { useCart } from "../context/CartContext";
import { useState, useCallback } from "react";
import Link from "next/link";

function Toast({ message, visible }) {
  return (
    <div className={`toast ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
}

export default function HomeClient({ featured }) {
  const { addToCart } = useCart();
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const handleAdd = (product) => {
    if (product.status === 'agotado') return;
    addToCart({ id: product.id, name: product.title, price: product.price });
    showToast(`${product.title} añadido a su colección.`);
  };

  return (
    <div className="page-enter">
      <Toast message={toastMsg} visible={toastVisible} />

      {/* ===== HERO SECTION ===== */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 8%',
        position: 'relative',
      }}>
        <p className="text-title text-gold fade-in" style={{ marginBottom: '1.5rem' }}>
          Zafhira Joyería de Autor
        </p>
        <h1 className="text-display font-serif fade-in stagger-1">
          Alquimia de Autor
        </h1>
        <p className="fade-in stagger-2" style={{
          maxWidth: '580px',
          color: 'var(--on-surface-variant)',
          fontSize: '1.05rem',
          marginTop: '1.5rem',
          marginBottom: '3rem',
          lineHeight: '1.8',
        }}>
          Piezas únicas forjadas con la precisión de un latido. 
          Descubra la sofisticación de Zafhira en cada detalle de oro y gemas preciosas.
        </p>
        <a href="/catalogo" className="btn-primary fade-in stagger-3">
          Ver Colección
        </a>
      </section>

      {/* ===== PHILOSOPHY SECTION ===== */}
      <section style={{
        padding: '8rem 8%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6rem',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div>
          <h2 className="text-headline font-serif" style={{ marginBottom: '2rem' }}>
            Donde el diseño se encuentra con el alma.
          </h2>
          <a href="/nosotros" className="btn-tertiary">Conoce nuestra historia</a>
        </div>
        <blockquote style={{
          fontFamily: "'Noto Serif', serif",
          fontStyle: 'italic',
          fontSize: '1.15rem',
          lineHeight: '2',
          color: 'var(--on-surface-variant)',
          borderLeft: '2px solid var(--primary)',
          paddingLeft: '2rem',
        }}>
          "En Zafhira, no creamos accesorios; esculpimos legados. Cada pieza es una narrativa 
          de elegancia atemporal, diseñada para quienes entienden que el verdadero lujo reside 
          en la singularidad del trazo."
        </blockquote>
      </section>

      {/* ===== FEATURED COLLECTION (Dynamic) ===== */}
      <section style={{
        padding: '4rem 6%',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'baseline', 
          marginBottom: '3rem' 
        }}>
          <div>
            <h2 className="text-headline font-serif">Piezas Destacadas</h2>
            <p className="text-label" style={{ marginTop: '0.5rem' }}>Zafhira Selección Exclusiva</p>
          </div>
          <a href="/catalogo" className="btn-tertiary">Ver todo</a>
        </div>

        {featured.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '6rem 2rem', 
            color: 'var(--on-surface-variant)',
            border: '1px dashed var(--outline)',
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Las piezas destacadas aparecerán aquí.</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Marca tus joyas como "destacadas" desde la Bóveda.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(featured.length, 3)}, 1fr)`,
            gap: '1.5rem',
          }}>
            {featured.map((product, i) => (
              <Link 
                key={product.id} 
                href={`/catalogo/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className={`product-card fade-in stagger-${i + 1}`} style={{ cursor: 'pointer' }}>
                  <div style={{
                    width: '100%',
                    aspectRatio: '1 / 1.2',
                    backgroundColor: 'var(--surface-container)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', height: '100%', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center' 
                      }}>
                        <span className="text-label">[ Fotografía ]</span>
                      </div>
                    )}
                    {product.status === 'agotado' && (
                      <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: '#ff4444', color: '#fff',
                        padding: '4px 12px', fontSize: '0.65rem',
                        fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                      }}>AGOTADO</div>
                    )}
                  </div>
                  <div className="card-body">
                    <p className="card-subtitle">{product.category}</p>
                    <h3 className="card-title">{product.title}</h3>
                    <p className="card-price">$ {product.price?.toLocaleString('es-CO')} COP</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== RESPONSIVE ===== */}
      <style jsx>{`
        .product-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .product-card:hover { transform: translateY(-8px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .product-card:active { transform: translateY(-2px); }
        @media (max-width: 768px) {
          section:nth-of-type(2) {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding: 4rem 6% !important;
          }
          section:nth-of-type(3) > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
