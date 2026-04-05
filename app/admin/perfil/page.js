'use client'

import React, { useState } from 'react'
import { updatePassword } from './actions'

export default function PerfilPage() {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const result = await updatePassword(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(result.success)
      event.currentTarget.reset()
    }
    setIsLoading(false)
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', marginBottom: '1.5rem', fontSize: '1.5rem', letterSpacing: '0.05em' }}>Ajustes de Perfil</h1>
      
      <div style={{ background: 'var(--surface-container)', padding: '2rem', border: '1px solid var(--outline)', borderRadius: '4px' }}>
        <h2 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cambiar Contraseña</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nueva Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              style={{
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--outline)',
                color: 'var(--on-surface)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="confirmPassword" style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              style={{
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--outline)',
                color: 'var(--on-surface)',
                outline: 'none',
              }}
            />
          </div>

          {error && <div style={{ color: '#ff6b6b', fontSize: '0.85rem' }}>{error}</div>}
          {success && <div style={{ color: '#51cf66', fontSize: '0.85rem' }}>{success}</div>}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '14px',
              background: 'var(--primary)',
              color: 'var(--on-primary)',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: '600',
              marginTop: '1rem',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}
