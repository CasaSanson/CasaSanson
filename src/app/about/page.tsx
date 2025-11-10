"use client";


export default function About() {
    return (
        <main className="bg-white min-h-screen w-[100%] mx-auto">
            {/* section de la coleccion */}
            <section className="w-full mx-auto bg-white grid grid-cols-1 md:grid-cols-2 h-auto md:h-[100vh] ">
                <div className="col-span-1">
                  <p className="text-black text-lg w-[60%] mx-auto mt-[40%] md:mt-[60%] m-7">
                  Una historia, una tradición, una cultura…
                  </p>
                  <p className="text-black text-lg w-[60%] mx-auto m-7">
                  Nuestro mundo nos llevó a aunar ideas
                  e ilusiones con el propósito de crear Casa Sansón
                  </p>
                </div>
                <div className="col-span-1">
                  <img src="/face.jpg" alt="Vogue" className="w-full h-[92%]" />
                </div>
            </section>

            {/* First Columns */}
            <section className="w-full mx-auto bg-white grid grid-cols-1 md:grid-cols-3 mt-[10%] md:h-[50vh] h-auto ">
                <div className="col-span-1">
                  <img src="/apolix.jpeg" alt="Vogue" className="w-[90%] ml-[10%] h-[90%] object-cover" />
                </div>
                <div className="col-span-1">
                  <p className="text-black text-lg w-[60%] mt-[30%] mx-auto">
                  Creamos prendas para ser queridas y recordadas.
                  <br />
                  <br />
                  Somos fieles a nuestros principios de sostenibilidad con nuestro entorno,
                  <br />
                  <br />
                  procurando siempre preservar este precioso mundo.
                  </p>
                </div>
                <div className="col-span-1">
                  <img src="/lanaabout.jpg" alt="Vogue" className="w-full h-[50%] object-cover" />
                </div>
            </section>

            {/* Second Columns */}
            <section className="w-full mx-auto bg-white grid grid-cols-1 md:grid-cols-2 mt-[10%] md:h-[50vh] h-auto ">
                <div className="col-span-1">
                  <img src="/hombre.jpg" alt="Vogue" className="w-[80%] ml-[10%] h-[80%] object-cover" />
                </div>
                <div className="col-span-1">
                  <p className="text-black text-lg w-[60%] mt-[10%] mx-auto">
                  Creamos prendas para ser queridas y recordadas.
                  <br />
                  <br />
                  Somos fieles a nuestros principios de sostenibilidad con nuestro entorno,
                  <br />
                  <br />
                  procurando siempre preservar este precioso mundo.
                  </p>
                  <p className="text-black text-lg w-[60%] mt-[10%] mx-auto">
                  Creamos prendas para ser queridas y recordadas.
                  <br />
                  <br />
                  Somos fieles a nuestros principios de sostenibilidad con nuestro entorno,
                  <br />
                  <br />
                  procurando siempre preservar este precioso mundo.
                  </p>
                </div>
            </section>

            {/* Third Columns */}
            <section className="w-full mx-auto bg-white grid grid-cols-1 md:grid-cols-3 mt-[20%] md:h-[50vh] h-auto ">
                <div className="col-span-1">
                  <img src="/lospanas.jpg" alt="Vogue" className="w-[70%] ml-[10%] h-[70%] object-cover" />
                </div>
                <div className="col-span-1">
                  <p className="text-black text-lg w-[60%] mt-[20%] mx-auto">
                  Creamos prendas para ser queridas y recordadas.
                  <br />
                  <br />
                  Somos fieles a nuestros principios de sostenibilidad con nuestro entorno,
                  <br />
                  <br />
                  procurando siempre preservar este precioso mundo.
                  </p>
                </div>
                <div className="col-span-1">
                  <img src="/birds.jpg" alt="Vogue" className="w-full h-[70%] mr-[10%]" />
                </div>
            </section>

            {/* footer */}

          
        </main>
    );
}