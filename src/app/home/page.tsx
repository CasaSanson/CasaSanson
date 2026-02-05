"use client"
import Header from "@/components/home/Header"
import Tape from "@/components/home/Tape"
import Footer from "@/components/footer/Footer"
import LastRelease from "@/components/shop/LastRelease"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Send, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "react-toastify"

interface Newsletter {
    id: string;
    email: string;
}
export default function homenav() {
    const [emailBanner, setEmailBanner] = useState(false)
    const [formData, setFormData] = useState<Newsletter[]>([])
    const [email, setEmail] = useState("");

    async function handleEmail() { 
        const { error } = await supabase
            .from("newsletter-emails")
            .insert([{ email: email }]) // Enviamos un objeto con la columna 'email'
    
        if (error) {
            console.log("ERROR", error)
            alert("No se pudo insertar el email")
        } else {
            setEmailBanner(false)
            alert("Gracias!")
            setEmail("") 
        }
    }

    useEffect(() => {
        setEmailBanner(true)
    }, [])
    return (
        <main className="  pt-18">
            {emailBanner && (
                <div className="fixed inset-0 bg-black/50 h-full w-full z-[999] p-20">
                    <div className="bg-white h-full w-full flex-col items-center justify-center space-y-10 px-20">
                        <div className="w-full h-full">
                            <div className="flex top-0 items-center justify-between w-full">
                                <Image src="/sanson_black.png" alt="" width={300} height={300}>
                                </Image>
                                <X className="text-red-500" onClick={() => setEmailBanner(false)} />
                            </div>
                            <div className="px-20 flex items-center flex-col justify-center space-y-20 border-2 border-black p-10">
                                <p className="text-xl text-black">Subscríbete a nuestro newsletter para enterarte de las novedades.</p>
                                <div className="">
                                    <label>
                                        Ingresa tu correo electrónico:
                                    </label>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border-2 border-black"
                                        placeholder="tucorreo@gmail.com"
                                    />
                                </div>
                                <button onClick={handleEmail} className="bg-black p-3 flex gap-3 text-white"><Send />Enviar</button>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            )}
            {/* Hero Section */}
            <Header />
            {/* Columnas*/}
            <LastRelease />
            {/*Tape*/}
            <div className="mb-10">
                <Tape />
            </div>
            {/* Footer */}
        </main>
    )
}