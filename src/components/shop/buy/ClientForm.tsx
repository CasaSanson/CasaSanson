"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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

const inputClass = (hasError: boolean) =>
    `w-full py-3 bg-transparent text-[12px] text-cs-negro placeholder:text-cs-gris-ceniza/50 outline-none tracking-wide border-b transition-colors duration-400 ${
        hasError ? "border-cs-vino" : "border-cs-negro/20 focus:border-cs-negro"
    }`;

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
            const itemsJson = cart.map(item => ({
                id: item.id,
                name: item.name,
                size: item.selectedVariant.size,
                price: item.selectedVariant.price ?? item.base_price,
                quantity: item.quantity,
                personalizedText: item.personalizedText || ""
            }));

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
                    subtotal,
                    total: totalFinal,
                    items: itemsJson,
                    status: 'pending',
                })
                .select().single();

            if (orderError) throw orderError;

            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart,
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
        <div className="bg-white">
            <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-8">
                Información de envío
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <input
                            name="nombre"
                            value={formData.nombre}
                            placeholder="Nombre"
                            onChange={handleInputChange}
                            className={inputClass(!!errors.nombre)}
                        />
                        {errors.nombre && <span className="text-cs-vino text-[9px] uppercase tracking-wider mt-1 block">{errors.nombre}</span>}
                    </div>
                    <div>
                        <input
                            name="apellido"
                            value={formData.apellido}
                            placeholder="Apellido"
                            onChange={handleInputChange}
                            className={inputClass(!!errors.apellido)}
                        />
                        {errors.apellido && <span className="text-cs-vino text-[9px] uppercase tracking-wider mt-1 block">{errors.apellido}</span>}
                    </div>
                </div>

                <div>
                    <input
                        name="email"
                        value={formData.email}
                        type="email"
                        placeholder="Correo electrónico"
                        onChange={handleInputChange}
                        className={inputClass(!!errors.email)}
                    />
                    {errors.email && <span className="text-cs-vino text-[9px] uppercase tracking-wider mt-1 block">{errors.email}</span>}
                </div>

                <div>
                    <PhoneInput
                        defaultCountry="MX"
                        value={formData.telefono}
                        onChange={(val) => setFormData(p => ({ ...p, telefono: val || '' }))}
                        className={`text-cs-negro text-[12px] border-b w-full py-3 outline-none tracking-wide ${errors.telefono ? 'border-cs-vino' : 'border-cs-negro/20'}`}
                    />
                    {errors.telefono && <span className="text-cs-vino text-[9px] uppercase tracking-wider mt-1 block">{errors.telefono}</span>}
                </div>

                <div className="pt-4">
                    <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-5">
                        Domicilio
                    </p>
                    <div className="space-y-6">
                        <div>
                            <input
                                name="direccion"
                                value={formData.direccion}
                                placeholder="Calle, número y colonia"
                                onChange={handleInputChange}
                                className={inputClass(!!errors.direccion)}
                            />
                            {errors.direccion && <span className="text-cs-vino text-[9px] uppercase tracking-wider mt-1 block">{errors.direccion}</span>}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <input
                                    name="ciudad"
                                    value={formData.ciudad}
                                    placeholder="Ciudad / Municipio"
                                    onChange={handleInputChange}
                                    className={inputClass(!!errors.ciudad)}
                                />
                                {errors.ciudad && <span className="text-cs-vino text-[9px] uppercase tracking-wider mt-1 block">{errors.ciudad}</span>}
                            </div>
                            <div>
                                <input
                                    name="codigoPostal"
                                    value={formData.codigoPostal}
                                    placeholder="Código Postal"
                                    onChange={handleInputChange}
                                    maxLength={5}
                                    className={inputClass(!!errors.codigoPostal)}
                                />
                                {errors.codigoPostal && <span className="text-cs-vino text-[9px] uppercase tracking-wider mt-1 block">{errors.codigoPostal}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Opciones de envío */}
                {!isEstimating && formData.codigoPostal.length === 5 && localRates.estandar.precio > 0 && (
                    <div className="pt-4">
                        <p className="text-[8px] uppercase tracking-[0.45em] text-cs-gris-ceniza mb-5">
                            Método de entrega
                        </p>
                        <div className="space-y-3">
                            {[
                                { key: "estandar", rate: localRates.estandar },
                                { key: "express", rate: localRates.express },
                            ].map(({ key, rate }) => (
                                <label
                                    key={key}
                                    className={`flex items-center justify-between py-4 border-b cursor-pointer transition-all duration-300 ${
                                        metodoEnvio === key ? "border-cs-negro" : "border-cs-negro/15 opacity-60"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="envio"
                                            checked={metodoEnvio === key}
                                            onChange={() => setMetodoEnvio(key)}
                                            className="accent-cs-negro"
                                        />
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-cs-negro">
                                            {rate.nombre}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-cs-negro tracking-wide">
                                        ${rate.precio.toLocaleString("es-MX")} MXN
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {isEstimating && (
                    <p className="text-[9px] uppercase tracking-[0.35em] text-cs-gris-ceniza">
                        Calculando envío...
                    </p>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading || isEstimating || localRates.estandar.precio === 0}
                        className="w-full py-5 text-[9px] uppercase tracking-[0.45em] bg-cs-negro text-white hover:bg-cs-vino transition-colors duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Conectando...' : 'Finalizar y Pagar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
