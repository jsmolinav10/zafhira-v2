"use client";

import { useCart } from "../../context/CartContext";
import { useState, useCallback } from "react";
import Link from "next/link";

const CATEGORIES = ["Todos", "Anillos", "Collares", "Brazaletes", "Pendientes"];

function Toast({ message, visible }) {
  return <div className={`toast ${visible ? 'show' : ''}`}>{message}</div>;
}

export default function CatalogClient({ initialCatalog }) {
  const { addToCart } = useCart();
  const [active, setActive] = useState("Todos");
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // Fallback map for Supabase schema to original Catalog expected rendering
  const mappedCatalog = initialCatalog.map(p => ({
    id: p.id,
    name: p.title,
    subtitle: p.description || "Pieza de Autor",
    price: p.price,
    category: p.category,
    image: p.image_url,
    status: p.status || 'disponible'
  }))

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const filtered = active === "Todos" 
    ? mappedCatalog 
    : mappedCatalog.filter(p => p.category?.toLowerCase().trim() === active.toLowerCase().trim());

  const handleAdd = (p) => {
    if (p.status === 'agotado') return;
    addToCart({ id: p.id, name: p.name, price: p.price });
    showToast(`${p.name} añadido.`);
  };

  return (
    <div className="page-enter">
      <Toast message={toastMsg} visible={toastVisible} />

      <section style={{ padding: '3rem 6%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="text-display font-serif fade-in">Catálogo</h1>
          <p className="fade-in stagger-1" style={{ color: 'var(--on-surface-variant)', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0' }}>
            Piezas de autor forjadas en el silencio del taller. Una exploración de la forma, el oro y la luz.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '4rem',
          flexWrap: 'wrap',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: '10px 24px',
                background: active === cat ? 'var(--primary)' : 'transparent',
                color: active === cat ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                border: active === cat ? 'none' : '1px solid var(--outline-variant)',
                borderRadius: 0,
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 200ms var(--ease-out), color 200ms var(--ease-out), transform 160ms var(--ease-out)',
              }}
              className="btn"
            >
              {cat} {cat !== "Todos" && <span style={{ opacity: 0.5, marginLeft: '6px' }}>
                {mappedCatalog.filter(p => p.category?.toLowerCase().trim() === cat.toLowerCase().trim()).length.toString().padStart(2, '0')}
              </span>}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--on-surface-variant)' }}>
              Aún no hay piezas disponibles en esta categoría.
            </div>
          ) : filtered.map((product, i) => (
            <div key={product.id} className={`product-card fade-in stagger-${(i % 4) + 1}`} style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/catalogo/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                width: '100%',
                aspectRatio: '1 / 1.15',
                backgroundColor: 'var(--surface-container)',
                border: '1px solid var(--outline)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>[ Fotografía ]</div>
                )}

                {/* Badge AGOTADO */}
                {product.status === 'agotado' && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#ff4444',
                    color: '#fff',
                    padding: '4px 12px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}>AGOTADO</div>
                )}
              </div>
              </Link>

              {/* Info + Button section */}
              <div style={{ padding: '1.25rem 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '1rem', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
                  {product.name}
                </h3>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  {product.subtitle}
                </p>

                {/* Price + Button row */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em', fontSize: '1.1rem' }}>
                    ${product.price.toLocaleString('es-CO')}
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => handleAdd(product)}
                    disabled={product.status === 'agotado'}
                    style={{
                      padding: '10px 24px',
                      fontSize: '0.7rem',
                      opacity: product.status === 'agotado' ? 0.4 : 1,
                      cursor: product.status === 'agotado' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {product.status === 'agotado' ? 'Agotado' : 'Adquirir'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: var(--surface-high);
          color: var(--on-surface);
          padding: 1rem 1.5rem;
          border: 1px solid var(--outline);
          font-family: var(--font-body);
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          z-index: 1000;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
