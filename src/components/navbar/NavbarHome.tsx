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
  const [isScrolled, setIsScrolled] = useState(false);



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
        setShow(true); // bajando → ocultar
      } else {
        setShow(true); // subiendo → mostrar
      }
      setLastScrollY(window.scrollY);

      // Detectar si ha scrolleado para cambiar el fondo
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
      <nav
        className={`fixed hidden md:block top-0 mx-auto items-center left-0 w-full z-50 transition-all duration-300 ${show ? "translate-y-0" : "-translate-y-full"} ${isScrolled ? "bg-white h-20" : "bg-transparent h-30"
          }`}
      >
        {/* Desktop Menu */}
        <div className={`hidden md:flex items-center h-full px-4 md:px-8 ${isScrolled ? "text-black" : "text-black"}`}>
          {/* LOGO */}
          <div className="flex items-center h-full">
            <Link
              href="/home"
              className="flex items-center h-full"
            >
              <Image
                width={isScrolled ? 140 : 150}
                height={isScrolled ? 30 : 50}
                src={isScrolled ? "/sanson_black.png" : "/sanson_vino.png"}
                alt=""
                className="object-contain transition-all duration-300">
              </Image>
            </Link>
          </div>

          {/* Navigation Links - Centered */}
          <div className="flex-1 flex justify-center space-x-20">
            {/* collections */}
            <Link
              href="/catalogo"
              className={`font-bold focus:text-gray-400 items-center transition-all duration-300 ${isScrolled ? "text-black hover:text-gray-600 text-base" : "text-cs-vino hover:text-gray-300 text-lg"}`}
            >
              CATÁLOGO
            </Link>

            {/* journal */}
            <Link
              href="/journal"
              className={`font-bold focus:text-gray-400 transition-all duration-300 ${isScrolled ? "text-black hover:text-gray-600 text-base" : "text-cs-vino hover:text-gray-300 text-lg"}`}
            >
              DIARIO
            </Link>
            {/*Biblioteca Desktop*/}
            <Link
              href="/biblioteca"
              className={`font-bold focus:text-gray-400 transition-all duration-300 ${isScrolled ? "text-black hover:text-gray-600 text-base" : "text-cs-vino hover:text-gray-300 text-lg"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              BIBLIOTECA
            </Link>
            {/* about us */}
            <Link
              href="/about"
              className={`font-bold focus:text-gray-400 transition-all duration-300 ${isScrolled ? "text-black hover:text-gray-600 text-base" : "text-cs-vino hover:text-gray-300 text-lg"}`}
            >
              NOSOTROS
            </Link>
          </div>
          {/* cart */}

        </div>
      </nav>
      <nav className="fixed md:hidden z-50 top-0 bg-white w-full h-20 flex items-center ">

        <button onClick={toggleMenu} className="inline-flex  gap-2 transition-all duration-300 hover:scale-110 active:scale-95">
          <MenuIcon className={`font-bold text-gray-900 ml-4 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`} />
        </button>
        <p className="font-bold text-2xl ml-[95px]">CASA SANSÓN</p>
        {/* Mobile Menu */}
        <div 
          className={`absolute top-full w-full sm:hidden space-y-10 pb-3 px-4 pt-4 transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? "opacity-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
          style={{ backgroundColor: 'rgba(111, 123, 106, 0.7)' }}
        >
          {/* LOGO */}
          <div className="flex text-white block">
            <Link
              href="/home"
              className="text-white text-lg hover:text-gray-500 focus:text-gray-500 uppercase font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
          </div>
          {/* about us */}
          <Link
            href="/about"
            className="text-white text-lg hover:text-gray-500 focus:text-gray-500 block uppercase font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            Nosotros
          </Link>
          {/* collections */}
          <Link
            href="/catalogo"
            className="text-white text-lg hover:text-gray-500 focus:text-gray-500 block uppercase font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            Catálogo
          </Link>
          {/* journal */}
          <Link
            href="/journal"
            className="text-white text-lg hover:text-gray-500 focus:text-gray-500 block uppercase font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            Diario
          </Link>
          <Link
            href="/biblioteca"
            className="text-white text-lg hover:text-gray-500 focus:text-gray-500 block uppercase font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            Biblioteca
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
