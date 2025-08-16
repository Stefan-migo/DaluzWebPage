'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { MessageCircle, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

interface CollapsibleFAQProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function CollapsibleFAQ({ question, answer, isOpen, onToggle }: CollapsibleFAQProps) {
  return (
    <Card className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">{question}</h3>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
      {isOpen && (
        <CardContent className="px-6 pb-6 pt-0">
          <p className="text-gray-600">{answer}</p>
        </CardContent>
      )}
    </Card>
  )
}

export default function FAQClient() {
  const [openItems, setOpenItems] = useState<string[]>([])
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const faqs = [
    {
      category: "Productos",
      questions: [
        {
          question: "¿Cómo sé qué línea de productos es la adecuada para mí?",
          answer: "Cada línea está diseñada para diferentes necesidades. ALMA TERRA se enfoca en aromaterapia, ECOS en limpieza natural, UMBRAL en transformación, JADE RITUAL en ceremonias, y UTÓPICA en cosmética natural. Recomendamos una consulta personalizada para identificar la línea perfecta para ti."
        },
        {
          question: "¿Los productos son 100% naturales?",
          answer: "Sí, todos nuestros productos están elaborados con ingredientes naturales y orgánicos cuidadosamente seleccionados. No utilizamos químicos sintéticos, parabenos ni conservantes artificiales."
        },
        {
          question: "¿Cuánto tiempo duran los productos?",
          answer: "Nuestros productos tienen una vida útil de 12-18 meses desde la fecha de elaboración. Al ser naturales, recomendamos usar dentro de 6 meses una vez abiertos para mantener su potencia."
        }
      ]
    },
    {
      category: "Membresía",
      questions: [
        {
          question: "¿Qué incluye el programa de 7 meses?",
          answer: "El programa incluye contenido semanal exclusivo, videos guiados, material descargable, kit de productos mensuales, acceso a la comunidad privada y sesiones grupales mensuales."
        },
        {
          question: "¿Puedo pausar mi membresía?",
          answer: "Sí, ofrecemos opciones de pausa por hasta 2 meses durante el programa. Contacta a nuestro equipo para coordinar la pausa de tu membresía."
        },
        {
          question: "¿Hay garantía de devolución?",
          answer: "Ofrecemos una garantía de 15 días desde el inicio del programa. Si no estás satisfecho, te devolvemos el 100% de tu inversión."
        }
      ]
    },
    {
      category: "Envíos",
      questions: [
        {
          question: "¿A qué ciudades envían?",
          answer: "Realizamos envíos a toda Argentina. Los envíos a CABA y GBA demoran 24-48hs, al interior del país 3-7 días hábiles según la zona."
        },
        {
          question: "¿Cuál es el costo de envío?",
          answer: "El envío es gratuito en compras superiores a $15.000. Para compras menores, el costo varía según la zona: CABA $1.200, GBA $1.800, Interior $2.500-4.000."
        },
        {
          question: "¿Puedo hacer seguimiento de mi pedido?",
          answer: "Sí, una vez despachado tu pedido recibirás un código de seguimiento por email para monitorear el estado de tu envío en tiempo real."
        }
      ]
    },
    {
      category: "Pagos",
      questions: [
        {
          question: "¿Qué métodos de pago aceptan?",
          answer: "Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express), transferencia bancaria, MercadoPago y efectivo en Rapipago/Pago Fácil."
        },
        {
          question: "¿Puedo pagar en cuotas?",
          answer: "Sí, con tarjeta de crédito puedes pagar hasta en 12 cuotas sin interés en productos seleccionados. El programa de membresía se puede abonar en 3 cuotas."
        },
        {
          question: "¿Emiten factura?",
          answer: "Sí, emitimos factura A o B según corresponda. Solo necesitamos tus datos fiscales al momento de la compra."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Centro de Ayuda
          </Badge>
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Encuentra respuestas rápidas a las consultas más comunes sobre DA LUZ CONSCIENTE
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="font-velista text-2xl md:text-3xl font-bold mb-8 text-brand-primary border-b border-brand-primary/20 pb-4">
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const itemId = `${categoryIndex}-${index}`
                  return (
                    <CollapsibleFAQ
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openItems.includes(itemId)}
                      onToggle={() => toggleItem(itemId)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-6 bg-bg-cream">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6">
              ¿No encontraste tu respuesta?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestro equipo está aquí para ayudarte. Contactanos por el medio que prefieras.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardHeader>
                <MessageCircle className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <CardTitle className="font-velista">Chat en Vivo</CardTitle>
                <CardDescription>Respuesta inmediata</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled>
                  Próximamente
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <Mail className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <CardTitle className="font-velista">Email</CardTitle>
                <CardDescription>Te respondemos en 24hs</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="mailto:info@daluzconsciente.com">
                    Enviar Email
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <Phone className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <CardTitle className="font-velista">WhatsApp</CardTitle>
                <CardDescription>Atención personalizada</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/contacto">
                    Contactar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
