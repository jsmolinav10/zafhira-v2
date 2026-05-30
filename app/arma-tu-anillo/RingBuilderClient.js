'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

/* ============================================================
   DATA: Metals, Settings, Gems, Sizes
   ============================================================ */
const METALS = [
  { id: 'oro-amarillo', name: 'Oro 18K Amarillo', gradient: ['#D4AF37', '#F5D060', '#B8941E'], price: 1200000, preview: '#D4AF37' },
  { id: 'oro-blanco', name: 'Oro 18K Blanco', gradient: ['#C0C0C0', '#EAEAEA', '#A8A8A8'], price: 1200000, preview: '#D0D0D0' },
  { id: 'oro-rosa', name: 'Oro 18K Rosa', gradient: ['#B76E79', '#E8A0A0', '#C4787F'], price: 1200000, preview: '#D4A0A0' },
  { id: 'plata-925', name: 'Plata 925', gradient: ['#8E8E8E', '#C8C8C8', '#707070'], price: 0, preview: '#A0A0A0' },
]

const SETTINGS = [
  { id: 'solitario', name: 'Solitario', desc: 'Corona clásica de 6 garras', price: 0, icon: '💍' },
  { id: 'cintillo', name: 'Cintillo', desc: 'Micro-pavé a lo largo del aro', price: 500000, icon: '✨' },
  { id: 'halo', name: 'Halo', desc: 'Corona rodeada de micro-brillantes', price: 800000, icon: '🌟' },
]

const GEMS = [
  { id: 'diamante', name: 'Diamante', color: '#F0F8FF', sparkle: '#E8F4FD', inner: '#D0E8F5', pricePerCt: 4500000, icon: '💎' },
  { id: 'esmeralda', name: 'Esmeralda', color: '#046307', sparkle: '#0A8F0E', inner: '#034D06', pricePerCt: 1500000, icon: '💚' },
  { id: 'rubi', name: 'Rubí', color: '#9B111E', sparkle: '#DC143C', inner: '#6B0F1A', pricePerCt: 800000, icon: '❤️' },
  { id: 'zafiro', name: 'Zafiro Azul', color: '#0F52BA', sparkle: '#1E6FDB', inner: '#0A3A82', pricePerCt: 800000, icon: '💙' },
  { id: 'zirconia', name: 'Zirconia', color: '#F5F5F5', sparkle: '#FFFFFF', inner: '#E0E0E0', pricePerCt: 0, fixedPrice: 100000, icon: '🤍' },
]

const GEM_SHAPES = [
  { id: 'brillante', name: 'Brillante (Redondo)' },
  { id: 'princesa', name: 'Princesa (Cuadrado)' },
  { id: 'ovalo', name: 'Óvalo' },
  { id: 'gota', name: 'Gota (Pera)' },
  { id: 'esmeralda', name: 'Esmeralda (Rectángulo)' },
]

const SIZES = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]

const CARAT_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3]

/* ============================================================
   SVG COMPONENTS
   ============================================================ */

function RingBand({ metal, hasCintillo }) {
  const [g1, g2, g3] = metal.gradient
  return (
    <g>
      {/* Band gradient definitions */}
      <defs>
        <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={g1} />
          <stop offset="50%" stopColor={g2} />
          <stop offset="100%" stopColor={g3} />
        </linearGradient>
        <linearGradient id="bandShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
        </linearGradient>
        <filter id="bandShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>

      {/* Main ring band - viewed from slight angle */}
      <ellipse cx="200" cy="280" rx="110" ry="40" fill="url(#bandGrad)" stroke={g3} strokeWidth="2" filter="url(#bandShadow)" />
      <ellipse cx="200" cy="280" rx="110" ry="40" fill="url(#bandShine)" />

      {/* Inner hole */}
      <ellipse cx="200" cy="280" rx="85" ry="28" fill="#0C1227" />
      <ellipse cx="200" cy="280" rx="85" ry="28" fill="rgba(0,0,0,0.3)" />

      {/* Band top surface (the visible width of the band) */}
      <path
        d={`M 90 280 Q 90 240, 200 230 Q 310 240, 310 280`}
        fill="url(#bandGrad)"
        stroke={g3}
        strokeWidth="1.5"
      />
      <path
        d={`M 90 280 Q 90 240, 200 230 Q 310 240, 310 280`}
        fill="url(#bandShine)"
      />

      {/* Cintillo - micro pavé dots along band if selected */}
      {hasCintillo && (
        <g>
          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (Math.PI / 18) * (i + 0.5)
            const x = 200 + Math.cos(angle) * 100 * (i < 9 ? 1 : -1)
            const baseY = 265
            const y = baseY - Math.sin(angle) * 8
            return (
              <circle
                key={i}
                cx={x < 200 ? 100 + (i % 9) * 12 + 6 : 196 + (i % 9) * 12 + 6}
                cy={268 - Math.abs(((i % 9) - 4)) * 2.5}
                r="2.5"
                fill="rgba(255,255,255,0.85)"
                style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.6))' }}
              />
            )
          })}
        </g>
      )}

      {/* Reflective highlight on top */}
      <path
        d={`M 130 260 Q 200 245, 270 260`}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
      />
    </g>
  )
}

