import { test } from 'node:test'
import assert from 'node:assert/strict'
import { quoteSchema } from '../lib/schemas/quote.js'

test('quoteSchema valida cotización completa', () => {
  const valid = {
    customer_name: 'Juan Perez',
    piece_type: 'anillo',
    metal: 'plata',
    margin_pct: 40,
  }
  const r = quoteSchema.safeParse(valid)
  assert.equal(r.success, true)
})

test('quoteSchema rechaza sin nombre', () => {
  const r = quoteSchema.safeParse({ piece_type: 'anillo', metal: 'plata' })
  assert.equal(r.success, false)
})

test('quoteSchema rechaza metal inválido', () => {
  const r = quoteSchema.safeParse({ customer_name: 'X', piece_type: 'anillo', metal: 'cobre' })
  assert.equal(r.success, false)
})
