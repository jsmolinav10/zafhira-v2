'use client'

const workshopFlow = {
  por_iniciar: { next: 'en_taller', label: '🔨 Iniciar en Taller', color: 'var(--primary)' },
  en_taller: { next: 'control_calidad', label: '✨ Control Calidad', color: '#ffa94d' },
  control_calidad: { next: 'empacado', label: '📦 Empacar', color: '#ffa94d' },
  empacado: { next: 'listo', label: '✅ Marcar Listo', color: '#51cf66' },
}

const shippingFlow = {
  sin_despachar: { next: 'en_transito', label: '🚚 Despachar', color: '#4a90e2' },
  en_transito: { next: 'en_reparto', label: '📬 En Reparto', color: '#4a90e2' },
  en_reparto: { next: 'entregado', label: '✅ Entregado', color: '#51cf66' },
}

const workshopLabels = {
  por_iniciar: { bg: 'rgba(255,170,0,0.15)', color: '#ffa94d', text: 'Por Iniciar' },
  en_taller: { bg: 'rgba(255,170,0,0.15)', color: '#ffa94d', text: 'En Taller' },
  control_calidad: { bg: 'rgba(74,144,226,0.15)', color: '#4a90e2', text: 'Control Calidad' },
  empacado: { bg: 'rgba(81,207,102,0.15)', color: '#51cf66', text: 'Empacado' },
  listo: { bg: 'rgba(81,207,102,0.15)', color: '#51cf66', text: 'Listo' },
}

const shippingLabels = {
  sin_despachar: { bg: 'rgba(150,150,150,0.15)', color: '#999', text: 'Sin Despachar' },
  en_transito: { bg: 'rgba(74,144,226,0.15)', color: '#4a90e2', text: 'En Tránsito' },
  en_reparto: { bg: 'rgba(74,144,226,0.15)', color: '#4a90e2', text: 'En Reparto' },
  entregado: { bg: 'rgba(81,207,102,0.15)', color: '#51cf66', text: 'Entregado' },
}

export default function OrderActions({ order, updateFieldAction }) {
  const ws = order.workshop_status || 'por_iniciar'
  const ss = order.shipping_status || 'sin_despachar'
  const balance = (order.total || 0) - (order.paid_amount || 0)

  const workshopStep = workshopFlow[ws]
  const shippingStep = shippingFlow[ss]
  const wsLabel = workshopLabels[ws] || workshopLabels.por_iniciar
  const ssLabel = shippingLabels[ss] || shippingLabels.sin_despachar

  const badgeStyle = (label) => ({
    padding: '3px 8px',
    background: label.bg,
    color: label.color,
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  })

  const btnStyle = (color) => ({
    background: 'transparent',
    border: `1px solid ${color}`,
    color: color,
    cursor: 'pointer',
    padding: '5px 10px',
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    transition: 'all 0.2s ease'
  })

  // Workshop complete?
  const workshopDone = ws === 'listo'
  // Show shipping actions only when workshop done and delivery is shipping
  const showShipping = workshopDone && order.delivery_method !== 'oficina'
  // Show balance warning on dispatch
  const showBalanceWarning = showShipping && balance > 0 && ss === 'sin_despachar'

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Workshop Status Badge */}
      <span style={badgeStyle(wsLabel)}>{wsLabel.text}</span>

      {/* Workshop Action */}
      {workshopStep && (
        <form action={updateFieldAction}>
          <input type="hidden" name="id" value={order.id} />
          <input type="hidden" name="field" value="workshop_status" />
          <input type="hidden" name="value" value={workshopStep.next} />
          <button type="submit" style={btnStyle(workshopStep.color)}>
            {workshopStep.label}
          </button>
        </form>
      )}

      {/* Shipping Status Badge (when workshop complete or shipping started) */}
      {(workshopDone || ss !== 'sin_despachar') && order.delivery_method !== 'oficina' && (
        <span style={badgeStyle(ssLabel)}>{ssLabel.text}</span>
      )}

      {/* Balance Warning */}
      {showBalanceWarning && (
        <span style={{ fontSize: '0.65rem', color: '#ff6b6b', fontWeight: 600 }}>
          ⚠️ Saldo: ${balance.toLocaleString('es-CO')}
        </span>
      )}

      {/* Shipping Action */}
      {showShipping && shippingStep && (
        <form action={updateFieldAction}>
          <input type="hidden" name="id" value={order.id} />
          <input type="hidden" name="field" value="shipping_status" />
          <input type="hidden" name="value" value={shippingStep.next} />
          <button type="submit" style={btnStyle(shippingStep.color)}>
            {shippingStep.label}
          </button>
        </form>
      )}

      {/* Completed state */}
      {ss === 'entregado' && (
        <span style={{
          padding: '3px 8px',
          background: 'rgba(81,207,102,0.15)',
          color: '#51cf66',
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>✔️ Completado</span>
      )}

      {order.delivery_method === 'oficina' && workshopDone && (
        <span style={{
          padding: '3px 8px',
          background: 'rgba(81,207,102,0.15)',
          color: '#51cf66',
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>🏢 Listo para recoger</span>
      )}
    </div>
  )
}
