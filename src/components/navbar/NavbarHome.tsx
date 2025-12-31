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
    <nav
      className={`fixed top-0 mx-auto items-center left-0 w-full z-50 transition-all duration-300 ${show ? "translate-y-0" : "-translate-y-full"} ${
        isScrolled ? "bg-white h-20" : "bg-transparent h-30"
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
      <button onClick={toggleMenu} className={`font-bold  px-4 focus:text-white sm:hidden transition-colors h-full flex items-center ${isScrolled ? "text-black hover:text-gray-600 text-base" : "text-white hover:text-gray-300 text-lg"}`}>
        <MenuIcon name="menu" className={`${isScrolled ? "w-5 h-5" : "w-6 h-6"} transition-all duration-300`} />
      </button>
      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden bg-black space-y-10 pb-3 px-4 pt-4`}>
        {/* LOGO */}
        <div className="flex text-white block">
          <Link
            href="/home"
            className="text-white text-lg hover:text-gray-500 focus:text-gray-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
        </div>
        {/* about us */}
        <Link
          href="/about"
          className="text-white text-lg hover:text-gray-500 focus:text-gray-500 block"
          onClick={() => setIsMenuOpen(false)}
        >
          Nosotros
        </Link>
        {/* collections */}
        <Link
          href="/catalogo"
          className="text-white text-lg hover:text-gray-500 focus:text-gray-500 block"
          onClick={() => setIsMenuOpen(false)}
        >
          Catálogo
        </Link>
        {/* journal */}
        <Link
          href="/journal"
          className="text-white text-lg hover:text-gray-500 focus:text-gray-500 block"
          onClick={() => setIsMenuOpen(false)}
        >
          Diario
        </Link>
        <Link
          href="/biblioteca"
          className="text-white text-lg hover:text-gray-500 focus:text-gray-500 block"
          onClick={() => setIsMenuOpen(false)}
        >
          Biblioteca
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
