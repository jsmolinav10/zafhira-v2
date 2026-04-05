'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function CheckoutPage() {
  const { cart, subtotal, clearCart, isLoaded } = useCart()
  const [shippingMethod, setShippingMethod] = useState('estandar')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [proofFile, setProofFile] = useState(null)
  const [proofPreview, setProofPreview] = useState(null)

  const [form, setForm] = useState({
    email: '', name: '', address: '', city: '', phone: '',
  })

  const shippingCost = shippingMethod === 'expres' ? 20000 : 0
  const total = subtotal + shippingCost

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProofFile(file)
      setProofPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return
    if (!proofFile) {
      alert('Por favor sube el comprobante de pago antes de finalizar.')
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      // 1. Upload payment proof
      const fileExt = proofFile.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('comprobantes')
        .upload(fileName, proofFile)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        alert('Error al subir el comprobante. Intenta de nuevo.')
        setSubmitting(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('comprobantes')
        .getPublicUrl(fileName)

      // 2. Create order
      const orderData = {
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_method: shippingMethod,
        items: cart.map(item => ({
          id: item.id,
          title: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || null,
        })),
        subtotal,
        shipping_cost: shippingCost,
        total,
        payment_proof_url: urlData.publicUrl,
        status: 'pendiente',
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

      if (orderError) {
        console.error('Order error:', orderError)
        alert('Error al crear el pedido. Intenta de nuevo.')
        setSubmitting(false)
        return
      }

      setOrderId(order.id)
      setOrderPlaced(true)
      clearCart()
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Ocurrió un error inesperado. Por favor intenta de nuevo.')
    }

    setSubmitting(false)
  }

  if (!isLoaded) return null

  // Success screen
  if (orderPlaced) {
    return (
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '6rem 6%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✨</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', marginBottom: '1rem' }}>
          ¡Pedido Recibido!
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
          Tu pedido ha sido registrado exitosamente. Estamos verificando tu comprobante de pago.
          Recibirás un correo en <strong>{form.email}</strong> una vez confirmemos la transacción.
        </p>
        <div style={{ 
          padding: '1.5rem', 
          background: 'var(--surface-container)', 
          border: '1px solid var(--outline-variant)', 
          marginBottom: '2rem',
          textAlign: 'left',
        }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>
            Número de pedido
          </p>
          <p style={{ fontFamily: 'monospace', color: 'var(--primary)', fontSize: '0.9rem' }}>
            {orderId?.slice(0, 8).toUpperCase()}
          </p>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', marginTop: '1rem', marginBottom: '0.5rem' }}>
            Estado
          </p>
          <span style={{ 
            padding: '4px 12px', background: 'rgba(255,170,0,0.15)', 
            color: '#ffa94d', fontSize: '0.7rem', fontWeight: 700, 
            textTransform: 'uppercase', letterSpacing: '0.05em' 
          }}>
            Pendiente de verificación
          </span>
        </div>
        <Link href="/catalogo" className="btn-primary" style={{ padding: '14px 40px' }}>
          Seguir Explorando
        </Link>
      </section>
    )
  }

  if (cart.length === 0) {
    return (
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '6rem 6%', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', marginBottom: '1rem' }}>
          Tu carrito está vacío
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2rem' }}>Agrega piezas desde nuestro catálogo.</p>
        <Link href="/catalogo" className="btn-primary" style={{ padding: '14px 40px' }}>
          Ver Catálogo
        </Link>
      </section>
    )
  }

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 6%' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
        Finalizar Compra
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.85rem', marginBottom: '3rem' }}>
        Completa los datos de envío y sube tu comprobante de pago
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* LEFT: Shipping + Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Shipping Info */}
          <div className="panel-elevated" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', color: 'var(--on-surface)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Información de Envío
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <input
                  type="email" name="email" required placeholder="Correo Electrónico"
                  value={form.email}
                  onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <input
                type="text" name="name" required placeholder="Nombre Completo"
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                style={inputStyle}
              />
              <input
                type="tel" name="phone" required placeholder="Teléfono"
                value={form.phone}
                onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                style={inputStyle}
              />
              <div style={{ gridColumn: 'span 2' }}>
                <input
                  type="text" name="address" required placeholder="Dirección Completa"
                  value={form.address}
                  onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <input
                type="text" name="city" required placeholder="Ciudad"
                value={form.city}
                onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Shipping Method */}
          <div className="panel-elevated" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', color: 'var(--on-surface)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Método de Envío
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { value: 'estandar', label: 'Envío Estándar (3-5 días)', price: 'Gratis' },
                { value: 'expres', label: 'Envío Exprés (1-2 días)', price: '$20.000' },
              ].map(opt => (
                <label key={opt.value} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                  border: shippingMethod === opt.value ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                  background: shippingMethod === opt.value ? 'rgba(186,160,113,0.05)' : 'transparent',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio" name="shipping" value={opt.value}
                      checked={shippingMethod === opt.value}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span style={{ color: 'var(--on-surface)', fontSize: '0.85rem' }}>{opt.label}</span>
                  </div>
                  <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>{opt.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* QR Payment */}
          <div className="panel-elevated" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', color: 'var(--on-surface)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Pago
            </h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Escanea el código QR con la aplicación de tu banco y realiza la transferencia por el monto total. 
              Luego sube el comprobante de pago.
            </p>
            
            {/* QR Placeholder */}
            <div style={{
              width: '200px', height: '200px',
              margin: '0 auto 1.5rem',
              background: '#fff',
              border: '2px solid var(--outline)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '0.5rem',
            }}>
              <div style={{ fontSize: '3rem' }}>📱</div>
              <span style={{ fontSize: '0.7rem', color: '#333', textAlign: 'center', padding: '0 1rem' }}>
                QR de pago — Configurable desde Admin
              </span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Total a transferir
              </p>
              <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', fontSize: '1.5rem', marginTop: '0.5rem' }}>
                $ {total.toLocaleString('es-CO')} COP
              </p>
            </div>

            {/* Upload Proof */}
            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '0.5rem' }}>
                Subir Comprobante de Pago *
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                required
                style={{
                  width: '100%', padding: '12px',
                  background: 'var(--surface-container)',
                  border: '1px dashed var(--primary)',
                  color: 'var(--primary)', cursor: 'pointer',
                }}
              />
              {proofPreview && (
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <img src={proofPreview} alt="Comprobante" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', border: '1px solid var(--outline)' }} />
                  <p style={{ fontSize: '0.75rem', color: '#51cf66', marginTop: '0.5rem' }}>✓ Comprobante cargado</p>
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', marginTop: '1rem', lineHeight: '1.6' }}>
              🔒 Tus pagos son seguros. El pedido quedará en estado <strong>pendiente</strong> hasta que verifiquemos tu comprobante. 
              Recibirás un correo de confirmación.
            </p>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="panel-elevated" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', color: 'var(--on-surface)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Resumen del Pedido
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '60px', height: '60px',
                  backgroundColor: 'var(--surface-container)',
                  border: '1px solid var(--outline)',
                  backgroundImage: item.image ? `url(${item.image})` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--on-surface)', fontWeight: 500 }}>{item.name}</p>
                  {item.size && <p style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>Talla/Largo: {item.size}</p>}
                  <p style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>Cantidad: {item.quantity}</p>
                </div>
                <p style={{ color: 'var(--on-surface)', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  $ {(item.price * item.quantity).toLocaleString('es-CO')}
                </p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--on-surface-variant)' }}>Subtotal</span>
              <span style={{ color: 'var(--on-surface)' }}>$ {subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--on-surface-variant)' }}>Envío</span>
              <span style={{ color: shippingCost === 0 ? '#51cf66' : 'var(--on-surface)' }}>
                {shippingCost === 0 ? 'Gratis' : `$ ${shippingCost.toLocaleString('es-CO')}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, paddingTop: '0.75rem', borderTop: '1px solid var(--outline-variant)' }}>
              <span style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-heading)' }}>TOTAL</span>
              <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>$ {total.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '0.85rem',
              letterSpacing: '0.15em',
              marginTop: '2rem',
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? 'wait' : 'pointer',
            }}
          >
            {submitting ? 'PROCESANDO...' : 'FINALIZAR COMPRA 🔒'}
          </button>
        </div>
      </form>

      <style jsx>{`
        @media (max-width: 768px) {
          form {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'var(--surface-container)',
  border: '1px solid var(--outline-variant)',
  color: 'var(--on-surface)',
  fontSize: '0.85rem',
  outline: 'none',
}
