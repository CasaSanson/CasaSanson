'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import InstaxPhoto from "@/components/Instax";
import liquidChrome, { LiquidChrome } from "@/components/LiquidChrome";
import WaterRipple from "@/components/WaterRiple";
import ScrollReveal from "@/components/ScrollReveal";
import LoadingScreen from "@/components/LoadingScreen";
import RippleEffect from "@/components/RippleEffect";
import Link from "next/link";
export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('loading'); // 'loading', 'landing', 'home'
  const [typewriterText, setTypewriterText] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  

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

          <h1 className="text-8xl md:text-4xl text-gray-300 mb-4 tracking-tight drop-shadow-lg">
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
        <div className="relative z-10 bg-black/30 pointer-events-none flex flex-col items-center justify-center text-center w-auto md:w-[40%] h-auto md:h-[100%] mx-auto px-8 animate-slideUp">
        
          {/* Logo o título principal */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl justify-center text-white mb-4 drop-shadow-lg">
             Casa Xoria
            </h1>
            <div className="w-full h-[1px] bg-gray-500 mx-auto mb-8"></div>
            <p className="text-xl  text-gray-300 font-light drop-shadow-md">
              La búsqueda de belleza y armonía a través de la forma y la materia.
            </p>

           <p className="text-gray-300 text-md mt-10 mx-auto">
            Primavera/Verano 26/27
           </p>


          </div>

          {/* Botón de entrada */}
          <button
            onClick={handleEnterWebsite}
            className="group relative pointer-events-auto px-12 py-4 bg-black backdrop-blur-sm text-white text-xl rounded-none border-2 border-black transition-all duration-700 hover:bg-gray-500/20 hover:text-black hover:border-black/50 hover:shadow-2xl transform hover:scale-105 drop-shadow-lg"
          >
            <span className="relative z-30">Explorar</span>
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
        <section className="h-auto md:h-[100%] bg-[#f1efe0] relative">
          
          <div className="relative w-[100%] md:w-full h-[500px] md:h-[950px] mx-auto">
          <video
            src="/costurera.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Overlay dinámico */}
        {isOpen && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 transition-all duration-500">
            <p className="text-white text-sm md:text-xl mb-4">
              1. Creemos en la belleza imperfecta del movimiento.
            </p>

            <p className="text-white text-sm md:text-xl mb-4">
              2. Honramos la sastrería desde la artesanía, no desde la norma.
            </p>

            <p className="text-white text-sm md:text-xl mb-4">
              3. Diseñamos para todos los cuerpos que buscan congruencia, no etiquetas.
            </p>

            <p className="text-white text-sm md:text-xl mb-4">
              4. La ropa debe acompañar el ritmo de la vida, no imponerla.
            </p>
            <p className="text-white text-sm md:text-xl mb-4">
              5. La calidad no es un lujo: es una forma de respeto.
            </p>
          </div>
        )}
      </div>

      {/* Botón toggle debajo del video */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group absolute left-1/2 -translate-x-1/2 bottom-10 pointer-events-auto px-4 md:px-12 py-2 md:py-4 bg-black backdrop-blur-sm text-white text-sm md:text-xl rounded-none border-2 border-black transition-all duration-700 hover:bg-gray-500/20 hover:text-black hover:border-black/50 hover:shadow-2xl transform hover:scale-105 drop-shadow-lg"
      >
        {isOpen ? "X" : "Manifiesto"}
      </button>
    </section>


        {/* Esencia de la marca*/}
        <ScrollReveal animation="up" delay={200}>
          <section className="py-16 bg-white bg-cover bg-center border-gray-700  h-[100vh] md:h-[80vh] w-full mx-auto grid grid-cols-1 md:grid-cols-2">
            <ScrollReveal animation="left" delay={400}>
              <div className="flex flex-col justify-center px-4 md:px-0 py-4 md:py-0">
                <h2 className="text-2xl md:text-4xl mb-10 text-black">Esencia</h2>
                <p className="text-black text-sm md:text-lg mb-7">
                  En Casa Xaria creemos que la elegancia no nace de las estructuras, sino del movimiento.
                </p>
                <p className="text-black text-sm md:text-lg mb-7">
                 Diseñamos prendas que celebran el cuerpo humano y la caída natural de las telas, desdibujando las líneas rígidas de lo formal.
                </p>
                <p className="text-black text-sm md:text-lg mb-20">
                 Nuestra ropa habita entre mundos: la oficina y la noche, la quietud y el tránsito, lo clásico y lo libre.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="right" delay={600}>
              <div className="flex justify-start items-center mr-0 md:mr-[17%] shadow-2xl shadow-white">
               <RippleEffect
            className="block bg-none w-auto md:w-[80%] md:mr-[10%] h-auto md:h-[600px]"
            style={{
              backgroundImage: 'url(/face.jpg)',
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


        {/* Catalogo de la marca*/}
        <ScrollReveal animation="up" delay={200}>
          <section className="py-16 bg-white bg-cover bg-center border-gray-700   h-auto md:h-[80vh] w-full mx-auto grid grid-cols-1 md:grid-cols-2">
            {/* Columna izquierda - Imagen */}
            <ScrollReveal animation="left" delay={400}>
              <div className="flex justify-center items-center md:justify-end md:items-center  ">
               <RippleEffect
            className="block bg-none w-auto md:w-[80%] md:ml-[10%] h-auto md:h-[700px] overflow-hidden"
            style={{
              backgroundImage: 'url(/modelo31.png)',
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
              <div className="flex flex-col justify-center ml-0 md:ml-[20%] mr-0 md:mr-[20%] mt-0 md:mt-[10%]">
                  <h2 className="text-2xl md:text-4xl mb-10 text-black">La primera prenda</h2>
                  <p className="text-black text-sm md:text-lg mb-20 align-center">
                  La primera creación de Casa Sansón es una declaración: una evolución del blazer que redefine el vestir formal.
                </p>
                <p className="text-black text-sm md:text-lg mb-20">
                Una pieza sin género, pensada para el día y la noche, para el cuerpo y el gesto.
                </p>
                <p className="text-black text-sm md:text-lg mb-20">
                En ella comienza la historia de Casa Sansón: un espacio donde la tela encuentra libertad y la forma, sentido.
                </p>
              </div>
            </ScrollReveal>
          </section>
        </ScrollReveal>

        {/* Mensaje con nuestra filosofia y foto 3 */}
        <ScrollReveal animation="down" delay={200}>
          <section className="py-16 bg-white bg-cover bg-center border-gray-700 pt-0 mt-0   h-auto md:h-[100vh] w-[100%] mx-auto grid grid-cols-1 md:grid-cols-2">
            <ScrollReveal animation="left" delay={400}>
              <div className="col-span-1">
                <h2 className="text-4xl  flex col-span-1 mt-[30%] ml-14 mr-14 items-center mb-12 text-black">
                  diario
                </h2>
                <p className="text-black text-lg flex justify-center ml-14 mr-24 items-center mb-12">
                  Esta página me gusta por las animaciones, transiciones y elementos visuales que son muy atractivos.
                  En la página de about us crea una comunidad al guiar al usuario a través de la visión de la marca, muestra los bocetos que hicieron reales sus productos y usa un lenguaje que es directo.
                  Incluye una sección de Chat with Us, donde le permite a sus clientes compartir sus ideas. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>          
              </div>
            </ScrollReveal>
            <ScrollReveal animation="right" delay={600}>
              <div className="flex col-span-1 mt-[14%] mb-[45%] mr-[10%] justify-end">
                <RippleEffect
                  className="block bg-none w-[80%] mr-[10%] h-[600px] overflow-hidden"
                  style={{
                    backgroundImage: 'url(/cac_about.png)',
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


      {/*CtA*/}
      <section className="grid grid-cols-3 bg-white h-[100vh]">
          {/* primera columna */}
          <div className="col-span-1 flex flex-col space-y-1 mt-[10%]">
            <div className="row-span-1">
              <Link href="/catalogo">
                <img src="/cac_jacket.png" alt="Lino" className="w-[80%] mx-auto h-[95%] object-cover hover:scale-105 transition-all duration-300" />
              </Link>
            </div>
            <div className="row-span-1 mx-auto">
              <button className="text-white bg-black text-lg px-4 py-2 rounded-none">
                Ver más
              </button>
            </div>
            </div>
            {/* segunda columna */}
          <div className="col-span-1 flex flex-col mt-[10%]">
            <div className="row-span-1">
              <Link href="/catalogo">
              <img src="/cac_jacket.png" alt="Lino" className="w-[80%] mx-auto h-[95%] object-cover hover:scale-105 transition-all duration-300" />
              </Link>
            </div>
            <div className="row-span-1 mx-auto">
              <button className="text-white bg-black text-lg px-4 py-2 rounded-none">
                Ver más
              </button>
            </div>
            </div>
            {/* tercera columna */}
            <div className="col-span-1 flex flex-col  mt-[10%]">
            <div className="row-span-1">
              <Link href="/catalogo">
              <img src="/cac_jacket.png" alt="Lino" className="w-[80%] mx-auto h-[95%] object-cover hover:scale-105 transition-all duration-300" />
              </Link>
            </div>
            <div className="row-span-1 mx-auto">
              <button className="text-white bg-black text-lg px-4 py-2 rounded-none">
                Ver más
              </button>
            </div>
            </div>
      </section>
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