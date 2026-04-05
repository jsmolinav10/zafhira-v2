import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'

export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()
  const { data: featured } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return <HomeClient featured={featured || []} />
}
