import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const orderSchema = z.object({
  customer_name: z.string().min(2, 'Nombre muy corto').max(100, 'Nombre muy largo'),
  customer_email: z.string().email('Email inválido'),
  customer_phone: z.string().min(8, 'Teléfono inválido').max(20, 'Teléfono inválido'),
  shipping_address: z.string().min(5, 'Dirección muy corta').max(255, 'Dirección muy larga'),
  shipping_city: z.string().min(2, 'Ciudad muy corta').max(100, 'Ciudad muy larga'),
  shipping_method: z.string(),
  items: z.array(z.any()).min(1, 'La orden debe tener al menos un item'),
  subtotal: z.number().positive('Subtotal debe ser positivo'),
  shipping_cost: z.number().nonnegative('Costo de envío no puede ser negativo'),
  total: z.number().positive('Total debe ser positivo'),
  payment_proof_url: z.string().url('URL de comprobante inválida').or(z.string().optional())
})

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

    const supabase = await createClient()

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
