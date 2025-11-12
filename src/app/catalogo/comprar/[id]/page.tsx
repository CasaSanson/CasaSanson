'use client'
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { products } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Lock } from "lucide-react";
import 'react-phone-number-input/style.css';
import PhoneInput from "react-phone-number-input";

interface FormData {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    pais: string;
    metodoEnvio: string;
    comentarios: string;
}

export default function CompraPage() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const quantity = parseInt(searchParams.get('quantity') || '1');
    const text = searchParams.get('text') || '';
    const size = searchParams.get('size') || '';
    const product = products.find((product) => product.id === parseInt(id as string));
    
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
        comentarios: ''
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error cuando el usuario empiece a escribir
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
        if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
        if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida';
        if (!formData.codigoPostal.trim()) newErrors.codigoPostal = 'El código postal es requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Primero, guardar el pedido en Supabase
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    product_id: product?.id || 0,
                    product_name: product?.name || '',
                    product_price: precioNumerico,
                    quantity: quantity,
                    customer_nombre: formData.nombre,
                    customer_apellido: formData.apellido,
                    customer_email: formData.email,
                    customer_telefono: formData.telefono,
                    direccion: formData.direccion,
                    ciudad: formData.ciudad,
                    codigo_postal: formData.codigoPostal,
                    pais: formData.pais,
                    metodo_envio: formData.metodoEnvio,
                    costo_envio: envio,
                    subtotal: subtotal,
                    total: total,
                    status: 'pending',
                    comentarios: formData.comentarios || null
                })
                .select()
                .single();

            if (orderError) {
                console.error('Error al guardar el pedido:', orderError);
                console.error('Datos que se intentaron insertar:', {
                    product_id: product?.id || 0,
                    product_name: product?.name || '',
                    product_price: precioNumerico,
                    quantity: quantity,
                    customer_nombre: formData.nombre,
                    customer_apellido: formData.apellido,
                    customer_email: formData.email,
                    customer_telefono: formData.telefono,
                    direccion: formData.direccion,
                    ciudad: formData.ciudad,
                    codigo_postal: formData.codigoPostal,
                    pais: formData.pais,
                    metodo_envio: formData.metodoEnvio,
                    costo_envio: envio,
                    subtotal: subtotal,
                    total: total,
                    status: 'pending',
                    comentarios: formData.comentarios || null
                });
                alert(`Error al guardar el pedido: ${orderError.message}`);
                return;
            }

            console.log('Pedido guardado con ID:', orderData.id);

            // Ahora crear la sesión de Stripe con el ID del pedido
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product?.id,
                    quantity: quantity,
                    customerInfo: formData,
                    orderId: orderData.id // Pasar el ID del pedido a Stripe
                }),
            });

            const { url } = await response.json();
            
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen w-full py-4 sm:py-8 px-3 sm:px-4 bg-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h1>
                    <Link href="/tienda" className="text-red-600 hover:text-red-800">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    const precioNumerico = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const subtotal = precioNumerico * quantity;
    const envio = formData.metodoEnvio === 'express' ? 250 : formData.metodoEnvio === 'estandar' ? 150 : 0; 
    const total = subtotal + envio;

    return (
        <div className="min-h-screen w-full py-4 sm:py-8 px-3 sm:px-4 bg-white mt-[10%] md:mt-[2%]">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-6">
                    <Link href={`/catalogo/ver/${product.id}`} className="text-blackhover:text-red-900 text-sm">
                        ← Volver a la tienda
                    </Link>
                </div>
                <div className="mx-auto">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">Casa Sansón</h1>
                </div>
                <div className="mx-auto">
                    <p className="text-gray-600 text-center mb-6">
                        Todos los pagos son procesados de forma segura y confiable.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario de compra */}
                    <div className="bg-white p-6 shadow-2xl shadow-gray-300 h-fit border border-gray-900">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Información de compra</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Información personal */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-md sm:text-lg font-medium text-black mb-1">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                                            errors.nombre ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Tu nombre"
                                    />
                                    {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-md sm:text-lg font-medium text-gray-700 mb-1">
                                        Apellido *
                                    </label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                                            errors.apellido ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Tu apellido"
                                    />
                                    {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium text-gray-700 mb-1">
                                    <span className="block text-md sm:text-lg font-medium text-gray-700 mb-1">Email *</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="tu@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-md sm:text-lg font-medium text-gray-700 mb-1">
                                    Teléfono *
                                </label>
                                <PhoneInput
                                    international
                                    defaultCountry="MX"
                                    value={formData.telefono}
                                    onChange={(value: string | undefined) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            telefono: value || ''
                                        }));
                                        if (errors.telefono) {
                                            setErrors(prev => ({
                                                ...prev,
                                                telefono: ''
                                            }));
                                        }
                                    }}
                                    className={`w-full ${
                                        errors.telefono ? 'border-red-500' : ''
                                    }`}
                                    numberInputProps={{
                                        className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                                            errors.telefono ? 'border-red-500' : 'border-gray-300'
                                        }`
                                    }}
                                />
                                {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                            </div>

                            {/* Dirección de envío */}
                            <div className="border-t pt-[2rem]">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">Dirección de envío</h3>
                                
                                <div>
                                    <label className="block text-md sm:text-lg font-medium text-gray-700 mb-1">
                                        Dirección (calle, número, colonia) *
                                    </label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleInputChange}
                                        className={`w-full mb-5 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                                            errors.direccion ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Calle, número, colonia"
                                    />
                                    {errors.direccion && <p className="text-red-500 text-xs mb-1">{errors.direccion}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-md sm:text-lg font-medium text-gray-700 mb-1">
                                            Ciudad *
                                        </label>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            value={formData.ciudad}
                                            onChange={handleInputChange}
                                            className={`w-full mb-5 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                                                errors.ciudad ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Ciudad"
                                        />
                                        {errors.ciudad && <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-md sm:text-lg font-medium text-gray-700 mb-1">
                                            Código Postal *
                                        </label>
                                        <input
                                            type="text"
                                            name="codigoPostal"
                                            value={formData.codigoPostal}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                                                errors.codigoPostal ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="12345"
                                        />
                                        {errors.codigoPostal && <p className="text-red-500 text-xs mt-1">{errors.codigoPostal}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md sm:text-lg font-medium text-gray-700 mb-1">
                                        País
                                    </label>
                                    <select
                                        name="pais"
                                        value={formData.pais}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    >
                                        <option value="México">México</option>
                                        <option value="España">España</option>
                                    </select>
                                </div>
                            </div>

                            {/* Método de envío */}
                           <div className="border-t pt-[2rem]">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">Método de envío</h3>
                                <div className="space-y-2">

                                    <label className="flex items-center text-gray-500 text-md sm:text-lg md:text-xl">
                                        <input
                                            type="radio"
                                            name="metodoEnvio"
                                            value="express"
                                            checked={formData.metodoEnvio === 'express'}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        <span>Envío express (1-2 semanas) - $250 MXN</span>
                                    </label>
                                    <label className="flex items-center text-gray-500 text-md sm:text-lg md:text-xl">
                                        <input
                                            type="radio"
                                            name="metodoEnvio"
                                            value="estandar"
                                            checked={formData.metodoEnvio === 'estandar'}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        <span>Envío estándar (3-4 semanas) - $150 MXN</span>
                                    </label>

                                </div>
                            </div> 

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Procesando...' : 'Proceder al pago'}
                            </button>
                        </form>
                    </div>

                    {/* Resumen del pedido */}
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
                </div>
            </div>
        </div>
    );
}