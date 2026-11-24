import { z } from 'zod'

export const sideStoneSchema = z.object({
  size_mm: z.number().nonnegative(),
  count: z.number().int().positive().default(1),
  type: z.string().optional(),
})

export const quoteSchema = z.object({
  customer_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  customer_phone: z.string().max(20).optional().or(z.literal('')),
  customer_email: z.string().email('Email inválido').optional().or(z.literal('')),
  piece_type: z.string().min(2).max(50),
  ring_size: z.string().max(10).optional().or(z.literal('')),
  band_thickness_mm: z.number().nonnegative().optional().nullable(),
  band_width_mm: z.number().nonnegative().optional().nullable(),
  center_stone_mm: z.number().nonnegative().optional().nullable(),
  side_stones: z.array(sideStoneSchema).default([]),
  metal: z.string().min(2),
  weight_estimate_g: z.number().nonnegative().optional().nullable(),
  price_per_gram_plata: z.number().nonnegative().optional().nullable(),
  price_per_gram_paladio: z.number().nonnegative().optional().nullable(),
  price_per_gram_oro: z.number().nonnegative().optional().nullable(),
  design_3d_cost: z.number().nonnegative().default(0),
  gems_cost: z.number().nonnegative().default(0),
  labor_cost: z.number().nonnegative().default(0),
  packaging_cost: z.number().nonnegative().default(30000),
  total_cost: z.number().nonnegative().optional().nullable(),
  margin_pct: z.number().min(0).max(500).default(40),
  sale_price: z.number().nonnegative().optional().nullable(),
  render_url: z.string().optional().nullable(),
  notes: z.string().max(1000).optional().or(z.literal('')),
  status: z.enum(['borrador', 'enviada', 'aceptada', 'rechazada']).default('borrador'),
})

export const metalPriceSchema = z.object({
  metal: z.string().min(2),
  purity: z.string().min(1),
  price_per_gram: z.number().positive(),
})
