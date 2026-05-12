import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CategorySelector from '../../CategorySelector'

async function updateProduct(formData) {
  'use server'
  const supabase = await createClient()

  const id = formData.get('id')
  const title = formData.get('title')
  const description = formData.get('description')
  const price = formData.get('price')
  const mainCategory = formData.get('main_category')
  const subcategory = formData.get('subcategory')
  const category = `${mainCategory}: ${subcategory}`
  const status = formData.get('status')
  const is_featured = formData.get('is_featured') === 'on'

  const updateData = {
    title,
    description,
    price: parseFloat(price.toString().replace(/\./g, '')),
    category,
    status,
    is_featured
  }

  // Handle image upload if a new one is provided
  const imageFile = formData.get('image')
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
        
      updateData.image_url = data.publicUrl
    }
  }

  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Error updating product:', error)
  }

  revalidatePath('/catalogo')
  revalidatePath('/admin/inventario')
  revalidatePath('/')
  redirect('/admin/inventario')
}

export default async function EditProductPage({ params }) {
  const { id } = params
  const supabase = await createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Producto no encontrado</h2>
        <Link href="/admin/inventario" style={{ color: 'var(--primary)' }}>Volver al inventario</Link>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/inventario" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>
          ← Volver
        </Link>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '2rem', letterSpacing: '0.05em', margin: 0 }}>
          Editar Pieza
        </h1>
      </div>

      <div className="panel-elevated" style={{ padding: '2rem', maxWidth: '800px' }}>
        <form action={updateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input type="hidden" name="id" value={product.id} />
          
          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Título</label>
            <input name="title" defaultValue={product.title} required style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }} />
          </div>
          
          <CategorySelector defaultValue={product.category} />

          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Precio (COP)</label>
            <input name="price" type="number" defaultValue={product.price} required style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Imagen de la Joya (Opcional, dejar en blanco para mantener la actual)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {product.image_url && (
                <img src={product.image_url} alt="Actual" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--outline)' }} />
              )}
              <input type="file" name="image" accept="image/*" style={{ flex: 1, padding: '10px', background: 'var(--surface-container)', border: '1px dashed var(--outline)', color: 'var(--primary)', cursor: 'pointer' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Estado</label>
              <select name="status" defaultValue={product.status} style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
                <option value="disponible">✅ Disponible</option>
                <option value="agotado">🔴 Agotado</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '18px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--on-surface)' }}>
                <input type="checkbox" name="is_featured" defaultChecked={product.is_featured} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                ⭐ Destacar en Portada
              </label>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Descripción</label>
            <textarea name="description" defaultValue={product.description} rows={4} style={{ width: '100%', padding: '10px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/admin/inventario" className="btn-secondary" style={{ padding: '12px', textAlign: 'center', textDecoration: 'none', flex: 1, background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
              CANCELAR
            </Link>
            <button type="submit" className="btn-primary" style={{ padding: '12px', flex: 2 }}>
              GUARDAR CAMBIOS
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
