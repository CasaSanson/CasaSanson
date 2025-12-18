'use client'
import { useState, useEffect } from "react";
import Footer from "@/components/footer/Footer";
import Header from "@/components/home/Header";
import Columns from "@/components/home/Columns";
import Tape from "@/components/home/Tape";
import Landing from "@/components/home/landing/Landing";
import CircularText from "@/components/CircularText";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('loading'); // 'loading', 'landing', 'home'
  const [typewriterText, setTypewriterText] = useState('');
  const [scrollY, setScrollY] = useState(0);
    
  // Efecto typewriter para la pantalla de carga
  useEffect(() => {
    const fullText = "cargando...";
    let currentIndex = 0;
    
    const typewriterInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypewriterText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
        // Después de completar el typewriter, esperar un poco y mostrar la portada
        setTimeout(() => {
          setCurrentScreen('landing');
        }, 2100);
      }
    }, 200); // Velocidad del typewriter
    
    return () => clearInterval(typewriterInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      setScrollY(scrollPosition);
      console.log('Scroll Y:', scrollPosition);
    };
    
    // Llamar inmediatamente para establecer el valor inicial
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escuchar el evento para saltar directamente a 'home'
  useEffect(() => {
    const handleSkipToHome = () => {
      setCurrentScreen('home');
    };

    window.addEventListener('skipToHome', handleSkipToHome);
    return () => window.removeEventListener('skipToHome', handleSkipToHome);
  }, []);

  // Función para manejar el clic en "Enter Website"
  const handleEnterWebsite = () => {
    setCurrentScreen('home');
  };

  // Pantalla de carga con typewriter
  if (currentScreen === "loading") {
    return (
      <div className="fixed inset-0 bg-[#222222] h-screen w-screen flex items-center justify-center z-50 relative overflow-hidden">
      {/* Fondo con Ripple */}
      <div className="absolute top-0 left-1/2 w-[1px] h-[30%] bg-gray-600 animate-line-down"></div>
      <div className="absolute bottom-0 left-1/2 w-[1px] h-[30%] bg-gray-600 animate-line-up"></div>

        <div className="relative text-center z-10">

          <h1 className="text-2xl md:text-4xl text-gray-300 mb-4 tracking-tight drop-shadow-lg">
            <CircularText
            text="● C A S A S A N S Ó N "
            onHover="speedUp"
            spinDuration={20}
            className="custom-class"/>
  
          </h1>
        </div>
      </div>
    );
  }
  

  // Si está mostrando la landing page
  if (currentScreen === 'landing') {
    return (
      <>
      <Landing/>
      </>
      
    );
  }
  return null;
}