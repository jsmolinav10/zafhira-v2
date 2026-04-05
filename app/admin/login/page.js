import { login } from './actions'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function LoginPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/admin')
  }

  const { error } = await searchParams; // Wait for search params in next 15

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      padding: '2rem'
    }}>
      <div className="panel-elevated" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', marginBottom: '0.5rem', fontSize: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Zafhira
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', marginBottom: '2rem', letterSpacing: '0.05em' }}>
          Bóveda Administrativa
        </p>

        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(255, 60, 60, 0.1)', border: '1px solid rgba(255, 60, 60, 0.3)', color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1.5rem', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form>
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correo Electrónico</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--surface-container)',
                border: '1px solid var(--outline-variant)',
                color: 'var(--on-surface)',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--surface-container)',
                border: '1px solid var(--outline-variant)',
                color: 'var(--on-surface)',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <button 
            formAction={login}
            className="btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '0.9rem' }}
          >
            Acceder a la Bóveda
          </button>
        </form>
      </div>
    </div>
  )
}
