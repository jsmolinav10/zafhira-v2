import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const requestUrl = new URL(request.url)
  return NextResponse.redirect(new URL('/admin/login', requestUrl.origin), {
    status: 302,
  })
}
