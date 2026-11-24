'use client'
import { useState, useEffect } from 'react'

const DEFAULT_METALS = [
  { metal: 'plata', purity: '925', label: 'Plata Ley 925', price_per_gram: 5500 },
  { metal: 'plata_paladio', purity: '950', label: 'Plata Paladio 950', price_per_gram: 7800 },
  { metal: 'oro', purity: '18k', label: 'Oro 18K (Amarillo / Blanco / Rosa)', price_per_gram: 295000 },
  { metal: 'oro', purity: '24k', label: 'Oro 24K Puro', price_per_gram: 390000 },
]

const emptyQuote = {
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  piece_type: 'Anillo de Compromiso',
  ring_size: '7',
  band_thickness_mm: 1.8,
  band_width_mm: 2.5,
  center_stone_mm: 5.0,
  side_stones: [{ size_mm: 1.5, count: 4 }],
  metal: 'oro_18k',
  weight_estimate_g: 4.5,
  design_3d_cost: 80000,
  gems_cost: 150000,
  labor_cost: 180000,
  packaging_cost: 30000,
  margin_pct: 45,
  notes: '',
  render_url: null,
  status: 'borrador',
}

export default function CotizacionesPage() {
  const [activeTab, setActiveTab] = useState('nueva') // 'nueva' | 'historial' | 'metales'
  const [form, setForm] = useState(emptyQuote)
  const [quotes, setQuotes] = useState([])
  const [metalPrices, setMetalPrices] = useState(DEFAULT_METALS)
  const [loadingEstimate, setLoadingEstimate] = useState(false)
  const [loadingRender, setLoadingRender] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [search, setSearch] = useState('')

  // Cargar cotizaciones y precios de metales
  const loadData = async () => {
    try {
      // 1. Cargar metales
      const resMetals = await fetch('/api/admin/metal-prices')
      if (resMetals.ok) {
        const dMetals = await resMetals.json()
        if (dMetals.prices && dMetals.prices.length > 0) {
          setMetalPrices(dMetals.prices)
        }
      }

      // 2. Cargar cotizaciones
      const resQuotes = await fetch('/api/quotes')
      if (resQuotes.ok) {
        const dQuotes = await resQuotes.json()
        setQuotes(dQuotes.quotes || [])
      }
    } catch (err) {
      console.error('Error cargando datos iniciales:', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // Obtener precio por gramo del metal seleccionado
  const getSelectedMetalPrice = () => {
    const metalKey = form.metal.toLowerCase()
    if (metalKey.includes('24k')) {
      const m = metalPrices.find(p => p.metal === 'oro' && p.purity === '24k')
      return m ? Number(m.price_per_gram) : 390000
    }
    if (metalKey.includes('18k') || metalKey.includes('oro')) {
      const m = metalPrices.find(p => p.metal === 'oro' && p.purity === '18k')
      return m ? Number(m.price_per_gram) : 295000
    }
    if (metalKey.includes('paladio')) {
      const m = metalPrices.find(p => p.metal.includes('paladio'))
      return m ? Number(m.price_per_gram) : 7800
    }
    const m = metalPrices.find(p => p.metal === 'plata' && p.purity === '925')
    return m ? Number(m.price_per_gram) : 5500
  }

  // Cálculos de costos
  const currentPricePerGram = getSelectedMetalPrice()
  const weight = Number(form.weight_estimate_g) || 0
  const scrapFactor = 1.08 // 8% merma orfebre
  const metalCost = Math.round(weight * currentPricePerGram * scrapFactor)
  const designCost = Number(form.design_3d_cost) || 0
  const gemsCost = Number(form.gems_cost) || 0
  const laborCost = Number(form.labor_cost) || 0
  const packCost = Number(form.packaging_cost) || 30000
  const totalCost = metalCost + designCost + gemsCost + laborCost + packCost
  const marginPct = Number(form.margin_pct) || 40
  const salePrice = Math.round(totalCost * (1 + marginPct / 100))

  // Estimar peso con IA o fórmula geométrica
  const handleEstimateWeight = async () => {
    setLoadingEstimate(true)
    setMessage({ type: '', text: '' })
    try {
      const res = await fetch('/api/quotes/estimate-weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          piece_type: form.piece_type,
          ring_size: String(form.ring_size),
          band_thickness_mm: Number(form.band_thickness_mm),
          band_width_mm: Number(form.band_width_mm),
          center_stone_mm: Number(form.center_stone_mm),
          side_stones: form.side_stones,
          metal: form.metal,
        }),
      })

      const data = await res.json()
      if (res.ok && data.weight_estimate_g) {
        update('weight_estimate_g', data.weight_estimate_g)
        setMessage({
          type: 'success',
          text: `Peso estimado con éxito: ${data.weight_estimate_g} g (${data.source === 'gemini-ai' ? 'IA Gemini' : 'Fórmula Geométrica Orfebre'})`,
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'No se pudo estimar el peso' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión al estimar peso' })
    } finally {
      setLoadingEstimate(false)
    }
  }

  // Generar render con IA o Blueprint
  const handleGenerateRender = async () => {
    setLoadingRender(true)
    setMessage({ type: '', text: '' })
    try {
      const res = await fetch('/api/quotes/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          piece_type: form.piece_type,
          ring_size: String(form.ring_size),
          band_thickness_mm: Number(form.band_thickness_mm),
          band_width_mm: Number(form.band_width_mm),
          center_stone_mm: Number(form.center_stone_mm),
          side_stones: form.side_stones,
          metal: form.metal,
        }),
      })

      const data = await res.json()
      if (res.ok && data.render_url) {
        update('render_url', data.render_url)
        setMessage({
          type: 'success',
          text: 'Render generado y guardado en Supabase Storage exitosamente.',
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al generar el render' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión al generar el render' })
    } finally {
      setLoadingRender(false)
    }
  }

  // Guardar cotización en DB
  const handleSaveQuote = async (e) => {
    e.preventDefault()
    if (!form.customer_name.trim()) {
      setMessage({ type: 'error', text: 'El nombre del cliente es obligatorio' })
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const payload = {
        customer_name: form.customer_name,
        customer_phone: form.customer_phone || '',
        customer_email: form.customer_email || '',
        piece_type: form.piece_type,
        ring_size: String(form.ring_size || ''),
        band_thickness_mm: Number(form.band_thickness_mm) || 0,
        band_width_mm: Number(form.band_width_mm) || 0,
        center_stone_mm: Number(form.center_stone_mm) || 0,
        side_stones: form.side_stones || [],
        metal: form.metal,
        weight_estimate_g: weight,
        price_per_gram_oro: form.metal.includes('oro') ? currentPricePerGram : 0,
        price_per_gram_plata: form.metal.includes('plata') ? currentPricePerGram : 0,
        design_3d_cost: designCost,
        gems_cost: gemsCost,
        labor_cost: laborCost,
        packaging_cost: packCost,
        total_cost: totalCost,
        margin_pct: marginPct,
        sale_price: salePrice,
        render_url: form.render_url,
        notes: form.notes || '',
        status: form.status || 'borrador',
      }

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok && data.quote) {
        setMessage({ type: 'success', text: `¡Cotización #${data.quote.id.slice(0, 8)} guardada con éxito!` })
        setQuotes(prev => [data.quote, ...prev])
        // Opcional: abrir PDF
        window.open(`/api/quotes/${data.quote.id}/pdf`, '_blank')
        setActiveTab('historial')
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al guardar la cotización' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de red al guardar cotización' })
    } finally {
      setSaving(false)
    }
  }

  // Actualizar estado de cotización existente
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q))
      }
    } catch (e) {
      console.error('Error actualizando estado:', e)
    }
  }

  // Eliminar cotización
  const handleDeleteQuote = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta cotización?')) return
    try {
      const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setQuotes(prev => prev.filter(q => q.id !== id))
      }
    } catch (e) {
      console.error('Error eliminando cotización:', e)
    }
  }

  // Actualizar precio de metal en BD
  const handleUpdateMetalPrice = async (metal, purity, price) => {
    try {
      const res = await fetch('/api/admin/metal-prices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metal, purity, price_per_gram: Number(price) }),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: `Precio de ${metal} ${purity} actualizado correctamente.` })
        loadData()
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al actualizar precio de metal' })
    }
  }

  const formatMoney = (n) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0)

  const filteredQuotes = quotes.filter(q =>
    q.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    q.piece_type?.toLowerCase().includes(search.toLowerCase()) ||
    q.metal?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', fontSize: '1.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Cotizador de Alta Joyería
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Estimación orfebre con IA Gemini, cálculo de merma y exportación en PDF de marca ZAFHIRA.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('nueva')}
            style={{
              padding: '8px 16px',
              background: activeTab === 'nueva' ? 'var(--primary)' : 'var(--surface-container)',
              color: activeTab === 'nueva' ? '#000' : 'var(--on-surface)',
              border: '1px solid var(--outline-variant)',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
            }}
          >
            + Nueva Cotización
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            style={{
              padding: '8px 16px',
              background: activeTab === 'historial' ? 'var(--primary)' : 'var(--surface-container)',
              color: activeTab === 'historial' ? '#000' : 'var(--on-surface)',
              border: '1px solid var(--outline-variant)',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
            }}
          >
            Historial ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab('metales')}
            style={{
              padding: '8px 16px',
              background: activeTab === 'metales' ? 'var(--primary)' : 'var(--surface-container)',
              color: activeTab === 'metales' ? '#000' : 'var(--on-surface)',
              border: '1px solid var(--outline-variant)',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
            }}
          >
            ⚙️ Precios Metales
          </button>
        </div>
      </div>

      {/* Alertas */}
      {message.text && (
        <div style={{
          padding: '12px 18px',
          marginBottom: '1.5rem',
          borderRadius: '4px',
          background: message.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${message.type === 'success' ? '#4ade80' : '#ef4444'}`,
          color: message.type === 'success' ? '#4ade80' : '#ef4444',
          fontSize: '0.85rem',
        }}>
          {message.text}
        </div>
      )}

      {/* TAB 1: FORMULARIO NUEVA COTIZACIÓN */}
      {activeTab === 'nueva' && (
        <form onSubmit={handleSaveQuote} style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '2rem' }}>
          {/* Columna Izquierda: Parámetros */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. Datos del Cliente */}
            <div style={{ background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 0, marginBottom: '1rem' }}>
                1. Datos del Cliente
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={form.customer_name}
                    onChange={e => update('customer_name', e.target.value)}
                    placeholder="Ej. Carolina Mendoza"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={form.customer_phone}
                    onChange={e => update('customer_phone', e.target.value)}
                    placeholder="+57 300 123 4567"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Correo Electrónico</label>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={e => update('customer_email', e.target.value)}
                    placeholder="cliente@ejemplo.com"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Especificación Técnica de la Joya */}
            <div style={{ background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                  2. Especificaciones de la Joya
                </h3>
                <button
                  type="button"
                  onClick={handleEstimateWeight}
                  disabled={loadingEstimate}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid var(--primary)',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {loadingEstimate ? 'Calculando...' : '✨ Estimar Peso con IA'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Tipo de Pieza</label>
                  <select
                    value={form.piece_type}
                    onChange={e => update('piece_type', e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)' }}
                  >
                    <option value="Anillo de Compromiso">Anillo de Compromiso</option>
                    <option value="Argolla de Matrimonio">Argolla de Matrimonio</option>
                    <option value="Dije / Colgante">Dije / Colgante</option>
                    <option value="Aretes / Candongas">Aretes / Candongas</option>
                    <option value="Pulsera / Esclava">Pulsera / Esclava</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Metal</label>
                  <select
                    value={form.metal}
                    onChange={e => update('metal', e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)' }}
                  >
                    <option value="oro_18k">Oro 18K ({formatMoney(getSelectedMetalPrice())}/g)</option>
                    <option value="oro_24k">Oro 24K</option>
                    <option value="plata">Plata Ley 925</option>
                    <option value="plata_paladio">Plata Paladio 950</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Talla (US)</label>
                  <input
                    type="text"
                    value={form.ring_size}
                    onChange={e => update('ring_size', e.target.value)}
                    placeholder="Ej. 6.5"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Peso Estimado (gramos) *</label>
                  <input
                    type="number"
                    step="0.05"
                    value={form.weight_estimate_g || ''}
                    onChange={e => update('weight_estimate_g', parseFloat(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--primary)', fontWeight: 'bold' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Ancho de Banda (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.band_width_mm}
                    onChange={e => update('band_width_mm', parseFloat(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Grosor de Banda (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.band_thickness_mm}
                    onChange={e => update('band_thickness_mm', parseFloat(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Diámetro Piedra Central (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.center_stone_mm}
                    onChange={e => update('center_stone_mm', parseFloat(e.target.value))}
                    placeholder="0 si es lisa sin piedra"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)' }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Costos de Fabricación */}
            <div style={{ background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 0, marginBottom: '1rem' }}>
                3. Desglose de Mano de Obra y Costos (COP)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Gemas / Diamantes</label>
                  <input
                    type="number"
                    value={form.gems_cost}
                    onChange={e => update('gems_cost', e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Diseño 3D / CAD</label>
                  <input
                    type="number"
                    value={form.design_3d_cost}
                    onChange={e => update('design_3d_cost', e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Mano de Obra Orfebre</label>
                  <input
                    type="number"
                    value={form.labor_cost}
                    onChange={e => update('labor_cost', e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Packaging y Certificado</label>
                  <input
                    type="number"
                    value={form.packaging_cost}
                    onChange={e => update('packaging_cost', e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Render, Resumen y Precios */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Boceto / Render */}
            <div style={{ background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.85rem', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                  Render Técnico / Boceto
                </h3>
                <button
                  type="button"
                  onClick={handleGenerateRender}
                  disabled={loadingRender}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--primary)',
                    color: '#000',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {loadingRender ? 'Generando...' : '🎨 Generar Render'}
                </button>
              </div>

              {form.render_url ? (
                <div>
                  <img
                    src={form.render_url}
                    alt="Render joya"
                    style={{ width: '100%', height: '220px', objectFit: 'contain', background: '#0a0a0c', borderRadius: '4px', border: '1px solid #333' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: '#4ade80', marginTop: '6px' }}>✓ Almacenado en Supabase Storage</div>
                </div>
              ) : (
                <div style={{ height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', border: '1px dashed var(--outline-variant)' }}>
                  <span style={{ fontSize: '2rem' }}>💎</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', margin: '8px 0 0 0' }}>
                    Haz clic en "Generar Render" para crear la ilustración técnica del diseño.
                  </p>
                </div>
              )}
            </div>

            {/* Resumen Financiero Orfebre */}
            <div style={{ background: 'var(--surface-container-high)', border: '1px solid var(--primary)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 0, borderBottom: '1px solid rgba(212,175,55,0.3)', paddingBottom: '8px' }}>
                Cálculo y Margen Comercial
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>Metal ({weight}g + 8% merma):</span>
                  <span>{formatMoney(metalCost)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>Gemas y Piedras:</span>
                  <span>{formatMoney(gemsCost)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>Modelado 3D CAD:</span>
                  <span>{formatMoney(designCost)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>Mano de obra:</span>
                  <span>{formatMoney(laborCost)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>Packaging de Lujo:</span>
                  <span>{formatMoney(packCost)}</span>
                </div>

                <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Costo Total de Producción:</span>
                  <span>{formatMoney(totalCost)}</span>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Margen de Utilidad: {marginPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={marginPct}
                    onChange={e => update('margin_pct', parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                </div>

                <div style={{ background: 'var(--surface-container)', padding: '1rem', border: '1px solid var(--outline)', textAlign: 'center', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)' }}>
                    Precio de Venta Sugerido
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                    {formatMoney(salePrice)}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'var(--primary)',
                    color: '#000',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                  }}
                >
                  {saving ? 'Guardando...' : '💾 Guardar y Generar PDF'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: HISTORIAL DE COTIZACIONES */}
      {activeTab === 'historial' && (
        <div style={{ background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Buscar por cliente, pieza o metal..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '320px', padding: '10px', background: 'var(--bg-base)', border: '1px solid var(--outline)', color: 'var(--on-surface)' }}
            />
            <button
              onClick={loadData}
              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', cursor: 'pointer' }}
            >
              🔄 Refrescar
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--outline-variant)', color: 'var(--primary)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>ID / Fecha</th>
                  <th style={{ padding: '12px' }}>Cliente</th>
                  <th style={{ padding: '12px' }}>Pieza / Metal</th>
                  <th style={{ padding: '12px' }}>Peso</th>
                  <th style={{ padding: '12px' }}>Precio Venta</th>
                  <th style={{ padding: '12px' }}>Estado</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--on-surface-variant)' }}>
                      No hay cotizaciones registradas aún.
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map(q => (
                    <tr key={q.id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                      <td style={{ padding: '12px' }}>
                        <strong>#{q.id.slice(0, 8).toUpperCase()}</strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>
                          {new Date(q.created_at).toLocaleDateString('es-CO')}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{q.customer_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{q.customer_phone || q.customer_email || '-'}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{q.piece_type}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{(q.metal || '').toUpperCase()}</div>
                      </td>
                      <td style={{ padding: '12px' }}>{q.weight_estimate_g} g</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{formatMoney(q.sale_price)}</td>
                      <td style={{ padding: '12px' }}>
                        <select
                          value={q.status || 'borrador'}
                          onChange={e => handleStatusChange(q.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            background: q.status === 'aceptada' ? 'rgba(74, 222, 128, 0.2)' : 'var(--bg-base)',
                            color: q.status === 'aceptada' ? '#4ade80' : 'var(--on-surface)',
                            border: '1px solid var(--outline)',
                            fontSize: '0.75rem',
                          }}
                        >
                          <option value="borrador">Borrador</option>
                          <option value="enviada">Enviada</option>
                          <option value="aceptada">Aceptada</option>
                          <option value="rechazada">Rechazada</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <a
                            href={`/api/quotes/${q.id}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(212, 175, 55, 0.15)',
                              border: '1px solid var(--primary)',
                              color: 'var(--primary)',
                              textDecoration: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                            }}
                          >
                            📄 Ver PDF
                          </a>
                          <button
                            onClick={() => handleDeleteQuote(q.id)}
                            style={{
                              padding: '6px 10px',
                              background: 'transparent',
                              border: '1px solid #ef4444',
                              color: '#ef4444',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CONFIGURACIÓN DE METALES */}
      {activeTab === 'metales' && (
        <div style={{ background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 0 }}>
            Precios de Metales por Gramo (COP)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>
            Actualiza el costo base por gramo según la tasa del mercado. Todas las cotizaciones usarán estos valores automáticamente.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {metalPrices.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-base)', padding: '1rem', border: '1px solid var(--outline)' }}>
                <div>
                  <strong style={{ textTransform: 'uppercase', color: 'var(--on-surface)' }}>{m.metal} ({m.purity})</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                    Última actualización: {m.updated_at ? new Date(m.updated_at).toLocaleDateString('es-CO') : 'Por defecto'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>COP $</span>
                  <input
                    type="number"
                    defaultValue={m.price_per_gram}
                    onBlur={(e) => handleUpdateMetalPrice(m.metal, m.purity, e.target.value)}
                    style={{
                      width: '130px',
                      padding: '8px',
                      background: 'var(--surface-container)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--primary)',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
