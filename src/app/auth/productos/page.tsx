"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Edit, Power, Trash } from "lucide-react";
import { number } from "motion/react";
import { fork } from "child_process";
interface Product_variants {
    id: number;
    product_id: number;
    sku: string;
    size: string;
    color: string;
    stock: number;
}

interface Products {
    id: string;
    name: string;
    description: string;
    base_price: number;
    active: boolean;
    image: string;
    maquila: boolean;
    product_variants: Product_variants[];
}

export default function AuthProdutos() {
    const [products, setProducts] = useState<Products[]>([])
    const [editPanel, setEditPanel] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Products | null>(null)
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        stock: "0",
        talla: "0"
    })

    async function fetchProducts() {
        const { data, error } = await supabase
            .from("products")
            .select(
                `id, name, description, base_price, active, image, maquila, product_variants (id,size, product_id, stock, color, sku)`
            )
        if (error) {
            console.log("Hubo un error al traer los datos", error)
        }
        else {
            setProducts(data as unknown as Products[])
            console.log("Se hizo el fetch correctamente")

        }

    }

    async function handleUpdate() {



    }


    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <main className="min-h-screen">
            {editPanel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white flex flex-col p-6 rounded-lg shadow-xl w-[400px]">
                        <h2 className="text-xl font-bold mb-4">Editar {selectedProduct?.name}</h2>
                        Nombre:
                        <input className="border-[1px] border-black" value={formData?.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})}></input>
                        Descripción:
                        <textarea className="border-[1px] border-black" value={selectedProduct?.description}></textarea>
                        <button onClick={() => {
                            setEditPanel(false);
                        }} className="mt-4 text-red-500">Cancelar</button>
                    </div>
                </div>
            )}
            <div className="flex flex-col items-center justify-center p-3">
                <h1 className="text-[20px] font-black">Productos</h1>
                <p>Aquí pueden observar los productos que tenemos disponibles y la cantidad restante en stock.</p>
            </div>
            <div className="h-full w-full grid grid-cols-3 mt-10 px-3">
                {products.map((product) => (
                    <div key={product.id} className="flex w-full flex-col p-3 bg-white border-[4px] border-green-700 rounded-[10px]">
                        <div className="flex justify-end mb-3 space-x-4">
                            <Edit
                                onClick={() => {
                                    setEditPanel(true);
                                    setSelectedProduct(product);
                                }}
                                className="h-5 text-blue-300 w-5 font-bold self-end hover:text-blue-500 cursor-pointer"></Edit>
                            <Trash className="h-5 text-red-300 w-5 self-end hover:text-red-500 cursor-pointer"></Trash>
                        </div>
                        <div className="h-full w-full mx-auto">
                            <Image
                                src={product.image}
                                alt="foto del producto"
                                width={300}
                                height={400}
                                className="object-cover mx-auto">
                            </Image>
                        </div>
                        <h1 className="font-bold text-black text-center">{product.name}</h1>
                        <p className="font-bold text-gray-500 text-sm mt-3 mb-3">{product.description}</p>
                        <p className="font-bold text-gray-500 text-sm mt-3 mb-3">Precio: ${product.base_price} mxn</p>
                        <div className="mt-3 mb-3">
                            <p className="font-bold text-gray-500 text-sm">Inventario por talla:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {product.product_variants?.map((variant) => (
                                    <span key={variant.id} className="border px-2 py-1 rounded text-xs bg-gray-50">
                                        {variant.size}: <span className="font-black text-black">{variant.stock}</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </main>
    )
}