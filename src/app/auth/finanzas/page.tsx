'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Plus, X, Upload, Loader2, AlertCircle, FileText,
  Trash2, Edit2, ChevronDown, TrendingUp, TrendingDown,
  Wallet, Tag, Receipt, ExternalLink, BarChart3,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Categoria = 'Materiales' | 'Marketing' | 'Maquila' | 'Operaciones' | 'Logística' | 'Otro'
type Periodo = 'mes' | 'trimestre' | 'año' | 'todo'

interface Gasto {
  id: string
  nombre: string
  monto: number
  unidades: number
  fecha_compra: string
  categoria: Categoria
  documento_url: string | null
  notas: string | null
  created_at: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIAS: { value: Categoria; color: string; bg: string; border: string }[] = [
  { value: 'Materiales',  color: '#a8c5b5', bg: '#a8c5b512', border: '#a8c5b522' },
  { value: 'Marketing',   color: '#cfaeb4', bg: '#cfaeb412', border: '#cfaeb422' },
  { value: 'Maquila',     color: '#b5a8c5', bg: '#b5a8c512', border: '#b5a8c522' },
  { value: 'Operaciones', color: '#c5bca8', bg: '#c5bca812', border: '#c5bca822' },
  { value: 'Logística',   color: '#a8b5c5', bg: '#a8b5c512', border: '#a8b5c522' },
  { value: 'Otro',        color: '#888',    bg: '#88888812', border: '#88888822' },
]

const CAT_MAP = Object.fromEntries(CATEGORIAS.map((c) => [c.value, c]))

const EMPTY_FORM = {
  nombre: '',
  monto: '',
  unidades: '1',
  fecha_compra: new Date().toISOString().split('T')[0],
  categoria: 'Otro' as Categoria,
  notas: '',
}

function periodoRange(p: Periodo): { from: string; to: string } | null {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  if (p === 'todo') return null
  const to = fmt(now)
  if (p === 'mes') return { from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)), to }
  if (p === 'trimestre') {
    const d = new Date(now); d.setMonth(d.getMonth() - 3)
    return { from: fmt(d), to }
  }
  return { from: fmt(new Date(now.getFullYear(), 0, 1)), to }
}

const fmt$ = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(n)

// ─── Component ────────────────────────────────────────────────────────────────

