import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { metalPriceSchema } from '@/lib/schemas/quote'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('metal_prices')
      .select('*')
      .order('metal', { ascending: true })

    if (error) {
      console.error('Error fetching metal prices:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ prices: data || [] })
  } catch (err) {
    console.error('API metal-prices GET error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const parsed = metalPriceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos de precio de metal inválidos', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { metal, purity, price_per_gram } = parsed.data
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('metal_prices')
      .upsert(
        {
          metal,
          purity,
          price_per_gram,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'metal,purity' }
      )
      .select()
      .single()

    if (error) {
      console.error('Error updating metal price:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ updated: data })
  } catch (err) {
    console.error('API metal-prices PUT error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
