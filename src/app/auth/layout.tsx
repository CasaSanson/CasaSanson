import NavbarWrapperAuth from "@/components/navbar/NavbarWrapperAuth";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavbarWrapperAuth />
      <main className="flex-grow">
        {children}
      </main>
    </>
  )
}