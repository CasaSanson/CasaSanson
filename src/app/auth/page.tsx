'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      const msg = signInError.message.toLowerCase()
      if (msg.includes('email not confirmed')) {
        setError('Confirma tu correo antes de entrar.')
      } else if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
        setError('Correo o contraseña incorrectos.')
      } else {
        setError(signInError.message)
      }
      setLoading(false)
      return
    }

    // El middleware en src/middleware.ts verifica que el email sea super_admin.
    // Si no lo es, redirige automáticamente a '/'. No hace falta checar aquí.
    router.push('/auth/dashboard')
    router.refresh()
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
            Portal de administración
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.025] border border-white/[0.07] p-8">
          <h1 className="font-serif text-lg text-white/85 mb-6">Iniciar sesión</h1>

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
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/80 outline-none focus:border-cs-verde-musgo/50 transition-colors placeholder:text-white/20"
                  placeholder="••••••••"
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
              <LogIn size={12} strokeWidth={1.5} />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

        </div>

        <p className="text-center text-[8px] uppercase tracking-[0.2em] text-white/15 mt-6">
          Solo administradores autorizados pueden acceder al portal
        </p>
      </div>
    </div>
  )
}