function GemStone({ gem, shape, carats, positioned = true }) {
  if (!gem) return null
  const scale = 0.6 + (carats || 1) * 0.35
  const cx = 200
  const cy = positioned ? 210 : 200

  return (
    <g transform={`translate(${cx}, ${cy}) scale(${Math.min(scale, 1.6)})`}>
      <defs>
        <radialGradient id="gemGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={gem.sparkle} />
          <stop offset="50%" stopColor={gem.color} />
          <stop offset="100%" stopColor={gem.inner} />
        </radialGradient>
        <filter id="gemGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Gem shape based on selection */}
      {shape === 'brillante' && (
        <g filter="url(#gemGlow)">
          <circle r="30" fill="url(#gemGrad)" stroke={gem.sparkle} strokeWidth="0.5" />
          {/* Facet lines */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (Math.PI * 2 / 8) * i
            return <line key={i} x1="0" y1="0" x2={Math.cos(a) * 28} y2={Math.sin(a) * 28} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          })}
          <circle r="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          {/* Crown sparkle */}
          <circle r="5" cx="-8" cy="-8" fill="rgba(255,255,255,0.5)" />
        </g>
      )}

      {shape === 'princesa' && (
        <g filter="url(#gemGlow)">
          <rect x="-26" y="-26" width="52" height="52" fill="url(#gemGrad)" stroke={gem.sparkle} strokeWidth="0.5" transform="rotate(0)" />
          <line x1="-26" y1="-26" x2="26" y2="26" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <line x1="26" y1="-26" x2="-26" y2="26" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <line x1="0" y1="-26" x2="0" y2="26" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <line x1="-26" y1="0" x2="26" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <circle r="4" cx="-8" cy="-10" fill="rgba(255,255,255,0.4)" />
        </g>
      )}

      {shape === 'ovalo' && (
        <g filter="url(#gemGlow)">
          <ellipse rx="32" ry="22" fill="url(#gemGrad)" stroke={gem.sparkle} strokeWidth="0.5" />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (Math.PI * 2 / 6) * i
            return <line key={i} x1="0" y1="0" x2={Math.cos(a) * 28} y2={Math.sin(a) * 18} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          })}
          <circle r="4" cx="-10" cy="-6" fill="rgba(255,255,255,0.45)" />
        </g>
      )}

      {shape === 'gota' && (
        <g filter="url(#gemGlow)">
          <path d="M 0 -32 C 20 -20, 26 5, 20 18 Q 10 30, 0 32 Q -10 30, -20 18 C -26 5, -20 -20, 0 -32 Z"
            fill="url(#gemGrad)" stroke={gem.sparkle} strokeWidth="0.5" />
          <line x1="0" y1="-30" x2="-15" y2="22" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <line x1="0" y1="-30" x2="15" y2="22" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <line x1="-18" y1="5" x2="18" y2="5" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <circle r="4" cx="-5" cy="-10" fill="rgba(255,255,255,0.45)" />
        </g>
      )}

      {shape === 'esmeralda' && (
        <g filter="url(#gemGlow)">
          <polygon points="-22,-30 22,-30 28,-22 28,22 22,30 -22,30 -28,22 -28,-22"
            fill="url(#gemGrad)" stroke={gem.sparkle} strokeWidth="0.5" />
          <rect x="-16" y="-20" width="32" height="40" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          <rect x="-8" y="-12" width="16" height="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <circle r="4" cx="-8" cy="-10" fill="rgba(255,255,255,0.4)" />
        </g>
      )}
    </g>
  )
}

function SettingMount({ setting, metal }) {
  if (!setting) return null
  const [g1, , g3] = metal.gradient

  if (setting.id === 'solitario') {
    return (
      <g>
        {/* 6 prongs */}
        {[-25, -12, 0, 12, 25].map((offset, i) => (
          <line key={i}
            x1={200 + offset * 1.4} y1={250}
            x2={200 + offset * 0.5} y2={215}
            stroke={g1} strokeWidth="3" strokeLinecap="round"
          />
        ))}
        {/* Base collar */}
        <ellipse cx="200" cy="248" rx="38" ry="6" fill={g1} opacity="0.6" />
      </g>
    )
  }

  if (setting.id === 'halo') {
    return (
      <g>
        {/* Prongs */}
        {[-20, -8, 8, 20].map((offset, i) => (
          <line key={i}
            x1={200 + offset * 1.5} y1={250}
            x2={200 + offset * 0.6} y2={218}
            stroke={g1} strokeWidth="2.5" strokeLinecap="round"
          />
        ))}
        {/* Halo ring of tiny gems */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (Math.PI * 2 / 16) * i
          const r = 42
          const cx = 200 + Math.cos(angle) * r * 0.85
          const cy = 210 + Math.sin(angle) * r * 0.55
          return (
            <circle key={i} cx={cx} cy={cy} r="2.5" fill="rgba(255,255,255,0.8)"
              style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' }} />
          )
        })}
        <ellipse cx="200" cy="248" rx="42" ry="7" fill={g1} opacity="0.5" />
      </g>
    )
  }

  // Cintillo has no extra mount - the pavé is on the band itself
  return (
    <g>
      <ellipse cx="200" cy="248" rx="30" ry="5" fill={g1} opacity="0.5" />
      {[-15, -5, 5, 15].map((offset, i) => (
        <line key={i}
          x1={200 + offset * 1.3} y1={248}
          x2={200 + offset * 0.6} y2={218}
          stroke={g1} strokeWidth="2" strokeLinecap="round"
        />
      ))}
    </g>
  )
}

