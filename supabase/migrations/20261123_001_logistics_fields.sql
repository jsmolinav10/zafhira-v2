-- MIGRACION: Campos de Logistica para Zafhira Boveda
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar campos de costo y referencia a PRODUCTS
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS reference VARCHAR(50),
ADD COLUMN IF NOT EXISTS production_cost DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS profit_margin_target DECIMAL(5,2) DEFAULT 40.00;

-- 2. Agregar campos de logistica a ORDERS
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS reference VARCHAR(50),
ADD COLUMN IF NOT EXISTS production_cost DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS accessories_description TEXT,
ADD COLUMN IF NOT EXISTS accessories_cost DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20) DEFAULT 'total',
ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(20) DEFAULT 'envio',
ADD COLUMN IF NOT EXISTS shipping_carrier VARCHAR(50),
ADD COLUMN IF NOT EXISTS shipping_guide VARCHAR(50),
ADD COLUMN IF NOT EXISTS shipping_status VARCHAR(30) DEFAULT 'sin_despachar',
ADD COLUMN IF NOT EXISTS workshop_status VARCHAR(30) DEFAULT 'por_iniciar',
ADD COLUMN IF NOT EXISTS custom_details TEXT,
ADD COLUMN IF NOT EXISTS order_source VARCHAR(20) DEFAULT 'web',
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- 3. Indices para busquedas rapidas
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_status ON public.orders(shipping_status);
CREATE INDEX IF NOT EXISTS idx_orders_workshop_status ON public.orders(workshop_status);
CREATE INDEX IF NOT EXISTS idx_products_reference ON public.products(reference);
