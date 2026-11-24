import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth/admin'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Protección: Si faltan las llaves, no intentamos conectar para evitar el timeout 504 en Vercel
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY no están configuradas.");
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            // Eliminamos maxAge para que la cookie sea de sesión (se borra al cerrar el navegador)
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value }) =>
            supabaseResponse.cookies.set(name, value, {
              maxAge: undefined, // Fuerza a que sea de sesión
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production'
            })
          );
        },
      },
    }
  )

  // Añadimos un timeout manual de 2 segundos para evitar que getUser() cuelgue el middleware
  const userPromise = supabase.auth.getUser();
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Supabase Timeout')), 2000)
  );

  let user = null;
  try {
    const { data } = await Promise.race([userPromise, timeoutPromise]);
    user = data?.user;
  } catch (err) {
    console.error("Middleware Auth Timeout/Error:", err.message);
    // Si hay timeout o error, user se mantiene en null para que
    // las protecciones de rutas más abajo sigan aplicando.
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // 1. Proteger rutas admin para usuarios no autenticados
  if (!user && isAdminRoute && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // 2. Control de Acceso basado en Roles (RBAC): verificar si el usuario autenticado tiene permisos de admin
  if (user && isAdminRoute && !isLoginPage) {
    if (!isAdmin(user)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'Tu cuenta no tiene permisos de administrador.')
      return NextResponse.redirect(url)
    }
  }

  // 3. Redirigir administradores autenticados fuera de la pantalla de login
  if (user && isLoginPage && isAdmin(user)) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
