import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// PUT /api/gastos/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { nombre, monto, unidades, fecha_compra, categoria, notas, documento_url } = body

    const { data, error } = await supabaseAdmin
      .from('gastos')
      .update({ nombre, monto, unidades, fecha_compra, categoria, notas: notas || null, documento_url: documento_url ?? null })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// DELETE /api/gastos/[id]
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { error } = await supabaseAdmin.from('gastos').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
