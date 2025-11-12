import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  export function AccordionComponent() { 
    return (
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-sm text-gray-800">Información del producto</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Nuestro producto principal combina tecnología de vanguardia con un diseño elegante. Construido con materiales premium, ofrece un rendimiento excepcional y confiabilidad.
            </p>
            <p>
              Las características clave incluyen capacidades de procesamiento avanzadas, y una interfaz de usuario intuitiva diseñada para principiantes y expertos.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-sm text-gray-800">Detalles de envío</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Ofrecemos envío mundial a través de socios de confianza. El envío estándar toma 3-5 días hábiles, mientras que el envío expreso asegura la entrega dentro de 1-2 días hábiles.
            </p>
            <p>
              Todos los pedidos se empaquetan cuidadosamente y están asegurados. Rastrea tu envío en tiempo real a través de nuestro portal de seguimiento dedicado.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Política de devolución</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Nosotros nos comprometemos con nuestros productos con una política de devolución completa de 30 días. Si no estás completamente satisfecho, simplemente devuelve el artículo en su condición original.
            </p>
            <p>
              Nuestro proceso de devolución sin complicaciones incluye envío gratuito y reembolsos completos procesados dentro de 48 horas de recibir el artículo devuelto.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  