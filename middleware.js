import { updateSession } from '@/lib/supabase/middleware'
import { checkRateLimit } from '@/lib/rateLimit'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Aplicar Rate Limiting a las rutas de API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = request.ip ?? (forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1');
    
    // Limite de 20 peticiones por minuto
    const result = await checkRateLimit(ip, { limit: 20, windowSeconds: 60 });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones. Intenta de nuevo más tarde.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.reset),
            'Retry-After': '60',
          },
        }
      );
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
