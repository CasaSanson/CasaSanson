'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ClienteLoginPage() {
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
        setError('Confirma tu correo antes de entrar. Revisa tu bandeja de entrada (y spam).')
      } else if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
        setError('Correo o contraseña incorrectos.')
      } else {
        setError(signInError.message)
      }
      setLoading(false)
      return
    }

    router.push('/cuenta')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-cs-ivory flex flex-col items-center justify-center px-4 pt-24 pb-16">

      {/* Logo */}
      <Link href="/" className="mb-10">
        <Image src="/sanson_black.png" alt="Casa Sansón" width={120} height={40} className="object-contain" />
      </Link>

      <div className="w-full max-w-sm">
        <div className="mb-7">
          <h1 className="text-[22px] font-serif text-cs-negro tracking-wide">Iniciar sesión</h1>
          <p className="text-[11px] text-cs-gris-grafito mt-1 tracking-wider">
            Accede a tu cuenta para ver tus pedidos y más.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[9px] uppercase tracking-[0.3em] text-cs-gris-grafito block mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-white border border-cs-crema-mineral text-[13px] text-cs-negro outline-none focus:border-cs-vino transition-colors placeholder:text-cs-gris-ceniza"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="text-[9px] uppercase tracking-[0.3em] text-cs-gris-grafito block mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-11 bg-white border border-cs-crema-mineral text-[13px] text-cs-negro outline-none focus:border-cs-vino transition-colors placeholder:text-cs-gris-ceniza"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cs-gris-ceniza hover:text-cs-negro transition-colors"
              >
                {showPassword ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[11px] text-cs-vino bg-cs-vino/5 border border-cs-vino/20 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cs-negro text-cs-ivory py-3.5 text-[10px] uppercase tracking-[0.4em] hover:bg-cs-vino transition-colors duration-300 disabled:opacity-50 mt-1"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-cs-crema-mineral" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-cs-gris-ceniza">o</span>
          <div className="flex-1 h-px bg-cs-crema-mineral" />
        </div>

        <Link
          href="/cuenta/registro"
          className="flex items-center justify-center w-full py-3.5 border border-cs-negro/20 text-[10px] uppercase tracking-[0.3em] text-cs-negro hover:border-cs-negro hover:bg-cs-negro hover:text-cs-ivory transition-all duration-300"
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  )
}
