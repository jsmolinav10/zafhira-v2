-- =========================================================================
-- MIGRACIÓN 003: MÓDULO DE COTIZACIONES Y PRECIOS DE METALES
-- Proyecto: Zafhira Joyería (zafhira-v2)
-- =========================================================================

-- 1. TABLA: metal_prices (Precios de metales actualizables por gramo)
CREATE TABLE IF NOT EXISTS public.metal_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metal TEXT NOT NULL,
  purity TEXT NOT NULL,
  price_per_gram NUMERIC(12,2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(metal, purity)
);

-- Seed de precios de referencia (COP por gramo)
INSERT INTO public.metal_prices (metal, purity, price_per_gram) VALUES
  ('plata', '925', 5500.00),
  ('plata_paladio', '950', 7800.00),
  ('oro', '18k', 295000.00),
  ('oro', '24k', 390000.00)
ON CONFLICT (metal, purity) DO UPDATE 
SET price_per_gram = EXCLUDED.price_per_gram;

-- 2. TABLA: quotes (Cotizaciones detalladas de piezas)
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  piece_type TEXT NOT NULL,
  ring_size TEXT,
  band_thickness_mm NUMERIC(4,2),
  band_width_mm NUMERIC(4,2),
  center_stone_mm NUMERIC(4,2),
  side_stones JSONB DEFAULT '[]'::jsonb,
  metal TEXT NOT NULL,
  weight_estimate_g NUMERIC(6,2),
  price_per_gram_plata NUMERIC(12,2),
  price_per_gram_paladio NUMERIC(12,2),
  price_per_gram_oro NUMERIC(12,2),
  design_3d_cost NUMERIC(12,2) DEFAULT 0,
  gems_cost NUMERIC(12,2) DEFAULT 0,
  labor_cost NUMERIC(12,2) DEFAULT 0,
  packaging_cost NUMERIC(12,2) DEFAULT 30000,
  total_cost NUMERIC(12,2),
  margin_pct NUMERIC(5,2) DEFAULT 40,
  sale_price NUMERIC(12,2),
  render_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'borrador', -- 'borrador', 'enviada', 'aceptada', 'rechazada'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.metal_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS PARA metal_prices
DROP POLICY IF EXISTS "Permitir lectura publica de precios de metales" ON public.metal_prices;
DROP POLICY IF EXISTS "Permitir escritura solo admin en precios de metales" ON public.metal_prices;

CREATE POLICY "Permitir lectura publica de precios de metales" 
ON public.metal_prices 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Permitir escritura solo admin en precios de metales" 
ON public.metal_prices 
FOR ALL 
TO authenticated 
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR 
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR 
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

-- 5. POLÍTICAS PARA quotes
DROP POLICY IF EXISTS "Permitir admin gestion total de cotizaciones" ON public.quotes;
DROP POLICY IF EXISTS "Permitir insercion anonima de cotizaciones" ON public.quotes;

CREATE POLICY "Permitir admin gestion total de cotizaciones" 
ON public.quotes 
FOR ALL 
TO authenticated 
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR 
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
)
WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR 
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

CREATE POLICY "Permitir insercion anonima de cotizaciones" 
ON public.quotes 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 6. BUCKET DE STORAGE PARA RENDERS DE IA
INSERT INTO storage.buckets (id, name, public) 
VALUES ('renders', 'renders', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Permitir lectura publica de renders" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subir renders admin y backend" ON storage.objects;

CREATE POLICY "Permitir lectura publica de renders" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'renders');

CREATE POLICY "Permitir subir renders admin y backend" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'renders');
