'use client'

import { useState } from 'react'

export default function InventoryActions({ product, toggleStatusAction, deleteAction, toggleFeaturedAction }) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Toggle featured */}
      <form action={toggleFeaturedAction}>
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="currentFeatured" value={String(product.is_featured || false)} />
        <button
          type="submit"
          title={product.is_featured ? 'Quitar de portada' : 'Destacar en portada'}
          style={{
            background: product.is_featured ? 'rgba(255,204,0,0.15)' : 'transparent',
            border: `1px solid ${product.is_featured ? '#ffd43b' : 'var(--outline-variant)'}`,
            color: product.is_featured ? '#ffd43b' : 'var(--on-surface-variant)',
            cursor: 'pointer',
            padding: '6px 10px',
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease'
          }}
        >
          {product.is_featured ? '⭐ Destacada' : '☆ Destacar'}
        </button>
      </form>

      {/* Toggle status */}
      <form action={toggleStatusAction}>
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="currentStatus" value={product.status || 'disponible'} />
        <button
          type="submit"
          title={product.status === 'agotado' ? 'Marcar como disponible' : 'Marcar como agotado'}
          style={{
            background: 'transparent',
            border: '1px solid var(--outline-variant)',
            color: product.status === 'agotado' ? '#51cf66' : '#ffa94d',
            cursor: 'pointer',
            padding: '6px 10px',
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease'
          }}
        >
          {product.status === 'agotado' ? '↩ Reponer' : '⛔ Agotar'}
        </button>
      </form>

      {/* Delete */}
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          title="Eliminar pieza"
          style={{
            background: 'transparent',
            border: '1px solid var(--outline-variant)',
            color: '#ff6b6b',
            cursor: 'pointer',
            padding: '6px 10px',
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease'
          }}
        >
          🗑 Eliminar
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              style={{
                background: '#ff4444',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '6px 10px',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Confirmar
            </button>
          </form>
          <button
            onClick={() => setShowConfirm(false)}
            style={{
              background: 'transparent',
              border: '1px solid var(--outline-variant)',
              color: 'var(--on-surface-variant)',
              cursor: 'pointer',
              padding: '6px 10px',
              fontSize: '0.65rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
