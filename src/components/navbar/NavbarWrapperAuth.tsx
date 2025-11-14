'use client'

import { usePathname } from 'next/navigation'
import NavbarAuth from './NavbarAuth'

export default function NavbarWrapper() {
  const pathname = usePathname()
  const isAuthRoute = pathname?.startsWith('/auth/') 

  if (!isAuthRoute) {
    return null
  }

  return <NavbarAuth />
}