"use client";
import Image from "next/image";
import { products } from "@/lib/products";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import FormData from "@/lib/shop/formData";
import { useState } from "react";

export default function Summary(){
    const { id } = useParams()
    const searchParams = useSearchParams();
    const product= products.find((product) => product.id === parseInt(id as string));
    const size = searchParams.get('size')
    const text = searchParams.get('text')
    const quantity = parseInt(searchParams.get('quantity') || '1');
    if (!product) return null
    const precioNumerico = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        pais: 'México',
        metodoEnvio: 'estandar',
        talla: '',
        personalizado: '',
    });
    const subtotal = precioNumerico * quantity;
    const envio = formData.metodoEnvio === 'express' ? 250 : formData.metodoEnvio === 'estandar' ? 150 : 0; 
    const total = subtotal + envio;
    
    return(
        <div className="bg-white p-6  shadow-lg shadow-gray-300 h-fit border border-gray-900">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>
                        
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="relative w-40 h-40">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                            <p className="text-xl text-gray-600">Talla: {size}</p>
                            <p className="text-xl text-gray-600">Personalizado: {text}</p>
                            </div>
                           
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between ">
                                <span className="text-sm md:text-lg text-black">Subtotal:</span>
                                <span className="text-sm md:text-lg text-black">${subtotal.toFixed(2)} MXN</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm md:text-lg text-black">Envío ({formData.metodoEnvio === 'express' ? 'estandar' : 'estudio'}):</span>
                                <span className="text-sm md:text-lg text-black">${envio.toFixed(2)} MXN</span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between ">
                                    <span className="text-sm md:text-lg text-black"> Total:</span>
                                    <span className="text-black text-sm md:text-lg">${total.toFixed(2)} MXN</span>
                                </div>
                            </div>
                        </div>
                    </div>
    )
}