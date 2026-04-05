import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import OrderActions from './OrderActions'

async function updateOrderStatus(formData) {
  'use server'
  const supabase = await createClient()
  const id = formData.get('id')
  const newStatus = formData.get('newStatus')

  await supabase.from('orders').update({ status: newStatus }).eq('id', id)

  revalidatePath('/admin/pedidos')
}

export default async function PedidosPage() {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const statusColors = {
    pendiente: { bg: 'rgba(255,170,0,0.15)', color: '#ffa94d' },
    verificado: { bg: 'rgba(81,207,102,0.15)', color: '#51cf66' },
    enviado: { bg: 'rgba(74,144,226,0.15)', color: '#4a90e2' },
    entregado: { bg: 'rgba(150,150,150,0.15)', color: '#999' },
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
        Pedidos
      </h1>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '3rem' }}>
        Gestiona los pedidos y verifica los comprobantes de pago.
      </p>

      {(!orders || orders.length === 0) ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface-low)', color: 'var(--on-surface-variant)', border: '1px dashed var(--outline)' }}>
          No hay pedidos registrados aún.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => {
            const sc = statusColors[order.status] || statusColors.pendiente
            const items = order.items || []
            
            return (
              <div key={order.id} className="panel-elevated" style={{ padding: '2rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--on-surface)' }}>
                        #{order.id?.slice(0, 8).toUpperCase()}
                      </span>
                      <span style={{
                        padding: '3px 10px',
                        background: sc.bg,
                        color: sc.color,
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>
                      {new Date(order.created_at).toLocaleString('es-CO')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', fontSize: '1.2rem' }}>
                      $ {order.total?.toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>

                {/* Customer Info + Items */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', marginBottom: '0.75rem' }}>
                      Cliente
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--on-surface)' }}>{order.customer_name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>{order.customer_email}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>{order.customer_phone}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginTop: '0.5rem' }}>
                      {order.shipping_address}, {order.shipping_city}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>
                      Envío: {order.shipping_method === 'expres' ? 'Exprés' : 'Estándar'}
                    </p>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', marginBottom: '0.75rem' }}>
                      Productos
                    </h3>
                    {items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--on-surface)' }}>
                          {item.title} {item.size ? `(${item.size})` : ''} x{item.quantity}
                        </span>
                        <span style={{ color: 'var(--on-surface-variant)' }}>
                          $ {(item.price * item.quantity)?.toLocaleString('es-CO')}
                        </span>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                        <span>Subtotal</span><span>$ {order.subtotal?.toLocaleString('es-CO')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                        <span>Envío</span><span>{order.shipping_cost === 0 ? 'Gratis' : `$ ${order.shipping_cost?.toLocaleString('es-CO')}`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comprobante + Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--outline-variant)' }}>
                  <div>
                    {order.payment_proof_url && (
                      <a
                        href={order.payment_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--primary)',
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        📄 Ver Comprobante de Pago
                      </a>
                    )}
                  </div>
                  <OrderActions order={order} updateStatusAction={updateOrderStatus} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
