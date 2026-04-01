import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET /api/gastos/ingresos?from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    let q = supabaseAdmin.from('orders').select('total, status')
    if (from) q = q.gte('created_at', from)
    if (to) q = q.lte('created_at', to + 'T23:59:59')

    const { data, error } = await q
    if (error) throw error

    const total = (data || [])
      .filter((o) => {
        const s = (o.status || '').toLowerCase()
        return s.includes('pagad') || s.includes('complet') || s.includes('paid')
      })
      .reduce((acc, o) => acc + (parseFloat(o.total) || 0), 0)

    return NextResponse.json({ total })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
