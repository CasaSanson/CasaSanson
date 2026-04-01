"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { ShoppingCartIcon, User, LogOut, ShoppingBag, HelpCircle, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const router = useRouter();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Load Supabase user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserMenuOpen(false);
    router.refresh();
  };

  const userNombre = user?.user_metadata?.nombre as string | undefined
  const userApellido = user?.user_metadata?.apellido as string | undefined
  const emailInitials = userNombre && userApellido
    ? `${userNombre[0]}${userApellido[0]}`.toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? ""
  const displayName = userNombre
    ? `${userNombre} ${userApellido ?? ''}`.trim()
    : user?.email ?? ''

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* ─── DESKTOP NAVBAR ─── */}
      <nav
        className={`fixed hidden md:block top-0 left-0 w-full z-50 transition-all duration-500 ${
          show ? "translate-y-0" : "-translate-y-full"
        } ${isScrolled ? "bg-white shadow-md h-20" : "bg-transparent h-28"}`}
      >
        <div className="flex items-center justify-between h-full px-8 max-w-9xl mx-auto">
          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                width={isScrolled ? 130 : 150}
                height={50}
                src={isScrolled ? "/sanson_black.png" : "/sanson_vino.png"}
                alt="Casa Sansón Logo"
                className="object-contain transition-all duration-300"
              />
            </Link>
          </div>

          {/* Nav links */}
          <div className="flex space-x-12">
            {["CATALOGO", "DIARIO", "BIBLIOTECA", "NOSOTROS"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace("ñ", "n")}`}
                className={`font-bold cursor-pointer transition-all duration-300 tracking-widest text-sm ${
                  isScrolled ? "text-black hover:text-cs-vino" : "text-cs-vino hover:text-black"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Right: user + cart */}
          <div className="flex items-center gap-4">

            {/* User icon / dropdown */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 transition-all hover:opacity-75"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border text-[10px] font-bold transition-colors ${
                        isScrolled
                          ? "bg-cs-vino/10 border-cs-vino/25 text-cs-vino"
                          : "bg-cs-ivory/10 border-cs-ivory/30 text-cs-ivory"
                      }`}
                    >
                      {emailInitials}
                    </div>
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-white border border-gray-100 shadow-xl py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-cs-gris-ceniza">Mi cuenta</p>
                        <p className="text-[12px] text-cs-negro mt-0.5 truncate font-medium">{displayName}</p>
                        {userNombre && (
                          <p className="text-[10px] text-cs-gris-ceniza truncate">{user.email}</p>
                        )}
                      </div>
                      <Link
                        href="/cuenta"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-[11px] text-cs-negro hover:bg-cs-ivory transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <ShoppingBag size={12} strokeWidth={1.5} />
                          Mis pedidos
                        </span>
                        <ChevronRight size={11} strokeWidth={1.5} className="text-cs-gris-ceniza" />
                      </Link>
                      <Link
                        href="/cuenta?s=ayuda"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-[11px] text-cs-negro hover:bg-cs-ivory transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle size={12} strokeWidth={1.5} />
                          Ayuda
                        </span>
                        <ChevronRight size={11} strokeWidth={1.5} className="text-cs-gris-ceniza" />
                      </Link>
                      <div className="border-t border-gray-50 mt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-4 py-3 text-[11px] text-cs-gris-grafito hover:text-cs-vino hover:bg-cs-ivory transition-colors"
                        >
                          <LogOut size={12} strokeWidth={1.5} />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/cuenta/login">
                  <User
                    size={22}
                    strokeWidth={1.5}
                    className={`transition-colors ${isScrolled ? "text-black hover:text-cs-vino" : "text-cs-vino hover:text-black"}`}
                  />
                </Link>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 transition-transform hover:scale-110 active:scale-95"
            >
              <ShoppingCartIcon
                className={isScrolled ? "text-black" : "text-cs-vino"}
                size={26}
              />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE NAVBAR ─── */}
      <nav
        className={`fixed md:hidden z-[999] top-0 w-full transition-all duration-500 ${
          show ? "translate-y-0" : "-translate-y-full"
        } bg-white/95 backdrop-blur-sm h-16 flex items-center justify-between px-5 border-b border-gray-100/80`}
      >
        {/* Hamburger */}
        <button
          onClick={toggleMenu}
          className="relative w-8 h-8 flex flex-col justify-center gap-[5px]"
          aria-label="Menú"
        >
          <span className={`block h-[1.5px] bg-cs-vino transition-all duration-300 origin-center ${isMenuOpen ? "rotate-45 translate-y-[6.5px] w-6" : "w-6"}`} />
          <span className={`block h-[1.5px] bg-cs-vino transition-all duration-300 ${isMenuOpen ? "opacity-0 w-3" : "w-4"}`} />
          <span className={`block h-[1.5px] bg-cs-vino transition-all duration-300 origin-center ${isMenuOpen ? "-rotate-45 -translate-y-[6.5px] w-6" : "w-6"}`} />
        </button>

        <Link href="/" className="font-bold text-lg tracking-tighter text-cs-vino">
          CASA SANSÓN
        </Link>

        {/* Right: user + cart */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/cuenta">
              <div className="w-7 h-7 rounded-full bg-cs-vino/10 border border-cs-vino/25 flex items-center justify-center text-[9px] font-bold text-cs-vino">
                {emailInitials}
              </div>
            </Link>
          ) : (
            <Link href="/cuenta/login">
              <User size={20} strokeWidth={1.5} className="text-cs-vino" />
            </Link>
          )}
          <button onClick={() => setIsCartOpen(true)} className="relative p-1">
            <ShoppingCartIcon className="text-cs-vino" size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-cs-vino text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ─── MOBILE FULL-SCREEN MENU ─── */}
      <div
        className={`fixed md:hidden inset-0 z-[998] flex flex-col transition-all duration-500 ease-in-out ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "var(--cs-obsidian)" }}
      >
        <div className="flex flex-col justify-center items-center h-full gap-0 pt-16">
          {["INICIO", "NOSOTROS", "CATALOGO", "DIARIO", "BIBLIOTECA"].map((item, idx) => (
            <Link
              key={item}
              href={item === "INICIO" ? "/" : `/${item.toLowerCase()}`}
              className={`text-white/80 hover:text-cs-rosa-polvo text-3xl font-bold tracking-[0.2em] py-4 w-full text-center transition-all duration-500 ${
                isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? `${100 + idx * 70}ms` : "0ms" }}
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}

          {/* Account link in mobile menu */}
          <div
            className={`mt-6 transition-all duration-500 ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            style={{ transitionDelay: isMenuOpen ? "500ms" : "0ms" }}
          >
            {user ? (
              <Link
                href="/cuenta"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-white/50 hover:text-cs-rosa-polvo text-xs uppercase tracking-[0.3em] transition-colors"
              >
                <User size={14} strokeWidth={1.5} />
                Mi cuenta
              </Link>
            ) : (
              <Link
                href="/cuenta/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-white/50 hover:text-cs-rosa-polvo text-xs uppercase tracking-[0.3em] transition-colors"
              >
                <User size={14} strokeWidth={1.5} />
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>

        {/* Logo footer */}
        <div
          className={`pb-12 flex justify-center transition-all duration-500 ${isMenuOpen ? "opacity-40 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: isMenuOpen ? "500ms" : "0ms" }}
        >
          <Image width={90} height={32} src="/sanson_vino.png" alt="Casa Sansón" className="object-contain opacity-60 invert" />
        </div>
      </div>
    </>
  );
};

export default Navbar;
