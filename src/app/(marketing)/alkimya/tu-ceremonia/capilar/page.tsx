import { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/ceremonia-capilar.css'

export const metadata: Metadata = {
  title: 'Ceremonia Capilar | ALKIMYA | DA LUZ CONSCIENTE',
  description:
    'Descubri tu ceremonia capilar. Fortalecé la raíz y transformá tu rutina de cuidado del cabello en un ritual consciente con DA LUZ Alkimya.',
}

const PASOS = [
  {
    num: 1,
    titulo: 'Reparación Profunda (Pre-Lavado)',
    proposito:
      'Aporta nutrientes intensos, reconstruye la hebra y previene el quiebre. Doble valor: Usar Acondicionador como Mascarilla.',
    intencion: 'Repará tu fuerza interior. Dedicate tiempo y presencia.',
    consejos:
      'Aplicá el Acondicionador Pureza sobre el pelo seco, de medios a puntas, 1 vez por semana. Dejá actuar 20 minutos antes de lavar.',
  },
  {
    num: 2,
    titulo: 'Limpieza y Desintoxicación',
    proposito:
      'Remueve impurezas, sebo y residuos. Abre las cutículas para recibir el tratamiento.',
    intencion:
      'Limpia tu mente de pensamientos repetitivos. Nutrí el templo de tu cabeza para recibir nuevas ideas.',
    consejos:
      'Usá el Shampoo para tu biotipo. Aplicá con masajes circulares suaves, acompañando con respiraciones.',
  },
  {
    num: 3,
    titulo: 'Acondicionamiento',
    proposito:
      'Cierra las cutículas, desenreda y da brillo. Aporta suavidad y protección.',
    intencion: 'Sella el amor en cada hebra. Honrá la sabiduría de tu pelo.',
    consejos:
      'Usá el Acondicionador Pureza de medios a puntas. Dejá actuar 1-2 minutos y enjuagá.',
  },
  {
    num: 4,
    titulo: 'Nutrición y Equilibrio (Post-Lavado)',
    proposito:
      'Aporta activos específicos, equilibra el cuero cabelludo y sella las puntas.',
    intencion:
      'Mantené el equilibrio y la intención de vitalidad hasta el próximo lavado.',
    consejos:
      'Aplicá tu Sérum Capilar Ilumina, poné 2 o 3 gotas en las yemas de los dedos y aplicá en las puntas para sellar.',
  },
] as const

const ALQUIMIAS = [
  {
    id: 'normal',
    kitTitulo: 'Kit para Cabello Normal y Equilibrado',
    alquimiaTitulo: 'Tu Alquimia Vata: NutriciÃ³n y Brillo',
    descripcion: 'Vitalidad y fuerza diaria.',
    productos: ['SHAMPOO PUREZA', 'ACONDICIONADOR PUREZA'],
  },
  {
    id: 'seco',
    kitTitulo: 'Kit para Cabello Seco y Rizado',
    alquimiaTitulo: 'Tu Alquimia Vata: Definición y Control',
    descripcion: 'Definición, nutrición y brillo.',
    productos: [
      'ACONDICIONADOR ILUMINA',
      'SHAMPOO ILUMINA',
      'SERUM ILUMINA',
    ],
  },
  {
    id: 'graso',
    kitTitulo: 'Kit para Cabello Graso y Mixto',
    alquimiaTitulo: 'Tu Alquimia Kapha: Purificación y Ligereza',
    descripcion: 'Purificación y ligereza.',
    productos: ['SHAMPOO SERENA', 'ACONDICIONADOR PUREZA'],
  },
  {
    id: 'caida',
    kitTitulo: 'Kit para Condición: Caída del Cabello',
    alquimiaTitulo: 'Alquimia Fortalecedora (Raíz)',
    descripcion: 'Refuerza, calma y trata la raíz.',
    productos: [
      'SHAMPOO RAÍZ',
      'ACONDICIONADOR PUREZA',
      'TÓNICO RAÍZ',
    ],
  },
] as const

export default function CeremoniaCapilarPage() {
  return (
    <div className="ceremonia-capilar-page">
      <div className="ceremonia-capilar-bg" aria-hidden="true" />
      <main className="ceremonia-capilar-content">
        {/* Hero - pt-0 so MainTitleBg touches header */}
        <section className="px-4 pt-0 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-20">
          <h1 className="ceremonia-capilar-hero-title">
            <div className="ceremonia-capilar-hero-title-bg" aria-hidden="true" />
            <span className="ceremonia-capilar-hero-title-text">
              CEREMONIA CAPILAR
            </span>
          </h1>
          <h3 className="font-subtitle mt-4 text-center text-xl italic sm:text-2xl md:text-3xl ceremonia-capilar-hero-subtitle">
            El Cabello: Fortaleciendo la Raíz
          </h3>
        </section>

        {/* Paso a Paso */}
        <section className="px-4 pb-12 sm:px-6 sm:pb-16 md:px-8 md:pb-20 lg:px-12 lg:pb-24">
          <div className="mx-auto max-w-4xl space-y-12 md:space-y-16 lg:space-y-20">
            {PASOS.map((paso, stepIndex) => {
              const isEvenStep = stepIndex % 2 === 0
              const photoShapeClass = stepIndex % 2 === 0 ? 'ceremonia-capilar-foto-circle' : 'ceremonia-capilar-foto-leaf'
              const zigzag = {
                title: isEvenStep ? 'left' : 'right',
                proposito: isEvenStep ? 'right' : 'left',
                intencion: isEvenStep ? 'left' : 'right',
                consejos: isEvenStep ? 'right' : 'left',
                photo: isEvenStep ? 'right' : 'left',
              }
              return (
                <article
                  key={paso.num}
                  className="ceremonia-capilar-step-container ceremonia-capilar-mobile-card lg:bg-transparent lg:shadow-none lg:p-0"
                >
                  {/* Titulo Principal */}
                  <div
                    className="ceremonia-capilar-step-title"
                    data-zigzag={zigzag.title}
                  >
                    <div className="ceremonia-capilar-step-title-bg" aria-hidden="true" />
                    <h4 className="ceremonia-capilar-step-title-text">
                      {paso.num}. {paso.titulo}
                    </h4>
                  </div>

                  {/* PropÃ³sito y Beneficio */}
                  <div
                    className="ceremonia-capilar-block-title"
                    data-zigzag={zigzag.proposito}
                  >
                    <div className="ceremonia-capilar-block-title-bg" aria-hidden="true" />
                    <span className="ceremonia-capilar-block-title-text">
                      Propósito y Beneficio
                    </span>
                  </div>
                  <div
                    className="ceremonia-capilar-block-text"
                    data-zigzag={zigzag.proposito}
                  >
                    <div className="ceremonia-capilar-block-text-bg" aria-hidden="true" />
                    <p className="ceremonia-capilar-block-text-content">
                      {paso.proposito}
                    </p>
                  </div>

                  {/* IntenciÃ³n de la Ceremonia */}
                  <div
                    className="ceremonia-capilar-block-title"
                    data-zigzag={zigzag.intencion}
                  >
                    <div className="ceremonia-capilar-block-title-bg" aria-hidden="true" />
                    <span className="ceremonia-capilar-block-title-text">
                      Intención de la Ceremonia
                    </span>
                  </div>
                  <div
                    className="ceremonia-capilar-block-text"
                    data-zigzag={zigzag.intencion}
                  >
                    <div className="ceremonia-capilar-block-text-bg" aria-hidden="true" />
                    <p className="ceremonia-capilar-block-text-content">
                      {paso.intencion}
                    </p>
                  </div>

                  {/* Consejos de AplicaciÃ³n */}
                  <div
                    className="ceremonia-capilar-block-title"
                    data-zigzag={zigzag.consejos}
                  >
                    <div className="ceremonia-capilar-block-title-bg" aria-hidden="true" />
                    <span className="ceremonia-capilar-block-title-text">
                      Consejos de Aplicación
                    </span>
                  </div>
                  <div
                    className="ceremonia-capilar-block-text"
                    data-zigzag={zigzag.consejos}
                  >
                    <div className="ceremonia-capilar-block-text-bg" aria-hidden="true" />
                    <p className="ceremonia-capilar-block-text-content">
                      {paso.consejos}
                    </p>
                  </div>

                  {/* Foto del Paso Capilar */}
                  <div 
                    className={`ceremonia-capilar-photo-block ${photoShapeClass}`}
                    data-zigzag={zigzag.photo}
                  >
                    <img 
                      src={`/images/ceremonias/cap_step_${paso.num}.png`} 
                      alt={`Foto Capilar paso ${paso.num}`} 
                    />
                    {/* Wavy Line Decoration */}
                    <div className="ceremonia-wavy-decoration" aria-hidden="true">
                      <svg width="25" height="120" viewBox="0 0 25 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 12 0 C 30 20 0 40 12 60 C 30 80 0 100 12 120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Elegí tu Alquimia */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-20 md:px-8 md:pb-24 lg:px-12 lg:pb-32">
          <div className="ceremonia-capilar-alquimia-title">
            <div className="ceremonia-capilar-alquimia-title-bg" aria-hidden="true" />
            <h1 className="ceremonia-capilar-alquimia-title-text">
              ¡Elegí tu Alquimia!
            </h1>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
            {ALQUIMIAS.map((alq) => (
              <article
                key={alq.id}
                className="flex flex-col rounded-lg bg-white/90 p-6 shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg sm:p-8"
              >
                <h4 className="font-title mb-1 text-xl font-normal text-[var(--color-brand-primary)] sm:text-2xl">
                  {alq.kitTitulo}
                </h4>
                <p className="font-subtitle mb-3 text-sm italic text-[var(--color-text-primary)]">
                  {alq.alquimiaTitulo}
                </p>
                <p className="font-text mb-6 flex-1 text-base leading-relaxed text-[var(--color-text-primary)]">
                  {alq.descripcion}
                </p>
                <ul className="font-text mb-6 list-inside list-decimal space-y-1 text-base text-[var(--color-text-primary)]">
                  {alq.productos.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                <Link
                  href="/productos"
                  className="font-title inline-flex justify-center rounded-r-[15px] border-2 border-[var(--color-brand-primary)] bg-[var(--color-bg-light)] px-6 py-3 text-sm font-medium uppercase tracking-[1px] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2"
                >
                  ELEGÍ TU CEREMONIA!
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
