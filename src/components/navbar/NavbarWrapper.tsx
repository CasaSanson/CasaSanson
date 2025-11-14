'use client'

import { usePathname } from 'next/navigation'
import Navbar from './NavbarHome'

export default function NavbarWrapper() {
  const pathname = usePathname()
  const isAuthRoute = pathname?.startsWith('/auth') 

  if (isAuthRoute) {
    return null
  }

  return <Navbar />
}
