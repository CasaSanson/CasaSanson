"use client";
import LastRelease from "@/components/shop/LastRelease";
import Store from "@/components/shop/Store";



export default function Catalogo() {
    return (
        <main className="bg-white min-h-screen w-[100%] mx-auto">
            {/* ÚLTIMO RELEASE */}
            {/* <LastRelease/> */}
            {/* Productos */}
            <Store/>
            {/* footer */}
            <footer className="bg-[#111111] pt-[5%] text-white py-8">
          <div className="container mx-auto px-4">
            <p className="text-center">
              &copy; 2025 Casa Sansón. Todos los derechos reservados.
            </p>
          </div>
        </footer>
        </main>
    );
}