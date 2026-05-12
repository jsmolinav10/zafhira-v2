import { createClient } from '@/lib/supabase/server'
import CategoryClient from '../CategoryClient'

export const metadata = {
  title: 'Anillos de Compromiso Personalizados Bogotá | Zafhira',
  description: 'Anillos de compromiso únicos hechos a medida. Solitarios, halos y diseños vintage con diamantes y gemas naturales en Oro 18K.',
}

export const revalidate = 0

export default async function AnillosCompromisoPage() {
  const supabase = await createClient()
  const { data: catalog, error } = await supabase
    .from('products')
    .select('*')
    .or('category.eq.Anillos: Compromiso,title.ilike.%compromiso%')
    .order('created_at', { ascending: false })

  return (
    <CategoryClient 
      title="Anillos de Compromiso" 
      description="Diseños excepcionales para la pregunta más importante de su vida. Seleccione entre nuestras creaciones o diseñe un anillo desde cero."
      products={catalog || []} 
    />
  )
}
