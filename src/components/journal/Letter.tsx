"use client";
import Image from "next/image";

export default function Letter() {
    return (
        <>
            <div className="px-2  w-full md:w-[60%] flex flex-col mx-auto ">
                <div className="flex justify-center items-center ">
                    <Image
                        src="/sanson_black.png"
                        alt="Logo"
                        width={200}
                        height={200}>

                    </Image>
                </div>
                <div>
                        <h2 className="text-md md:text-4xl font-bold mt-15 ">
                            La Intención Detrás de Casa Sansón
                        </h2>
                    </div>
                <div className="space-y-4 mt-5">
                    <p className="text-black text-sm md:text-lg">
                        (Mariano) Gracias por estar aquí y por elegir formar parte de este proyecto que nace del deseo profundo de acompañarte en los momentos más significativos de tu camino.
                    </p>
                    <p className="text-black text-sm md:text-lg">
                        (Lorena) Casa Sansón nació de ese deseo, sí, pero también de una convicción: la de transformar la manera en que entendemos el acto de vestir. No se trata solo de prendas, sino del lenguaje silencioso que construimos con ellas. Creemos que la elegancia no pertenece a lo rígido, sino que nace del movimiento.
                    </p>
                    <p className="text-black text-sm md:text-lg">
                        (José) Y para que ese movimiento sea auténtico, buscamos que cada persona sienta en su piel el cobijo suave de una tela de alta calidad, brindada por la naturaleza. Queremos que se sientan en congruencia con su cuerpo y con la sensualidad de una prenda que cae sobre su silueta. Es fundamental que caminen con fuerza y propósito.
                    </p>
                    <p className="text-black text-sm md:text-lg">
                        (José) Y para que ese movimiento sea auténtico, buscamos que cada persona sienta en su piel el cobijo suave de una tela de alta calidad, brindada por la naturaleza. Queremos que se sientan en congruencia con su cuerpo y con la sensualidad de una prenda que cae sobre su silueta. Es fundamental que caminen con fuerza y propósito.
                    </p>
                    <p className="text-black text-sm md:text-lg">
                        (Lorena) Diseñamos para celebrar la anatomía humana, para desdibujar los límites de lo formal y permitir que cada pieza respire con quien la lleva. La belleza, para nosotros, vive más allá de lo clásico, de lo aceptado, de lo seguro. No nace de un logo ni de lo que dictan las tendencias. Es una forma de hablar sin palabras.
                    </p>
                    <p className="text-black text-sm md:text-lg">
                        (Mariano) Cuando pienso en lo que quiero que sientas al usar nuestras prendas, imagino esa chispa que aparece cuando te expones a experiencias que te transforman, o cuando estrenas algo que te conecta contigo mismo. Nuestras piezas están hechas para despertar esa energía creativa que te impulsa a pensar distinto, explorar más y nutrir tu presencia.
                    </p>
                    <p className="text-black text-sm md:text-lg">
                        (José) Esa chispa debe ir acompañada de una sensación de bienestar físico total. Esto es lo que debemos infundir en cada pieza: ese ajuste, ese viento y esa comodidad perfecta que da la libertad. Es la misma sensación que encuentro al nadar, al correr o al pintar con movimiento constante. Nuestra ropa está diseñada para que camines dentro del mundo con confianza, naturalidad y empatía.
                    </p>
                    <p className="text-black text-sm md:text-lg">
                        (Lorena) Esa sensación de libertad y de seguridad es la que quiero que experimente quien observe cada pieza y, sobre todo, quien la lleve puesta. Es la misma conexión entre los textiles —su peso, su textura, su movimiento—, las siluetas y el espacio que celebramos en cada colección. Porque, en esencia, para mí, vestir es una extensión honesta de lo que soy.
                    </p>
                    <p className="text-black text-sm md:text-lg">
                        (Mariano) Por eso elegimos fibras naturales. No es un capricho: es una forma de honrar la conexión que sentimos con la naturaleza, con lo que respira contigo y se adapta a tu cuerpo con suavidad. Queremos que al vestirlas sientas seguridad y confianza, y que te permitan vivir con libertad en tu cuerpo y en tu mente.
                    </p>
                    <p className="text-black text-sm md:text-lg">
                        (José) Las fibras naturales son nuestro puente hacia lo real. Son la forma en que la naturaleza entra en la vida cotidiana y se convierte en expresión.
                    </p>
                    <p className="text-black text-lg w-full mx-auto pt-24 flex flex-col mx-auto text-left">
                        Con cariño,
                    </p>
                    <p className="text-black text-lg w-full mx-auto pt-4">
                        Casa Sansón.
                    </p>
                </div>

            </div>
            <div className="flex flex-col mx-auto">
                <Image
                    src="/sanson_black.png"
                    alt="logo"
                    width={500}
                    height={500}
                    className="flex mx-auto">
                </Image>
            </div>
        </>
    )
}