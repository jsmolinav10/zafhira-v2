import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.customer_name || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Nombre del cliente y al menos un producto son requeridos' },
        { status: 400 }
      )
    }

    // Generate short reference if not provided
    const datePrefix = new Date().toISOString().slice(2, 10).replace(/-/g, '')
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const reference = body.reference || `ZF-${datePrefix}-${randomSuffix}`

    const orderData = {
      customer_name: body.customer_name,
      customer_email: body.customer_email || '',
      customer_phone: body.customer_phone || '',
      shipping_address: body.shipping_address || 'Recoge en oficina',
      shipping_city: body.shipping_city || 'Bogotá',
      shipping_method: body.shipping_method || 'pickup',
      items: body.items,
      subtotal: body.subtotal || 0,
      shipping_cost: body.shipping_cost || 0,
      total: body.total || 0,
      payment_proof_url: body.payment_proof_url || '',
      status: 'pendiente',
      // Logistics fields
      reference: reference,
      production_cost: body.production_cost || 0,
      accessories_description: body.accessories_description || '',
      accessories_cost: body.accessories_cost || 0,
      payment_type: body.payment_type || 'total',
      paid_amount: body.paid_amount || 0,
      payment_method: body.payment_method || '',
      delivery_method: body.delivery_method || 'envio',
      shipping_carrier: body.shipping_carrier || '',
      shipping_guide: body.shipping_guide || '',
      shipping_status: body.shipping_status || 'sin_despachar',
      workshop_status: body.workshop_status || 'por_iniciar',
      custom_details: body.custom_details || '',
      order_source: 'presencial',
      admin_notes: body.admin_notes || '',
    }

    const supabase = createAdminClient()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (orderError) {
      console.error('Supabase presential order insert error:', orderError)
      return NextResponse.json(
        { error: orderError.message, code: orderError.code },
        { status: 500 }
      )
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (err) {
    console.error('API presential orders error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
