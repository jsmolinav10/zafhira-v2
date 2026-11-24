import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { orderSchema } from '@/lib/schemas/order'

export async function POST(request) {
  try {
    const body = await request.json()

    // Validación y Sanitización con Zod
    const validatedData = orderSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Datos de orden inválidos', details: validatedData.error.format() },
        { status: 400 }
      )
    }

    const orderData = {
      ...validatedData.data,
      status: 'pendiente',
    }

    // Usar cliente admin para bypasear RLS (solo en servidor)
    const supabase = createAdminClient()

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