export default function Finanzas() {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [ingresos, setIngresos] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [periodo, setPeriodo] = useState<Periodo>('mes')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Gasto | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [docFile, setDocFile] = useState<File | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const range = periodoRange(periodo)
      const params = range ? `?from=${range.from}&to=${range.to}` : ''

      const [gastosRes, ingresosRes] = await Promise.all([
        fetch(`/api/gastos${params}`),
        fetch(`/api/gastos/ingresos${params}`),
      ])

      if (!gastosRes.ok || !ingresosRes.ok) throw new Error('Error al cargar datos')

      const [gastosData, ingresosData] = await Promise.all([gastosRes.json(), ingresosRes.json()])

      setGastos(gastosData)
      setIngresos(ingresosData.total ?? 0)
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar los datos financieros')
    } finally {
      setLoading(false)
    }
  }, [periodo])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Derived KPIs ──────────────────────────────────────────────────────────

  const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0)
  const balance = ingresos - totalGastos
  const margen = ingresos > 0 ? ((balance / ingresos) * 100).toFixed(1) : null

  const porCategoria = CATEGORIAS.map(({ value }) => ({
    categoria: value,
    total: gastos.filter((g) => g.categoria === value).reduce((acc, g) => acc + g.monto, 0),
    count: gastos.filter((g) => g.categoria === value).length,
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total)

  const maxCatTotal = Math.max(...porCategoria.map((c) => c.total), 1)

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const openNew = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDocFile(null)
    setShowForm(true)
  }

  const openEdit = (g: Gasto) => {
    setEditing(g)
    setForm({
      nombre: g.nombre,
      monto: String(g.monto),
      unidades: String(g.unidades),
      fecha_compra: g.fecha_compra,
      categoria: g.categoria,
      notas: g.notas || '',
    })
    setDocFile(null)
    setShowForm(true)
  }

  const closeForm = () => { setShowForm(false); setEditing(null); setDocFile(null) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let documento_url = editing?.documento_url ?? null

      if (docFile) {
        const fd = new FormData()
        fd.append('file', docFile)
        const upRes = await fetch('/api/gastos/upload', { method: 'POST', body: fd })
        if (!upRes.ok) throw new Error('Error al subir el documento')
        const upData = await upRes.json()
        documento_url = upData.url
      }

      const payload = {
        nombre: form.nombre.trim(),
        monto: parseFloat(form.monto) || 0,
        unidades: parseInt(form.unidades) || 1,
        fecha_compra: form.fecha_compra,
        categoria: form.categoria,
        notas: form.notas.trim() || null,
        documento_url,
      }

      const url = editing ? `/api/gastos/${editing.id}` : '/api/gastos'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Error al guardar')
      }

      closeForm()
      fetchData()
    } catch (e: any) {
      setError(e.message ?? 'Error al guardar el gasto')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/gastos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      fetchData()
    } catch (e: any) {
      setError(e.message ?? 'Error al eliminar el gasto')
    } finally {
      setDeletingId(null)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={13} strokeWidth={1.5} className="text-white/30" />
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/25">Administración</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="font-serif text-xl text-white/85">Finanzas</h1>
            <div className="flex items-center gap-1.5">
              {(['mes', 'trimestre', 'año', 'todo'] as Periodo[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 border transition-all duration-150 ${
                    periodo === p
                      ? 'bg-white/[0.06] border-white/[0.12] text-white/70'
                      : 'border-white/[0.05] text-white/25 hover:border-white/[0.08] hover:text-white/45'
                  }`}
                >
                  {p === 'mes' ? 'Este mes' : p === 'trimestre' ? '3 meses' : p === 'año' ? 'Este año' : 'Todo'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-950/20 border border-red-900/30 mb-6 text-[11px] text-white/50">
            <AlertCircle size={13} strokeWidth={1.5} className="text-red-400/50 flex-shrink-0" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-white/25 hover:text-white/50">
              <X size={12} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={22} strokeWidth={1.5} className="animate-spin text-white/20" />
          </div>
        ) : (
          <>
            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
              <KpiCard
                label="Ingresos"
                value={fmt$(ingresos)}
                icon={<TrendingUp size={13} strokeWidth={1.5} />}
                color="#a8c5b5"
                sub="Ventas del período"
              />
              <KpiCard
                label="Gastos"
                value={fmt$(totalGastos)}
                icon={<TrendingDown size={13} strokeWidth={1.5} />}
                color="#cfaeb4"
                sub={`${gastos.length} registro${gastos.length !== 1 ? 's' : ''}`}
              />
              <KpiCard
                label="Balance"
                value={fmt$(balance)}
                icon={<Wallet size={13} strokeWidth={1.5} />}
                color={balance >= 0 ? '#a8c5b5' : '#cfaeb4'}
                sub={balance >= 0 ? 'Positivo' : 'Negativo'}
                highlight
              />
              <KpiCard
                label="Margen"
                value={margen !== null ? `${margen}%` : '—'}
                icon={<BarChart3 size={13} strokeWidth={1.5} />}
                color="#b5a8c5"
                sub="Sobre ingresos"
              />
            </div>

            {/* ── Gastos por categoría ── */}
            {porCategoria.length > 0 && (
              <div className="mb-8 p-5 bg-white/[0.02] border border-white/[0.05]">
                <p className="text-[9px] uppercase tracking-[0.35em] text-white/25 mb-4 flex items-center gap-2">
                  <Tag size={10} strokeWidth={1.5} />
                  Gastos por categoría
                </p>
                <div className="space-y-3">
                  {porCategoria.map(({ categoria, total, count }) => {
                    const cat = CAT_MAP[categoria]
                    const pct = totalGastos > 0 ? (total / totalGastos) * 100 : 0
                    return (
                      <div key={categoria}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border"
                              style={{ color: cat.color, backgroundColor: cat.bg, borderColor: cat.border }}
                            >
                              {categoria}
                            </span>
                            <span className="text-[9px] text-white/20">{count} registro{count !== 1 ? 's' : ''}</span>
                          </div>
                          <span className="text-[11px] font-mono text-white/55">{fmt$(total)}</span>
                        </div>
                        <div className="h-[2px] bg-white/[0.04] overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
                            style={{ width: `${(total / maxCatTotal) * 100}%`, backgroundColor: cat.color + '60' }}
                          />
                        </div>
                        <p className="text-[8px] text-white/18 mt-1">{pct.toFixed(1)}% del total</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[9px] uppercase tracking-[0.35em] text-white/20 flex items-center gap-2">
                <Receipt size={10} strokeWidth={1.5} />
                Registros de gastos
              </p>
              <button
                onClick={openNew}
                className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] px-3 py-2 bg-white/[0.04] border border-white/[0.08] text-white/55 hover:bg-white/[0.07] hover:text-white/75 transition-all duration-150"
              >
                <Plus size={11} strokeWidth={1.5} />
                Nuevo gasto
              </button>
            </div>

            {/* ── Gastos list ── */}
            {gastos.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-white/[0.06]">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">No hay gastos registrados</p>
                <button
                  onClick={openNew}
                  className="mt-4 text-[9px] uppercase tracking-[0.2em] px-4 py-2 border border-white/[0.08] text-white/30 hover:text-white/55 hover:border-white/[0.15] transition-all"
                >
                  Agregar el primero
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {gastos.map((g) => {
                  const cat = CAT_MAP[g.categoria] ?? CAT_MAP['Otro']
                  const isOpen = expandedId === g.id
                  return (
                    <div key={g.id} className="hover:bg-white/[0.012] transition-colors">
                      <button
                        className="w-full flex items-center gap-4 py-4 px-2 text-left"
                        onClick={() => setExpandedId(isOpen ? null : g.id)}
                      >
                        <span
                          className="hidden sm:inline text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 border flex-shrink-0"
                          style={{ color: cat.color, backgroundColor: cat.bg, borderColor: cat.border }}
                        >
                          {g.categoria}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-white/72 truncate">{g.nombre}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[9px] text-white/25">
                              {new Date(g.fecha_compra + 'T12:00:00').toLocaleDateString('es-MX', {
                                year: 'numeric', month: 'short', day: 'numeric',
                              })}
                            </p>
                            {g.unidades > 1 && (
                              <span className="text-[8px] text-white/18">{g.unidades} uds.</span>
                            )}
                            {g.documento_url && (
                              <FileText size={9} strokeWidth={1.5} className="text-white/20" />
                            )}
                          </div>
                        </div>
                        <p className="font-serif text-[14px] text-white/70 flex-shrink-0">{fmt$(g.monto)}</p>
                        <ChevronDown
                          size={13}
                          strokeWidth={1.5}
                          className={`text-white/18 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-5">
                          <div className="bg-white/[0.025] border border-white/[0.055] p-5">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 mb-5">
                              <Field label="Categoría">
                                <span
                                  className="text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border"
                                  style={{ color: cat.color, backgroundColor: cat.bg, borderColor: cat.border }}
                                >
                                  {g.categoria}
                                </span>
                              </Field>
                              <Field label="Monto" value={fmt$(g.monto)} />
                              <Field label="Unidades" value={String(g.unidades)} />
                              <Field
                                label="Fecha de compra"
                                value={new Date(g.fecha_compra + 'T12:00:00').toLocaleDateString('es-MX', {
                                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                })}
                              />
                              {g.notas && <Field label="Notas" value={g.notas} className="col-span-2" />}
                            </div>
                            <div className="flex items-center gap-2 pt-4 border-t border-white/[0.05]">
                              {g.documento_url && (
                                <a
                                  href={g.documento_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border border-white/[0.07] text-white/35 hover:text-white/60 hover:border-white/[0.12] transition-all"
                                >
                                  <FileText size={10} strokeWidth={1.5} />
                                  Ver documento
                                  <ExternalLink size={9} strokeWidth={1.5} />
                                </a>
                              )}
                              <button
                                onClick={() => openEdit(g)}
                                className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border border-white/[0.07] text-white/35 hover:text-white/60 hover:border-white/[0.12] transition-all ml-auto"
                              >
                                <Edit2 size={10} strokeWidth={1.5} />
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(g.id)}
                                disabled={deletingId === g.id}
                                className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 border border-red-900/30 text-red-400/40 hover:text-red-400/70 hover:border-red-900/50 transition-all disabled:opacity-50"
                              >
                                {deletingId === g.id
                                  ? <Loader2 size={10} strokeWidth={1.5} className="animate-spin" />
                                  : <Trash2 size={10} strokeWidth={1.5} />}
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal Form ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0f1115] border border-white/[0.08] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Receipt size={13} strokeWidth={1.5} className="text-white/30" />
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/55">
                  {editing ? 'Editar gasto' : 'Nuevo gasto'}
                </p>
              </div>
              <button onClick={closeForm} className="text-white/20 hover:text-white/50 transition-colors">
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FormField label="Nombre del gasto" required>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej. Tela de lino, diseño de campaña..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] px-3 py-2.5 text-[12px] text-white/70 placeholder-white/20 focus:outline-none focus:border-white/[0.15] transition-colors"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Monto (MXN)" required>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.monto}
                    onChange={(e) => setForm({ ...form, monto: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-white/[0.03] border border-white/[0.08] px-3 py-2.5 text-[12px] text-white/70 placeholder-white/20 focus:outline-none focus:border-white/[0.15] transition-colors"
                  />
                </FormField>
                <FormField label="Unidades">
                  <input
                    type="number"
                    min="1"
                    value={form.unidades}
                    onChange={(e) => setForm({ ...form, unidades: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.08] px-3 py-2.5 text-[12px] text-white/70 placeholder-white/20 focus:outline-none focus:border-white/[0.15] transition-colors"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Fecha de compra" required>
                  <input
                    type="date"
                    required
                    value={form.fecha_compra}
                    onChange={(e) => setForm({ ...form, fecha_compra: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.08] px-3 py-2.5 text-[12px] text-white/70 focus:outline-none focus:border-white/[0.15] transition-colors"
                  />
                </FormField>
                <FormField label="Categoría" required>
                  <div className="relative">
                    <select
                      value={form.categoria}
                      onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}
                      className="w-full appearance-none bg-white/[0.03] border border-white/[0.08] px-3 py-2.5 text-[12px] text-white/70 focus:outline-none focus:border-white/[0.15] transition-colors pr-8"
                    >
                      {CATEGORIAS.map((c) => (
                        <option key={c.value} value={c.value} className="bg-[#0f1115]">
                          {c.value}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={12} strokeWidth={1.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  </div>
                </FormField>
              </div>

              <FormField label="Notas (opcional)">
                <textarea
                  rows={2}
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  placeholder="Proveedor, número de factura, observaciones..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] px-3 py-2.5 text-[12px] text-white/70 placeholder-white/20 focus:outline-none focus:border-white/[0.15] transition-colors resize-none"
                />
              </FormField>

              <FormField label="Documento (transferencia, factura, etc.)">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-3 px-3 py-3 border border-dashed border-white/[0.08] hover:border-white/[0.15] cursor-pointer transition-colors group"
                >
                  <Upload size={13} strokeWidth={1.5} className="text-white/25 group-hover:text-white/40 flex-shrink-0 transition-colors" />
                  <div className="min-w-0">
                    {docFile ? (
                      <p className="text-[11px] text-white/55 truncate">{docFile.name}</p>
                    ) : editing?.documento_url ? (
                      <p className="text-[10px] text-white/30">Documento actual — haz clic para reemplazar</p>
                    ) : (
                      <p className="text-[10px] text-white/25">Haz clic para subir PDF, imagen o comprobante</p>
                    )}
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                />
              </FormField>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-[9px] uppercase tracking-[0.2em] px-4 py-2 border border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/[0.1] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] px-5 py-2 bg-white/[0.06] border border-white/[0.1] text-white/60 hover:bg-white/[0.09] hover:text-white/80 transition-all disabled:opacity-50"
                >
                  {saving && <Loader2 size={10} strokeWidth={1.5} className="animate-spin" />}
                  {editing ? 'Guardar cambios' : 'Registrar gasto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, icon, color, sub, highlight }: {
  label: string; value: string; icon: React.ReactNode
  color: string; sub?: string; highlight?: boolean
}) {
  return (
    <div className={`p-4 border ${highlight ? 'bg-white/[0.035]' : 'bg-white/[0.02]'} border-white/[0.055]`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[8px] uppercase tracking-[0.3em] text-white/25">{label}</p>
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="font-serif text-[18px] leading-none" style={{ color }}>{value}</p>
      {sub && <p className="text-[8px] text-white/20 mt-1.5 uppercase tracking-wider">{sub}</p>}
    </div>
  )
}

function FormField({ label, required, children }: {
  label: string; required?: boolean; children: React.ReactNode; className?: string
}) {
  return (
    <div>
      <label className="block text-[8px] uppercase tracking-[0.3em] text-white/25 mb-1.5">
        {label}{required && <span className="text-red-400/50 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function Field({ label, value, children, className }: {
  label: string; value?: string; children?: React.ReactNode; className?: string
}) {
  return (
    <div className={className}>
      <p className="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1">{label}</p>
      {children ?? <p className="text-[11px] text-white/60">{value}</p>}
    </div>
  )
}
