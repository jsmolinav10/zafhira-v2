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

  const isSilver = product.title?.toLowerCase().includes('plata') || product.description?.toLowerCase().includes('plata')
  const isGold = product.title?.toLowerCase().includes('oro') || product.description?.toLowerCase().includes('oro')

  let materialDesc = 'Nuestras joyas son forjadas con metales nobles y piedras preciosas naturales certificadas, seleccionadas con los más altos estándares de calidad.'
  if (isSilver && !isGold) {
    materialDesc = 'Forjado en Plata 950. Esta aleación premium está compuesta por un 95% de plata pura y un 5% de metales endurecedores (como cobre), logrando el equilibrio perfecto entre maleabilidad artesanal, durabilidad extrema y un brillo blanco excepcional. Todas nuestras gemas son naturales y certificadas.'
  } else if (isGold && !isSilver) {
    materialDesc = 'Forjado en Oro de 18 Quilates (18K). Compuesto por un 75% de oro puro de 24K y un 25% de aleaciones maestras (como plata y cobre) que garantizan su dureza estructural, resistencia al desgaste y un color inalterable de por vida. Gemas naturales certificadas.'
  } else {
    materialDesc = 'Forjado en metales nobles (Oro 18K o Plata 950). El Oro 18K (75% oro puro, 25% aleaciones) garantiza resistencia y color inalterable. La Plata 950 (95% plata pura, 5% cobre) otorga un brillo blanco excepcional. Gemas naturales certificadas.'
  }

  const tabs = {
    detalles: product.description || 'Pieza de autor diseñada y fabricada artesanalmente en nuestro taller. Cada joya es una expresión única de elegancia y maestría orfebrera.',
    materiales: materialDesc,
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

            {/* Quote Custom Metal Button */}
            <a 
              href={`https://wa.me/573229007675?text=Hola,%20me%20interesa%20la%20pieza%20*${encodeURIComponent(product.title)}*,%20pero%20me%20gustar%C3%ADa%20cotizarla%20en%20un%20metal%20diferente%20(ej.%20Oro%2018K%20/%20Plata)%20o%20con%20una%20piedra%20diferente.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textAlign: 'center',
                background: 'transparent',
                border: '1px solid var(--outline-variant)',
                color: 'var(--on-surface-variant)',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                transition: 'border-color 200ms var(--ease-out), color 200ms var(--ease-out)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--outline-variant)'; e.currentTarget.style.color = 'var(--on-surface-variant)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.012 2c5.506 0 9.989 4.478 9.989 9.984 0 1.705-.448 3.308-1.238 4.69l1.206 4.413-4.52-.185c-1.37.768-2.956 1.206-4.637 1.206-5.506 0-9.989-4.478-9.989-9.984C2.823 6.478 7.306 2 12.012 2zm0 1.5c-4.686 0-8.489 3.8-8.489 8.484 0 1.83.585 3.535 1.583 4.935l-.837 3.064 3.136-1.002c1.36.91 2.975 1.442 4.707 1.442 4.686 0 8.489-3.8 8.489-8.484 0-4.684-3.803-8.484-8.489-8.484zm4.239 11.232c-.226.549-1.077 1.054-1.521 1.134-.383.069-.877.108-2.61-.611-2.094-.868-3.447-3.003-3.551-3.142-.104-.139-.848-1.129-.848-2.152 0-1.023.531-1.526.717-1.724.186-.198.406-.248.541-.248.135 0 .271 0 .384.006.124.006.293-.047.458.35.169.407.575 1.405.626 1.509.051.104.085.226.017.361-.068.135-.102.22-.203.339-.101.118-.214.253-.305.339-.101.096-.208.203-.096.395.113.192.502.829 1.083 1.346.75.668 1.366.87 1.558.966.192.096.305.085.418-.034.113-.118.491-.57.626-.768.135-.198.271-.164.446-.102.175.062 1.106.52 1.298.616.192.096.316.141.361.22.045.079.045.463-.181 1.012z"/>
              </svg>
              Cotizar en Otro Metal
            </a>

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
