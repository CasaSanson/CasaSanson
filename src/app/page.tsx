'use client'
import { useState, useEffect } from "react";
import Landing from "@/components/home/landing/Landing";
import CircularText from "@/components/CircularText";
import Header from "@/components/home/Header";
import Tape from "@/components/home/Tape";
import Newsletter from "@/components/home/Newsletter";
import LastRelease from "@/components/shop/LastRelease";
import Image from "next/image";
import { Send, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Newsletter {
  id: string;
  email: string;
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'loading' | 'landing' | 'home'>('loading');
  const [typewriterText, setTypewriterText] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [emailBanner, setEmailBanner] = useState(false);
  const [email, setEmail] = useState("");

  // En pantallas pequeñas o si ya vio la animación, saltar directo al home
  useEffect(() => {
    const isSmallScreen = window.innerWidth < 1024;
    const alreadyVisited = sessionStorage.getItem('animationShown') === 'true';

    if (isSmallScreen || alreadyVisited) {
      setCurrentScreen('home');
      return;
    }

    const fullText = "cargando...";
    let currentIndex = 0;

    const typewriterInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypewriterText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
        setTimeout(() => {
          setCurrentScreen('landing');
        }, 2100);
      }
    }, 200);

    return () => clearInterval(typewriterInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      setScrollY(scrollPosition);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleSkipToHome = () => {
      sessionStorage.setItem('animationShown', 'true');
      setCurrentScreen('home');
    };
    window.addEventListener('skipToHome', handleSkipToHome);
    return () => window.removeEventListener('skipToHome', handleSkipToHome);
  }, []);

  async function handleEmail() {
    const { error } = await supabase
      .from("newsletter-emails")
      .insert([{ email }]);

    if (error) {
      console.log("ERROR", error);
      alert("No se pudo insertar el email");
    } else {
      setEmailBanner(false);
      alert("Gracias!");
      setEmail("");
    }
  }

  if (currentScreen === "loading") {
    return (
      <div className="fixed inset-0 bg-[#222222] h-screen w-screen flex items-center justify-center z-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[1px] h-[30%] bg-gray-600 animate-line-down"></div>
        <div className="absolute bottom-0 left-1/2 w-[1px] h-[30%] bg-gray-600 animate-line-up"></div>
        <div className="relative text-center z-10">
          <h1 className="text-2xl md:text-4xl text-gray-300 mb-4 tracking-tight drop-shadow-lg">
            <CircularText
              text="● C A S A S A N S Ó N "
              onHover="speedUp"
              spinDuration={20}
              className="custom-class"
            />
          </h1>
        </div>
      </div>
    );
  }

  if (currentScreen === 'landing') {
    return (
      <Landing
        onEnter={() => {
          sessionStorage.setItem('animationShown', 'true');
          setCurrentScreen('home');
        }}
      />
    );
  }

  return (
    <main className="pt-18">
      {emailBanner && (
        <div className="fixed inset-0 bg-black/50 h-full w-full z-[999] p-20">
          <div className="bg-white h-full w-full flex-col items-center justify-center space-y-10 px-20">
            <div className="w-full h-full">
              <div className="flex top-0 items-center justify-between w-full">
                <Image src="/sanson_black.png" alt="" width={300} height={300} />
                <X className="text-red-500" onClick={() => setEmailBanner(false)} />
              </div>
              <div className="px-20 flex items-center flex-col justify-center space-y-20 border-2 border-black p-10">
                <p className="text-xl text-black">Subscríbete a nuestro newsletter para enterarte de las novedades.</p>
                <div className="">
                  <label>Ingresa tu correo electrónico:</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-black"
                    placeholder="tucorreo@gmail.com"
                  />
                </div>
                <button onClick={handleEmail} className="bg-black p-3 flex gap-3 text-white">
                  <Send />Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Header />
      <LastRelease />
      <Tape />
      <Newsletter />
    </main>
  );
}
