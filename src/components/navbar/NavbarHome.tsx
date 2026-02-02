"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MenuIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext"; // Importamos el contexto

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart(); // Extraemos lo necesario del carrito
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Efecto de ocultar/mostrar al scrollear
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShow(false); // bajando → ocultar
      } else {
        setShow(true); // subiendo → mostrar
      }
      setLastScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <nav
        className={`fixed hidden md:block top-0 left-0 w-full z-50 transition-all duration-500 ${
          show ? "translate-y-0" : "-translate-y-full"
        } ${isScrolled ? "bg-white shadow-md h-20" : "bg-transparent h-28"}`}
      >
        <div className="flex items-center justify-between h-full px-8 max-w-9xl mx-auto">
          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/home">
              <Image
                width={isScrolled ? 130 : 150}
                height={50}
                src={isScrolled ? "/sanson_black.png" : "/sanson_vino.png"}
                alt="Casa Sansón Logo"
                className="object-contain transition-all duration-300"
              />
            </Link>
          </div>

          {/* Navigation Links - Centered */}
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

          {/* CART ICON DESKTOP */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 transition-transform hover:scale-110 active:scale-95"
          >
            <ShoppingCartIcon className={isScrolled ? "text-black" : "text-cs-vino"} size={26} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* --- MOBILE NAVBAR --- */}
      <nav className="fixed md:hidden z-50 top-0 bg-white w-full h-20 flex items-center justify-between px-4 shadow-sm">
        <button onClick={toggleMenu} className="transition-all hover:scale-110">
          <MenuIcon
            className={`text-gray-900 transition-transform duration-300 ${
              isMenuOpen ? "rotate-90" : "rotate-0"
            }`}
          />
        </button>

        <p className="font-bold text-xl tracking-tighter">CASA SANSÓN</p>

        {/* CART ICON MOBILE */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-2"
        >
          <ShoppingCartIcon className="text-gray-900" size={24} />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-black text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`absolute top-full left-0 w-full flex flex-col space-y-6 p-8 transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
          style={{ backgroundColor: "rgba(111, 123, 106, 0.95)", backdropFilter: "blur(5px)" }}
        >
          {["INICIO", "NOSOTROS", "CATALOGO", "DIARIO", "BIBLIOTECA"].map((item) => (
            <Link
              key={item}
              href={item === "INICIO" ? "/home" : `/${item.toLowerCase()}`}
              className="text-white cursor-pointer text-2xl font-bold uppercase tracking-widest border-b border-white/20 pb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;