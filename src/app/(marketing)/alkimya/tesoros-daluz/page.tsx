import { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Tesoros Da Luz | ALKIMYA | DA LUZ CONSCIENTE',
  description:
    'Tu ritualización comienza aquí. Descubrí los Tesoros Da Luz: papel semilla, portal de inmersión y herramientas de transformación con cada producto.',
}

const PORTAL_CARDS = [
  {
    title: 'ALMA TERRA | Portal de Enraizamiento',
    items: [
      'Audio Ritual: "El Retorno al Origen".',
      'Herramienta Somática: Mudra de Tierra y Contacto de Peso.',
      'Juego de Intención: Anclaje y Sostén.',
    ],
    frequency: 'Hexaedro',
    variant: 'alma' as const,
  },
  {
    title: 'ECOS | Portal de Purificación',
    items: [
      'Audio Ritual: "El Silencio Fértil".',
      'Herramienta Somática: Diapasón Humano y Liberación Craneal.',
      'Juego de Intención: Limpieza y Verdad.',
    ],
    frequency: 'DODECAEDRO',
    variant: 'ecos' as const,
  },
  {
    title: 'UMBRAL SENS | Portal de la Sacralidad',
    items: [
      'Audio Ritual: "Habitar la Memoria Líquida".',
      'Herramienta Somática: Mapa del Goce y Movilidad Sacra.',
      'Juego de Intención: Nutrir y Gozar.',
    ],
    frequency: 'ICOSAEDRO',
    variant: 'umbral' as const,
  },
  {
    title: 'PRISMA | Portal de la Identidad',
    items: [
      'Audio Ritual: "Encender la Propia Luz".',
      'Herramienta Somática: Ejercicio de Palming y Eje de Poder.',
      'Juego de Intención: Explorar y Manifestar.',
    ],
    frequency: 'TETRAEDRO',
    variant: 'utopica' as const,
  },
  {
    title: 'JADE RITUAL | Portal del Corazón',
    items: [
      'Audio Ritual: "Coherencia y Sincronía".',
      'Herramienta Somática: Sostén de Pecho y Anjali Mudra.',
      'Juego de Intención: Sanar y Alinear.',
    ],
    frequency: 'OCTAEDRO',
    variant: 'jade' as const,
  },
]

const TESORO_UNIVERSAL_ITEMS = [
  {
    title: 'La Intención y el Biotipo (PDF Guía)',
    description: 'Recibís el manifiesto de la marca en un formato breve, junto con tips y ejemplos para aprender a intencionar y conectar con la energía de tu Biotipo (Serena, Ilumina, Renace, etc.).',
  },
  {
    title: 'Anclaje de la Presencia (Audio)',
    description: 'Práctica breve de respiración consciente para centrarte y crear el hábito de la conexión.',
  },
  {
    title: 'Música Medicina',
    description: 'Un link a la Playlist exclusiva de Da Luz para ambientar tu ceremonia.',
  },
]

const PLUS_SINERGIA_ITEMS = [
  {
    title: 'EL PROTOCOLO ALQUÍMICO (Guía Teórica)',
    description: 'Secuencia óptima y soporte teórico de la fusión de activos.',
  },
  {
    title: 'EL RITUAL DE LA FUSIÓN (audio)',
    description: 'Ceremonia guiada para transformar la aplicación del Kit en una experiencia meditativa y sinérgica.',
  },
  {
    title: 'EL ANCLA DE LA CEREMONIA',
    description: 'Ejercicios somáticos y de reflexión para integrar la intención.',
  },
]

