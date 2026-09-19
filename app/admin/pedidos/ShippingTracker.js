'use client'

const carrierUrls = {
  'Inter Rapidísimo': (guide) => `https://www.interrapidisimo.com/tracking/?guia=${guide}`,
  'Coordinadora': (guide) => `https://www.coordinadora.com/rastreo-de-envios/?guia=${guide}`,
  'Servientrega': (guide) => `https://www.servientrega.com/wps/portal/rastreo-envios/?guia=${guide}`,
  'Envía': (guide) => `https://envia.co/rastreo/?guia=${guide}`,
}

export default function ShippingTracker({ carrier, guide }) {
  if (!guide || !carrier) return null

  const getUrl = carrierUrls[carrier]
  const url = getUrl ? getUrl(guide) : null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--on-surface)' }}>
        {guide}
      </span>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--primary)',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textDecoration: 'none',
            padding: '3px 8px',
            border: '1px solid var(--primary)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          🔗 Rastrear
        </a>
      )}
    </div>
  )
}
