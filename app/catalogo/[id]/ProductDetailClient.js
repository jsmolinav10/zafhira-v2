'use client'

import { useState, useCallback } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

const RING_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12', '13']
const CHAIN_LENGTHS = ['40 cm', '45 cm', '50 cm', '60 cm']

function Toast({ message, visible }) {
  return <div className={`toast ${visible ? 'show' : ''}`}>{message}</div>
}

export default function ProductDetailClient({ product, related }) {
  const { addToCart } = useCart()
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [activeTab, setActiveTab] = useState('detalles')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleTabChange = (tab) => {
    if (tab === activeTab) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveTab(tab)
      setIsTransitioning(false)
    }, 150)
  }

  const isRing = product.category?.toLowerCase() === 'anillos'
  const isNecklace = product.category?.toLowerCase() === 'collares'
  const needsSize = isRing || isNecklace
  const sizeOptions = isRing ? RING_SIZES : isNecklace ? CHAIN_LENGTHS : []
  const sizeLabel = isRing ? 'Talla' : 'Largo de Cadena'

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }, [])

  const handleBuy = () => {
    if (product.status === 'agotado') return
    if (needsSize && !selectedSize) {
      showToast(`Por favor selecciona ${isRing ? 'una talla' : 'un largo'}.`)
      return
    }
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      size: selectedSize || null,
      image: product.image_url,
    })
    showToast(`${product.title} añadido al carrito.`)
  }

  const tabs = {
    detalles: product.description || 'Pieza de autor diseñada y fabricada artesanalmente en nuestro taller. Cada joya es una expresión única de elegancia y maestría orfebrera.',
    materiales: 'Oro de 18 quilates, piedras preciosas naturales certificadas. Cada material es seleccionado con los más altos estándares de calidad para garantizar la durabilidad y el brillo de su pieza.',
    envio: 'Envío estándar gratuito (3-5 días hábiles). Envío exprés disponible por $20.000 COP (1-2 días hábiles). Todas las piezas se envían en un estuche de lujo Zafhira con certificado de autenticidad.',
  }

  return (
    <div className="page-enter">
      <Toast message={toastMsg} visible={toastVisible} />

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 6%' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
          <Link href="/" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Inicio</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <Link href="/catalogo" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Catálogo</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span style={{ color: 'var(--on-surface)' }}>{product.title}</span>
        </nav>

        {/* Main Grid: Image | Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          
          {/* LEFT: Gallery */}
          <div>
            <div style={{
              width: '100%',
              height: 'calc(100vh - 120px)', // Very large, editorial full-bleed height
              minHeight: '600px',
              backgroundColor: 'var(--surface-container)',
              overflow: 'hidden',
              position: 'relative',
              borderRadius: '0', // Sharp luxury edges
            }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)' }}>
                  [ Fotografía ]
                </div>
              )}
              {product.status === 'agotado' && (
                <div style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: '#ff4444', color: '#fff', padding: '6px 16px',
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                }}>AGOTADO</div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                {product.category}
              </p>
              <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', letterSpacing: '0.03em', marginBottom: '0.5rem' }}>
                {product.title}
              </h1>
            </div>

            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.95rem', lineHeight: '1.8' }}>
              {product.description || 'Pieza exclusiva de autor, fabricada artesanalmente en el taller de Zafhira. Una exploración de la forma, el oro y la luz.'}
            </p>

            <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontSize: '1.6rem', letterSpacing: '0.05em' }}>
              $ {product.price?.toLocaleString('es-CO')} COP
            </div>

            {/* Size/Length Selector */}
            {needsSize && (
              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '0.75rem' }}>
                  {sizeLabel}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {sizeOptions.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '10px 18px',
                        border: selectedSize === size ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                        background: selectedSize === size ? 'rgba(186,160,113,0.1)' : 'transparent',
                        color: selectedSize === size ? 'var(--primary)' : 'var(--on-surface)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: selectedSize === size ? 600 : 400,
                        letterSpacing: '0.05em',
                        letterSpacing: '0.05em',
                        transition: 'border-color 200ms var(--ease-out), background 200ms var(--ease-out), color 200ms var(--ease-out), transform 160ms var(--ease-out)',
                      }}
                      className="btn"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buy Button */}
            <button
              className="btn-primary"
              onClick={handleBuy}
              disabled={product.status === 'agotado'}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                opacity: product.status === 'agotado' ? 0.4 : 1,
                cursor: product.status === 'agotado' ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
              }}
            >
              {product.status === 'agotado' ? 'AGOTADO' : 'COMPRAR'}
            </button>

            {/* Accordion Tabs */}
            <div style={{ borderTop: '1px solid var(--outline-variant)', marginTop: '1rem' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--outline-variant)' }}>
                {['detalles', 'materiales', 'envio'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    style={{
                      flex: 1,
                      padding: '14px 0',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                      color: activeTab === tab ? 'var(--primary)' : 'var(--on-surface-variant)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      transition: 'color 200ms var(--ease-out), border-color 200ms var(--ease-out)',
                    }}
                  >
                    {tab === 'envio' ? 'Envío' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <p style={{ 
                padding: '1.5rem 0', 
                color: 'var(--on-surface-variant)', 
                fontSize: '0.85rem', 
                lineHeight: '1.8',
                transition: 'filter 250ms var(--ease-out), opacity 250ms var(--ease-out)',
                filter: isTransitioning ? 'blur(2px)' : 'none',
                opacity: isTransitioning ? 0.6 : 1,
              }}>
                {tabs[activeTab]}
              </p>
            </div>

            {/* Payment Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--on-surface-variant)', fontSize: '0.75rem' }}>
              <span>Opciones de pago:</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['QR Bancario', 'Transferencia'].map(method => (
                  <span key={method} style={{
                    padding: '4px 10px',
                    border: '1px solid var(--outline-variant)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.05em',
                  }}>
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: '6rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '1.3rem', marginBottom: '2rem', letterSpacing: '0.05em' }}>
              Productos Relacionados
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(related.length, 4)}, 1fr)`, gap: '1.5rem' }}>
              {related.map(r => (
                <Link key={r.id} href={`/catalogo/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-card" style={{ cursor: 'pointer' }}>
                    <div style={{
                      width: '100%', aspectRatio: '1/1',
                      backgroundColor: 'var(--surface-container)',
                      border: '1px solid var(--outline)',
                      overflow: 'hidden',
                    }}>
                      {r.image_url ? (
                        <img src={r.image_url} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)', fontSize: '0.75rem' }}>[ Foto ]</div>
                      )}
                    </div>
                    <div style={{ padding: '1rem 0' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--on-surface)' }}>{r.title}</h3>
                      <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>$ {r.price?.toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          section > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  )
}
