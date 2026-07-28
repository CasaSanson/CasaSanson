'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function RegistroPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0b0d10] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-full border border-cs-verde-musgo/30 bg-cs-verde-musgo/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={20} strokeWidth={1.5} className="text-cs-verde-musgo" />
          </div>
          <h2 className="font-serif text-lg text-white/85 mb-2">Cuenta creada</h2>
          <p className="text-[11px] text-white/35 leading-relaxed mb-8">
            Revisa tu correo <span className="text-white/55">{email}</span> y confirma tu cuenta para continuar.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/35 hover:text-white/60 transition-colors border border-white/[0.07] hover:border-white/[0.14] px-6 py-3"
          >
            <ArrowLeft size={11} strokeWidth={1.5} />
            Volver al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0d10] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="mb-10 text-center">
          <p className="font-serif text-[11px] uppercase tracking-[0.4em] text-white/50 mb-1">
            Casa Sansón
          </p>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">
            Crear cuenta
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.025] border border-white/[0.07] p-8">
          <h1 className="font-serif text-lg text-white/85 mb-6">Registro</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/80 outline-none focus:border-cs-verde-musgo/50 transition-colors placeholder:text-white/20"
                placeholder="tu@correo.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-11 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/80 outline-none focus:border-cs-verde-musgo/50 transition-colors placeholder:text-white/20"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPassword
                    ? <EyeOff size={14} strokeWidth={1.5} />
                    : <Eye size={14} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">
                Confirmar contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/80 outline-none focus:border-cs-verde-musgo/50 transition-colors placeholder:text-white/20"
                placeholder="Repite tu contraseña"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-cs-vino/15 border border-cs-vino/30 text-[11px] text-white/60">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white/[0.07] border border-white/[0.12] hover:bg-white/[0.12] hover:border-cs-verde-musgo/40 disabled:opacity-40 transition-all py-3.5 text-[10px] uppercase tracking-[0.35em] text-white/70 mt-2"
            >
              <UserPlus size={12} strokeWidth={1.5} />
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-white/25 hover:text-white/50 transition-colors"
            >
              <ArrowLeft size={10} strokeWidth={1.5} />
              Ya tengo cuenta
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
