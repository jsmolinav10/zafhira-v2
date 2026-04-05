import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'Zafhira | Bóveda',
}

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If no user, render children without sidebar (login page will handle itself)
  if (!user) {
    return <>{children}</>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: 'var(--surface-low)',
        borderRight: '1px solid var(--outline)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--outline)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Zafhira</h2>
          <p style={{ color: 'var(--primary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Bóveda Segura</p>
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin" style={{ display: 'block', padding: '10px 16px', color: 'var(--on-surface)', textDecoration: 'none', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Métricas (KPI)</span>
          </Link>
          <Link href="/admin/inventario" style={{ display: 'block', padding: '10px 16px', color: 'var(--on-surface-variant)', textDecoration: 'none' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Inventario</span>
          </Link>
          <Link href="/admin/pedidos" style={{ display: 'block', padding: '10px 16px', color: 'var(--on-surface-variant)', textDecoration: 'none' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>📦 Pedidos</span>
          </Link>
          <Link href="/admin/orfebres" style={{ display: 'block', padding: '10px 16px', color: 'var(--on-surface-variant)', textDecoration: 'none' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Acceso Orfebres</span>
          </Link>
          <Link href="/admin/perfil" style={{ display: 'block', padding: '10px 16px', color: 'var(--on-surface-variant)', textDecoration: 'none' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Perfil / Seguridad</span>
          </Link>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--outline)', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
          <div>👤 {user.email}</div>
          <form action="/auth/signout" method="post" style={{ marginTop: '1rem' }}>
            <button type="submit" style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.75rem', padding: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cerrar Sesión</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
