import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Genera un SVG técnico de lujo para boceto de orfebrería cuando la IA de imagen no está disponible
 */
function generateTechnicalBlueprintSvg(body) {
  const metalName = (body.metal || 'Oro 18K').replace('_', ' ').toUpperCase()
  const pieceType = (body.piece_type || 'Anillo').toUpperCase()
  const widthMm = body.band_width_mm || 2.5
  const thicknessMm = body.band_thickness_mm || 1.8
  const stoneMm = body.center_stone_mm || 0
  const size = body.ring_size || '7'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C158" />
      <stop offset="50%" stop-color="#C59B27" />
      <stop offset="100%" stop-color="#8E6A12" />
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f0f12" />
      <stop offset="100%" stop-color="#18181c" />
    </linearGradient>
    <radialGradient id="gemGrad" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#93c5fd" />
      <stop offset="100%" stop-color="#1e3a8a" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)" />

  <!-- Grid Blueprint Lines -->
  <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
    <line x1="50" y1="50" x2="750" y2="50" />
    <line x1="50" y1="150" x2="750" y2="150" />
    <line x1="50" y1="250" x2="750" y2="250" />
    <line x1="50" y1="350" x2="750" y2="350" />
    <line x1="50" y1="450" x2="750" y2="450" />
    <line x1="50" y1="550" x2="750" y2="550" />
    <line x1="100" y1="50" x2="100" y2="550" />
    <line x1="250" y1="50" x2="250" y2="550" />
    <line x1="400" y1="50" x2="400" y2="550" />
    <line x1="550" y1="50" x2="550" y2="550" />
    <line x1="700" y1="50" x2="700" y2="550" />
  </g>

  <!-- Header Branding -->
  <text x="400" y="70" text-anchor="middle" fill="#D4AF37" font-family="serif" font-size="20" letter-spacing="4">ZAFHIRA JOYERÍA</text>
  <text x="400" y="95" text-anchor="middle" fill="#888888" font-family="sans-serif" font-size="11" letter-spacing="2">BOCETO TÉCNICO Y ESPECIFICACIÓN ORFEBRE</text>

  <!-- Central Ring Illustration -->
  <!-- Outer band -->
  <ellipse cx="400" cy="320" rx="150" ry="90" fill="none" stroke="url(#goldGrad)" stroke-width="${Math.min(22, Math.max(8, widthMm * 4))}" />
  <!-- Inner band comfort fit -->
  <ellipse cx="400" cy="330" rx="142" ry="82" fill="none" stroke="#2a2518" stroke-width="2" />
  
  <!-- Stone Setting if specified -->
  ${stoneMm > 0 ? `
    <!-- Prong Setting -->
    <path d="M 385 225 L 390 200 L 410 200 L 415 225 Z" fill="url(#goldGrad)" />
    <!-- Center Diamond / Gemstone -->
    <polygon points="400,160 425,190 415,225 385,225 375,190" fill="url(#gemGrad)" stroke="#ffffff" stroke-width="1.5" />
    <line x1="400" y1="160" x2="400" y2="225" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1" />
    <line x1="375" y1="190" x2="425" y2="190" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1" />
    <text x="400" y="145" text-anchor="middle" fill="#93c5fd" font-family="sans-serif" font-size="11">GEMA CENTRAL: ${stoneMm} mm</text>
  ` : ''}

  <!-- Technical Spec Box -->
  <rect x="70" y="440" width="660" height="100" rx="4" fill="#141418" stroke="#333333" stroke-width="1" />
  
  <text x="95" y="475" fill="#888888" font-family="sans-serif" font-size="11">PIEZA:</text>
  <text x="150" y="475" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">${pieceType}</text>

  <text x="310" y="475" fill="#888888" font-family="sans-serif" font-size="11">METAL:</text>
  <text x="370" y="475" fill="#D4AF37" font-family="sans-serif" font-size="12" font-weight="bold">${metalName}</text>

  <text x="540" y="475" fill="#888888" font-family="sans-serif" font-size="11">TALLA:</text>
  <text x="595" y="475" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">${size} US</text>

  <text x="95" y="515" fill="#888888" font-family="sans-serif" font-size="11">ANCHO BANDA:</text>
  <text x="195" y="515" fill="#ffffff" font-family="sans-serif" font-size="12">${widthMm} mm</text>

  <text x="310" y="515" fill="#888888" font-family="sans-serif" font-size="11">GROSOR BANDA:</text>
  <text x="420" y="515" fill="#ffffff" font-family="sans-serif" font-size="12">${thicknessMm} mm</text>

  <text x="540" y="515" fill="#888888" font-family="sans-serif" font-size="11">ACABADO:</text>
  <text x="615" y="515" fill="#ffffff" font-family="sans-serif" font-size="12">Pulido espejo</text>
</svg>`
}

export async function POST(request) {
  try {
    const body = await request.json()
    const apiKey = process.env.GOOGLE_AI_API_KEY
    const supabase = createAdminClient()

    let imageBuffer = null
    let contentType = 'image/png'
    let fileExtension = 'png'

    // 1. Intentar generación con Imagen 3 / Gemini si hay API Key
    if (apiKey) {
      try {
        const prompt = `High-end jewelry professional technical studio photograph of a luxury ${body.metal || '18k yellow gold'} ${body.piece_type || 'ring'}, size ${body.ring_size || '7'}, band width ${body.band_width_mm || 2.5}mm, ${body.center_stone_mm ? `featuring a brilliant center diamond of ${body.center_stone_mm}mm` : 'pure minimalist clean design'}. Soft velvet reflections, sharp macro details, jewelry craftsmanship catalog lighting.`

        const imagenRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              instances: [{ prompt }],
              parameters: { sampleCount: 1, aspectRatio: '1:1', outputMimeType: 'image/png' },
            }),
            signal: AbortSignal.timeout(10000),
          }
        )

        if (imagenRes.ok) {
          const data = await imagenRes.json()
          const b64 = data.predictions?.[0]?.bytesBase64Encoded
          if (b64) {
            imageBuffer = Buffer.from(b64, 'base64')
          }
        }
      } catch (aiErr) {
        console.warn('Imagen 3 generation failed, falling back to technical blueprint render:', aiErr.message)
      }
    }

    // 2. Si no hubo imagen de IA, generar el SVG técnico artesanal de ZAFHIRA
    if (!imageBuffer) {
      const svg = generateTechnicalBlueprintSvg(body)
      imageBuffer = Buffer.from(svg, 'utf-8')
      contentType = 'image/svg+xml'
      fileExtension = 'svg'
    }

    // 3. Subir el render a Supabase Storage (bucket 'renders')
    const fileName = `quotes/${Date.now()}_render.${fileExtension}`
    const { error: uploadError } = await supabase.storage
      .from('renders')
      .upload(fileName, imageBuffer, {
        contentType,
        upsert: true,
      })

    if (uploadError) {
      console.warn('Could not upload to storage bucket renders, returning inline data URI:', uploadError.message)
      const base64Data = imageBuffer.toString('base64')
      return NextResponse.json({
        render_url: `data:${contentType};base64,${base64Data}`,
        stored: false,
      })
    }

    // 4. Obtener URL pública permanente
    const { data: urlData } = supabase.storage.from('renders').getPublicUrl(fileName)
    return NextResponse.json({
      render_url: urlData.publicUrl,
      stored: true,
    })
  } catch (err) {
    console.error('API quotes/render error:', err)
    return NextResponse.json({ error: 'Error al generar render' }, { status: 500 })
  }
}
