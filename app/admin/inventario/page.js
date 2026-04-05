import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function uploadProduct(formData) {
  'use server'
  const supabase = await createClient()

  const title = formData.get('title')
  const description = formData.get('description')
  const price = formData.get('price')
  const category = formData.get('category')
  const imageFile = formData.get('image') // Get the file from FormData

  let image_url = '/placeholder-ring.webp'

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    
    // Upload image to Supabase Storage 'productos' bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('productos')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (!uploadError) {
      // Get the public URL for the uploaded image
      const { data } = supabase.storage
        .from('productos')
        .getPublicUrl(fileName)
        
      image_url = data.publicUrl
    } else {
      console.error('Error uploading image:', uploadError)
    }
  }

  const { error } = await supabase
    .from('products')
    .insert([{ title, description, price: parseFloat(price), category, image_url }])

  revalidatePath('/catalogo')
  revalidatePath('/admin/inventario')
}

export default async function InventoryPage() {
  const supabase = await createClient()
  
  // Fetch existing products
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Mis Creaciones</h1>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '3rem' }}>Gestiona el inventario que se mostrará en el catálogo de Zafhira.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
        
        {/* Formulario de Creación */}
        <div className="panel-elevated" style={{ padding: '2rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', color: 'var(--on-surface)' }}>Añadir Nueva Pieza</h2>
          <form action={uploadProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Título</label>
              <input name="title" required placeholder="Ej. Anillo de la Promesa" style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Categoría</label>
                <select name="category" style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
                  <option value="Collares">Collares</option>
                  <option value="Anillos">Anillos</option>
                  <option value="Pulseras">Pulseras</option>
                  <option value="Aretes">Aretes</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Precio (COP)</label>
                <input name="price" type="number" required placeholder="1500000" style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Imagen de la Joya</label>
              <input type="file" name="image" accept="image/*" required style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px dashed var(--outline)', color: 'var(--primary)', cursor: 'pointer' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Descripción</label>
              <textarea name="description" rows={3} style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', resize: 'vertical' }} />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '1rem', width: '100%' }}>FORJAR Y PUBLICAR</button>
          </form>
        </div>

        {/* Listado de Inventario */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', color: 'var(--on-surface)' }}>Catálogo Activo</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(!products || products.length === 0) ? (
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface-low)', color: 'var(--on-surface-variant)', border: '1px dashed var(--outline)' }}>
                Aún no hay piezas cargadas en la bóveda de Supabase.
              </div>
            ) : (
                products.map(p => (
                  <div key={p.id} className="panel-elevated" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ 
                         width: '50px', height: '50px', 
                         background: 'var(--surface-container)', 
                         border: '1px solid var(--outline)',
                         backgroundImage: p.image_url ? `url(${p.image_url})` : 'none',
                         backgroundSize: 'cover',
                         backgroundPosition: 'center',
                         borderRadius: '4px'
                       }} />
                       <div>
                         <div style={{ fontWeight: 600, color: 'var(--on-surface)', fontSize: '0.9rem' }}>{p.title}</div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{p.category}</div>
                       </div>
                    </div>
                    <div style={{ fontWeight: 500, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                       ${p.price.toLocaleString('es-CO')}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
