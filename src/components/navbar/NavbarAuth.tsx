"use client";
import Link from "next/link";

export default function NavbarAuth() {
  return (
    <nav className="flex items-center mx-auto bg-cs-verde-musgo w-full z-50 h-[80px]  p-2 ">
      <button className="text-white text-lg font-bold hover:text-red-200 focus:text-red-500 w-full">
        <Link href="/auth/dashboard">
          ADMIN
        </Link>
      </button>
      <button className="text-white text-lg font-bold hover:text-red-200 focus:text-gray-400 w-full">
        <Link href="/auth/dashboard/pedidos">
          PEDIDOS
        </Link>
      </button>
      <button className="text-white text-lg font-bold hover:text-red-200 focus:text-gray-400 w-full">
        <Link href="/auth/cartas">
          CARTAS
        </Link>
      </button>
      <button className="text-white text-lg font-bold hover:text-red-200 focus:text-gray-400 w-full">
        <Link href="/auth/libros">
          LIBROS
        </Link>
      </button>
    </nav>
  );
}