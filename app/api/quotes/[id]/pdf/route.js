import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const supabase = createAdminClient()

    const { data: quote, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !quote) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
    }

    const formatMoney = (amount) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(amount || 0)
    }

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Cotización · Zafhira #${quote.id.slice(0, 8)}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1a1a1a;
      background: #ffffff;
      margin: 0;
      padding: 20px;
    }
    .sheet {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #e5e5e5;
      padding: 40px;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #D4AF37;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .brand h1 {
      margin: 0;
      font-size: 26px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #111;
    }
    .brand p {
      margin: 4px 0 0 0;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #8E6A12;
    }
    .quote-meta {
      text-align: right;
      font-size: 12px;
      color: #666;
    }
    .quote-meta strong {
      display: block;
      font-size: 15px;
      color: #111;
      margin-bottom: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    .card {
      background: #fafafa;
      border: 1px solid #eee;
      border-radius: 6px;
      padding: 16px 20px;
    }
    .card h3 {
      margin: 0 0 12px 0;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #8E6A12;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 6px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 12px;
    }
    .row span:first-child { color: #666; }
    .row span:last-child { font-weight: 600; color: #111; }
    
    .table-container {
      margin-bottom: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th {
      background: #1a1a1c;
      color: #D4AF37;
      text-align: left;
      padding: 10px 14px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    td {
      padding: 10px 14px;
      border-bottom: 1px solid #eee;
    }
    tr:nth-child(even) { background: #fafafa; }
    
    .render-container {
      margin-bottom: 30px;
      text-align: center;
      background: #0f0f12;
      border-radius: 6px;
      padding: 16px;
    }
    .render-img {
      max-width: 100%;
      max-height: 280px;
      border-radius: 4px;
      object-fit: contain;
    }
    
    .total-box {
      margin-left: auto;
      width: 300px;
      background: #fafafa;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      padding: 16px 20px;
      margin-bottom: 40px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
    }
    .total-row.final {
      border-top: 2px solid #D4AF37;
      padding-top: 10px;
      margin-top: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #111;
    }

    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      padding-top: 20px;
    }
    .sig-box {
      width: 45%;
      border-top: 1px solid #999;
      padding-top: 8px;
      text-align: center;
      font-size: 11px;
      color: #666;
    }

    .no-print-bar {
      background: #111;
      color: #fff;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-radius: 6px;
    }
    .btn-print {
      background: #D4AF37;
      color: #000;
      border: none;
      padding: 8px 18px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;
      font-size: 13px;
    }
    @media print {
      .no-print-bar { display: none; }
      .sheet { border: none; padding: 0; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="no-print-bar">
      <span>Vista previa de Cotización Zafhira</span>
      <button class="btn-print" onclick="window.print()">📥 Imprimir / Guardar en PDF</button>
    </div>

    <div class="header">
      <div class="brand">
        <h1>ZAFHIRA</h1>
        <p>Taller de Joyería Personalizada · Bogotá, Colombia</p>
      </div>
      <div class="quote-meta">
        <strong>COTIZACIÓN #${quote.id.slice(0, 8).toUpperCase()}</strong>
        <div>Fecha: ${new Date(quote.created_at).toLocaleDateString('es-CO')}</div>
        <div>Estado: <span style="text-transform: uppercase; font-weight: bold;">${quote.status || 'Borrador'}</span></div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Datos del Cliente</h3>
        <div class="row"><span>Nombre:</span><span>${quote.customer_name}</span></div>
        <div class="row"><span>Teléfono:</span><span>${quote.customer_phone || 'No registrado'}</span></div>
        <div class="row"><span>Email:</span><span>${quote.customer_email || 'No registrado'}</span></div>
      </div>

      <div class="card">
        <h3>Especificaciones de la Joya</h3>
        <div class="row"><span>Tipo de pieza:</span><span style="text-transform: capitalize;">${quote.piece_type}</span></div>
        <div class="row"><span>Metal:</span><span style="text-transform: uppercase;">${(quote.metal || '').replace('_', ' ')}</span></div>
        <div class="row"><span>Talla:</span><span>${quote.ring_size ? `${quote.ring_size} US` : 'A medida'}</span></div>
        <div class="row"><span>Ancho / Grosor:</span><span>${quote.band_width_mm || 0}mm / ${quote.band_thickness_mm || 0}mm</span></div>
        <div class="row"><span>Peso estimado:</span><span>${quote.weight_estimate_g ? `${quote.weight_estimate_g} g` : 'Pendiente'}</span></div>
      </div>
    </div>

    ${quote.render_url ? `
    <div class="render-container">
      <div style="color: #D4AF37; font-size: 11px; margin-bottom: 8px; letter-spacing: 0.1em; text-transform: uppercase;">Render / Boceto Técnico Aprobado</div>
      <img src="${quote.render_url}" class="render-img" alt="Render de la joya" />
    </div>` : ''}

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Concepto / Material</th>
            <th>Detalle</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Metal Principal</strong></td>
            <td>${(quote.metal || '').toUpperCase()} · ${quote.weight_estimate_g || 0} gramos est.</td>
            <td style="text-align: right;">${formatMoney(quote.weight_estimate_g * (quote.price_per_gram_oro || quote.price_per_gram_plata || 0))}</td>
          </tr>
          <tr>
            <td><strong>Gemas / Piedras</strong></td>
            <td>Piedra central ${quote.center_stone_mm || 0}mm + laterales</td>
            <td style="text-align: right;">${formatMoney(quote.gems_cost || 0)}</td>
          </tr>
          <tr>
            <td><strong>Modelado y Prototipado 3D</strong></td>
            <td>Diseño CAD y renderizado artesanal</td>
            <td style="text-align: right;">${formatMoney(quote.design_3d_cost || 0)}</td>
          </tr>
          <tr>
            <td><strong>Mano de Obra Orfebre</strong></td>
            <td>Fundición, forja, engaste y pulido espejo</td>
            <td style="text-align: right;">${formatMoney(quote.labor_cost || 0)}</td>
          </tr>
          <tr>
            <td><strong>Packaging de Lujo Zafhira</strong></td>
            <td>Estuche de terciopelo, paño de limpieza y certificado</td>
            <td style="text-align: right;">${formatMoney(quote.packaging_cost || 30000)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="total-box">
      <div class="total-row"><span>Costo de Producción:</span><span>${formatMoney(quote.total_cost)}</span></div>
      <div class="total-row"><span>Margen / Gestión:</span><span>${quote.margin_pct || 40}%</span></div>
      <div class="total-row final"><span>Precio de Venta:</span><span style="color: #8E6A12;">${formatMoney(quote.sale_price)}</span></div>
    </div>

    <div class="signature-section">
      <div class="sig-box">
        Jhoan Sebastian · Maestro Orfebre<br>
        <strong>ZAFHIRA JOYERÍA</strong>
      </div>
      <div class="sig-box">
        Firma de Aceptación del Cliente<br>
        <strong>${quote.customer_name}</strong>
      </div>
    </div>
  </div>
</body>
</html>`

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (err) {
    console.error('API quote PDF error:', err)
    return NextResponse.json({ error: 'Error al generar cotización imprimible' }, { status: 500 })
  }
}
