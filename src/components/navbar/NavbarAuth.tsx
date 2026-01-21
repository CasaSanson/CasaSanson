"use client";
import Link from "next/link";

export default function NavbarAuth() {
  return (
    <nav className="flex items-center mx-auto bg-black w-full z-50 h-16  p-2 ">
      <button className="text-white text-lg font-bold hover:text-red-200 focus:text-red-500 w-full">
        <Link href="/auth/dashboard">
          Dashboard
        </Link>
      </button>
      <button className="text-white text-lg font-bold hover:text-red-200 focus:text-gray-400 w-full">
        <Link href="/auth/dashboard/pedidos">
          Pedidos
        </Link>
      </button>
      <button className="text-white text-lg font-bold hover:text-red-200 focus:text-gray-400 w-full">
        <Link href="/auth/cartas">
          Cartas
        </Link>
      </button>
    </nav>
  );
}