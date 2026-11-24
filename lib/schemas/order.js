import { z } from 'zod';

export const orderSchema = z.object({
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
});

