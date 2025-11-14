import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Configuración simple con contraseña única
// En producción, esto debería estar en una base de datos
const ADMIN_PASSWORD_HASH = "$2b$12$k4sKdfAs5dRhH9bOWRplm..E7FCOHJxi10VT.DA1UQg2AlZwNI.Ua" // "Aguachile1109"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          return null
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          ADMIN_PASSWORD_HASH
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: "1",
          email: "admin@jacm.com",
          name: "José Antonio Corona Mañón",
          role: "admin"
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production"
}
