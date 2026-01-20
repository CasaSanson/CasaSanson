"use client";
import { useState, useEffect } from "react";
import { Product, ProductVariant } from "@/lib/shop/interfaces";
import { supabase } from "@/lib/supabase";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Definimos la estructura de la tarifa para que TypeScript no se queje
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
    talla: string;
    personalizado: string;
}

interface ClientFormProps {
    product: Product;
    selectedVariant: ProductVariant | null;
    quantity: number;
    metodoEnvio: string;
    setMetodoEnvio: (val: string) => void;
    // CORRECCIÓN: Ahora recibe objetos de tipo ShippingRate
    onRatesUpdate: (rates: { estandar: ShippingRate; express: ShippingRate }) => void;
}

export default function ClientForm({
    product,
    selectedVariant,
    quantity,
    metodoEnvio,
    setMetodoEnvio,
    onRatesUpdate,
}: ClientFormProps) {
    const [errors, setErrors] = useState<Partial<FormData & { metodoEnvio: string }>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isEstimating, setIsEstimating] = useState(false);
    
    // Estado local para manejar lo que se muestra en los radios
    const [localRates, setLocalRates] = useState<{ estandar: ShippingRate; express: ShippingRate }>({
        estandar: { precio: 150, nombre: "Cargando...", rate_id: "" },
        express: { precio: 250, nombre: "Cargando...", rate_id: "" }
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
        talla: selectedVariant?.size || "",
        personalizado: (selectedVariant as any)?.personalizedText || "",
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
                        nombre: "Envío Express"
                    }
                };
                setLocalRates(rates);
                onRatesUpdate(rates); // Actualiza al padre (CompraPage)
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'metodoEnvio') {
            setMetodoEnvio(value);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (isEstimating) return;

        setIsLoading(true);

        // CORRECCIÓN: Accedemos a .precio porque ahora son objetos
        const variantPrice = selectedVariant?.price ?? product.base_price;
        const currentRate = metodoEnvio === 'express' ? localRates.express : localRates.estandar;
        const totalFinal = (variantPrice * quantity) + currentRate.precio;

        try {
            // Guardar orden en Supabase
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    product_id: product.id,
                    product_name: product.name,
                    customer_email: formData.email,
                    direccion: formData.direccion,
                    codigo_postal: formData.codigoPostal,
                    metodo_envio: metodoEnvio,
                    shipping_rate_id: currentRate.rate_id, // Guardamos el ID para usarlo tras el pago
                    total: totalFinal,
                    status: 'pending',
                })
                .select().single();

            if (orderError) throw orderError;

            // Checkout de Stripe
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    variantId: selectedVariant?.id,
                    quantity,
                    shippingCost: currentRate.precio,
                    rateId: currentRate.rate_id, // Enviamos el ID a Stripe para recuperarlo en el webhook
                    customerInfo: { ...formData, metodoEnvio },
                    orderId: orderData.id
                }),
            });

            const { url } = await response.json();
            if (url) window.location.href = url;
        } catch (error) {
            console.error(error);
            alert("Error al procesar la compra");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 shadow-2xl border border-gray-900">
            <h1 className="text-2xl font-bold mb-6 text-black uppercase tracking-tight">Información de compra</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <input name="nombre" value={formData.nombre} placeholder="Nombre" onChange={handleInputChange} 
                               className={`w-full border p-2 text-black ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                    </div>
                    <div>
                        <input name="apellido" value={formData.apellido} placeholder="Apellido" onChange={handleInputChange} 
                               className={`w-full border p-2 text-black ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
                    </div>
                </div>

                <div>
                    <input name="email" value={formData.email} type="email" placeholder="Email" onChange={handleInputChange} 
                           className={`w-full border p-2 text-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <PhoneInput
                        defaultCountry="MX"
                        value={formData.telefono}
                        onChange={(val) => setFormData(p => ({ ...p, telefono: val || '' }))}
                        className={`text-black p-2 border w-full ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-bold mb-2 text-black uppercase text-sm tracking-wider">Dirección de Envío</h3>
                    <input name="direccion" value={formData.direccion} placeholder="Calle y número" onChange={handleInputChange} 
                           className={`w-full border p-2 mb-2 text-black ${errors.direccion ? 'border-red-500' : 'border-gray-300'}`} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <input name="ciudad" value={formData.ciudad} placeholder="Ciudad" onChange={handleInputChange} 
                               className={`border p-2 text-black ${errors.ciudad ? 'border-red-500' : 'border-gray-300'}`} />
                        <input name="codigoPostal" value={formData.codigoPostal} placeholder="C.P." onChange={handleInputChange} 
                               className={`border p-2 text-black ${errors.codigoPostal ? 'border-red-500' : 'border-gray-300'}`} />
                    </div>
                    {errors.codigoPostal && <p className="text-red-500 text-xs mt-1">{errors.codigoPostal}</p>}
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-bold mb-2 text-black uppercase text-sm tracking-wider">Método de envío</h3>
                    
                    {formData.codigoPostal.length < 5 && (
                        <p className="text-sm text-gray-500 italic">Ingresa tu C.P. para calcular el envío.</p>
                    )}

                    {isEstimating && (
                        <div className="flex items-center space-x-2 text-blue-600 py-2">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            <p className="text-sm font-medium">Cotizando con paqueterías...</p>
                        </div>
                    )}

                    {!isEstimating && formData.codigoPostal.length === 5 && (
                        <div className="space-y-2">
                            <label className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-all ${metodoEnvio === 'estandar' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                <div className="flex items-center">
                                    <input type="radio" name="metodoEnvio" value="estandar" checked={metodoEnvio === 'estandar'} onChange={handleInputChange} className="mr-3 accent-black" />
                                    <span className="text-black text-sm">{localRates.estandar.nombre}</span>
                                </div>
                                <span className="font-bold text-black text-sm">${localRates.estandar.precio} MXN</span>
                            </label>

                            <label className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-all ${metodoEnvio === 'express' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                <div className="flex items-center">
                                    <input type="radio" name="metodoEnvio" value="express" checked={metodoEnvio === 'express'} onChange={handleInputChange} className="mr-3 accent-black" />
                                    <span className="text-black text-sm font-medium text-blue-700">DHL Express (Rápido)</span>
                                </div>
                                <span className="font-bold text-black text-sm">${localRates.express.precio} MXN</span>
                            </label>
                        </div>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading || isEstimating} 
                    className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Procesando...' : 'Finalizar y Pagar'}
                </button>
            </form>
        </div>
    );
}