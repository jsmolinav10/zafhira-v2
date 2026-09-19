import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import InventoryActions from './InventoryActions'
import CategorySelector from './CategorySelector'
import PriceCalculator from './PriceCalculator'

async function uploadProduct(formData) {
  'use server'
  const supabase = await createClient()

  const title = formData.get('title')
  const description = formData.get('description')
  const price = formData.get('price')
  const mainCategory = formData.get('main_category')
  const subcategory = formData.get('subcategory')
  const category = `${mainCategory}: ${subcategory}`
  const material = formData.get('material')
  const status = formData.get('status') || 'disponible'
  const imageFile = formData.get('image')
  const reference = formData.get('reference') || ''
  const production_cost = parseFloat(formData.get('production_cost') || '0')
  const profit_margin_target = parseFloat(formData.get('profit_margin_target') || '40')

  let image_url = '/placeholder-ring.webp'

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('productos')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (!uploadError) {
      const { data } = supabase.storage
        .from('productos')
        .getPublicUrl(fileName)

      image_url = data.publicUrl
    } else {
      console.error('Error uploading image:', uploadError)
    }
  }

  const is_featured = formData.get('is_featured') === 'on'
  const finalDescription = material ? `Material: ${material}\n\n${description}` : description

  const { error } = await supabase
    .from('products')
    .insert([{
      title,
      description: finalDescription,
      price: parseFloat(price.toString().replace(/\./g, '')),
      category,
      image_url,
      status,
      is_featured,
      reference,
      production_cost,
      profit_margin_target
    }])

  if (error) {
    console.error('Error inserting product:', error)
  }

  revalidatePath('/catalogo')
  revalidatePath('/')
  revalidatePath('/admin/inventario')
}

async function deleteProduct(formData) {
  'use server'
  const supabase = await createClient()
  const id = formData.get('id')

  await supabase.from('products').delete().eq('id', id)

  revalidatePath('/catalogo')
  revalidatePath('/admin/inventario')
}

async function toggleStatus(formData) {
  'use server'
  const supabase = await createClient()
  const id = formData.get('id')
  const currentStatus = formData.get('currentStatus')
  const newStatus = currentStatus === 'disponible' ? 'agotado' : 'disponible'

  await supabase.from('products').update({ status: newStatus }).eq('id', id)

  revalidatePath('/')
  revalidatePath('/admin/inventario')
}

async function toggleFeatured(formData) {
  'use server'
  const supabase = await createClient()
  const id = formData.get('id')
  const currentFeatured = formData.get('currentFeatured') === 'true'

  await supabase.from('products').update({ is_featured: !currentFeatured }).eq('id', id)

  revalidatePath('/')
  revalidatePath('/admin/inventario')
}

export default async function InventoryPage() {
  const supabase = await createClient()

  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Mis Creaciones</h1>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '3rem' }}>Gestiona el inventario que se mostrará en el catálogo de Zafhira.</p>

      <div className="admin-layout">

        {/* Formulario de Creación */}
        <div className="panel-elevated" style={{ padding: '2rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', color: 'var(--on-surface)' }}>Añadir Nueva Pieza</h2>
          <form action={uploadProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Reference */}
            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Referencia Interna</label>
              <input name="reference" placeholder="Ej. AF-10550, ZF-M-B" style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Título</label>
              <input name="title" required placeholder="Ej. Anillo de la Promesa" style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }} />
            </div>

            <CategorySelector />

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Material</label>
              <input name="material" placeholder="Ej. Oro 18K, Plata 925..." style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }} />
            </div>

            {/* Price Calculator (Cost + Margin + Price) */}
            <PriceCalculator />

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Archivo Multimedia (Foto o Video)</label>
              <input type="file" name="image" accept="image/*,video/mp4,video/quicktime" required style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px dashed var(--outline)', color: 'var(--primary)', cursor: 'pointer' }} />
            </div>

            <div className="admin-form-row">
              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Estado</label>
                <select name="status" style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
                  <option value="disponible">✅ Disponible</option>
                  <option value="agotado">🛑 Agotado</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: '18px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--on-surface)' }}>
                  <input type="checkbox" name="is_featured" style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                  ⭐ Destacar en Portada
                </label>
              </div>
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
                <div key={p.id} className="panel-elevated admin-list-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '50px', height: '50px',
                      background: 'var(--surface-container)',
                      border: '1px solid var(--outline)',
                      backgroundImage: p.image_url ? `url(${p.image_url})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '4px',
                      flexShrink: 0
                    }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--on-surface)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {p.is_featured && <span title="Destacada en portada">⭐</span>}
                        {p.reference && <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--primary)', padding: '1px 6px', border: '1px solid var(--primary)', marginRight: '4px' }}>{p.reference}</span>}
                        {p.title}
                        <span style={{
                          fontSize: '0.6rem',
                          padding: '2px 8px',
                          background: p.status === 'agotado' ? 'rgba(255,68,68,0.15)' : 'rgba(81,207,102,0.15)',
                          color: p.status === 'agotado' ? '#ff4444' : '#51cf66',
                          borderRadius: '2px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {p.status === 'agotado' ? 'Agotado' : 'En Stock'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', display: 'flex', gap: '0.75rem', marginTop: '2px' }}>
                        <span>{p.category}</span>
                        {p.production_cost > 0 && (
                          <span>Costo: ${p.production_cost?.toLocaleString('es-CO')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="admin-list-actions">
                    <div style={{ fontWeight: 500, color: 'var(--primary)', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap' }}>
                      ${p.price.toLocaleString('es-CO')}
                    </div>
                    <InventoryActions product={p} toggleStatusAction={toggleStatus} deleteAction={deleteProduct} toggleFeaturedAction={toggleFeatured} />
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
