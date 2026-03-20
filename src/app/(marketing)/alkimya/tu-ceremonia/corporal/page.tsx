import { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/ceremonia-corporal.css'

export const metadata: Metadata = {
  title: 'Ceremonia Corporal | ALKIMYA | DA LUZ CONSCIENTE',
  description:
    'Descubri­ tu ceremonia corporal. El cuerpo: sosten y descarga de la tension. Transforma tu rutina en un ritual consciente con DA LUZ Alkimya.',
}

const PASOS = [
  {
    num: 1,
    titulo: 'Limpieza y Renovacion',
    proposito:
      'Elimina impurezas del cuerpo. Prepara la piel para recibir la nutricion.',
    intencion:
      'Con el agua, flui, solta y renovate. Deja ir las cargas del dia.',
    consejos:
      'Usa el Gel Exfoliante ECOS 1 o 2 veces por semana, con movimientos circulares en seco.',
  },
  {
    num: 2,
    titulo: 'Alivio Específico',
    proposito:
      'Brinda sensación inmediata de bienestar y calma la inflamación (Dolor, hinchazón, calor).',
    intencion: 'Sella la intención y la protección del cuerpo.',
    consejos:
      'Aplicá el Gel Susurro sobre zonas de tensión o piernas cansadas, masajeando hasta su absorción.',
  },
  {
    num: 3,
    titulo: 'Hidratación y Calma',
    proposito:
      'Sella la humedad, restaura la barrera lipídica y calma condiciones como el picor.',
    intencion: 'Acompañá la piel con amor y nutrición después del baño.',
    consejos:
      'Usa la Crema Corporal Pureza diariamente después de la ducha. Aplicar con masaje ascendente sobre la piel ligeramente húmeda.',
  },
] as const

const KIT_CORPORAL = {
  titulo: 'Kit Corporal',
  subtitulo: 'El Ritual del Cuerpo: Conexion y Bienestar Diario',
  descripcion:
    'La piel corporal merece la misma atencion consciente. Este kit es la Alquimia perfecta para renovar, aliviar y nutrir tu cuerpo de pies a cabeza. Un ritual de detox, calma y tonificacion.',
  productos: [
    'GEL EXFOLIANTE',
    'PASTA DENTAL',
    'CREMA CORPORAL PUREZA',
    'GEL FRIO SUSURRO',
  ],
} as const

export default function CeremoniaCorporalPage() {
  return (
    <div className="ceremonia-corporal-page">
      <div className="ceremonia-corporal-bg" aria-hidden="true" />
      <main className="ceremonia-corporal-content">
        {/* Hero - pt-0 so MainTitleBg touches header */}
        <section className="px-4 pt-0 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-20">
          <h1 className="ceremonia-corporal-hero-title">
            <div className="ceremonia-corporal-hero-title-bg" aria-hidden="true" />
            <span className="ceremonia-corporal-hero-title-text">
              CEREMONIA CORPORAL
            </span>
          </h1>
          <h3 className="font-subtitle mt-4 text-center text-xl italic sm:text-2xl md:text-3xl ceremonia-corporal-hero-subtitle">
            El Cuerpo: Sostén y Descarga de la Tensión
          </h3>
        </section>

        {/* Paso a Paso */}
        <section className="px-4 pb-12 sm:px-6 sm:pb-16 md:px-8 md:pb-20 lg:px-12 lg:pb-24">
          <div className="mx-auto max-w-4xl space-y-12 md:space-y-16 lg:space-y-20">
            {PASOS.map((paso, stepIndex) => {
              const isEvenStep = stepIndex % 2 === 0
              const photoShapeClass = stepIndex % 2 === 0 ? 'ceremonia-corporal-foto-circle' : 'ceremonia-corporal-foto-leaf'
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
                  className="ceremonia-corporal-step-container ceremonia-corporal-mobile-card lg:bg-transparent lg:shadow-none lg:p-0"
                >
                  {/* Titulo Principal */}
                  <div
                    className="ceremonia-corporal-step-title"
                    data-zigzag={zigzag.title}
                  >
                    <div className="ceremonia-corporal-step-title-bg" aria-hidden="true" />
                    <h4 className="ceremonia-corporal-step-title-text">
                      {paso.num}. {paso.titulo}
                    </h4>
                  </div>

                  {/* PropÃ³sito y Beneficio */}
                  <div
                    className="ceremonia-corporal-block-title"
                    data-zigzag={zigzag.proposito}
                  >
                    <div className="ceremonia-corporal-block-title-bg" aria-hidden="true" />
                    <span className="ceremonia-corporal-block-title-text">
                      Propósito y Beneficio
                    </span>
                  </div>
                  <div
                    className="ceremonia-corporal-block-text"
                    data-zigzag={zigzag.proposito}
                  >
                    <div className="ceremonia-corporal-block-text-bg" aria-hidden="true" />
                    <p className="ceremonia-corporal-block-text-content">
                      {paso.proposito}
                    </p>
                  </div>

                  {/* IntenciÃ³n de la Ceremonia */}
                  <div
                    className="ceremonia-corporal-block-title"
                    data-zigzag={zigzag.intencion}
                  >
                    <div className="ceremonia-corporal-block-title-bg" aria-hidden="true" />
                    <span className="ceremonia-corporal-block-title-text">
                      Intención de la Ceremonia
                    </span>
                  </div>
                  <div
                    className="ceremonia-corporal-block-text"
                    data-zigzag={zigzag.intencion}
                  >
                    <div className="ceremonia-corporal-block-text-bg" aria-hidden="true" />
                    <p className="ceremonia-corporal-block-text-content">
                      {paso.intencion}
                    </p>
                  </div>

                  {/* Consejos de AplicaciÃ³n */}
                  <div
                    className="ceremonia-corporal-block-title"
                    data-zigzag={zigzag.consejos}
                  >
                    <div className="ceremonia-corporal-block-title-bg" aria-hidden="true" />
                    <span className="ceremonia-corporal-block-title-text">
                      Consejos de Aplicación
                    </span>
                  </div>
                  <div
                    className="ceremonia-corporal-block-text"
                    data-zigzag={zigzag.consejos}
                  >
                    <div className="ceremonia-corporal-block-text-bg" aria-hidden="true" />
                    <p className="ceremonia-corporal-block-text-content">
                      {paso.consejos}
                    </p>
                  </div>

                  {/* Foto del Paso Corporal */}
                  <div
                    className={`ceremonia-corporal-photo-block ${photoShapeClass}`}
                    data-zigzag={zigzag.photo}
                  >
                    <img
                      src={`/images/ceremonias/corp_step_${paso.num}.png`}
                      alt={`Foto Corporal paso ${paso.num}`}
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

        {/* ElegÃ­ tu Alquimia - Kit Corporal */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-20 md:px-8 md:pb-24 lg:px-12 lg:pb-32">
          <div className="ceremonia-corporal-alquimia-title">
            <div className="ceremonia-corporal-alquimia-title-bg" aria-hidden="true" />
            <h1 className="ceremonia-corporal-alquimia-title-text">
              Elegí tu Alquimia!
            </h1>
          </div>

          <article className="mx-auto max-w-2xl rounded-lg bg-white/90 p-6 shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg sm:p-8">
            <h4 className="font-title mb-2 text-xl font-normal text-[var(--color-brand-primary)] sm:text-2xl">
              {KIT_CORPORAL.titulo}
            </h4>
            <p className="font-subtitle mb-4 text-base font-medium italic text-[var(--color-text-primary)]">
              {KIT_CORPORAL.subtitulo}
            </p>
            <p className="font-text mb-6 text-base leading-relaxed text-[var(--color-text-primary)]">
              {KIT_CORPORAL.descripcion}
            </p>
            <ul className="font-text mb-6 list-inside list-decimal space-y-1 text-base text-[var(--color-text-primary)]">
              {KIT_CORPORAL.productos.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <Link
              href="/productos"
              className="font-title inline-flex w-full justify-center rounded-r-[15px] border-2 border-[var(--color-brand-primary)] bg-[var(--color-bg-light)] px-6 py-3 text-sm font-medium uppercase tracking-[1px] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 sm:w-auto"
            >
              ELEGÍ TU CEREMONIA! | KIT CORPORAL
            </Link>
          </article>
        </section>
      </main>
    </div>
  )
}
