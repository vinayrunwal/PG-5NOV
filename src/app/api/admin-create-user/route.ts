import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(req: Request) {
  try {
    if (!SERVICE_ROLE_KEY) return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }, { status: 500 });

    const body = await req.json();
    const { email, password, display_name, phone, role } = body || {};
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 });

    const adminBase = SUPABASE_URL.replace(/\/+$/, '') + '/auth/v1/admin';
    const now = new Date().toISOString();

    const payload: any = {
      email,
      password,
      user_metadata: { display_name, email, phone, role },
      email_confirm: true,
      email_confirmed_at: now,
    };

    const resp = await fetch(`${adminBase}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { json = text; }

    if (!resp.ok) {
      return NextResponse.json({ error: `admin create user failed: ${resp.status} ${text}` }, { status: 500 });
    }

    return NextResponse.json({ user: json }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