export default function TesorosDaLuzPage() {
  return (
    <div className="tesoros-page min-h-screen">
      {/* Full-width title band */}
      <section className="tesoros-header-band">
        <div className="tesoros-header-band-inner">
          <h1 className="tesoros-page-title">Tesoros Da Luz</h1>
        </div>
      </section>

      <div className="tesoros-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10 md:space-y-14">
        {/* Hero intro */}
        <section className="text-center space-y-6">
          <h2 className="tesoros-subtitle font-title text-center">
            Tu Ritualización Comienza Aquí: Dos Llaves de Transformación
          </h2>
          <p className="font-text text-lg md:text-xl text-text-primary leading-relaxed max-w-3xl mx-auto">
            Creemos que la soberanía nace cuando el conocimiento se vuelve cuerpo. No se trata solo de adquirir información, sino de acuerpar las herramientas que ya habitan en vos para transformar tu realidad biológica y vibracional.
          </p>
          <p className="font-text text-lg text-text-primary leading-relaxed max-w-3xl mx-auto">
            Dentro nuestro tenemos infinitos recursos de regulación; los <strong>Tesoros Da Luz</strong> son el ecosistema diseñado para que vuelvas a ese equilibrio.
          </p>
          <p className="font-text text-lg text-text-primary leading-relaxed max-w-3xl mx-auto">
            Con cada producto, no solo nutrís tu piel, también recibís dos llaves de transformación diseñadas para anclar la Presencia en tu Ser.
          </p>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 1: Papel Semilla */}
        <section className="space-y-6">
          <h3 className="font-subtitle text-2xl md:text-3xl text-brand-primary italic">
            1: Papel Semilla y la Siembra de la Intención
          </h3>

          <Card variant="brand" className="tesoros-content-card">
            <CardContent className="pt-6">
              <p className="tesoros-card-text font-text text-lg leading-relaxed">
                Con la compra de una Alquimia o de un Kit Alkímico, te llevas de regalo un papel semilla: una invitación a honrar a la Madre Tierra mientras honrás tu propio templo.
              </p>
              <p className="tesoros-card-text font-text text-lg leading-relaxed mt-4">
                Un acto sagrado: Si no vas a sembrarlo ahora, regalalo a alguien que ame las plantas. Por favor, no lo tires; ahí habita vida y nutrición.
              </p>
            </CardContent>
          </Card>

          <h4 className="font-subtitle text-xl text-brand-primary italic mt-6">
            EL RITUAL DE SIEMBRA
          </h4>
          <Card variant="brand" className="tesoros-content-card">
            <CardContent className="pt-6">
              <p className="tesoros-card-text font-text text-lg leading-relaxed">
                Para activar tu semilla, te invitamos a un acto de presencia: escribí tu intención en un papel aparte y remojá el papel semilla 10 minutos antes de pasarlo a tierra fértil. Al plantarlo, activás tu Chakra Raíz, practicando el enraizamiento y la confianza en los ciclos de la vida.
              </p>
              <Link
                href="/blog"
                className="font-subtitle italic inline-block mt-4"
              >
                Guía completa: ¿Cómo cuido mi brote?
              </Link>
            </CardContent>
          </Card>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 2: Portal de Inmersión */}
        <section className="space-y-8">
          <h3 className="font-subtitle text-2xl md:text-3xl text-brand-primary italic">
            2. TU PORTAL DE INMERSIÓN
          </h3>

          <Card variant="brand" className="tesoros-content-card">
            <CardContent className="pt-6">
              <p className="tesoros-card-text font-text text-lg leading-relaxed">
                Con cada producto Da Luz que adquirís accedés a un <strong>Paquete de Bienvenida</strong> diseñado para la ritualización de tu autocuidado.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h4 className="font-subtitle text-xl text-brand-primary italic">
              A. EL TESORO UNIVERSAL (Regalo Fijo para todas las compras)
            </h4>
            <p className="font-text text-lg text-text-primary leading-relaxed italic">
              Tu infraestructura de regulación y conexión con la filosofía Da Luz:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TESORO_UNIVERSAL_ITEMS.map((item) => (
                <Card key={item.title} variant="brand" className="tesoros-content-card h-full">
                  <CardHeader>
                    <CardTitle className="tesoros-card-title font-subtitle text-base italic">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="tesoros-card-text font-text text-base leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-subtitle text-xl text-brand-primary italic">
              B. EL TESORO ESPECÍFICO (El Ritual de tu Línea)
            </h4>
            <p className="font-text text-lg text-text-primary leading-relaxed">
              Según la Alkimya que elijas, desbloqueás un Portal de Inmersión diseñado para transformar tu rutina en un acto de poder:
            </p>
            {/* Bento grid: 5 cards - 2 large, 3 small or similar layout */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 tesoros-bento-grid">
              {PORTAL_CARDS.map((card) => (
                <Card key={card.title} variant={card.variant} padding="default" className="h-full">
                  <CardHeader>
                    <CardTitle className="font-subtitle text-base md:text-lg text-brand-primary italic">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <ul className="font-text text-base text-text-primary space-y-1 list-none">
                      {card.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                    <p className="font-caption text-sm text-text-primary mt-2">
                      Sincronizados con la frecuencia del <strong>{card.frequency}</strong>.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 3: Plus de la Sinergia */}
        <section className="space-y-6">
          <h3 className="font-subtitle text-2xl md:text-3xl text-brand-primary italic">
            3. EL PLUS DE LA SINERGIA (Kits Da Luz)
          </h3>
          <p className="font-text text-lg text-text-primary leading-relaxed">
            Si elegís un kit, el valor de tu Tesoro se multiplica. Recibís TODO lo del Nivel Base (Tesoro Universal + Específico de cada línea incluida) MÁS tres herramientas de Maestría exclusivas, diseñadas para la sinergia e integración profunda:
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PLUS_SINERGIA_ITEMS.map((item) => (
              <Card key={item.title} variant="brand" className="tesoros-content-card h-full">
                <CardHeader>
                  <CardTitle className="tesoros-card-title font-subtitle text-base italic">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="tesoros-card-text font-text text-base leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 4: Cómo desbloquear */}
        <section className="space-y-4">
          <h3 className="font-subtitle text-2xl md:text-3xl text-brand-primary italic">
            ¿CÓMO LO DESBLOQUEO?
          </h3>
          <ul className="font-text text-lg text-text-primary leading-relaxed space-y-2 list-disc list-inside">
            <li><strong>Compra en Web:</strong> Se acredita automáticamente en tu perfil tras confirmar tu pedido.</li>
            <li><strong>Compra Externa (Local/WhatsApp):</strong> Registrate en la web y validá tu compra enviándonos tu mail y una foto del producto, número de lote o palabra clave por WhatsApp.</li>
          </ul>
        </section>

        <hr className="border-brand-primary/30" />

        {/* Sección 5: Maestría */}
        <Card variant="brand" className="tesoros-content-card">
          <CardContent className="pt-6">
            <h3 className="tesoros-card-title font-subtitle text-xl md:text-2xl italic mb-4">
              LA MAESTRÍA DE LA AUTOGESTIÓN: TU PRÓXIMO PASO
            </h3>
            <p className="tesoros-card-text font-text text-lg leading-relaxed">
              Estos Tesoros son un portal de bienvenida. Si deseás profundizar con ejercicios extensos y meditaciones de visualización avanzada, te invitamos a explorar la Membresía Da Luz.
            </p>
            <Link
              href="/membresia/programa"
              className="font-subtitle italic inline-block mt-4"
            >
              Explorar la Membresía Da Luz
            </Link>
          </CardContent>
        </Card>

        <hr className="border-brand-primary/30" />

        {/* Cierre y CTA */}
        <section className="text-center space-y-8">
          <p className="font-text text-lg text-text-primary leading-relaxed italic max-w-2xl mx-auto">
            El Tesoro es nuestra forma de honrar tu confianza y asegurar que cada gota de Alkimya cumpla su propósito de transformación.
          </p>
          <Link
            href="/productos"
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'btn tesoros-cta-link font-title uppercase tracking-wider w-full sm:w-auto justify-center px-6 py-4 sm:px-8 text-center no-underline'
            )}
          >
            EXPLORAR LA TIENDA Y OBTENER MI TESORO
          </Link>
        </section>
      </div>
    </div>
  )
}
