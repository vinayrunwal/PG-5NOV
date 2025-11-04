import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(req: Request) {
  try {
    if (!SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured on server.' }, { status: 500 });
    }

    // Admin protection: in production require ADMIN_API_KEY header, in dev allow localhost
    const ADMIN_KEY = process.env.ADMIN_API_KEY || '';
    const providedKey = req.headers.get('x-admin-key') || req.headers.get('authorization')?.replace('Bearer ', '') || '';
    const host = req.headers.get('host') || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const requireAdmin = process.env.NODE_ENV === 'production';

    if (requireAdmin) {
      if (!ADMIN_KEY || providedKey !== ADMIN_KEY) {
        return NextResponse.json({ error: 'Unauthorized: ADMIN_API_KEY required' }, { status: 401 });
      }
    } else {
      // Development: allow if request originates from localhost OR valid admin key provided
      if (!isLocal && ADMIN_KEY && providedKey !== ADMIN_KEY) {
        return NextResponse.json({ error: 'Unauthorized: admin key required from non-localhost' }, { status: 401 });
      }
    }

    const body = await req.json();
    const email = body?.email;
    if (!email) return NextResponse.json({ error: 'email required in request body' }, { status: 400 });

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Query the auth.users table directly using the service role key.
    const { data, error } = await admin
      .from('auth.users')
      .select('*')
      .eq('email', email)
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
    }

    return NextResponse.json({ user: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
