import { createClient } from '@/lib/supabase/server'
import AboutClient from './AboutClient'

export const metadata = {
  title: 'Sobre Nosotros & Galería | Zafhira',
  description: 'Conoce al fundador de Zafhira y explora nuestra galería exclusiva de joyas y trabajos personalizados.',
}

export const revalidate = 0

export default async function NosotrosPage() {
  const supabase = await createClient()
  
  // Obtener solo las obras de la categoría Galería
  const { data: galleryItems, error } = await supabase
    .from('products')
    .select('*')
    .ilike('category', 'Galería%')
    .order('created_at', { ascending: false })

  return <AboutClient galleryItems={galleryItems || []} />
}
