import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import PedidosClient from './PedidosClient'

async function updateField(formData) {
  'use server'
  const supabase = createAdminClient()
  const id = formData.get('id')
  const field = formData.get('field')

  if (field === 'workshop_status') {
    await supabase.from('orders').update({ workshop_status: formData.get('value') }).eq('id', id)
  } else if (field === 'shipping_status') {
    const value = formData.get('value')
    const updates = { shipping_status: value }
    if (value === 'en_transito' || value === 'en_reparto') updates.status = 'enviado'
    if (value === 'entregado') updates.status = 'entregado'
    await supabase.from('orders').update(updates).eq('id', id)
  } else if (field === 'shipping_guide') {
    await supabase.from('orders').update({
      shipping_guide: formData.get('guide_number'),
      shipping_carrier: formData.get('shipping_carrier')
    }).eq('id', id)
  } else if (field === 'register_payment') {
    const amount = parseFloat(formData.get('payment_amount') || '0')
    const { data: current } = await supabase.from('orders').select('paid_amount, total').eq('id', id).single()
    if (current) {
      const newPaid = (current.paid_amount || 0) + amount
      const updates = { paid_amount: newPaid }
      if (newPaid >= current.total) {
        updates.payment_type = 'total'
      }
      await supabase.from('orders').update(updates).eq('id', id)
    }
  }

  revalidatePath('/admin/pedidos')
  revalidatePath('/admin')
}

export default async function PedidosPage() {
  const supabase = createAdminClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: products } = await supabase
    .from('products')
    .select('id, title, price, reference, production_cost, profit_margin_target, image_url')
    .order('title')

  // Calculate KPIs
  const totalRevenue = (orders || []).reduce((sum, o) => sum + (o.total || 0), 0)
  const totalBalance = (orders || []).reduce((sum, o) => {
    const balance = (o.total || 0) - (o.paid_amount || 0)
    return sum + (balance > 0 ? balance : 0)
  }, 0)
  const totalNetProfit = (orders || []).reduce((sum, o) => {
    return sum + ((o.total || 0) - (o.production_cost || 0) - (o.accessories_cost || 0) - (o.shipping_cost || 0))
  }, 0)
  const inTransitCount = (orders || []).filter(o =>
    o.shipping_status && o.shipping_status !== 'entregado' && o.shipping_status !== 'sin_despachar' && o.delivery_method !== 'oficina'
  ).length

  return (
    <PedidosClient
      orders={orders || []}
      products={products || []}
      totalRevenue={totalRevenue}
      totalBalance={totalBalance}
      totalNetProfit={totalNetProfit}
      inTransitCount={inTransitCount}
      updateFieldAction={updateField}
    />
  )
}
