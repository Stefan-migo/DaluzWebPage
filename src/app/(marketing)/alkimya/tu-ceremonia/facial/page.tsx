import { Metadata } from 'next'
import Link from 'next/link'
import CeremoniaCarousel, {
  type CeremoniaBanner,
} from '@/components/marketing/CeremoniaCarousel'
import '@/styles/ceremonia-facial.css'

const BANNERS: CeremoniaBanner[] = [
  {
    src: '/images/ceremonias/carrusel/ceremonia-acne.webp',
    alt: 'Ceremonia facial para piel con tendencia al acné: limpieza profunda y calma',
  },
  {
    src: '/images/ceremonias/carrusel/ceremonia-pitta.webp',
    alt: 'Ceremonia facial para piel sensible / Pitta: alivio y protección',
  },
  {
    src: '/images/ceremonias/carrusel/ceremonia-mixta.webp',
    alt: 'Ceremonia facial para piel mixta / Pitta-Kapha: hidratación y balance',
  },
  {
    src: '/images/ceremonias/carrusel/ceremonia-madura.webp',
    alt: 'Ceremonia facial para piel madura / Vata: nutrición y regeneración',
  },
  {
    src: '/images/ceremonias/carrusel/ceremonia-grasa.webp',
    alt: 'Ceremonia facial para piel grasa / Kapha: claridad y ligereza',
  },
  {
    src: '/images/ceremonias/carrusel/ceremonia-seca.webp',
    alt: 'Ceremonia facial para piel seca / Vata: suavidad y nutrición',
  },
]

export const metadata: Metadata = {
  title: 'Ceremonia Facial | ALKIMYA | DA LUZ CONSCIENTE',
  description:
    'Descubrí tu ceremonia facial diaria. Transformá tu rutina de cuidado facial en un ritual consciente con DA LUZ Alkimya.',
}

type Paso = {
  num: number;
  titulo: string;
  proposito: string;
  intencion: string;
  consejos: string;
  extra?: readonly { titulo: string; texto: string }[];
};

const PASOS: readonly Paso[] = [
  {
    num: 1,
    titulo: 'Limpieza Facial',
    proposito:
      'Elimina suciedad, sebo, maquillaje y toxinas. Prepara la piel para absorber tratamientos.',
    intencion:
      'Con el agua, liberá la piel de lo que ya no necesita y conectate con la pureza para recibir el nuevo día .',
    consejos:
      'Usá tu Agua Micelar para desmaquillar y tu limpiador facial en Gel como segundo paso.',
  },
  {
    num: 2,
    titulo: 'Exfoliación (Complementaria)',
    proposito:
      'Renueva el cutis, desobstruye poros y elimina la piel muerta. Mejora la absorción.',
    intencion:
      'Liberá las capas de lo viejo (células muertas) y prepará tu ser para la nueva recepción.',
    consejos:
      'Aplicar de 1 a 3 veces por semana, según el biotipo. Utilizar el Gel exfoliante Renace.',
  },
  {
    num: 3,
    titulo: 'Tonificación',
    proposito:
      'Equilibra el pH de la piel tras la limpieza y prepara la barrera cutánea.',
    intencion: 'Tonificá tu intención y tu campo energético.',
    consejos:
      'Aplicá el Tónico Hidratante con toques suaves o brumizando el rostro, mañana y noche.',
  },
  {
    num: 4,
    titulo: 'Nutrición (Sérum)',
    proposito:
      'Aporta la alta concentración de activos específicos (Vitaminas, Ácido Hialurónico) que tu piel necesita.',
    intencion:
      'Nutrí tu Ser con lo más vital que necesita. Conectá con la intención detrás de la Alkimya elegida.',
    consejos:
      'Aplicá tu Sérum específico (Vitamina C, Niacinamida, etc.) con masajes suaves.',
  },
  {
    num: 5,
    titulo: 'Humectación y Protección (Hidratación)',
    proposito:
      'Sella los activos, previene la pérdida de agua y restaura el confort.',
    intencion:
      'Sellá la gratitud por tu Ser. Que tu piel se sienta mimada y cuidada.',
    consejos:
      'Usá la Emulsión o Crema específica para tu biotipo. Aplicá después del sérum.',
  },
];

