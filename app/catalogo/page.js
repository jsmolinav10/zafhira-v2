import { createClient } from '@/lib/supabase/server'
import CatalogClient from './CatalogClient'

export const metadata = {
  title: 'Zafhira | Catálogo',
  description: 'Explora nuestra colección exclusiva de alta joyería.',
}

export const revalidate = 0 // Opt out of caching so new inventory items show up immediately, though in production we can use on-demand revalidation.

export default async function CatalogPage() {
  const supabase = await createClient()
  const { data: catalog, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return <CatalogClient initialCatalog={catalog || []} />
}
