import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET /api/gastos?from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    let q = supabaseAdmin.from('gastos').select('*').order('fecha_compra', { ascending: false })
    if (from) q = q.gte('fecha_compra', from)
    if (to) q = q.lte('fecha_compra', to)

    const { data, error } = await q
    if (error) throw error

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST /api/gastos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, monto, unidades, fecha_compra, categoria, notas, documento_url } = body

    if (!nombre || monto === undefined || !fecha_compra || !categoria) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('gastos')
      .insert([{ nombre, monto, unidades: unidades ?? 1, fecha_compra, categoria, notas: notas || null, documento_url: documento_url || null }])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
