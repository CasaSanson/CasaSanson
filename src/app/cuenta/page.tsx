'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, HelpCircle, User, LogOut, ChevronRight, Package, Mail, MessageCircle } from 'lucide-react'

const ayudaLinks = [
  { label: 'Guía de tallas', href: '/catalogo', icon: Package },
  { label: 'Política de cambios y devoluciones', href: '/nosotros', icon: ShoppingBag },
  { label: 'Contacto por WhatsApp', href: 'https://wa.me/527224278825', icon: MessageCircle, external: true },
  { label: 'Enviarnos un correo', href: 'mailto:casasanson@gmail.com', icon: Mail, external: true },
]

export default function CuentaPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'pedidos' | 'ayuda' | 'perfil'>('pedidos')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/cuenta/login')
      } else {
        setUser(data.user)
      }
      setLoading(false)
    })
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cs-ivory flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-cs-negro/20 border-t-cs-negro rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const fullName = user.user_metadata?.full_name as string | undefined
  const nombre = user.user_metadata?.nombre as string | undefined
  const apellido = user.user_metadata?.apellido as string | undefined
  const displayName = fullName ?? user.email ?? ''
  const avatarInitials = nombre && apellido
    ? `${nombre[0]}${apellido[0]}`.toUpperCase()
    : user.email?.slice(0, 2).toUpperCase() ?? 'CS'

  return (
    <div className="min-h-screen bg-cs-ivory pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-cs-crema-mineral">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-cs-vino/10 border border-cs-vino/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-cs-vino">{avatarInitials}</span>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-cs-gris-grafito mb-0.5">Mi cuenta</p>
              {fullName ? (
                <p className="text-[14px] font-serif text-cs-negro">{fullName}</p>
              ) : (
                <p className="text-[13px] text-cs-negro truncate max-w-[200px]">{user.email}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-cs-gris-grafito hover:text-cs-vino transition-colors"
          >
            <LogOut size={12} strokeWidth={1.5} />
            Salir
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-cs-crema-mineral mb-8 gap-0">
          {([
            { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
            { id: 'ayuda', label: 'Ayuda', icon: HelpCircle },
            { id: 'perfil', label: 'Perfil', icon: User },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-2 px-5 py-3 text-[10px] uppercase tracking-[0.2em] border-b-2 transition-all duration-150 -mb-px ${
                activeSection === id
                  ? 'border-cs-negro text-cs-negro'
                  : 'border-transparent text-cs-gris-grafito hover:text-cs-negro'
              }`}
            >
              <Icon size={12} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>

        {/* ── PEDIDOS ── */}
        {activeSection === 'pedidos' && (
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-cs-gris-ceniza mb-6">Historial de pedidos</p>
            <div className="py-16 text-center border border-dashed border-cs-crema-mineral">
              <ShoppingBag size={22} strokeWidth={1} className="mx-auto mb-4 text-cs-gris-ceniza" />
              <p className="text-[13px] text-cs-gris-grafito font-serif mb-1">Aún no tienes pedidos</p>
              <p className="text-[11px] text-cs-gris-ceniza mb-6">Cuando realices una compra, aparecerá aquí.</p>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] border border-cs-negro/30 px-6 py-3 text-cs-negro hover:bg-cs-negro hover:text-cs-ivory transition-all duration-300"
              >
                Explorar catálogo
                <ChevronRight size={11} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        )}

        {/* ── AYUDA ── */}
        {activeSection === 'ayuda' && (
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-cs-gris-ceniza mb-6">Centro de ayuda</p>
            <div className="divide-y divide-cs-crema-mineral">
              {ayudaLinks.map(({ label, href, icon: Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-between py-4 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cs-crema-mineral/60 flex items-center justify-center">
                      <Icon size={13} strokeWidth={1.5} className="text-cs-gris-grafito" />
                    </div>
                    <span className="text-[13px] text-cs-negro group-hover:text-cs-vino transition-colors">
                      {label}
                    </span>
                  </div>
                  <ChevronRight
                    size={13}
                    strokeWidth={1.5}
                    className="text-cs-gris-ceniza group-hover:text-cs-vino group-hover:translate-x-0.5 transition-all"
                  />
                </a>
              ))}
            </div>

            <div className="mt-8 p-5 bg-cs-nude/40 border border-cs-crema-mineral">
              <p className="text-[11px] text-cs-gris-grafito leading-relaxed">
                ¿Tienes un problema con tu pedido? Escríbenos directamente y te respondemos en menos de 24 horas.
              </p>
            </div>
          </div>
        )}

        {/* ── PERFIL ── */}
        {activeSection === 'perfil' && (
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-cs-gris-ceniza mb-6">Datos de tu cuenta</p>
            <div className="space-y-3">
              {nombre && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white border border-cs-crema-mineral">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-cs-gris-ceniza mb-1">Nombre</p>
                    <p className="text-[13px] text-cs-negro">{nombre}</p>
                  </div>
                  <div className="p-4 bg-white border border-cs-crema-mineral">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-cs-gris-ceniza mb-1">Apellido</p>
                    <p className="text-[13px] text-cs-negro">{apellido}</p>
                  </div>
                </div>
              )}
              <div className="p-4 bg-white border border-cs-crema-mineral">
                <p className="text-[9px] uppercase tracking-[0.3em] text-cs-gris-ceniza mb-1">Correo electrónico</p>
                <p className="text-[13px] text-cs-negro">{user.email}</p>
              </div>
              <div className="p-4 bg-white border border-cs-crema-mineral">
                <p className="text-[9px] uppercase tracking-[0.3em] text-cs-gris-ceniza mb-1">Miembro desde</p>
                <p className="text-[13px] text-cs-negro">
                  {new Date(user.created_at).toLocaleDateString('es-MX', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cs-gris-grafito border border-cs-crema-mineral px-5 py-3 hover:border-cs-vino/40 hover:text-cs-vino transition-all duration-200"
            >
              <LogOut size={12} strokeWidth={1.5} />
              Cerrar sesión
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