function SnapZone({ active, hasGem }) {
  if (hasGem) return null
  return (
    <g>
      {/* Pulsing target zone */}
      <circle cx="200" cy="210" r="35" fill="none" stroke="var(--primary)" strokeWidth="2"
        strokeDasharray="6 4" opacity="0.6">
        <animate attributeName="r" values="33;38;33" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      {active && (
        <text x="200" y="212" textAnchor="middle" fontSize="10" fill="var(--primary)" fontFamily="Manrope, sans-serif" opacity="0.7">
          Suelta aquí
        </text>
      )}
    </g>
  )
}

function EngravingPreview({ text, metal }) {
  if (!text) return null
  return (
    <g>
      <text
        x="200" y="295"
        textAnchor="middle"
        fontSize="8"
        fill={metal.gradient[1]}
        fontFamily="'Noto Serif', serif"
        fontStyle="italic"
        opacity="0.55"
        letterSpacing="2"
      >
        {text}
      </text>
    </g>
  )
}

/* ============================================================
   PRICING ENGINE
   ============================================================ */
function calculatePrice(config) {
  let total = 0
  if (config.metal) total += config.metal.price
  if (config.setting) total += config.setting.price
  if (config.gem) {
    if (config.gem.fixedPrice) {
      total += config.gem.fixedPrice
    } else {
      total += config.gem.pricePerCt * (config.carats || 1)
    }
  }
  if (config.engraving && config.engraving.trim()) total += 50000
  return total
}

/* ============================================================
   DRAGGABLE GEM CARD
   ============================================================ */
