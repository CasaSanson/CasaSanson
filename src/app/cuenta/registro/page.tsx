'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ClienteRegistroPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const inputClass = "w-full px-4 py-3 bg-white border border-cs-crema-mineral text-[13px] text-cs-negro outline-none focus:border-cs-vino transition-colors placeholder:text-cs-gris-ceniza"
  const labelClass = "text-[9px] uppercase tracking-[0.3em] text-cs-gris-grafito block mb-1.5"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nombre.trim() || !apellido.trim()) { setError('Ingresa tu nombre y apellido.'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }

    setLoading(true)
    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/cuenta`,
        data: {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          full_name: `${nombre.trim()} ${apellido.trim()}`,
        },
      },
    })

    if (signUpError) {
      const msg = signUpError.message.toLowerCase()
      if (msg.includes('rate limit') || msg.includes('email rate')) {
        setError('Demasiados intentos en poco tiempo. Espera unos minutos e intenta de nuevo.')
      } else if (msg.includes('already registered') || msg.includes('user already')) {
        setError('Este correo ya tiene una cuenta. Intenta iniciar sesión.')
      } else {
        setError(signUpError.message)
      }
      setLoading(false)
      return
    }

    // Si Supabase no requiere confirmación de email, data.session ya existe → redirigir directo
    if (data.session) {
      router.push('/cuenta')
      router.refresh()
      return
    }

    // Si requiere confirmación, mostrar pantalla de éxito
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cs-ivory flex flex-col items-center justify-center px-4 text-center">
        <div className="w-12 h-12 rounded-full border border-cs-verde-musgo/40 bg-cs-verde-musgo/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={20} strokeWidth={1.5} className="text-cs-verde-musgo" />
        </div>
        <h2 className="font-serif text-xl text-cs-negro mb-1">
          ¡Bienvenido, {nombre}!
        </h2>
        <p className="text-[12px] text-cs-gris-grafito leading-relaxed max-w-xs mt-1 mb-8">
          Revisa tu correo <span className="text-cs-negro font-medium">{email}</span> y confirma tu cuenta para continuar.
        </p>
        <Link
          href="/cuenta/login"
          className="text-[10px] uppercase tracking-[0.3em] text-cs-negro border border-cs-negro/20 px-6 py-3 hover:bg-cs-negro hover:text-cs-ivory transition-all duration-300"
        >
          Ir al login
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cs-ivory flex flex-col items-center justify-center px-4 pt-24 pb-16">

      <Link href="/" className="mb-10">
        <Image src="/sanson_black.png" alt="Casa Sansón" width={120} height={40} className="object-contain" />
      </Link>

      <div className="w-full max-w-sm">
        <div className="mb-7">
          <h1 className="text-[22px] font-serif text-cs-negro tracking-wide">Crear cuenta</h1>
          <p className="text-[11px] text-cs-gris-grafito mt-1 tracking-wider">
            Guarda tus pedidos y accede a beneficios exclusivos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nombre + Apellido en grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                autoComplete="given-name"
                className={inputClass}
                placeholder="Ana"
              />
            </div>
            <div>
              <label className={labelClass}>Apellido</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
                autoComplete="family-name"
                className={inputClass}
                placeholder="García"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
              placeholder="tu@correo.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className={labelClass}>Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className={`${inputClass} pr-11`}
                placeholder="Mínimo 8 caracteres"
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

          {/* Confirm */}
          <div>
            <label className={labelClass}>Confirmar contraseña</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className={inputClass}
              placeholder="Repite tu contraseña"
            />
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-[10px] mt-6 text-cs-gris-grafito">
          ¿Ya tienes cuenta?{' '}
          <Link href="/cuenta/login" className="text-cs-negro underline underline-offset-2 hover:text-cs-vino transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
