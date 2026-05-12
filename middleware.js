import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'

// Limitador de peticiones en memoria básico (Edge Runtime)
// Nota: en producción con Vercel esto se reinicia frecuentemente, es mejor usar Upstash Redis.
const rateLimitMap = new Map();

export async function middleware(request) {
  // Aplicar Rate Limiting solo a las rutas de API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown-ip';
    const currentTime = Date.now();
    
    if (rateLimitMap.has(ip)) {
      const data = rateLimitMap.get(ip);
      // Limpiar datos antiguos (ej: 1 minuto de ventana)
      if (currentTime - data.timestamp > 60000) {
        rateLimitMap.set(ip, { count: 1, timestamp: currentTime });
      } else {
        if (data.count >= 20) { // Límite de 20 peticiones por minuto
          return NextResponse.json({ error: 'Demasiadas peticiones. Intenta de nuevo más tarde.' }, { status: 429 });
        }
        data.count++;
        rateLimitMap.set(ip, data);
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: currentTime });
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
