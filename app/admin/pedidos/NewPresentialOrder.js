'use client'

import { useState } from 'react'

const ACCESSORIES = [
  { id: 'estuche_led', label: 'Estuche con Luz LED', price: 65000 },
  { id: 'estuche_terciopelo', label: 'Estuche de Terciopelo', price: 23000 },
  { id: 'bolsa_regalo', label: 'Bolsa de Regalo Zafhira', price: 13000 },
  { id: 'pano_limpiador', label: 'Paño Limpiador', price: 5000 },
  { id: 'certificado', label: 'Certificado de Autenticidad', price: 0 },
]

const CARRIERS = ['Inter Rapidísimo', 'Coordinadora', 'Servientrega', 'Envía']
const PAYMENT_METHODS = ['Efectivo', 'Nequi', 'Bancolombia', 'Daviplata', 'Datáfono']

export default function NewPresentialOrder({ products, onClose, onCreated }) {
  const [selectedProductId, setSelectedProductId] = useState('')
  const [accessories, setAccessories] = useState([])
  const [paymentType, setPaymentType] = useState('total')
  const [paidAmount, setPaidAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Nequi')
  const [deliveryMethod, setDeliveryMethod] = useState('envio')
  const [shippingCarrier, setShippingCarrier] = useState('Inter Rapidísimo')
  const [shippingCost, setShippingCost] = useState('16500')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const product = products?.find(p => String(p.id) === String(selectedProductId)) || null
  const productPrice = product?.price || 0
  const productCost = product?.production_cost || 0

  const accessoriesCost = accessories.reduce((sum, accId) => {
    const acc = ACCESSORIES.find(a => a.id === accId)
    return sum + (acc?.price || 0)
  }, 0)

  const accessoriesDesc = accessories.map(accId => {
    const acc = ACCESSORIES.find(a => a.id === accId)
    return acc ? `${acc.label} ($${acc.price.toLocaleString('es-CO')})` : ''
  }).filter(Boolean).join(', ')

  const shippingCostNum = deliveryMethod === 'envio' ? (parseFloat(shippingCost) || 0) : 0
  const total = productPrice
  const paid = paymentType === 'total' ? total : (parseFloat(paidAmount) || 0)
  const balance = Math.max(0, total - paid)
  const netProfit = productPrice - productCost - accessoriesCost - shippingCostNum

  const handleToggleAccessory = (accId) => {
    setAccessories(prev =>
      prev.includes(accId) ? prev.filter(id => id !== accId) : [...prev, accId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!product) return

    setSubmitting(true)
    setError(null)

    const formData = new FormData(e.target)
    const orderData = {
      customer_name: formData.get('customer_name'),
      customer_phone: formData.get('customer_phone'),
      customer_email: formData.get('customer_email') || '',
      shipping_address: deliveryMethod === 'envio' ? (formData.get('shipping_address') || '') : 'Recoge en oficina',
      shipping_city: deliveryMethod === 'envio' ? (formData.get('shipping_city') || 'Bogotá') : 'Bogotá',
      shipping_method: deliveryMethod === 'envio' ? 'estandar' : 'pickup',
      items: [{
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        size: formData.get('custom_size') || '',
      }],
      subtotal: productPrice,
      shipping_cost: shippingCostNum,
      total: total,
      payment_proof_url: '',
      // Logistics fields
      reference: product.reference || '',
      production_cost: productCost,
      accessories_description: accessoriesDesc,
      accessories_cost: accessoriesCost,
      payment_type: paymentType,
      paid_amount: paid,
      payment_method: paymentMethod,
      delivery_method: deliveryMethod,
      shipping_carrier: deliveryMethod === 'envio' ? shippingCarrier : '',
      shipping_guide: '',
      shipping_status: 'sin_despachar',
      workshop_status: 'por_iniciar',
      custom_details: formData.get('custom_details') || '',
      order_source: 'presencial',
      admin_notes: formData.get('admin_notes') || '',
    }

    try {
      const res = await fetch('/api/orders/presential', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al crear el pedido')
      }

      if (onCreated) onCreated()
      if (onClose) onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const labelStyle = {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--on-surface-variant)',
    display: 'block',
    marginBottom: '4px'
  }

  const inputStyle = {
    width: '100%',
    padding: '10px',
    background: 'var(--surface-container)',
    border: '1px solid var(--outline-variant)',
    color: 'var(--on-surface)',
    fontSize: '0.85rem'
  }

  const sectionTitle = (text) => (
    <h3 style={{
      fontSize: '0.7rem',
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      color: 'var(--primary)',
      borderBottom: '1px solid var(--outline-variant)',
      paddingBottom: '8px',
      marginBottom: '1rem',
      marginTop: '1.5rem'
    }}>{text}</h3>
  )

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(5px)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '2rem',
      overflowY: 'auto'
    }}>
      <div className="panel-elevated" style={{
        width: '100%',
        maxWidth: '700px',
        padding: '2rem',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '1.3rem', letterSpacing: '0.05em', margin: 0 }}>
            Nuevo Pedido Presencial
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: '1.5rem', padding: '4px' }}
          >×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 1. DATOS DEL CLIENTE */}
          {sectionTitle('1. Datos del Cliente')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Nombre Completo *</label>
              <input name="customer_name" required placeholder="Nombre del cliente" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Teléfono / WhatsApp *</label>
              <input name="customer_phone" required placeholder="310 123 4567" style={inputStyle} />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <label style={labelStyle}>Email (Opcional)</label>
            <input name="customer_email" type="email" placeholder="cliente@email.com" style={inputStyle} />
          </div>

          {/* 2. DETALLE DE LA JOYA */}
          {sectionTitle('2. Detalle de la Joya')}
          <div>
            <label style={labelStyle}>Pieza del Catálogo *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
              style={inputStyle}
            >
              <option value="">-- Seleccionar pieza --</option>
              {products?.map(p => (
                <option key={p.id} value={p.id}>
                  {p.reference ? `[${p.reference}] ` : ''}{p.title} — ${p.price?.toLocaleString('es-CO')}
                </option>
              ))}
            </select>
          </div>
          {product && (
            <div style={{ marginTop: '0.75rem', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
              Referencia: <strong style={{ color: 'var(--on-surface)' }}>{product.reference || 'N/A'}</strong> &nbsp;|&nbsp;
              Costo: <strong style={{ color: 'var(--on-surface)' }}>${productCost.toLocaleString('es-CO')}</strong> &nbsp;|&nbsp;
              PV: <strong style={{ color: 'var(--primary)' }}>${productPrice.toLocaleString('es-CO')}</strong>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Talla / Medida / Largo</label>
              <input name="custom_size" placeholder="Ej. Talla 6.5 o 60cm" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Grabado / Personalización</label>
              <input name="custom_details" placeholder="Ej. J & M 2026" style={inputStyle} />
            </div>
          </div>

          {/* 3. ACCESORIOS */}
          {sectionTitle('3. Accesorios y Empaque')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ACCESSORIES.map(acc => (
              <label
                key={acc.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  cursor: 'pointer', fontSize: '0.85rem', color: 'var(--on-surface)',
                  padding: '8px 12px',
                  background: accessories.includes(acc.id) ? 'rgba(191,163,117,0.08)' : 'transparent',
                  border: `1px solid ${accessories.includes(acc.id) ? 'var(--primary)' : 'var(--outline-variant)'}`,
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={accessories.includes(acc.id)}
                  onChange={() => handleToggleAccessory(acc.id)}
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                />
                <span style={{ flex: 1 }}>{acc.label}</span>
                <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem' }}>
                  {acc.price > 0 ? `$${acc.price.toLocaleString('es-CO')}` : 'Incluido'}
                </span>
              </label>
            ))}
          </div>

          {/* 4. PAGO */}
          {sectionTitle('4. Pago y Cartera')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Tipo de Pago</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['total', 'parcial'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setPaymentType(type); if (type === 'total') setPaidAmount('') }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: paymentType === type ? 'var(--primary)' : 'var(--surface-container)',
                      color: paymentType === type ? '#000' : 'var(--on-surface-variant)',
                      border: `1px solid ${paymentType === type ? 'var(--primary)' : 'var(--outline-variant)'}`,
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {type === 'total' ? 'Pago Total' : 'Abono Parcial'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Método de Pago</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={inputStyle}>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {paymentType === 'parcial' && (
            <div style={{ marginTop: '0.75rem' }}>
              <label style={labelStyle}>Monto Abonado (COP) *</label>
              <input
                type="number"
                value={paidAmount}
                onChange={e => setPaidAmount(e.target.value)}
                placeholder="Ej. 500000"
                required
                style={inputStyle}
              />
            </div>
          )}

          {/* 5. ENTREGA */}
          {sectionTitle('5. Entrega y Logística')}
          <div>
            <label style={labelStyle}>Modalidad de Entrega</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[{ value: 'oficina', label: '🏢 Recoge en Oficina' }, { value: 'envio', label: '🚚 Envío Nacional' }].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDeliveryMethod(opt.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: deliveryMethod === opt.value ? 'var(--primary)' : 'var(--surface-container)',
                    color: deliveryMethod === opt.value ? '#000' : 'var(--on-surface-variant)',
                    border: `1px solid ${deliveryMethod === opt.value ? 'var(--primary)' : 'var(--outline-variant)'}`,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {deliveryMethod === 'envio' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Transportadora</label>
                  <select value={shippingCarrier} onChange={e => setShippingCarrier(e.target.value)} style={inputStyle}>
                    {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Costo del Flete (COP)</label>
                  <input type="number" value={shippingCost} onChange={e => setShippingCost(e.target.value)} style={inputStyle} />
                  <span style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', marginTop: '2px', display: 'block' }}>
                    Asumido por Zafhira (gratis para el cliente)
                  </span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Dirección de Envío</label>
                  <input name="shipping_address" placeholder="Calle / Carrera / Barrio" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ciudad</label>
                  <input name="shipping_city" placeholder="Ej. Medellín" style={inputStyle} />
                </div>
              </div>
            </>
          )}

          {/* 6. NOTAS INTERNAS */}
          {sectionTitle('6. Notas Internas (Solo Admin)')}
          <textarea name="admin_notes" rows={2} placeholder="Notas internas del pedido..." style={{ ...inputStyle, resize: 'vertical' }} />

          {/* RESUMEN FINANCIERO */}
          {product && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: 'var(--surface-container)',
              border: '1px solid var(--outline-variant)'
            }}>
              <h3 style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--primary)',
                marginBottom: '1rem'
              }}>Resumen Financiero</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>Precio de Venta</span>
                  <span style={{ color: 'var(--on-surface)' }}>${productPrice.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>Costo de Taller</span>
                  <span style={{ color: 'var(--on-surface)' }}>-${productCost.toLocaleString('es-CO')}</span>
                </div>
                {accessoriesCost > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--on-surface-variant)' }}>Accesorios</span>
                    <span style={{ color: 'var(--on-surface)' }}>-${accessoriesCost.toLocaleString('es-CO')}</span>
                  </div>
                )}
                {shippingCostNum > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--on-surface-variant)' }}>Flete (asumido Zafhira)</span>
                    <span style={{ color: 'var(--on-surface)' }}>-${shippingCostNum.toLocaleString('es-CO')}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '0.5rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-heading)' }}>⭐ Ganancia Neta</span>
                  <span style={{ color: netProfit > 0 ? '#51cf66' : '#ff4444', fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
                    ${netProfit.toLocaleString('es-CO')}
                  </span>
                </div>
                {productPrice > 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', textAlign: 'right' }}>
                    Margen Neto: {((netProfit / productPrice) * 100).toFixed(1)}%
                  </div>
                )}
              </div>

              {balance > 0 && (
                <div style={{
                  marginTop: '1rem',
                  padding: '8px 12px',
                  background: 'rgba(255,68,68,0.1)',
                  border: '1px solid rgba(255,68,68,0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#ff6b6b', fontSize: '0.8rem', fontWeight: 600 }}>Saldo Pendiente</span>
                  <span style={{ color: '#ff4444', fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    ${balance.toLocaleString('es-CO')}
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div style={{ padding: '10px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff6b6b', fontSize: '0.8rem', marginTop: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: 'transparent',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >CANCELAR</button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !product}
              style={{
                flex: 2,
                padding: '12px',
                opacity: submitting || !product ? 0.5 : 1,
                cursor: submitting || !product ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'PROCESANDO...' : 'GUARDAR PEDIDO 💎'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
