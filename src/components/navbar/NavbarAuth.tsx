"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FileText,
  BookOpen,
  LogOut,
  Wallet,
} from "lucide-react";

const navItems = [
  { href: "/auth/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/auth/dashboard/pedidos", label: "Pedidos", icon: ShoppingBag, exact: true },
  { href: "/auth/productos", label: "Productos", icon: Package, exact: false },
  { href: "/auth/finanzas", label: "Finanzas", icon: Wallet, exact: false },
  { href: "/auth/cartas", label: "Cartas", icon: FileText, exact: false },
  { href: "/auth/libros", label: "Libros", icon: BookOpen, exact: false },
];

export default function NavbarAuth() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href) ?? false;
  };

  const initials = userEmail
    ?.split("@")[0]
    .slice(0, 2)
    .toUpperCase() ?? "AD";

  return (
    <nav className="fixed top-0 left-0 right-0 h-[58px] bg-[#0d0f12] border-b border-white/[0.06] z-50 flex items-center px-5 gap-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 pr-6 border-r border-white/[0.07] mr-5 flex-shrink-0">
        <div className="flex flex-col leading-none">
          <span className="text-white/90 text-[11px] uppercase tracking-[0.3em] font-serif">
            Casa Sansón
          </span>
          <span className="text-[8px] uppercase tracking-[0.25em] text-cs-verde-musgo/70 mt-0.5">
            Portal de administración
          </span>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-0.5 flex-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] uppercase tracking-[0.18em] transition-all duration-150 ${
                active
                  ? "bg-white/[0.08] text-white"
                  : "text-white/35 hover:text-white/65 hover:bg-white/[0.04]"
              }`}
            >
              <Icon
                size={12}
                strokeWidth={active ? 2 : 1.5}
                className={active ? "text-cs-verde-musgo" : ""}
              />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-3 pl-5 border-l border-white/[0.07] flex-shrink-0">
        {userEmail && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cs-verde-musgo/15 border border-cs-verde-musgo/25 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-cs-verde-musgo uppercase">
                {initials}
              </span>
            </div>
            <span className="text-[10px] text-white/35 hidden md:block max-w-[160px] truncate">
              {userEmail}
            </span>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/25 hover:text-white/60 transition-colors duration-200 ml-1"
        >
          <LogOut size={12} strokeWidth={1.5} />
          <span className="hidden sm:block">Salir</span>
        </button>
      </div>
    </nav>
  );
}
