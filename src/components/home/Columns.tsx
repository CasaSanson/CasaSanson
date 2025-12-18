"use client";
import ScrollReveal from "../ScrollReveal";
import RippleEffect from "../RippleEffect";
export default function Columns(){
    return(
        <div className="overflow-x-hidden">
        <ScrollReveal animation="up" delay={50}>
          <section className="py-16 bg-cs-ivory bg-cover bg-center border-gray-700  h-full w-full md:h-full w-full mx-auto grid grid-cols-1 md:grid-cols-2">
            <ScrollReveal animation="left" delay={50}>
              <div className="flex flex-col md:justify-between px-4 md:px-10 py-4 md:py-10 md:mt-[11%]">
                <h2 className="text-2xl md:text-4xl mb-10 text-black">Esencia</h2>
                <p className="text-black text-sm md:text-lg mb-7">
                  En Casa Sansón creemos que la elegancia no nace de las estructuras, sino del movimiento.
                </p>
                <p className="text-black text-sm md:text-lg mb-7">
                 Diseñamos prendas que celebran el cuerpo humano y la caída natural de las telas, desdibujando las líneas rígidas de lo formal.
                </p>
                <p className="text-black text-sm md:text-lg">
                 Nuestra ropa habita entre mundos: la oficina y la noche, la quietud y el tránsito, lo clásico y lo libre.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="right" delay={50}>
              <div className="hidden md:flex justify-start items-center mr-0 md:mr-[5%] shadow-2xl shadow-white h-auto md:h-[600px] w-[500px] md:w-[600px]">
               <video
                src="/video_muestra.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover">
               </video>
              </div>
              <div className="block md:hidden justify-start items-center mr-0 md:mr-[17%] shadow-2xl shadow-white h-auto md:h-[600px] w-full md:w-[600px] mt-20">
                <img src="/face.jpg" alt="Face" className=" h-full object-cover" />
              </div>
            </ScrollReveal>
          </section>
        </ScrollReveal>


        {/* Catalogo de la marca*/}
        <ScrollReveal animation="up" delay={50}>
          <section className="py-16 bg-cs-ivory bg-cover bg-center border-gray-700 h-auto md:h-[80vh] w-auto md:w-full mx-auto grid grid-cols-1 md:grid-cols-2">
            {/* Columna izquierda - Imagen */}
            <ScrollReveal animation="left" delay={50}>
              <div className="hidden md:flex justify-center items-center md:justify-end md:items-center  ">
               <RippleEffect
            className="block bg-none w-auto md:w-[80%]  h-[500px] md:h-[700px]"
            style={{
              backgroundImage: 'url(/modelo31.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            autoDrops={false}
            options={{ perturbance: 0.04, dropRadius: 80 }}
          />
              </div>
            </ScrollReveal>

            {/* Columna derecha - Texto */}
            <ScrollReveal animation="right" delay={50}>
              <div className="flex flex-col justify-center px-4 md:px-10 py-4 md:py-10 md:mt-[11%]">
                  <h2 className="text-2xl md:text-4xl mb-10 text-black">La primera prenda</h2>
                  <p className="text-black text-sm md:text-lg mb-7">
                  La primera creación de Casa Sansón es una declaración: una evolución del blazer que redefine el vestir formal.
                </p>
                <p className="text-black text-sm md:text-lg mb-7">
                Una pieza sin género, pensada para el día y la noche, para el cuerpo y el gesto.
                </p>
                <p className="text-black text-sm md:text-lg mb-7">
                En ella comienza la historia de Casa Sansón: un espacio donde la tela encuentra libertad y la forma, sentido.
                </p>
              </div>
            </ScrollReveal>
            <div className="block md:hidden justify-center items-center">
              <img src="/face.jpg" alt="Modelo" className="w-full h-full object-cover" />
            </div>
          </section>
        </ScrollReveal>

        {/* 3*/}
        <ScrollReveal animation="down" delay={50}>
          <section className="py-16 bg-cs-ivory bg-cover bg-center border-gray-700 h-auto md:h-[80vh] w-auto md:w-full mx-auto grid grid-cols-1 md:grid-cols-2">
            <ScrollReveal animation="left" delay={50}>
              <div className="col-span-1flex flex-col md:justify-between px-4 md:px-10 py-4 md:py-10 md:mt-[11%]">
                <h2 className="text-2xl md:text-4xl mb-10 text-black">
                  Diario
                </h2>
                <p className="text-black text-sm md:text-lg mb-7">
                  Esta página me gusta por las animaciones, transiciones y elementos visuales que son muy atractivos.
                  En la página de about us crea una comunidad al guiar al usuario a través de la visión de la marca, muestra los bocetos que hicieron reales sus productos y usa un lenguaje que es directo.
                  Incluye una sección de Chat with Us, donde le permite a sus clientes compartir sus ideas. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
                <p className="text-black text-sm md:text-lg mb-7">
                  Esta página me gusta por las animaciones, transiciones y elementos visuales que son muy atractivos.
                  En la página de about us crea una comunidad al guiar al usuario a través de la visión de la marca, muestra los bocetos que hicieron reales sus productos y usa un lenguaje que es directo.
                  Incluye una sección de Chat with Us, donde le permite a sus clientes compartir sus ideas. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="right" delay={50}>
              <div className="hidden md:flex col-span-1 mt-[14%] mb-[45%] mr-[10%] justify-end">
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
            <div className="block md:hidden justify-center items-center">
              <img src="/cac_about.png" alt="Modelo" className="w-full h-full object-cover" />
            </div>
          </section>
        </ScrollReveal>
        </div>
    )
}