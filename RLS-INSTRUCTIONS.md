# Configuración de Seguridad en Supabase (RLS y Storage)

Por defecto, tu base de datos de Supabase sin RLS permite que cualquiera con la API Key pueda modificar productos o leer pedidos ajenos.

Se ha creado la migración consolidada en:
📂 [`supabase/migrations/20261123_002_enable_rls_all_tables.sql`](./supabase/migrations/20261123_002_enable_rls_all_tables.sql)

---

## Instrucciones para Aplicar la Migración:

1. Ingresa a tu panel de [Supabase](https://app.supabase.com).
2. Selecciona tu proyecto (`zafhira-v2`).
3. En el menú lateral izquierdo, haz clic en **SQL Editor**.
4. Haz clic en **New query**.
5. Abre y copia el contenido completo del archivo [`supabase/migrations/20261123_002_enable_rls_all_tables.sql`](./supabase/migrations/20261123_002_enable_rls_all_tables.sql).
6. Pégalo en el editor y haz clic en el botón verde **Run** (Ejecutar).

---

## Qué protege esta migración:

* ✅ **Tabla `orders`**: Los clientes y visitantes pueden crear pedidos, pero solo pueden leer sus propios pedidos o los administradores autenticados. La actualización o borrado queda restringido exclusivamente a administradores (`role = 'admin'`).
* ✅ **Tabla `products`**: Cualquier visitante puede leer el catálogo público, pero nadie del público puede alterar precios, editar descripciones o borrar joyas del catálogo.
* ✅ **Bucket `comprobantes`**: Permite subir comprobantes de pago de forma segura al finalizar el pedido y restringe la lectura y descarga únicamente a administradores.
