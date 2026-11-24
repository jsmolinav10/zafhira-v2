-- =========================================================================
-- MIGRACIÓN 002: ROW LEVEL SECURITY (RLS) & STORAGE POLICIES
-- Proyecto: Zafhira Joyería (zafhira-v2)
-- =========================================================================

-- 1. ASEGURAR COLUMNA user_id EN ORDERS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 2. HABILITAR RLS EN TODAS LAS TABLAS PRINCIPALES
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS PARA LA TABLA 'PRODUCTS'
-- Eliminar políticas previas si existiesen
DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.products;
DROP POLICY IF EXISTS "Permitir insercion solo admin productos" ON public.products;
DROP POLICY IF EXISTS "Permitir modificacion solo admin productos" ON public.products;
DROP POLICY IF EXISTS "Permitir eliminacion solo admin productos" ON public.products;

-- 3.1. Lectura pública (Cualquier visitante puede ver el catálogo)
CREATE POLICY "Permitir lectura publica de productos" 
ON public.products 
FOR SELECT 
TO public 
USING (true);

-- 3.2. Inserción solo administradores o service_role
CREATE POLICY "Permitir insercion solo admin productos" 
ON public.products 
FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR 
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

-- 3.3. Actualización solo administradores o service_role
CREATE POLICY "Permitir modificacion solo admin productos" 
ON public.products 
FOR UPDATE 
TO authenticated 
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR 
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

-- 3.4. Eliminación solo administradores o service_role
CREATE POLICY "Permitir eliminacion solo admin productos" 
ON public.products 
FOR DELETE 
TO authenticated 
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR 
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

-- 4. POLÍTICAS PARA LA TABLA 'ORDERS'
DROP POLICY IF EXISTS "Permitir insertar ordenes" ON public.orders;
DROP POLICY IF EXISTS "Permitir leer propias ordenes o admin" ON public.orders;
DROP POLICY IF EXISTS "Permitir actualizar solo admin ordenes" ON public.orders;
DROP POLICY IF EXISTS "Permitir borrar solo admin ordenes" ON public.orders;

-- 4.1. Permitir que cualquier visitante (checkout web o anónimo) inserte pedidos
CREATE POLICY "Permitir insertar ordenes" 
ON public.orders 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 4.2. Permitir lectura: Si el usuario es dueño del pedido (user_id) O si es Administrador
CREATE POLICY "Permitir leer propias ordenes o admin" 
ON public.orders 
FOR SELECT 
TO authenticated 
USING (
  auth.uid() = user_id OR 
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR 
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

-- 4.3. Permitir actualización solo a administradores
CREATE POLICY "Permitir actualizar solo admin ordenes" 
ON public.orders 
FOR UPDATE 
TO authenticated 
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR 
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

-- 4.4. Permitir eliminación solo a administradores
CREATE POLICY "Permitir borrar solo admin ordenes" 
ON public.orders 
FOR DELETE 
TO authenticated 
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR 
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
);

-- 5. POLÍTICAS DE STORAGE PARA BUCKET 'comprobantes'
-- Crear el bucket de comprobantes si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('comprobantes', 'comprobantes', false)
ON CONFLICT (id) DO NOTHING;

-- Permitir subir comprobantes de pago desde el checkout (público / anon)
DROP POLICY IF EXISTS "Permitir subir comprobantes" ON storage.objects;
CREATE POLICY "Permitir subir comprobantes" 
ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'comprobantes');

-- Permitir ver comprobantes a administradores
DROP POLICY IF EXISTS "Permitir ver comprobantes admin" ON storage.objects;
CREATE POLICY "Permitir ver comprobantes admin" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'comprobantes' AND (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR 
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  )
);

