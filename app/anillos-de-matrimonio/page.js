import { createClient } from '@/lib/supabase/server'
import CategoryClient from '../CategoryClient'

export const metadata = {
  title: 'Anillos de Matrimonio en Oro 18K Bogotá | Zafhira',
  description: 'Descubre nuestra colección exclusiva de anillos de matrimonio y argollas hechas a mano en Oro 18K y Plata en nuestro taller en Bogotá.',
}

export const revalidate = 0

export default async function AnillosMatrimonioPage() {
  const supabase = await createClient()
  // Asumiendo que la categoría en DB es "Anillos" o podemos buscar por título
  const { data: catalog, error } = await supabase
    .from('products')
    .select('*')
    .ilike('title', '%matrimonio%') // Filtramos los que tengan "matrimonio" en el título
    .order('created_at', { ascending: false })

  return (
    <CategoryClient 
      title="Anillos de Matrimonio" 
      description="El símbolo eterno de su unión, forjado a mano en nuestro taller de Bogotá con Oro 18K de la más alta pureza."
      products={catalog || []} 
    />
  )
}
