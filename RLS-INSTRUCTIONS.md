# Configuración de Seguridad en Supabase (RLS)

Por defecto, tu base de datos de Supabase con `NEXT_PUBLIC_SUPABASE_ANON_KEY` permite que cualquiera inserte, lea o borre registros si conocen la URL. Para solucionarlo, debes habilitar Row Level Security (RLS) en tus tablas.

## Instrucciones:

1. Ve a tu panel de control de [Supabase](https://app.supabase.com).
2. Selecciona tu proyecto (`zafhira-v2`).
3. Ve a la sección **SQL Editor** en el menú izquierdo.
4. Haz clic en **New Query** y pega el siguiente código SQL:

```sql
-- 1. Habilitar RLS en la tabla orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. Política para permitir INSERCIONES anónimas y autenticadas
-- (Esto asume que cualquier visitante puede crear una orden de compra)
CREATE POLICY "Permitir insertar ordenes" ON public.orders
FOR INSERT 
TO public
WITH CHECK (true);

-- 3. Política para permitir LECTURA solo a usuarios autenticados y que sean dueños de la orden
-- Si tu tabla 'orders' no tiene un 'user_id', deberás añadirlo para que los clientes
-- logueados solo puedan ver sus compras.
-- Ejemplo asumiendo que tienes una columna user_id en la tabla orders:
CREATE POLICY "Permitir leer propias ordenes" ON public.orders
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 4. Política para NO PERMITIR UPDATE O DELETE desde el cliente público
-- No se crean políticas para UPDATE o DELETE para el rol 'public' ni 'anon'.
-- Solo tu backend con la Service Role Key, o tú desde el Dashboard, podrán modificarlas.
```

5. Haz clic en el botón **Run** (Ejecutar) en la esquina inferior derecha.

> [!WARNING]
> Si la tabla `orders` actualmente no tiene una columna `user_id` vinculada a `auth.uid()`, el comando número 3 no funcionará. Si ese es el caso, te recomiendo crear la columna `user_id` en `orders` primero.
