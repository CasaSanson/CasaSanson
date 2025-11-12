"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/lib/products"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AccordionComponent } from "@/components/Accordion"

export default function TiendaVerPage({ params }: { params: { id: string } }) {
    const { id } = params
    const [isZoomed, setIsZoomed] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const product = products[Number(id) - 1]
    const sizes = ["XS", "S", "M", "L", "XL"]
    const [selectedSize, setSelectedSize] = useState(sizes[0])
    const [personalizedText, setPersonalizedText] = useState("")
    const handleSizeClick = (size: string) => {
        setSelectedSize(size)
    }

  
    return (
        <div className="min-h-screen w-full py-4 sm:py-8 px-3 sm:px-4 bg-white">
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
                <div className="max-w-9xl mx-auto mt-[6%] md:mt-[2%]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                        
                        {/* Imagen del lado izquierdo */}
                        <div className="col-span-1 flex justify-center lg:justify-start">
                            <div 
                                className="relative overflow-hidden shadow-2xl cursor-zoom-in"
                            >
                                <Image 
                                    src={product.image} 
                                    alt={product.name} 
                                    width={600} 
                                    height={600}
                                    className={`transition-transform duration-300 ${
                                        isZoomed ? 'scale-150' : 'scale-100'
                                    }`}
                                    style={{
                                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                                    }}
                                />
                                {isZoomed && (
                                    <div className="absolute inset-0  flex items-center justify-center">
                           
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Interior chaqueta */}
                        <div className="col-span-1 hidden md:block px-6">
                           <img
                                src="/interior_verde.png"
                                alt="Interior chaqueta"
                                className="w-full h-full object-cover"
                            />
                        {personalizedText && (
                            <p
                            className="absolute text-gray-800 text-xl font-semibold"
                            style={{
                                top: "50%", // posición vertical aproximada
                                left: "50%", // posición horizontal
                                transform: "translate(-50%, -50%)",
                                fontFamily: "Times New Roman", // puedes ajustar a tu fuente
                            }}
                            >
                            {personalizedText}
                            </p>
  )}
                        </div>
                        {/* Información del producto del lado derecho */}
                        <div className="flex flex-col items-start text-center space-y-4 px-6 justify-start w-full">
                            <div className="text-left">
                                <p className="text-3xl  text-black text-left ">{product.name}</p>
                                <p className="text-md text-gray-800 py-2 mb-5">
                                    {product.price} 
                                </p>
                                
                                <p className="hidden md:block text-xl  text-gray-800 py-2">
                                    Selecciona su talla:
                                </p>
                                {/* Desktop */}
                                <div className="hidden md:flex grid-cols-5 space-x-6 mt-4">
                                    {sizes.map((size) => (
                                        <button
                                        key={size}
                                        onClick={() => handleSizeClick(size)}
                                        className={`border border-black px-4 py-2 text-sm transition-colors duration-300 
                                          ${selectedSize === size
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-black hover:bg-black hover:text-white'
                                          }`}
                                      >
                                        {size}
                                      </button>
                                    ))}
                                </div>
                                <div className="hidden md:block mt-10">
                                    <p className="hidden md:block text-lg text-gray-800">Para:</p>
                                    <input 
                                    type="text" 
                                    placeholder="Hazlo tuyo" 
                                    className="hidden md:block w-full mb-2 mt-2 border border-black px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black transition duration-200" 
                                    value={personalizedText}
                                    onChange={(e) => setPersonalizedText(e.target.value)}
                                    />
                                </div>
                                {/* Mobile */}
                                <div className="md:hidden block relative ">
                                <img src="/interior_verde.png" alt="Interior chaqueta" className="md:hidden block w-full h-full object-cover" />
                                    {personalizedText && (
                                        <p className="absolute text-gray-800 text-xl font-semibold"
                                        style={{
                                            top: "70%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            fontFamily: "Times New Roman",
                                        }}>
                                        {personalizedText}
                                        </p>
                                    )}
                                </div>
                                <div className="md:hidden mt-10">
                                    <p className="md:hidden block text-lg text-gray-800">Para:</p>
                                    <input 
                                    type="text" 
                                    placeholder="Hazlo tuyo" 
                                    className="md:hidden block w-full mb-2 mt-2 border border-black px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black transition duration-200" 
                                    value={personalizedText}
                                    onChange={(e) => setPersonalizedText(e.target.value)}
                                    />
                                </div>
                                <div className="md:hidden mt-4">
                                    <p className="md:hidden block text-lg text-gray-800">Talla:</p>
                                    <Select
                                        onValueChange={(value) => handleSizeClick(value)}
                                    >
                                        <SelectTrigger className="w-full border border-black px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black transition duration-200">
                                            <SelectValue placeholder="Selecciona tu talla" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem key={size} value={size}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="mt-4">
                                    <AccordionComponent />
                                    </div>
                                <div className="flex space-x-3 mt-10">
                                    <Link href={{
                                        pathname: `/catalogo/comprar/${product.id}`,
                                        query: {
                                            size: selectedSize,
                                            text: personalizedText
                                        }
                                    }}
                                    >
                                        <button className="bg-black border border-black hover:bg-white text-white hover:text-black transition-colors duration-300 text-black px-4 py-2">
                                            Comprar ahora
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}