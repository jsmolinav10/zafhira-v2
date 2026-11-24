import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { quoteSchema } from '@/lib/schemas/quote'

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = quoteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.format() }, { status: 400 })
    }
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('quotes').insert([parsed.data]).select().single()
    if (error) {
      console.error('quote insert error:', error)
      return NextResponse.json({ error: 'Error al guardar cotización' }, { status: 500 })
    }
    return NextResponse.json({ quote: data }, { status: 201 })
  } catch (err) {
    console.error('quotes POST error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false })
    if (error) {
      return NextResponse.json({ error: 'Error al listar' }, { status: 500 })
    }
    return NextResponse.json({ quotes: data })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
