import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// WARNING: This endpoint uses the SUPABASE_SERVICE_ROLE_KEY and will mark a
// user's email as confirmed. Use only for development or after careful review.

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
      if (!isLocal && ADMIN_KEY && providedKey !== ADMIN_KEY) {
        return NextResponse.json({ error: 'Unauthorized: admin key required from non-localhost' }, { status: 401 });
      }
    }

    const body = await req.json();
    const email = body?.email;
    if (!email) return NextResponse.json({ error: 'email required in request body' }, { status: 400 });

    // Use the Supabase Admin REST API instead of querying internal tables.
    // This is more portable across Supabase versions.
    const adminBase = SUPABASE_URL.replace(/\/+$/, '') + '/auth/v1/admin';

    // 1) fetch user by email
    const listResp = await fetch(`${adminBase}/users?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!listResp.ok) {
      const txt = await listResp.text();
      return NextResponse.json({ error: `admin list users failed: ${listResp.status} ${txt}` }, { status: 500 });
    }

    const users = await listResp.json();
    const user = Array.isArray(users) ? users[0] : users;
    if (!user || !user.id) return NextResponse.json({ error: 'User not found via admin API' }, { status: 404 });

    const now = new Date().toISOString();

    // 2) try to mark user confirmed via admin PATCH endpoint
    const patchResp = await fetch(`${adminBase}/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_confirm: true, email_confirmed_at: now, confirmed_at: now }),
    });

    if (!patchResp.ok) {
      const txt = await patchResp.text();
      return NextResponse.json({ error: `admin patch user failed: ${patchResp.status} ${txt}`, user }, { status: 500 });
    }

    const patched = await patchResp.json();
    return NextResponse.json({ user: patched }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