export default function CeremoniaFacialPage() {
  return (
    <div className="ceremonia-facial-page">
      <div className="ceremonia-facial-bg" aria-hidden="true" />
      <main className="ceremonia-facial-content">
        {/* Hero - pt-0 so MainTitleBg touches header */}
        <section className="px-4 pt-0 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-20">
          <h1 className="ceremonia-facial-hero-title">
            <div className="ceremonia-facial-hero-title-bg" aria-hidden="true" />
            <span className="ceremonia-facial-hero-title-text">
              CEREMONIA FACIAL
            </span>
          </h1>
          <h3 className="font-subtitle mt-4 text-center text-xl italic sm:text-2xl md:text-3xl ceremonia-facial-hero-subtitle">
            El Rostro: Activación del Escudo Protector
          </h3>
        </section>

        {/* Paso a Paso */}
        <section className="px-4 pb-2 sm:px-6 sm:pb-4 md:px-8 md:pb-6 lg:px-12 lg:pb-10">
          <div className="mx-auto max-w-4xl space-y-6 md:space-y-8 lg:space-y-10">
            {PASOS.map((paso, stepIndex) => {
              /* Zigzag: Step 1 starts L,R,L,R,L. Step 2 continues R,L,R,L. Step 3 L,R,L,R. etc. */
              const isEvenStep = stepIndex % 2 === 0
              const zigzag = {
                title: isEvenStep ? 'left' : 'right',
                proposito: isEvenStep ? 'right' : 'left',
                intencion: isEvenStep ? 'left' : 'right',
                consejos: isEvenStep ? 'right' : 'left',
                extra: 'left' as const,
                photo: isEvenStep ? 'right' : 'left',
              }
              const photoShapeClass = stepIndex % 2 === 0 ? 'ceremonia-facial-foto-circle' : 'ceremonia-facial-foto-leaf'
              return (
                <article
                  key={paso.num}
                  className="ceremonia-facial-step-container ceremonia-facial-mobile-card lg:bg-transparent lg:shadow-none lg:p-0"
                >
                  {/* Titulo Principal */}
                  <div
                    className="ceremonia-facial-step-title"
                    data-zigzag={zigzag.title}
                  >
                    <div className="ceremonia-facial-step-title-bg" aria-hidden="true" />
                    <h4 className="ceremonia-facial-step-title-text pb-4 lg:pb-6">
                      {paso.num}. {paso.titulo}
                    </h4>
                  </div>

                  {/* Propósito y Beneficio */}
                  <div
                    className="ceremonia-facial-block-group"
                    data-zigzag={zigzag.proposito}
                    data-order="1"
                  >
                    <div className="ceremonia-facial-block-title">
                      <div className="ceremonia-facial-block-title-bg" aria-hidden="true" />
                      <span className="ceremonia-facial-block-title-text">
                        Propósito y Beneficio
                      </span>
                    </div>
                    <div className="ceremonia-facial-block-text">
                      <div className="ceremonia-facial-block-text-bg" aria-hidden="true" />
                      <p className="ceremonia-facial-block-text-content">
                        {paso.proposito}
                      </p>
                    </div>
                  </div>

                  {/* Intención de la Ceremonia */}
                  <div
                    className="ceremonia-facial-block-group"
                    data-zigzag={zigzag.intencion}
                    data-order="2"
                  >
                    <div className="ceremonia-facial-block-title">
                      <div className="ceremonia-facial-block-title-bg" aria-hidden="true" />
                      <span className="ceremonia-facial-block-title-text">
                        Intención de la Ceremonia
                      </span>
                    </div>
                    <div className="ceremonia-facial-block-text">
                      <div className="ceremonia-facial-block-text-bg" aria-hidden="true" />
                      <p className="ceremonia-facial-block-text-content">
                        {paso.intencion}
                      </p>
                    </div>
                  </div>

                  {/* Consejos de Aplicación */}
                  <div
                    className="ceremonia-facial-block-group"
                    data-zigzag={zigzag.consejos}
                    data-order="3"
                  >
                    <div className="ceremonia-facial-block-title">
                      <div className="ceremonia-facial-block-title-bg" aria-hidden="true" />
                      <span className="ceremonia-facial-block-title-text">
                        Consejos de Aplicación
                      </span>
                    </div>
                    <div className="ceremonia-facial-block-text">
                      <div className="ceremonia-facial-block-text-bg" aria-hidden="true" />
                      <p className="ceremonia-facial-block-text-content whitespace-pre-line">
                        {paso.consejos}
                      </p>
                    </div>
                  </div>

                  {/* Texto extra (solo si aplica) */}
                  {'extra' in paso && paso.extra && paso.extra.length > 0 && (
                    <div
                      className="ceremonia-facial-extra-block"
                      data-zigzag={zigzag.extra}
                    >
                      <div className="ceremonia-facial-extra-block-bg" aria-hidden="true" />
                      <div className="ceremonia-facial-extra-block-content">
                        {paso.extra.map((item, i) => (
                          <p key={i}>
                            <span className="font-subtitle font-medium italic">
                              {item.titulo}{' '}
                            </span>
                            {item.texto}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Foto del Paso */}
                  <div
                    className={`ceremonia-facial-photo-block ${photoShapeClass}`}
                    data-zigzag={zigzag.photo}
                  >
                    <img
                      src={`/images/ceremonias/step_${paso.num}.png`}
                      alt={`Foto paso ${paso.num}`}
                    />
                    {/* Wavy Line Decoration */}
                    <div className="ceremonia-wavy-decoration" aria-hidden="true">
                      <svg width="25" height="120" viewBox="0 0 25 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 12 0 C 30 20 0 40 12 60 C 30 80 0 100 12 120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Elegí tu Ceremonia - Carrusel de biotipos */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-20 md:px-8 md:pb-24 lg:px-12 lg:pb-32 -mt-4 sm:-mt-8 lg:-mt-16">
          <CeremoniaCarousel
            banners={BANNERS}
            label="Ceremonias faciales según tu biotipo"
          />
          <div className="mt-8 flex justify-center sm:mt-10">
            <Link
              href="/productos"
              className="font-title inline-flex justify-center rounded-r-[15px] border-2 border-[var(--color-brand-primary)] bg-[var(--color-bg-light)] px-8 py-4 text-sm font-medium uppercase tracking-[1px] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 sm:text-base"
            >
              ELEGÍ TU CEREMONIA!
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