function DraggableGemCard({ gem, onEquip, isEquipped }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('gem-id', gem.id)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onEquip(gem)}
      className={`gem-card ${isEquipped ? 'gem-card-equipped' : ''}`}
      title={`Arrastra o haz clic para equipar ${gem.name}`}
    >
      <div className="gem-card-preview" style={{ background: gem.color === '#F5F5F5' || gem.color === '#F0F8FF' ? 'rgba(255,255,255,0.15)' : gem.color }}>
        <span style={{ fontSize: '1.8rem' }}>{gem.icon}</span>
      </div>
      <div className="gem-card-info">
        <span className="gem-card-name">{gem.name}</span>
        <span className="gem-card-price">
          {gem.fixedPrice
            ? `$${gem.fixedPrice.toLocaleString('es-CO')}`
            : `$${gem.pricePerCt.toLocaleString('es-CO')}/ct`
          }
        </span>
      </div>
      {isEquipped && <span className="gem-equipped-badge">✓ Equipado</span>}
    </div>
  )
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function RingBuilderClient() {
  // Phase: 'setup' → 'builder'
  const [phase, setPhase] = useState('setup')

  // Setup fields
  const [selectedMetal, setSelectedMetal] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  // Builder config
  const [config, setConfig] = useState({
    metal: null,
    setting: null,
    gem: null,
    gemShape: 'brillante',
    carats: 1,
    size: null,
    engraving: '',
  })

  // UI state
  const [activeCategory, setActiveCategory] = useState('monturas')
  const [isDragOver, setIsDragOver] = useState(false)
  const [assembleAnim, setAssembleAnim] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const svgRef = useRef(null)

  const { addToCart } = useCart()

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2800)
  }, [])

  // Start builder
  const handleStartBuilder = () => {
    if (!selectedMetal || !selectedSize) return
    const metal = METALS.find(m => m.id === selectedMetal)
    setConfig(prev => ({ ...prev, metal, size: selectedSize }))
    setPhase('builder')
  }

  // Equip setting
  const equipSetting = (setting) => {
    setConfig(prev => ({ ...prev, setting }))
    triggerAssembleAnim()
    showToast(`Montura "${setting.name}" equipada`)
  }

  // Equip gem
  const equipGem = (gem) => {
    setConfig(prev => ({ ...prev, gem }))
    triggerAssembleAnim()
    showToast(`${gem.icon} ${gem.name} insertada`)
  }

  // Change metal on-the-fly
  const changeMetal = (metalId) => {
    const metal = METALS.find(m => m.id === metalId)
    setConfig(prev => ({ ...prev, metal }))
    showToast(`Metal cambiado a ${metal.name}`)
  }

  // Assemble animation
  const triggerAssembleAnim = () => {
    setAssembleAnim(true)
    setTimeout(() => setAssembleAnim(false), 600)
  }

  // Drag handlers for the SVG drop zone
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const gemId = e.dataTransfer.getData('gem-id')
    if (gemId) {
      const gem = GEMS.find(g => g.id === gemId)
      if (gem) equipGem(gem)
    }
  }

  // Build WhatsApp message
  const buildWhatsAppMessage = () => {
    const c = config
    const price = calculatePrice(c)
    let msg = `✨ ¡Hola Zafhira! ✨\n\n`
    msg += `Diseñé mi anillo personalizado y me encantaría cotizarlo:\n\n`
    msg += `💍 *DISEÑO DE MI ANILLO*\n`
    msg += `━━━━━━━━━━━━━━━━\n`
    msg += `🛸 Metal: ${c.metal?.name || 'No seleccionado'}\n`
    msg += `⚙️ Montura: ${c.setting?.name || 'No seleccionada'}\n`
    if (c.gem) {
      const shapeName = GEM_SHAPES.find(s => s.id === c.gemShape)?.name || c.gemShape
      msg += `💎 Gema: ${c.gem.name} — Corte ${shapeName}\n`
      msg += `📐 Quilates: ${c.carats} ct\n`
    }
    msg += `📏 Talla: ${c.size}\n`
    if (c.engraving) msg += `✍️ Grabado: "${c.engraving}"\n`
    msg += `━━━━━━━━━━━━━━━━\n`
    msg += `💰 Precio estimado: $${price.toLocaleString('es-CO')} COP\n\n`
    msg += `¿Podrían darme más información sobre tiempos y disponibilidad? ¡Gracias! 🙏`
    return encodeURIComponent(msg)
  }

  // Add custom ring to cart
  const handleAddToCart = () => {
    const price = calculatePrice(config)
    const shapeName = GEM_SHAPES.find(s => s.id === config.gemShape)?.name || ''
    const gemInfo = config.gem ? `, ${config.gem.name} ${shapeName} ${config.carats}ct` : ''
    const settingInfo = config.setting ? `, ${config.setting.name}` : ''

    const customProduct = {
      id: `custom-anillo-${Date.now()}`,
      name: `Anillo Personalizado (${config.metal?.name}${settingInfo}${gemInfo})`,
      price,
      size: `Talla ${config.size}${config.engraving ? ` — Grabado: "${config.engraving}"` : ''}`,
    }

    addToCart(customProduct)
    showToast('🛒 ¡Anillo añadido al carrito!')
    setShowSummary(true)
  }

  const totalPrice = calculatePrice(config)

  /* ============================================================
     RENDER: SETUP PHASE
     ============================================================ */
  if (phase === 'setup') {
    return (
      <div className="page-enter ring-builder-setup">
        <div className="rb-setup-container">
          <div className="rb-setup-header">
            <p className="rb-setup-label">EXPERIENCIA PERSONALIZADA</p>
            <h1 className="text-headline font-serif">Arma tu propio anillo</h1>
            <p className="rb-setup-subtitle">
              Diseña la pieza de tus sueños, pieza por pieza. Como un videojuego, ensambla cada componente de tu anillo hasta crear algo único y verdaderamente tuyo.
            </p>
          </div>

          {/* Metal Selection */}
          <div className="rb-setup-section">
            <h2 className="rb-setup-section-title">
              <span className="rb-step-num">01</span>
              ¿Cuál es tu metal?
            </h2>
            <div className="rb-metal-grid">
              {METALS.map(m => (
                <button
                  key={m.id}
                  className={`rb-metal-card ${selectedMetal === m.id ? 'rb-metal-active' : ''}`}
                  onClick={() => setSelectedMetal(m.id)}
                >
                  <div className="rb-metal-swatch" style={{ background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]}, ${m.gradient[2]})` }} />
                  <span className="rb-metal-name">{m.name}</span>
                  <span className="rb-metal-price">
                    {m.price === 0 ? 'Base' : `+$${m.price.toLocaleString('es-CO')}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="rb-setup-section">
            <h2 className="rb-setup-section-title">
              <span className="rb-step-num">02</span>
              ¿Cuál es tu talla?
            </h2>
            <div className="rb-size-grid">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`rb-size-btn ${selectedSize === s ? 'rb-size-active' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="rb-size-hint">
              💡 ¿No sabes tu talla? Visita nuestra <Link href="/guias" style={{ color: 'var(--primary)' }}>guía de tallas</Link>
            </p>
          </div>

          {/* Start Button */}
          <button
            className="btn-primary rb-start-btn"
            disabled={!selectedMetal || !selectedSize}
            onClick={handleStartBuilder}
            style={{ opacity: (!selectedMetal || !selectedSize) ? 0.4 : 1 }}
          >
            🚀 INICIAR EL TALLER
          </button>
        </div>

        <style jsx>{`
          .ring-builder-setup {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6rem 6% 4rem;
          }
          .rb-setup-container {
            max-width: 700px;
            width: 100%;
          }
          .rb-setup-header {
            text-align: center;
            margin-bottom: 3.5rem;
          }
          .rb-setup-label {
            font-family: 'Manrope', sans-serif;
            font-size: 0.7rem;
            letter-spacing: 0.25em;
            color: var(--primary);
            margin-bottom: 1rem;
            text-transform: uppercase;
          }
          .rb-setup-subtitle {
            color: var(--on-surface-variant);
            font-size: 0.95rem;
            margin-top: 1rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.7;
          }
          .rb-setup-section {
            margin-bottom: 3rem;
          }
          .rb-setup-section-title {
            font-family: 'Manrope', sans-serif;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--on-surface);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .rb-step-num {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--primary);
            color: var(--on-primary);
            font-size: 0.75rem;
            font-weight: 700;
          }
          .rb-metal-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
          }
          .rb-metal-card {
            background: var(--surface-low);
            border: 2px solid var(--outline-variant);
            padding: 1.25rem;
            cursor: pointer;
            transition: all 0.3s var(--ease-out);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            font-family: 'Manrope', sans-serif;
          }
          .rb-metal-card:hover {
            border-color: var(--primary);
            background: var(--surface-container);
            transform: translateY(-2px);
          }
          .rb-metal-active {
            border-color: var(--primary) !important;
            background: rgba(212, 175, 55, 0.08) !important;
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
          }
          .rb-metal-swatch {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.1);
          }
          .rb-metal-name {
            font-size: 0.8rem;
            color: var(--on-surface);
            font-weight: 600;
            letter-spacing: 0.03em;
          }
          .rb-metal-price {
            font-size: 0.7rem;
            color: var(--primary);
          }
          .rb-size-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .rb-size-btn {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--surface-low);
            border: 1px solid var(--outline-variant);
            color: var(--on-surface);
            font-family: 'Manrope', sans-serif;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.25s var(--ease-out);
          }
          .rb-size-btn:hover {
            border-color: var(--primary);
            background: var(--surface-container);
          }
          .rb-size-active {
            border-color: var(--primary) !important;
            background: var(--primary) !important;
            color: var(--on-primary) !important;
            font-weight: 700;
          }
          .rb-size-hint {
            margin-top: 1rem;
            font-size: 0.8rem;
            color: var(--on-surface-variant);
          }
          .rb-start-btn {
            width: 100%;
            margin-top: 1rem;
            padding: 18px 40px;
            font-size: 1rem;
            letter-spacing: 0.15em;
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }

  /* ============================================================
     RENDER: BUILDER PHASE (Need for Speed Workshop)
     ============================================================ */
  return (
    <div className="page-enter rb-workspace">
      {/* Toast */}
      <div className={`toast ${toastVisible ? 'show' : ''}`}>{toastMsg}</div>

      {/* LEFT: Ring Visualizer */}
      <div className="rb-visualizer">
        <div className="rb-vis-header">
          <p className="rb-vis-label">VISTA PREVIA EN VIVO</p>
          <p className="rb-vis-price">
            ${totalPrice.toLocaleString('es-CO')} <span>COP</span>
          </p>
        </div>

        <div
          className={`rb-svg-container ${assembleAnim ? 'rb-assemble-flash' : ''} ${isDragOver ? 'rb-drag-target-active' : ''}`}
          ref={svgRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="rb-ring-svg">
            {/* Background shimmer */}
            <defs>
              <radialGradient id="bgShimmer" cx="50%" cy="45%" r="50%">
                <stop offset="0%" stopColor="rgba(212,175,55,0.06)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
            </defs>
            <rect width="400" height="400" fill="url(#bgShimmer)" />

            {/* Ring Assembly — Layered like Lego */}
            {config.metal && <RingBand metal={config.metal} hasCintillo={config.setting?.id === 'cintillo'} />}
            {config.setting && config.metal && <SettingMount setting={config.setting} metal={config.metal} />}
            <SnapZone active={isDragOver} hasGem={!!config.gem} />
            {config.gem && <GemStone gem={config.gem} shape={config.gemShape} carats={config.carats} />}
            {config.metal && <EngravingPreview text={config.engraving} metal={config.metal} />}
          </svg>

          {/* Assembly particles */}
          {assembleAnim && (
            <div className="rb-particles">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="rb-particle" style={{
                  '--angle': `${(360 / 12) * i}deg`,
                  '--delay': `${i * 30}ms`,
                  background: config.metal?.preview || 'var(--primary)',
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Spec summary beneath the ring */}
        <div className="rb-spec-bar">
          <div className="rb-spec-item">
            <span className="rb-spec-key">Metal</span>
            <span className="rb-spec-val">{config.metal?.name}</span>
          </div>
          {config.setting && (
            <div className="rb-spec-item">
              <span className="rb-spec-key">Montura</span>
              <span className="rb-spec-val">{config.setting.name}</span>
            </div>
          )}
          {config.gem && (
            <div className="rb-spec-item">
              <span className="rb-spec-key">Gema</span>
              <span className="rb-spec-val">{config.gem.name} {config.carats}ct</span>
            </div>
          )}
          <div className="rb-spec-item">
            <span className="rb-spec-key">Talla</span>
            <span className="rb-spec-val">{config.size}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="rb-actions">
          <button
            className="btn-primary"
            onClick={handleAddToCart}
            disabled={!config.setting || !config.gem}
            style={{ opacity: (!config.setting || !config.gem) ? 0.4 : 1, flex: 1 }}
          >
            🛒 Añadir al Carrito
          </button>
          <a
            href={`https://wa.me/573001234567?text=${buildWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ flex: 1, textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            💬 Cotizar por WhatsApp
          </a>
        </div>
      </div>

      {/* RIGHT: Parts Panel (Need for Speed Sidebar) */}
      <div className="rb-parts-panel">
        <div className="rb-panel-header">
          <h2 className="rb-panel-title">🛠️ TALLER DE PERSONALIZACIÓN</h2>
          <p className="rb-panel-subtitle">Selecciona y arrastra las piezas</p>
        </div>

        {/* Category Tabs */}
        <div className="rb-category-tabs">
          {[
            { id: 'metales', label: '🛸 Chasis', icon: '🛸' },
            { id: 'monturas', label: '⚙️ Soporte', icon: '⚙️' },
            { id: 'gemas', label: '💎 Joyas', icon: '💎' },
            { id: 'detalles', label: '✍️ Vinilo', icon: '✍️' },
          ].map(cat => (
            <button
              key={cat.id}
              className={`rb-cat-tab ${activeCategory === cat.id ? 'rb-cat-active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Category Content */}
        <div className="rb-category-content">

          {/* METALS */}
          {activeCategory === 'metales' && (
            <div className="rb-cat-section fade-in">
              <p className="rb-cat-desc">Cambia el metal base de tu anillo en cualquier momento</p>
              <div className="rb-parts-list">
                {METALS.map(m => (
                  <button
                    key={m.id}
                    className={`rb-part-card ${config.metal?.id === m.id ? 'rb-part-equipped' : ''}`}
                    onClick={() => changeMetal(m.id)}
                  >
                    <div className="rb-part-icon" style={{ background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})` }} />
                    <div className="rb-part-info">
                      <span className="rb-part-name">{m.name}</span>
                      <span className="rb-part-price">{m.price === 0 ? 'Incluido' : `+$${m.price.toLocaleString('es-CO')}`}</span>
                    </div>
                    {config.metal?.id === m.id && <span className="rb-part-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeCategory === 'monturas' && (
            <div className="rb-cat-section fade-in">
              <p className="rb-cat-desc">Elige cómo quieres que se sostenga la gema principal</p>
              <div className="rb-parts-list">
                {SETTINGS.map(s => (
                  <button
                    key={s.id}
                    className={`rb-part-card ${config.setting?.id === s.id ? 'rb-part-equipped' : ''}`}
                    onClick={() => equipSetting(s)}
                  >
                    <div className="rb-part-icon-text">{s.icon}</div>
                    <div className="rb-part-info">
                      <span className="rb-part-name">{s.name}</span>
                      <span className="rb-part-desc">{s.desc}</span>
                      <span className="rb-part-price">{s.price === 0 ? 'Incluido' : `+$${s.price.toLocaleString('es-CO')}`}</span>
                    </div>
                    {config.setting?.id === s.id && <span className="rb-part-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GEMS */}
          {activeCategory === 'gemas' && (
            <div className="rb-cat-section fade-in">
              <p className="rb-cat-desc">Arrastra tu gema favorita hacia el anillo o toca para equipar</p>

              {/* Gem Type */}
              <h4 className="rb-sub-title">Piedra</h4>
              <div className="rb-gem-grid">
                {GEMS.map(g => (
                  <DraggableGemCard
                    key={g.id}
                    gem={g}
                    onEquip={equipGem}
                    isEquipped={config.gem?.id === g.id}
                  />
                ))}
              </div>

              {/* Gem Shape */}
              <h4 className="rb-sub-title" style={{ marginTop: '1.5rem' }}>Corte / Forma</h4>
              <div className="rb-shape-grid">
                {GEM_SHAPES.map(s => (
                  <button
                    key={s.id}
                    className={`rb-shape-btn ${config.gemShape === s.id ? 'rb-shape-active' : ''}`}
                    onClick={() => setConfig(prev => ({ ...prev, gemShape: s.id }))}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Carats */}
              <h4 className="rb-sub-title" style={{ marginTop: '1.5rem' }}>Quilates</h4>
              <div className="rb-carat-grid">
                {CARAT_OPTIONS.map(c => (
                  <button
                    key={c}
                    className={`rb-size-btn ${config.carats === c ? 'rb-size-active' : ''}`}
                    onClick={() => setConfig(prev => ({ ...prev, carats: c }))}
                  >
                    {c} ct
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ENGRAVING */}
          {activeCategory === 'detalles' && (
            <div className="rb-cat-section fade-in">
              <p className="rb-cat-desc">Añade un grabado personalizado en el interior de la banda</p>
              <div className="rb-engrave-field">
                <label htmlFor="engravingInput" className="rb-engrave-label">Texto del Grabado (Opcional)</label>
                <input
                  id="engravingInput"
                  type="text"
                  maxLength={25}
                  placeholder='Ej: "A & L — 2026"'
                  value={config.engraving}
                  onChange={(e) => setConfig(prev => ({ ...prev, engraving: e.target.value }))}
                  className="rb-engrave-input"
                />
                <p className="rb-engrave-counter">{config.engraving.length}/25 caracteres</p>
                {config.engraving && (
                  <p className="rb-engrave-cost">+$50.000 COP por grabado láser</p>
                )}
              </div>

              {/* Size change */}
              <h4 className="rb-sub-title" style={{ marginTop: '2rem' }}>Cambiar Talla</h4>
              <div className="rb-size-grid" style={{ flexWrap: 'wrap' }}>
                {SIZES.map(s => (
                  <button
                    key={s}
                    className={`rb-size-btn ${config.size === s ? 'rb-size-active' : ''}`}
                    onClick={() => setConfig(prev => ({ ...prev, size: s }))}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        /* =========================================
           WORKSPACE LAYOUT
           ========================================= */
        .rb-workspace {
          display: grid;
          grid-template-columns: 1fr 420px;
          min-height: 100vh;
          padding-top: 5.5rem;
        }

        /* =========================================
           LEFT: VISUALIZER
           ========================================= */
        .rb-visualizer {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 3rem;
          position: sticky;
          top: 5.5rem;
          height: calc(100vh - 5.5rem);
        }
        .rb-vis-header {
          text-align: center;
          margin-bottom: 1rem;
        }
        .rb-vis-label {
          font-family: 'Manrope', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          color: var(--on-surface-variant);
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }
        .rb-vis-price {
          font-family: 'Noto Serif', serif;
          font-size: 2rem;
          color: var(--primary);
          font-weight: 400;
        }
        .rb-vis-price span {
          font-size: 0.9rem;
          color: var(--on-surface-variant);
        }

        .rb-svg-container {
          position: relative;
          width: 100%;
          max-width: 420px;
          aspect-ratio: 1 / 1;
          border: 1px solid var(--outline-variant);
          background: radial-gradient(circle at 50% 40%, rgba(212,175,55,0.04), transparent 70%);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .rb-svg-container:hover {
          border-color: rgba(212,175,55,0.3);
        }
        .rb-drag-target-active {
          border-color: var(--primary) !important;
          box-shadow: inset 0 0 40px rgba(212,175,55,0.08), 0 0 30px rgba(212,175,55,0.1);
        }
        .rb-ring-svg {
          width: 100%;
          height: 100%;
        }

        /* Assemble flash */
        .rb-assemble-flash {
          animation: assembleFlash 0.5s ease-out;
        }
        @keyframes assembleFlash {
          0% { box-shadow: 0 0 0 rgba(212,175,55,0); }
          30% { box-shadow: 0 0 60px rgba(212,175,55,0.4); }
          100% { box-shadow: 0 0 0 rgba(212,175,55,0); }
        }

        /* Particles */
        .rb-particles {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        .rb-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: particleBurst 0.6s ease-out forwards;
          animation-delay: var(--delay);
        }
        @keyframes particleBurst {
          0% { transform: rotate(var(--angle)) translateX(0) scale(1); opacity: 1; }
          100% { transform: rotate(var(--angle)) translateX(80px) scale(0); opacity: 0; }
        }

        /* Spec Bar */
        .rb-spec-bar {
          display: flex;
          gap: 1.5rem;
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: var(--surface-low);
          border: 1px solid var(--outline-variant);
          flex-wrap: wrap;
          justify-content: center;
        }
        .rb-spec-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
        }
        .rb-spec-key {
          font-family: 'Manrope', sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--on-surface-variant);
        }
        .rb-spec-val {
          font-size: 0.78rem;
          color: var(--on-surface);
          font-weight: 600;
        }

        /* Action Buttons */
        .rb-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          width: 100%;
          max-width: 420px;
        }

        /* =========================================
           RIGHT: PARTS PANEL
           ========================================= */
        .rb-parts-panel {
          background: var(--surface);
          border-left: 1px solid var(--outline-variant);
          overflow-y: auto;
          height: calc(100vh - 5.5rem);
          position: sticky;
          top: 5.5rem;
          display: flex;
          flex-direction: column;
        }
        .rb-panel-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid var(--outline-variant);
        }
        .rb-panel-title {
          font-family: 'Manrope', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          color: var(--primary);
          font-weight: 700;
        }
        .rb-panel-subtitle {
          font-size: 0.75rem;
          color: var(--on-surface-variant);
          margin-top: 0.25rem;
        }

        /* Category Tabs */
        .rb-category-tabs {
          display: flex;
          border-bottom: 1px solid var(--outline-variant);
          overflow-x: auto;
        }
        .rb-cat-tab {
          flex: 1;
          padding: 0.85rem 0.5rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          font-family: 'Manrope', sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.05em;
          color: var(--on-surface-variant);
          cursor: pointer;
          transition: all 0.25s var(--ease-out);
          white-space: nowrap;
        }
        .rb-cat-tab:hover {
          color: var(--on-surface);
          background: rgba(212,175,55,0.03);
        }
        .rb-cat-active {
          color: var(--primary) !important;
          border-bottom-color: var(--primary) !important;
          font-weight: 600;
        }

        /* Category Content */
        .rb-category-content {
          flex: 1;
          padding: 1.25rem;
          overflow-y: auto;
        }
        .rb-cat-desc {
          font-size: 0.78rem;
          color: var(--on-surface-variant);
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }
        .rb-sub-title {
          font-family: 'Manrope', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--on-surface-variant);
          margin-bottom: 0.75rem;
        }

        /* Parts List */
        .rb-parts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .rb-part-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--surface-low);
          border: 1px solid var(--outline-variant);
          cursor: pointer;
          transition: all 0.25s var(--ease-out);
          text-align: left;
          font-family: 'Manrope', sans-serif;
        }
        .rb-part-card:hover {
          border-color: var(--primary);
          background: var(--surface-container);
          transform: translateX(4px);
        }
        .rb-part-equipped {
          border-color: var(--primary) !important;
          background: rgba(212,175,55,0.06) !important;
        }
        .rb-part-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .rb-part-icon-text {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .rb-part-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .rb-part-name {
          font-size: 0.82rem;
          color: var(--on-surface);
          font-weight: 600;
        }
        .rb-part-desc {
          font-size: 0.7rem;
          color: var(--on-surface-variant);
        }
        .rb-part-price {
          font-size: 0.72rem;
          color: var(--primary);
          font-weight: 500;
        }
        .rb-part-check {
          color: var(--primary);
          font-size: 1.1rem;
          font-weight: 700;
        }

        /* Gem Grid */
        .rb-gem-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        /* Shape Grid */
        .rb-shape-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .rb-shape-btn {
          padding: 8px 14px;
          background: var(--surface-low);
          border: 1px solid var(--outline-variant);
          color: var(--on-surface-variant);
          font-family: 'Manrope', sans-serif;
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
        }
        .rb-shape-btn:hover {
          border-color: var(--primary);
        }
        .rb-shape-active {
          border-color: var(--primary) !important;
          background: var(--primary) !important;
          color: var(--on-primary) !important;
          font-weight: 600;
        }

        /* Carat Grid */
        .rb-carat-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        /* Size Grid (reuse from setup) */
        .rb-size-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        /* Engraving */
        .rb-engrave-field {
          margin-top: 0.5rem;
        }
        .rb-engrave-label {
          display: block;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          color: var(--on-surface-variant);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        .rb-engrave-input {
          width: 100%;
          padding: 12px 16px;
          background: var(--surface-low);
          border: 1px solid var(--outline-variant);
          color: var(--on-surface);
          font-family: 'Noto Serif', serif;
          font-style: italic;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.3s ease;
          letter-spacing: 0.05em;
        }
        .rb-engrave-input:focus {
          border-color: var(--primary);
        }
        .rb-engrave-input::placeholder {
          color: var(--text-muted);
          opacity: 0.5;
        }
        .rb-engrave-counter {
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 0.4rem;
          text-align: right;
        }
        .rb-engrave-cost {
          font-size: 0.72rem;
          color: var(--primary);
          margin-top: 0.5rem;
        }

        /* =========================================
           RESPONSIVE
           ========================================= */
        @media (max-width: 900px) {
          .rb-workspace {
            grid-template-columns: 1fr;
          }
          .rb-visualizer {
            position: relative;
            top: auto;
            height: auto;
            padding: 1.5rem;
            min-height: unset;
          }
          .rb-parts-panel {
            position: relative;
            top: auto;
            height: auto;
            border-left: none;
            border-top: 1px solid var(--outline-variant);
          }
          .rb-actions {
            flex-direction: column;
          }
        }
      `}</style>

      {/* Global gem card styles (not scoped to JSX) */}
      <style jsx global>{`
        .gem-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem;
          background: var(--surface-low);
          border: 1px solid var(--outline-variant);
          cursor: grab;
          transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
          user-select: none;
        }
        .gem-card:hover {
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .gem-card:active {
          cursor: grabbing;
          transform: scale(0.95);
        }
        .gem-card-equipped {
          border-color: var(--primary) !important;
          background: rgba(212,175,55,0.06) !important;
        }
        .gem-card-preview {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255,255,255,0.1);
        }
        .gem-card-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.1rem;
        }
        .gem-card-name {
          font-family: 'Manrope', sans-serif;
          font-size: 0.75rem;
          color: var(--on-surface);
          font-weight: 600;
        }
        .gem-card-price {
          font-family: 'Manrope', sans-serif;
          font-size: 0.65rem;
          color: var(--primary);
        }
        .gem-equipped-badge {
          font-size: 0.6rem;
          color: var(--primary);
          font-weight: 700;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  )
}
