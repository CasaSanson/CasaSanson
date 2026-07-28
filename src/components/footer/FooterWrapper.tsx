'use client'
import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function FooterWrapper() {
  const pathname = usePathname()
  
  // Si la ruta es exactamente '/', no renderizamos nada
  if (pathname === '/') return null

  return <Footer />
}