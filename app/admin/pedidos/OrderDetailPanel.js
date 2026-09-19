'use client'

import { useState } from 'react'
import ShippingTracker from './ShippingTracker'
import WhatsAppButton from './WhatsAppButton'

const CARRIERS = ['Inter Rapidísimo', 'Coordinadora', 'Servientrega', 'Envía']

export default function OrderDetailPanel({ order, updateFieldAction }) {
  const [editingGuide, setEditingGuide] = useState(false)
  const [guide, setGuide] = useState(order.shipping_guide || '')
  const [carrier, setCarrier] = useState(order.shipping_carrier || 'Inter Rapidísimo')
  const [registeringPayment, setRegisteringPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')

  const balance = (order.total || 0) - (order.paid_amount || 0)
  const productionCost = order.production_cost || 0
  const accessoriesCost = order.accessories_cost || 0
  const shippingCost = order.shipping_cost || 0
  const netProfit = (order.total || 0) - productionCost - accessoriesCost - shippingCost

  const labelStyle = {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--on-surface-variant)',
    marginBottom: '8px'
  }

  return (
    <div style={{
      marginTop: '1.5rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid var(--outline-variant)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '2rem'
    }}>
      {/* Column 1: Financial */}
      <div>
        <h4 style={labelStyle}>Detalle Financiero</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
          {productionCost > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--on-surface-variant)' }}>Costo Taller</span>
              <span style={{ color: 'var(--on-surface)' }}>${productionCost.toLocaleString('es-CO')}</span>
            </div>
          )}
          {accessoriesCost > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--on-surface-variant)' }}>Accesorios</span>
              <span style={{ color: 'var(--on-surface)' }}>${accessoriesCost.toLocaleString('es-CO')}</span>
            </div>
          )}
          {order.accessories_description && (
            <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', fontStyle: 'italic', marginBottom: '0.25rem' }}>
              {order.accessories_description}
            </div>
          )}
          {shippingCost > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--on-surface-variant)' }}>Flete Zafhira</span>
              <span style={{ color: 'var(--on-surface)' }}>${shippingCost.toLocaleString('es-CO')}</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '0.5rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span style={{ color: 'var(--on-surface)' }}>Ganancia Neta</span>
            <span style={{ color: netProfit > 0 ? '#51cf66' : '#ff4444' }}>
              ${netProfit.toLocaleString('es-CO')}
            </span>
          </div>
        </div>
      </div>

      {/* Column 2: Payment Status */}
      <div>
        <h4 style={labelStyle}>Estado de Pago</h4>
        <div style={{ fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--on-surface-variant)' }}>Abonado</span>
            <span style={{ color: '#51cf66' }}>${(order.paid_amount || 0).toLocaleString('es-CO')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--on-surface-variant)' }}>Método</span>
            <span style={{ color: 'var(--on-surface)' }}>{order.payment_method || 'N/A'}</span>
          </div>
          {balance > 0 && (
            <div style={{
              padding: '8px 12px',
              background: 'rgba(255,68,68,0.1)',
              border: '1px solid rgba(255,68,68,0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <span style={{ color: '#ff6b6b', fontSize: '0.75rem', fontWeight: 600 }}>Saldo Pendiente</span>
              <span style={{ color: '#ff4444', fontWeight: 700 }}>${balance.toLocaleString('es-CO')}</span>
            </div>
          )}
          {balance > 0 && !registeringPayment && (
            <button
              type="button"
              onClick={() => setRegisteringPayment(true)}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '8px',
                background: 'transparent',
                border: '1px solid #51cf66',
                color: '#51cf66',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >💵 Registrar Abono / Saldo</button>
          )}
          {registeringPayment && (
            <form action={updateFieldAction} style={{ marginTop: '0.5rem' }}>
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="field" value="register_payment" />
              <input
                name="payment_amount"
                type="number"
                placeholder="Monto recibido (COP)"
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', fontSize: '0.8rem', marginBottom: '0.5rem' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" style={{ flex: 1, padding: '6px', background: '#51cf66', border: 'none', color: '#000', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Confirmar
                </button>
                <button type="button" onClick={() => setRegisteringPayment(false)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Column 3: Shipping */}
      <div>
        <h4 style={labelStyle}>Envío y Logística</h4>
        <div>
          {order.delivery_method === 'oficina' ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', padding: '8px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', marginBottom: '0.75rem' }}>
              🏢 Recoge en oficina
            </div>
          ) : (
            <div style={{ marginBottom: '0.75rem' }}>
              {order.shipping_guide ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <ShippingTracker carrier={order.shipping_carrier || carrier} guide={order.shipping_guide} />
                </div>
              ) : !editingGuide ? (
                <button
                  type="button"
                  onClick={() => setEditingGuide(true)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'transparent',
                    border: '1px dashed var(--outline)',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}
                >+ Asignar Guía de Envío</button>
              ) : (
                <form action={updateFieldAction} style={{ marginBottom: '0.5rem' }}>
                  <input type="hidden" name="id" value={order.id} />
                  <input type="hidden" name="field" value="shipping_guide" />
                  <select
                    name="shipping_carrier"
                    value={carrier}
                    onChange={e => setCarrier(e.target.value)}
                    style={{ width: '100%', padding: '6px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', fontSize: '0.8rem', marginBottom: '0.25rem' }}
                  >
                    {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    name="guide_number"
                    value={guide}
                    onChange={e => setGuide(e.target.value)}
                    placeholder="Número de guía"
                    required
                    style={{ width: '100%', padding: '6px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '0.25rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button type="submit" style={{ flex: 1, padding: '6px', background: 'var(--primary)', border: 'none', color: '#000', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      Guardar Guía
                    </button>
                    <button type="button" onClick={() => setEditingGuide(false)} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* WhatsApp Button */}
          <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            <WhatsAppButton order={order} />
          </div>

          {/* Custom details */}
          {order.custom_details && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
              <span style={{ fontWeight: 600 }}>Personalización:</span> {order.custom_details}
            </div>
          )}

          {/* Order source badge */}
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{
              fontSize: '0.6rem',
              padding: '2px 8px',
              background: order.order_source === 'presencial' ? 'rgba(74,144,226,0.15)' : 'rgba(81,207,102,0.15)',
              color: order.order_source === 'presencial' ? '#4a90e2' : '#51cf66',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {order.order_source === 'presencial' ? '🏢 Presencial' : '🌐 Web'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
