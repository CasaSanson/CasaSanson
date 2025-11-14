"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MenuIcon, ShoppingCartIcon } from "lucide-react";
const Navbar = () => {
  const [show, setShow] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    const handleSkipToHome = () => {
      setCurrentScreen('home');
    };

    window.addEventListener('skipToHome', handleSkipToHome);
    return () => window.removeEventListener('skipToHome', handleSkipToHome);
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShow(false); // bajando → ocultar
      } else {
        setShow(true); // subiendo → mostrar
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-[#111111]  py-4 transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      {/* Desktop Menu */}
      <div className="hidden md:flex  justify-center space-x-12 text-white ">
        {/* LOGO */}
        <div className="flex text-white">
          <Link
            href="/"
            className="text-white text-lg font-bold hover:text-gray-500 focus:text-gray-400"
          >
            Casa Sansón
          </Link>
        </div>
        {/* about us */}
        <Link
          href="/about"
          className="text-white text-lg font-bold hover:text-gray-500 focus:text-gray-400"
        >
          Nosotros
        </Link>
        {/* collections */}
        <Link
          href="/catalogo"
          className="text-white text-lg font-bold hover:text-gray-500 focus:text-gray-400"
        >
          Catálogo
        </Link>
        {/* journal */}
        <Link
          href="/journal"
          className="text-white text-lg font-bold hover:text-gray-500 focus:text-gray-400"
        >
          Diario
        </Link>
        {/* cart */}
        <Link
          href="/cart"
          className="text-white text-lg font-bold hover:text-gray-500 focus:text-red-500"
        >
          <ShoppingCartIcon className="w-6 h-6" />
        </Link>
      </div>
      <button onClick={toggleMenu} className="text-white text-lg font-bold hover:text-gray-500 px-4 focus:text-white sm:hidden">
        <MenuIcon name="menu" className="w-6 h-6" />
      </button>
      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden bg-white space-y-4 pb-3 px-4 pt-4`}>
        {/* LOGO */}
        <div className="flex text-white block">
          <Link
            href="/"
            className="text-black text-lg hover:text-gray-500 focus:text-white"
          >
            Casa Sansón
          </Link>
        </div>
        {/* about us */}
        <Link
          href="/about"
          className="text-black text-lg hover:text-gray-500 focus:text-red-500 block"
        >
          Nosotros
        </Link>
        {/* collections */}
        <Link
          href="/catalogo"
          className="text-black text-lg hover:text-gray-500 focus:text-red-500 block"
        >
          Catálogo
        </Link>
        {/* journal */}
        <Link
          href="/journal"
          className="text-black text-lg hover:text-gray-500 focus:text-red-500 block"
        >
          Diario
        </Link>
        {/* cart */}
        <Link
          href="/cart"
          className="text-black text-lg hover:text-gray-500 focus:text-red-500 block"
        >
          <ShoppingCartIcon className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
