'use client'

import { useState } from 'react'
import OrderActions from './OrderActions'
import OrderDetailPanel from './OrderDetailPanel'
import NewPresentialOrder from './NewPresentialOrder'

export default function PedidosClient({
  orders, products, totalRevenue, totalBalance, totalNetProfit, inTransitCount, updateFieldAction
}) {
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState(null)

  const kpiCardStyle = {
    padding: '1.25rem',
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            Pedidos
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
            Control de pedidos, pagos, logística y ganancias reales.
          </p>
        </div>
        <button
          onClick={() => setShowNewOrder(true)}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.8rem', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}
        >
          + NUEVO PEDIDO PRESENCIAL
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="panel-elevated" style={kpiCardStyle}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Facturado</div>
          <div style={{ color: 'var(--primary)', fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginTop: '0.4rem' }}>
            ${(totalRevenue / 1000000).toFixed(1)}M
          </div>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', marginTop: '0.25rem' }}>{orders.length} pedidos</div>
        </div>

        <div className="panel-elevated" style={kpiCardStyle}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cartera por Cobrar</div>
          <div style={{ color: totalBalance > 0 ? '#ff4444' : '#51cf66', fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginTop: '0.4rem' }}>
            ${totalBalance > 0 ? totalBalance.toLocaleString('es-CO') : '0'}
          </div>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', marginTop: '0.25rem' }}>
            {totalBalance > 0 ? 'Saldos pendientes' : 'Todo al día ✅'}
          </div>
        </div>

        <div className="panel-elevated" style={kpiCardStyle}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ganancia Neta Real</div>
          <div style={{ color: '#51cf66', fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginTop: '0.4rem' }}>
            ${(totalNetProfit / 1000).toFixed(0)}k
          </div>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', marginTop: '0.25rem' }}>PV - Costos - Accesorios - Flete</div>
        </div>

        <div className="panel-elevated" style={kpiCardStyle}>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Envíos en Tránsito</div>
          <div style={{ color: '#4a90e2', fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginTop: '0.4rem' }}>
            {inTransitCount}
          </div>
          <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', marginTop: '0.25rem' }}>Con transportadora</div>
        </div>
      </div>

      {/* Orders List */}
      {(!orders || orders.length === 0) ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface-low)', color: 'var(--on-surface-variant)', border: '1px dashed var(--outline)' }}>
          No hay pedidos registrados aún. Usa el botón "+ NUEVO PEDIDO PRESENCIAL" para crear el primero.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => {
            const items = order.items || []
            const balance = (order.total || 0) - (order.paid_amount || 0)
            const isExpanded = expandedOrder === order.id

            return (
              <div key={order.id} className="panel-elevated" style={{ padding: '1.5rem' }}>
                {/* Header Row */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: '1rem' }}
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '240px' }}>
                    {/* Reference */}
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--primary)', whiteSpace: 'nowrap', padding: '2px 6px', border: '1px solid var(--outline-variant)' }}>
                      {order.reference || `#${order.id?.slice(0, 8).toUpperCase()}`}
                    </span>

                    {/* Customer & Product */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--on-surface)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.customer_name}
                        <span style={{ color: 'var(--on-surface-variant)', fontWeight: 400, marginLeft: '8px' }}>
                          {items[0]?.title || ''}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
                        {new Date(order.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                    {/* Balance indicator */}
                    {balance > 0 && (
                      <span style={{
                        padding: '3px 8px',
                        background: 'rgba(255,68,68,0.15)',
                        color: '#ff4444',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap'
                      }}>
                        Saldo: ${balance.toLocaleString('es-CO')}
                      </span>
                    )}

                    {/* Total */}
                    <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                      ${(order.total || 0).toLocaleString('es-CO')}
                    </span>

                    {/* Expand chevron */}
                    <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Actions Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--outline-variant)' }}>
                  <OrderActions order={order} updateFieldAction={updateFieldAction} />
                </div>

                {/* Expandable Detail Panel */}
                {isExpanded && (
                  <OrderDetailPanel order={order} updateFieldAction={updateFieldAction} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* New Presential Order Modal */}
      {showNewOrder && (
        <NewPresentialOrder
          products={products}
          onClose={() => setShowNewOrder(false)}
          onCreated={() => window.location.reload()}
        />
      )}
    </div>
  )
}
