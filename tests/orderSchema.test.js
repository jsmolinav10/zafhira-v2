import test from 'node:test';
import assert from 'node:assert/strict';
import { orderSchema } from '../lib/schemas/order.js';

test('orderSchema valida correctamente una orden completa', () => {
  const validOrder = {
    customer_name: 'Carlos Ruiz',
    customer_email: 'carlos@example.com',
    customer_phone: '3001234567',
    shipping_address: 'Calle 100 # 15-20',
    shipping_city: 'Bogotá',
    shipping_method: 'Envío asegurado',
    items: [{ id: 'ring-1', name: 'Anillo de oro', price: 1500000, quantity: 1 }],
    subtotal: 1500000,
    shipping_cost: 0,
    total: 1500000,
  };

  const parsed = orderSchema.safeParse(validOrder);
  assert.equal(parsed.success, true);
});

test('orderSchema rechaza correo inválido o datos faltantes', () => {
  const invalidOrder = {
    customer_name: 'C', // muy corto
    customer_email: 'no-es-un-email',
    customer_phone: '123', // muy corto
    shipping_address: '',
    shipping_city: '',
    shipping_method: '',
    items: [], // vacio
    subtotal: -100, // negativo
    shipping_cost: -50,
    total: 0,
  };

  const parsed = orderSchema.safeParse(invalidOrder);
  assert.equal(parsed.success, false);
  assert.ok(parsed.error.issues.length >= 5);
});

