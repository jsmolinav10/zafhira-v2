import { NextResponse } from 'next/server'
import { z } from 'zod'

const estimateSchema = z.object({
  piece_type: z.string().default('anillo'),
  ring_size: z.string().optional(),
  band_thickness_mm: z.number().optional().default(1.8),
  band_width_mm: z.number().optional().default(2.5),
  center_stone_mm: z.number().optional().default(0),
  side_stones: z.array(z.object({ size_mm: z.number(), count: z.number() })).optional().default([]),
  metal: z.string().default('oro_18k'),
})

// Densidades de metales en g/mm³
const METAL_DENSITIES = {
  plata: 0.01036, // Plata 925
  plata_paladio: 0.01100, // Plata Paladio
  oro_18k: 0.01558, // Oro 18k amarillo/blanco promedio
  oro_24k: 0.01932, // Oro 24k puro
}

// Diámetros internos aproximados por talla US en mm
const RING_SIZE_DIAMETERS = {
  '4': 14.9, '5': 15.7, '6': 16.5, '7': 17.3,
  '8': 18.1, '9': 19.0, '10': 19.8, '11': 20.6, '12': 21.4
}

/**
 * Cálculo orfebre geométrico de respaldo
 */
function calculateGeometricWeight(d) {
  const sizeKey = String(d.ring_size || '7').replace(/[^0-9.]/g, '')
  const innerDiameter = RING_SIZE_DIAMETERS[sizeKey] || 17.3
  const meanDiameter = innerDiameter + (d.band_thickness_mm || 1.8)
  const circumference = Math.PI * meanDiameter
  const crossSectionArea = (d.band_width_mm || 2.5) * (d.band_thickness_mm || 1.8) * 0.85 // Factor de curvatura comfort-fit
  const volumeMm3 = circumference * crossSectionArea

  const metalKey = d.metal.toLowerCase().replace(/[^a-z0-9_]/g, '')
  const density = METAL_DENSITIES[metalKey] || 0.01558
  const estimatedGrams = volumeMm3 * density

  return parseFloat(Math.max(1.5, estimatedGrams).toFixed(2))
}

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = estimateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos de diseño inválidos', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const d = parsed.data
    const apiKey = process.env.GOOGLE_AI_API_KEY

    // Si hay API Key de Gemini configurada, consultar a Gemini 1.5 Flash
    if (apiKey) {
      try {
        const prompt = `Eres un maestro joyero y orfebre de alta joyería artesanal.
Calcula el peso estimado en gramos para la siguiente joya:
- Tipo de pieza: ${d.piece_type}
- Talla de anillo: ${d.ring_size || '7 US'}
- Espesor/Grosor de la banda: ${d.band_thickness_mm} mm
- Ancho de la banda: ${d.band_width_mm} mm
- Engaste de piedra central: ${d.center_stone_mm} mm
- Piedras laterales: ${JSON.stringify(d.side_stones)}
- Metal seleccionado: ${d.metal}

Instrucción estricta: Responde ÚNICAMENTE con un número flotante con máximo 2 decimales (por ejemplo: 4.85). No agregues texto, explicaciones, ni unidades.`

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.1, maxOutputTokens: 20 },
            }),
            signal: AbortSignal.timeout(4000), // Timeout de 4s
          }
        )

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json()
          const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
          const weight = parseFloat(text)
          if (!isNaN(weight) && weight > 0 && weight < 200) {
            return NextResponse.json({
              weight_estimate_g: parseFloat(weight.toFixed(2)),
              source: 'gemini-ai',
            })
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using geometric fallback:', geminiErr.message)
      }
    }

    // Fallback geométrico orfebre
    const fallbackWeight = calculateGeometricWeight(d)
    return NextResponse.json({
      weight_estimate_g: fallbackWeight,
      source: 'geometric-formula',
    })
  } catch (err) {
    console.error('estimate-weight error:', err)
    return NextResponse.json({ error: 'Error interno al estimar peso' }, { status: 500 })
  }
}
