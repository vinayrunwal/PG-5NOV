import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const { id, email, display_name } = body
    if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 })

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE env vars')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })

    const name = display_name ?? (email && typeof email === 'string' ? email.split('@')[0] : 'New User')

    const { error } = await supabase.rpc('create_profile_if_not_exists', {
      p_id: id,
      p_email: email ?? null,
      p_display_name: name,
    })

    if (error) {
      console.error('RPC error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
