"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from "@/lib/shop/interfaces";

interface CartItem extends Product {
    selectedVariant: ProductVariant;
    personalizedText?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (variantId: string) => void;
    // --- AGREGAMOS ESTA LÍNEA ---
    updateQuantity: (variantId: string, newQuantity: number) => void; 
    totalItems: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem('casa-sanson-cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Error cargando carrito", e);
            }
        }
    }, []);

    // Guardar en localStorage cada vez que cambie el carrito
    useEffect(() => {
        localStorage.setItem('casa-sanson-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (newItem: CartItem) => {
        setCart((prev) => {
            const existing = prev.find(i =>
                i.selectedVariant.id === newItem.selectedVariant.id &&
                i.personalizedText === newItem.personalizedText
            );
            if (existing) {
                return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (variantId: string) => {
        setCart(prev => prev.filter(i => i.selectedVariant.id !== variantId));
    };

    // Función para actualizar cantidad (ahora tipada)
    const updateQuantity = (variantId: string, newQuantity: number) => {
        if (newQuantity < 1) return; 
        setCart(prevCart => 
          prevCart.map(item => 
            item.selectedVariant.id === variantId 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        );
    };

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, // <-- Se pasa correctamente
            totalItems, 
            isCartOpen, 
            setIsCartOpen 
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
    return context;
};