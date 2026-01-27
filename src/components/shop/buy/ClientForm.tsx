"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// --- INTERFACES ---
export interface ShippingRate {
    precio: number;
    nombre: string;
    rate_id: string;
}

export interface FormData {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    pais: string;
}

interface ClientFormProps {
    cart: any[];
    metodoEnvio: string;
    setMetodoEnvio: (val: string) => void;
    onRatesUpdate: (rates: { estandar: ShippingRate; express: ShippingRate }) => void;
}

export default function ClientForm({
    cart,
    metodoEnvio,
    setMetodoEnvio,
    onRatesUpdate,
}: ClientFormProps) {
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isEstimating, setIsEstimating] = useState(false);
    
    const [localRates, setLocalRates] = useState<{ estandar: ShippingRate; express: ShippingRate }>({
        estandar: { precio: 0, nombre: "Ingresa tu C.P.", rate_id: "" },
        express: { precio: 0, nombre: "Ingresa tu C.P.", rate_id: "" }
    });

    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        pais: 'México',
    });

    const fetchRates = async (zip: string) => {
        setIsEstimating(true);
        try {
            const res = await fetch('/api/shipping/estimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zip_to: zip })
            });
            const data = await res.json();
          
            if (data.success) {
                const rates = {
                    estandar: data.estandar,
                    express: { 
                        precio: Math.ceil(data.estandar.precio * 1.3), 
                        rate_id: data.estandar.rate_id,
                        nombre: "DHL Express (Rápido)"
                    }
                };
                setLocalRates(rates);
                onRatesUpdate(rates);
            }
        } catch (error) {
            console.error("Error al cotizar:", error);
        } finally {
            setIsEstimating(false);
        }
    };

    useEffect(() => {
        if (formData.codigoPostal.length === 5) {
            fetchRates(formData.codigoPostal);
        }
    }, [formData.codigoPostal]);

    const validateForm = (): boolean => {
        const newErrors: any = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido';
        if (!formData.apellido.trim()) newErrors.apellido = 'Apellido requerido';
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
        if (!formData.telefono) newErrors.telefono = 'Teléfono requerido';
        if (!formData.direccion.trim()) newErrors.direccion = 'Dirección requerida';
        if (!formData.ciudad.trim()) newErrors.ciudad = 'Ciudad requerida';
        if (!/^\d{5}$/.test(formData.codigoPostal)) newErrors.codigoPostal = 'CP inválido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (isEstimating || localRates.estandar.precio === 0) {
            alert("Por favor espera a que se calcule el envío");
            return;
        }

        setIsLoading(true);

        const subtotal = cart.reduce((acc, item) => {
            const precio = item.selectedVariant.price ?? item.base_price ?? 0;
            return acc + (precio * item.quantity);
        }, 0);

        const currentRate = metodoEnvio === 'express' ? localRates.express : localRates.estandar;
        const totalFinal = subtotal + currentRate.precio;

        try {
            // Limpieza del carrito para guardarlo como JSONB
            const itemsJson = cart.map(item => ({
                id: item.id,
                name: item.name,
                size: item.selectedVariant.size,
                price: item.selectedVariant.price ?? item.base_price,
                quantity: item.quantity,
                personalizedText: item.personalizedText || ""
            }));

            // 1. Guardar en Supabase (Mapeado exacto a tus columnas SQL)
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_nombre: formData.nombre,
                    customer_apellido: formData.apellido,
                    customer_email: formData.email,
                    customer_telefono: formData.telefono,
                    direccion: formData.direccion,
                    ciudad: formData.ciudad,
                    codigo_postal: formData.codigoPostal,
                    pais: formData.pais,
                    metodo_envio: metodoEnvio,
                    costo_envio: currentRate.precio,
                    subtotal: subtotal,
                    total: totalFinal,
                    items: itemsJson, // Columna JSONB
                    status: 'pending',
                })
                .select().single();

            if (orderError) throw orderError;

            // 2. Stripe Checkout
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart: cart, 
                    shippingCost: currentRate.precio,
                    orderId: orderData.id,
                    customerInfo: formData
                }),
            });

            const stripeData = await response.json();
            if (stripeData.url) {
                window.location.href = stripeData.url;
            } else {
                throw new Error("No se pudo generar la sesión de Stripe");
            }

        } catch (error: any) {
            console.error("Error en Checkout:", error);
            alert(`Error al procesar el pedido: ${error.message || "Inténtalo de nuevo"}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 shadow-2xl border border-gray-900">
            <h1 className="text-2xl font-bold mb-6 text-black uppercase tracking-tight">Información de envío</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <input name="nombre" value={formData.nombre} placeholder="Nombre" onChange={handleInputChange} 
                               className={`w-full border p-2 text-black focus:outline-none focus:ring-1 focus:ring-black ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.nombre && <span className="text-red-500 text-[10px] uppercase mt-1">{errors.nombre}</span>}
                    </div>
                    <div className="flex flex-col">
                        <input name="apellido" value={formData.apellido} placeholder="Apellido" onChange={handleInputChange} 
                               className={`w-full border p-2 text-black focus:outline-none focus:ring-1 focus:ring-black ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.apellido && <span className="text-red-500 text-[10px] uppercase mt-1">{errors.apellido}</span>}
                    </div>
                </div>

                <div>
                    <input name="email" value={formData.email} type="email" placeholder="Correo electrónico" onChange={handleInputChange} 
                           className={`w-full border p-2 text-black focus:outline-none focus:ring-1 focus:ring-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.email && <span className="text-red-500 text-[10px] uppercase mt-1">{errors.email}</span>}
                </div>

                <div>
                    <PhoneInput
                        defaultCountry="MX"
                        value={formData.telefono}
                        onChange={(val) => setFormData(p => ({ ...p, telefono: val || '' }))}
                        className={`text-black p-2 border w-full focus:outline-none ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.telefono && <span className="text-red-500 text-[10px] uppercase mt-1">{errors.telefono}</span>}
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-bold mb-2 text-black uppercase text-xs tracking-widest">Domicilio</h3>
                    <input name="direccion" value={formData.direccion} placeholder="Calle, número y colonia" onChange={handleInputChange} 
                           className={`w-full border p-2 mb-2 text-black focus:outline-none focus:ring-1 focus:ring-black ${errors.direccion ? 'border-red-500' : 'border-gray-300'}`} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <input name="ciudad" value={formData.ciudad} placeholder="Ciudad / Municipio" onChange={handleInputChange} 
                               className={`border p-2 text-black focus:outline-none focus:ring-1 focus:ring-black ${errors.ciudad ? 'border-red-500' : 'border-gray-300'}`} />
                        <input name="codigoPostal" value={formData.codigoPostal} placeholder="Código Postal" onChange={handleInputChange} maxLength={5}
                               className={`border p-2 text-black focus:outline-none focus:ring-1 focus:ring-black ${errors.codigoPostal ? 'border-red-500' : 'border-gray-300'}`} />
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-bold mb-2 text-black uppercase text-xs tracking-widest">Opciones de entrega</h3>
                    
                    {!isEstimating && formData.codigoPostal.length === 5 && (
                        <div className="space-y-2">
                            <label className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${metodoEnvio === 'estandar' ? 'border-black bg-gray-50' : 'border-gray-200 opacity-60'}`}>
                                <div className="flex items-center">
                                    <input type="radio" name="envio" checked={metodoEnvio === 'estandar'} onChange={() => setMetodoEnvio('estandar')} className="mr-3 accent-black" />
                                    <span className="text-black text-xs uppercase font-medium">{localRates.estandar.nombre}</span>
                                </div>
                                <span className="font-bold text-black text-xs">${localRates.estandar.precio} MXN</span>
                            </label>

                            <label className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${metodoEnvio === 'express' ? 'border-black bg-gray-50' : 'border-gray-200 opacity-60'}`}>
                                <div className="flex items-center">
                                    <input type="radio" name="envio" checked={metodoEnvio === 'express'} onChange={() => setMetodoEnvio('express')} className="mr-3 accent-black" />
                                    <span className="text-black text-xs uppercase font-medium">{localRates.express.nombre}</span>
                                </div>
                                <span className="font-bold text-black text-xs">${localRates.express.precio} MXN</span>
                            </label>
                        </div>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading || isEstimating || localRates.estandar.precio === 0} 
                    className="w-full bg-black text-white py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-cs-vino transition-colors disabled:opacity-30"
                >
                    {isLoading ? 'Conectando...' : 'Finalizar y Pagar'}
                </button>
            </form>
        </div>
    );
}