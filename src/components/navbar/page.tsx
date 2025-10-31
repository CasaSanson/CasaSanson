"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-[#111111]  py-4 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex justify-center space-x-12 text-white">
        <div className="flex text-white">
        <Link
          href="/"
          className="text-white text-lg left-[50%] translate-x-[-50%] font-bold hover:text-gray-500 focus:text-red-500"
        >
          Casa Sansón
        </Link>
        </div>
        
        <Link
          href="/about"
          className="text-white text-lg font-bold hover:text-gray-500 focus:text-red-500"
        >
          About Us
        </Link>
        <Link
          href="/collections"
          className="text-white text-lg font-bold hover:text-gray-500 focus:text-red-500"
        >
          Collections
        </Link>
        <Link
          href="/journal"
          className="text-white text-lg font-bold hover:text-gray-500 focus:text-red-500"
        >
          Journal
        </Link>
        <Link
          href="/cart"
          className="text-white text-lg font-bold hover:text-gray-500 focus:text-red-500"
        >
          Cart
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
