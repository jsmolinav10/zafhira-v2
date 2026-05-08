import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['customer_name', 'customer_email', 'customer_phone', 'shipping_address', 'shipping_city', 'shipping_method', 'items', 'subtotal', 'shipping_cost', 'total', 'payment_proof_url']
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { error: `Campo requerido faltante: ${field}` },
          { status: 400 }
        )
      }
    }

    const supabase = await createClient()

    const orderData = {
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      shipping_address: body.shipping_address,
      shipping_city: body.shipping_city,
      shipping_method: body.shipping_method,
      items: body.items,
      subtotal: body.subtotal,
      shipping_cost: body.shipping_cost,
      total: body.total,
      payment_proof_url: body.payment_proof_url,
      status: 'pendiente',
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (orderError) {
      console.error('Supabase order insert error:', orderError)
      return NextResponse.json(
        { error: orderError.message, code: orderError.code, details: orderError.details },
        { status: 500 }
      )
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (err) {
    console.error('API orders error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
