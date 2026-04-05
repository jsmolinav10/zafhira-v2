"use client";

import { useCart } from "../context/CartContext";
import { useState, useEffect, useCallback } from "react";

// Product data centralized (single source of truth)
const PRODUCTS = [
  {
    id: "ring_001",
    name: "Anillo Sello de Autor",
    subtitle: "Oro 18K — Pieza Única",
    price: 1250000,
    image: null, // placeholder
  },
  {
    id: "neck_002",
    name: "Cadena Singapur 1mm",
    subtitle: "Cadena Ref703-042 · 45CM",
    price: 89400,
    image: null,
  },
  {
    id: "dije_001",
    name: "Prueba Dije",
    subtitle: "Zafiro Profundo · Oro 18K",
    price: 1500000,
    image: "/prueba%20dije.jpg",
  },
];

// Toast component (replaces alert)
function Toast({ message, visible }) {
  return (
    <div className={`toast ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
}

export default function Home() {
  const { addToCart } = useCart();
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const handleAdd = (product) => {
    addToCart({ id: product.id, name: product.name, price: product.price });
    showToast(`${product.name} añadido a su colección.`);
  };

  return (
    <>
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
          ATELIER JOYERÍA
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

      {/* ===== PHILOSOPHY SECTION (Editorial Quote) ===== */}
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

      {/* ===== FEATURED COLLECTION (Asymmetric Gallery) ===== */}
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
            <p className="text-label" style={{ marginTop: '0.5rem' }}>Atelier Selección Otoño</p>
          </div>
          <a href="/catalogo" className="btn-tertiary">Ver todo</a>
        </div>

        {/* Asymmetric Grid Layout (NOT uniform 3-column) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: 'auto',
          gap: '1.5rem',
        }}>
          {/* Card 1: Large featured */}
          <div className="product-card fade-in stagger-1" style={{ gridRow: 'span 1' }}>
            <div style={{
              width: '100%',
              aspectRatio: '1 / 1.2',
              backgroundColor: 'var(--surface-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <span className="text-label">[ Fotografía Anillo ]</span>
            </div>
            <div className="card-body">
              <p className="card-subtitle">Oro de 18 Kilates</p>
              <h3 className="card-title">{PRODUCTS[0].name}</h3>
              <p className="card-price">$ {PRODUCTS[0].price.toLocaleString('es-CO')} COP</p>
              <button className="btn-ghost" onClick={() => handleAdd(PRODUCTS[0])}>
                Añadir a la Colección
              </button>
            </div>
          </div>

          {/* Card 2: Medium */}
          <div className="product-card fade-in stagger-2">
            <div style={{
              width: '100%',
              aspectRatio: '1 / 1',
              backgroundColor: 'var(--surface-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span className="text-label">[ Fotografía Cadena ]</span>
            </div>
            <div className="card-body">
              <p className="card-subtitle">Pieza Única · Oro</p>
              <h3 className="card-title">{PRODUCTS[1].name}</h3>
              <p className="card-price">$ {PRODUCTS[1].price.toLocaleString('es-CO')} COP</p>
              <button className="btn-ghost" onClick={() => handleAdd(PRODUCTS[1])}>
                Añadir a la Colección
              </button>
            </div>
          </div>

          {/* Card 3: With real image */}
          <div className="product-card fade-in stagger-3">
            <div style={{
              width: '100%',
              aspectRatio: '1 / 1.2',
              backgroundColor: 'var(--surface-container)',
              overflow: 'hidden',
            }}>
              <img
                className="card-image"
                src="/prueba%20dije.jpg"
                alt="Prueba Dije — Zafiro profundo con montura de oro"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="card-body">
              <p className="card-subtitle">Zafiro Profundo · Oro 18K</p>
              <h3 className="card-title">{PRODUCTS[2].name}</h3>
              <p className="card-price">$ {PRODUCTS[2].price.toLocaleString('es-CO')} COP</p>
              <button className="btn-ghost" onClick={() => handleAdd(PRODUCTS[2])}>
                Añadir a la Colección
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RESPONSIVE: Philosophy section collapses on mobile ===== */}
      <style jsx>{`
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
    </>
  );
}
