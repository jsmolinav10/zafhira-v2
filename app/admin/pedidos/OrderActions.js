'use client'

export default function OrderActions({ order, updateStatusAction }) {
  const nextStatus = {
    pendiente: 'verificado',
    verificado: 'enviado',
    enviado: 'entregado',
  }

  const actionLabels = {
    pendiente: '✅ Verificar Pago',
    verificado: '📦 Marcar Enviado',
    enviado: '🏠 Marcar Entregado',
  }

  const next = nextStatus[order.status]
  const label = actionLabels[order.status]

  if (!next) {
    return (
      <span style={{
        padding: '6px 14px',
        background: 'rgba(150,150,150,0.15)',
        color: '#999',
        fontSize: '0.7rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        ✓ COMPLETADO
      </span>
    )
  }

  return (
    <form action={updateStatusAction}>
      <input type="hidden" name="id" value={order.id} />
      <input type="hidden" name="newStatus" value={next} />
      <button
        type="submit"
        style={{
          background: order.status === 'pendiente' ? 'var(--primary)' : 'transparent',
          border: order.status === 'pendiente' ? 'none' : '1px solid var(--outline-variant)',
          color: order.status === 'pendiente' ? '#000' : 'var(--primary)',
          cursor: 'pointer',
          padding: '8px 16px',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          transition: 'all 0.2s ease',
        }}
      >
        {label}
      </button>
    </form>
  )
}
