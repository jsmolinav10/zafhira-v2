'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MetalesRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/cotizaciones')
  }, [router])

  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
      Cargando configuración de metales...
    </div>
  )
}
