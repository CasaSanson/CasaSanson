import Footer from '@/components/footer/Footer';
import './globals.css'
import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import { SessionProvider } from "@/components/src/components/SessionProvider";
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/shop/CartDrawe';

export const metadata = {
  title: 'Casa Sansón',
  description: 'Prendas que celebran el cuerpo humano',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amarna:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          <SessionProvider>
            <NavbarWrapper />
            <CartDrawer /> {/* <--- Agrégalo aquí */}
            <main>{children}</main>
            <Footer />
          </SessionProvider>
        </CartProvider>
      </body>
    </html>
  )
}

