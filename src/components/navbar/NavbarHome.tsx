"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MenuIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
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
      className={`fixed top-2 mx-auto items-center h-30 left-0 w-full z-50 bg-gradient-to-r from-[#454444] to-[#232323] py-2 transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      {/* Desktop Menu */}
      <div className="hidden md:flex justify-center space-x-20 text-white items-center ">
        {/* LOGO */}
        <div className="flex text-white">
          <Link
            href="/"
            className=""
          >
            <Image 
            width={120}
            height={10}
            src="/sanson_white.png" 
            alt=""
            className="object-cover">
            </Image>
          </Link>
        </div>
        
        {/* collections */}
        <Link
          href="/catalogo"
          className="text-white text-lg font-bold hover:text-gray-500 focus:text-gray-400 items-center"
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
        {/* about us */}
        <Link
          href="/about"
          className="text-white text-lg font-bold hover:text-gray-500 focus:text-gray-400"
        >
          Nosotros
        </Link>
        {/* cart */}
        
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
