'use client'

import { useState } from 'react'

export default function InventoryActions({ product, toggleStatusAction, deleteAction }) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
