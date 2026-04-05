import { createClient } from '@/lib/supabase/server'
import ProductDetailClient from './ProductDetailClient'
import { notFound } from 'next/navigation'

export const revalidate = 0

export async function generateMetadata({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()
  
  if (!product) return { title: 'Producto no encontrado | Zafhira' }
  
  return {
    title: `${product.title} | Zafhira`,
    description: product.description || `Descubre ${product.title} en nuestra colección exclusiva.`,
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product || error) notFound()

  // Fetch related products (same category, excluding current)
  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(4)

  return <ProductDetailClient product={product} related={related || []} />
}
