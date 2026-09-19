'use client'

export default function WhatsAppButton({ order }) {
  if (!order?.customer_phone) return null

  const phone = order.customer_phone.replace(/\D/g, '')
  const phoneFormatted = phone.startsWith('57') ? phone : `57${phone}`

  const productName = order.items?.[0]?.title || 'tu joya'
  const balance = (order.total || 0) - (order.paid_amount || 0)

  let message = ''

  if (order.shipping_status === 'en_reparto' || order.shipping_status === 'en_transito') {
    message = `¡Hola ${order.customer_name}! ✨ Tu joya *${productName}* ya fue despachada por *${order.shipping_carrier || 'nuestra transportadora'}*.`
    if (order.shipping_guide) {
      message += `\nNúmero de guía: *${order.shipping_guide}*`
    }
    if (balance > 0) {
      message += `\n\nSaldo pendiente contraentrega: *$${balance.toLocaleString('es-CO')}*`
    }
    message += `\n\n¡Gracias por confiar en Zafhira! 💎`
  } else if (order.workshop_status === 'listo' || order.workshop_status === 'empacado') {
    if (order.delivery_method === 'oficina') {
      message = `¡Hola ${order.customer_name}! ✨ Tu joya *${productName}* ya está lista para recoger en nuestra oficina.`
      if (balance > 0) {
        message += `\nSaldo pendiente: *$${balance.toLocaleString('es-CO')}*`
      }
      message += `\n\n¡Te esperamos! 💎 Zafhira Joyería`
    } else {
      message = `¡Hola ${order.customer_name}! ✨ Tu joya *${productName}* está lista y será despachada muy pronto.\n\n¡Gracias por confiar en Zafhira! 💎`
    }
  } else if (order.shipping_status === 'entregado') {
    message = `¡Hola ${order.customer_name}! ✨ Esperamos que estés disfrutando tu joya *${productName}*.\n\nSi tienes alguna pregunta sobre el cuidado de tu pieza, estamos para ti. 💎 Zafhira`
  } else {
    message = `¡Hola ${order.customer_name}! ✨ Te escribimos de Zafhira Joyería para darte una actualización sobre tu pedido *${productName}*.\n\n¿Tienes alguna pregunta? Estamos para ti. 💎`
  }

  const encodedMessage = encodeURIComponent(message)
  const waUrl = `https://wa.me/${phoneFormatted}?text=${encodedMessage}`

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Enviar mensaje por WhatsApp"
      style={{
        background: '#25d366',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        padding: '6px 12px',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        transition: 'all 0.2s ease',
        borderRadius: '2px'
      }}
    >
      💬 WhatsApp
    </a>
  )
}
