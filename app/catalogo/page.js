"use client";

import { useCart } from "../../context/CartContext";
import { useState, useCallback } from "react";

const CATEGORIES = ["Todos", "Anillos", "Collares", "Brazaletes", "Pendientes"];

const CATALOG = [
  { id: "ring_001", name: "Anillo Fractal Zafhira", subtitle: "Oro de 18 Kilates", price: 1250000, category: "Anillos", image: null },
  { id: "ring_002", name: "Solitario Eternidad", subtitle: "Oro Blanco · Brillante", price: 4200000, category: "Anillos", image: null },
  { id: "neck_001", name: "Collar Prisma Solar", subtitle: "Pieza Única · Diamantes", price: 8450000, category: "Collares", image: null },
  { id: "neck_002", name: "Cadena Eslabón Z", subtitle: "Oro Macizo de 18K", price: 89400, category: "Collares", image: null },
  { id: "dije_001", name: "Prueba Dije", subtitle: "Zafiro Profundo · Oro 18K", price: 1500000, category: "Collares", image: "/prueba%20dije.jpg" },
  { id: "braz_001", name: "Brazalete Cénit", subtitle: "Oro Martillado a Mano", price: 6800000, category: "Brazaletes", image: null },
  { id: "pend_001", name: "Pendientes Nébula", subtitle: "Oro Amarillo · Zafiro", price: 3100000, category: "Pendientes", image: null },
  { id: "neck_003", name: "Gargantilla Legado Esmeralda", subtitle: "Oro amarillo 24k · Esmeralda Colombiana", price: 12200000, category: "Collares", image: null },
];

function Toast({ message, visible }) {
  return <div className={`toast ${visible ? 'show' : ''}`}>{message}</div>;
}

export default function CatalogPage() {
  const { addToCart } = useCart();
  const [active, setActive] = useState("Todos");
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const filtered = active === "Todos" ? CATALOG : CATALOG.filter(p => p.category === active);

  const handleAdd = (p) => {
    addToCart({ id: p.id, name: p.name, price: p.price });
    showToast(`${p.name} añadido.`);
  };

  return (
    <>
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
                transition: 'all 0.3s ease',
              }}
            >
              {cat} {cat !== "Todos" && <span style={{ opacity: 0.5, marginLeft: '6px' }}>
                {CATALOG.filter(p => cat === "Todos" || p.category === cat).length.toString().padStart(2, '0')}
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
          {filtered.map((product, i) => (
            <div key={product.id} className={`product-card fade-in stagger-${(i % 4) + 1}`}>
              <div style={{
                width: '100%',
                aspectRatio: '1 / 1.15',
                backgroundColor: 'var(--surface-container)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span className="text-label">[ {product.category} ]</span>
                )}
              </div>
              <div className="card-body">
                <p className="card-subtitle">{product.subtitle}</p>
                <h3 className="card-title">{product.name}</h3>
                <p className="card-price">$ {product.price.toLocaleString('es-CO')} COP</p>
                <button className="btn-ghost" onClick={() => handleAdd(product)} style={{ width: '100%', textAlign: 'center' }}>
                  Añadir a la Colección
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
