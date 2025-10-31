'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import InstaxPhoto from "@/components/Instax";
import liquidChrome, { LiquidChrome } from "@/components/LiquidChrome";
import WaterRipple from "@/components/WaterRiple";
import ScrollReveal from "@/components/ScrollReveal";
import LoadingScreen from "@/components/LoadingScreen";
import RippleEffect from "@/components/RippleEffect";
export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('loading'); // 'loading', 'landing', 'home'
  const [typewriterText, setTypewriterText] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [carrousel, setCarrousel] = useState(0);
  

  // Efecto typewriter para la pantalla de carga
  useEffect(() => {
    const fullText = "Loading...";
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
  // Función para manejar el clic en "Enter Website"
  const handleEnterWebsite = () => {
    setCurrentScreen('home');
  };

  // Pantalla de carga con typewriter
  if (currentScreen === "loading") {
    return (
      <div className="fixed inset-0 bg-[#222222] h-screen w-screen flex items-center justify-center z-50 relative overflow-hidden">
      {/* Fondo con Ripple */}
      <div className="absolute top-0 left-1/2 w-[3px] h-[30%] bg-white animate-line-down"></div>
      <div className="absolute bottom-0 left-1/2 w-[3px] h-[30%] bg-white animate-line-up"></div>

        <div className="relative text-center z-10">

          <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
            {typewriterText}
          </h1>
        </div>
      </div>
    );
  }
  

  // Si está mostrando la landing page
  if (currentScreen === 'landing') {
    return (
      <div className="fixed inset-0  bg-cover bg-center h-screen w-screen flex items-center justify-center z-50 relative overflow-hidden">
        {/* Fondo con Ripple */}
        <div className="absolute inset-0 ">
          <RippleEffect
            style={{
              backgroundImage: 'url(/luna.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            autoDrops={true}
            options={{ perturbance: 0.02, dropRadius: 70 }}
          />
        </div>
        <div className="absolute top-0 left-1/2 w-[3px] h-[20%] bg-gray-500 animate-line-down"></div>
        <div className="absolute bottom-0 left-1/2 w-[3px] h-[20%] bg-gray-500 animate-line-up"></div>
        <div className="relative z-10 bg-black/30 pointer-events-none flex flex-col items-center justify-center text-center w-[40%] h-[100%] mx-auto px-8 animate-slideUp">
        
          {/* Logo o título principal */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl justify-center font-bold text-white mb-4  drop-shadow-lg">
             casa sansón.
            </h1>
            <div className="w-full h-[1px] bg-gray-500 mx-auto mb-8"></div>
            <p className="text-2xl md:text-3xl text-white font-light drop-shadow-md">
              SLOGAN
            </p>


          </div>
          {/* Botón de entrada */}
          <button
            onClick={handleEnterWebsite}
            className="group relative pointer-events-auto px-12 py-4 bg-black backdrop-blur-sm text-white text-xl font-semibold rounded-none border-2 border-black transition-all duration-700 hover:bg-gray-500/20 hover:text-black hover:border-black/50 hover:shadow-2xl transform hover:scale-105 drop-shadow-lg"
          >
            <span className="relative z-30">ENTRAR</span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>
    );
  }

  // Solo mostrar la home page cuando currentScreen sea 'home'
  if (currentScreen === 'home') {
    return (
      <>
        {/* Contenido principal con padding superior para evitar superposición con navbar */}
        <main className="relative bg-[#111111] pt-18">
        {/* Hero Section */}
        {/* <section className="h-[100%] bg-[#f1efe0] relative">
          <div className="relative w-full h-[1220px]">
          <RippleEffect
            className="absolute inset-0 bg-none"
            style={{
              backgroundImage: 'url(/forest.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center'
            }}
            autoDrops={false}
            options={{ perturbance: 0.02, dropRadius: 40 }}
          />
          </div>  
        </section > */}

        {/* Mensaje con nuestra filosofia y foto 1 */}
        <ScrollReveal animation="up" delay={200}>
          <section className="py-16 bg-[#222222] border-gray-700 mb-24  h-[80vh] w-full mx-auto grid grid-cols-2">
            <ScrollReveal animation="left" delay={400}>
              <div className="flex flex-col justify-center ml-[20%] mr-[20%] mt-[40%]">
                <h2 className="text-4xl font-bold mb-6 text-white">Filosofia</h2>
                <p className="text-white text-lg">
                  Esta página me gusta por las animaciones, transiciones y elementos visuales que son muy atractivos.
                  En la página de about us crea una comunidad al guiar al usuario a través de la visión de la marca, muestra los bocetos que hicieron reales sus productos y usa un lenguaje que es directo.
                  Incluye una sección de Chat with Us, donde le permite a sus clientes compartir sus ideas. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="right" delay={600}>
              <div className="flex justify-start items-center mr-[17%] shadow-2xl shadow-white">
               <RippleEffect
            className="block bg-none w-[80%] mr-[10%] h-[600px] overflow-hidden"
            style={{
              backgroundImage: 'url(/vogue.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            autoDrops={false}
            options={{ perturbance: 0.02, dropRadius: 40 }}
          />
              </div>
            </ScrollReveal>
          </section>
        </ScrollReveal>


        {/* Mensaje con nuestra filosofia y foto 2 */}
        <ScrollReveal animation="up" delay={200}>
          <section className="py-16 bg-[#222222] border-gray-700 mb-24  h-[80vh] w-full mx-auto grid grid-cols-2">
            {/* Columna izquierda - Imagen */}
            <ScrollReveal animation="left" delay={400}>
              <div className="flex justify-end items-center ml-[17%] ">
               <RippleEffect
            className="block bg-none w-[80%] ml-[10%] h-[600px] overflow-hidden"
            style={{
              backgroundImage: 'url(/buffalo.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            autoDrops={false}
            options={{ perturbance: 0.02, dropRadius: 40 }}
          />
              </div>
            </ScrollReveal>

            {/* Columna derecha - Texto */}
            <ScrollReveal animation="right" delay={600}>
              <div className="flex flex-col justify-center ml-[20%] mr-[20%] mt-[40%]">
                  <h2 className="text-4xl font-bold mb-6 text-white">Lorem ipsum dolor</h2>
                  <p className="text-white text-lg">
                  Esta página me gusta por las animaciones, transiciones y elementos visuales que son muy atractivos.
                  En la página de about us crea una comunidad al guiar al usuario a través de la visión de la marca, muestra los bocetos que hicieron reales sus productos y usa un lenguaje que es directo.
                  Incluye una sección de Chat with Us, donde le permite a sus clientes compartir sus ideas. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
              </div>
            </ScrollReveal>
          </section>
        </ScrollReveal>

        {/* Mensaje con nuestra filosofia y foto 3 */}
        <ScrollReveal animation="down" delay={200}>
          <section className="py-16 bg-[#222222] border-gray-700 pt-0 mt-0 mb-24  h-[80vh] w-[100%] mx-auto grid grid-cols-2">
            <ScrollReveal animation="left" delay={400}>
              <div className="col-span-1">
                <h2 className="text-4xl font-bold flex col-span-1 mt-[30%] ml-14 mr-14 items-center mb-12 text-white">
                  Lorem ipsum dolor
                </h2>
                <p className="text-white text-lg flex justify-center ml-14 mr-24 items-center mb-12">
                  Esta página me gusta por las animaciones, transiciones y elementos visuales que son muy atractivos.
                  En la página de about us crea una comunidad al guiar al usuario a través de la visión de la marca, muestra los bocetos que hicieron reales sus productos y usa un lenguaje que es directo.
                  Incluye una sección de Chat with Us, donde le permite a sus clientes compartir sus ideas. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="right" delay={600}>
              <div className="flex col-span-1 mt-[14%] mb-[45%] mr-[10%] justify-end">
               <RippleEffect
            className="absolute inset-0 bg-none w-[60px] h-[600px]"
            style={{
              backgroundImage: 'url(/jacob_elordi.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            autoDrops={false}
            options={{ perturbance: 0.02, dropRadius: 40 }}
          />
              </div>
            </ScrollReveal>
          </section>
        </ScrollReveal>


          

        {/* Footer */}
        <footer className="bg-[#111111] text-white py-8">
          <div className="container mx-auto px-4">
            <p className="text-center">
              &copy; 2025 Casa Sansón. Todos los derechos reservados.
            </p>
          </div>
        </footer>
        </main>
      </>
    );
  }
  return null;
}