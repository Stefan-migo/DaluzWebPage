import { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/raices-filosofia.css'

export const metadata: Metadata = {
  title: 'Filosofía y Propósito | La Alquimista | DA LUZ CONSCIENTE',
  description: 'La alquimista y creadora detrás de Da Luz Consciente. De la sombra a la alkimia viva, formación holística y propósito.',
}

const WRAPPER = 'raices-filosofia-pages'

const FORMACIONES = [
  'Eneagrama y Epigenetica',
  'Reiki Usui (Niveles 1, 2, 3 y Master)',
  'Reiki Karuna (Niveles 1 y 2)',
  'Flores de Bach',
  'Fitoterapia (Medicina Herbal)',
  'Gemoterapia',
  'Química Cosmética',
  'Formulación Cosmética Avanzada',
  'Aromaterapia',
  'Chamanismo Universal',
  'Salud Hormonal',
]

const SABERES = [
  'Cuencos Sonoros',
  'Péndulo Evolutivo',
  'Canto Medicina',
  'Astrología',
  'Danza Primal, Danza Matriz, Danza Butoh',
  'Ciclicidad Lunar-Menstrual',
  'Ayurveda',
  'Numerología',
  'Nutrición Antiinflamatoria',
  'Psicología UNC',
]

export default function FilosofiaPropositoPage() {
  return (
    <div className={WRAPPER}>
      <div className="raices-page-container">
        {/* Background */}
        <div className="raices-page-bg raices-bg-general" aria-hidden />

        {/* Mobile/Tablet Hero - visible < 1024px */}
        <section className="raices-header-band raices-hero-mobile" aria-labelledby="filosofia-title">
          <div className="raices-header-band-inner">
            <h1 id="filosofia-title" className="raices-band-title">
              La Alquimista y Creadora Detrás de Da Luz
          </h1>
          </div>
        </section>
        <div className="raices-content raices-hero-mobile">
          <p className="raices-intro">
            ¡Hola! Soy la alquimista, terapeuta holística y creadora detrás de Da Luz Consciente. Siento profundamente la vocación de servir a la Nueva Humanidad, impulsando la presencia, la consciencia de unidad, el amor y el coraje para habitar y crear en la Tierra.
          </p>
        </div>

        {/* Desktop Hero - visible >= 1024px only */}
        <section className="raices-hero-desktop" aria-labelledby="filosofia-hero-title">
          <div className="raices-hero-desktop-grid">
            <div className="raices-hero-desktop-left">
              <div className="raices-hero-title-wrap">
                <h1 id="filosofia-hero-title" className="raices-hero-title">
                  La Alquimista y Creadora Detrás de Da Luz
                </h1>
              </div>
              <div className="raices-hero-arrow" aria-hidden>
                <img src="/svg/filosofia/filo/arrowDown.svg" alt="" className="raices-hero-arrow-svg" />
              </div>
              <div className="raices-hero-paragraph-wrap">
                <p className="raices-hero-paragraph">
                  ¡Hola! Soy la alquimista, terapeuta holística y creadora detrás de Da Luz Consciente. Siento profundamente la vocación de servir a la Nueva Humanidad, impulsando la presencia, la consciencia de unidad, el amor y el coraje para habitar y crear en la Tierra.
                </p>
                <div className="raices-hero-underline" aria-hidden>
                  <img src="/svg/filosofia/filo/UnderLine.svg" alt="" className="raices-hero-underline-svg" />
                </div>
              </div>
            </div>
            <div className="raices-hero-desktop-right">
              <div className="raices-hero-image-placeholder">
                <div className="raices-hero-image-circle">
                  <span className="raices-hero-placeholder-text">Imagen</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* De la Sombra - Mobile/Tablet (original band) */}
        <section className="raices-section-band filo-mobile-only" aria-labelledby="sombra-title-mobile">
          <div className="raices-section-band-inner">
            <h2 id="sombra-title-mobile" className="raices-section-band-title">
              De la Sombra a la Alkimia Viva: El Viaje
            </h2>
          </div>
        </section>
        {/* De la Sombra - Desktop (TitleCard bg, centered) */}
        <div className="filo-desktop-only filo-section-title-desktop">
          <div className="filo-section-title-wrap">
            <div className="filo-section-title-bg" aria-hidden>
              <img src="/svg/filosofia/filo/TitleCard.svg" alt="" className="filo-section-title-card" />
            </div>
            <h2 id="sombra-title" className="filo-section-title-text">
              De la Sombra a la Alkimia Viva: El Viaje
            </h2>
          </div>
        </div>
        <div className="raices-content">
          <article className="raices-card raices-section-card">
            <p>
              El origen de Da Luz surge de una transformación genuina. El origen de Da Luz nace de una transformación genuina. He transitado el victimismo, la disociación y la incoherencia, manifestados en somatizaciones físicas que mi cuerpo ya no podía ignorar.
            </p>
            <p>
              Ese dolor fue el combustible de mi curiosidad: necesitaba entender mi Ser para cooperar, primero, con mi propia sanación.
            </p>
            <p>
              Mi pulso fue siempre el mismo: entender y ayudar a mi Ser para después poder cooperar con la Humanidad.
            </p>
            <p>
              Por ello, inicié con Psicología en la UNC. Fascinada con la información, pero con deseos de más, empecé a formarme paralelamente en diversos saberes integrales y fui explorando en mi propio cuerpo cada herramienta, asombrada por cómo la transformación interna operaba efectivamente en mi exterior.
            </p>
          </article>
        </div>

        {/* El Cuerpo - Mobile/Tablet (original band) */}
        <section className="raices-section-band filo-mobile-only" aria-labelledby="cuerpo-title-mobile">
          <div className="raices-section-band-inner">
            <h2 id="cuerpo-title-mobile" className="raices-section-band-title">
              El Cuerpo como Laboratorio
            </h2>
          </div>
        </section>
        {/* El Cuerpo - Desktop (title without bg band) */}
        <div className="filo-desktop-only filo-section-title-desktop filo-section-title-nobg">
          <h2 id="cuerpo-title" className="filo-section-title-plain">
            El Cuerpo como Laboratorio
          </h2>
        </div>
        <div className="raices-content">
          <article className="raices-card raices-section-card">
            <p>
              Me enamoré por completo de la autogestión y seguí estudiando ya no solo al Ser, sino también a todo aquello que nos afecta por cercanía: la alimentación, la cosmética, las plantas.
            </p>
            <p>
              Vivencié mi propia sanación de colon irritable y dolor crónico con medicina herbal y me enamoré de este mundo. Empecé a formular mis propios cosméticos, y en el proceso de explorarlos descubrí que estaban siendo un canal hermoso a través del cual no solo me nutría, sino que también me conectaba con mi placer y sensibilidad, forzando un vínculo más consciente.
            </p>
            <p>
              Al experimentar cómo el auto-amor y la escucha activa de mis cuerpos me hacían sentir en mayor armonía, nació el deseo ineludible de compartirlo.
            </p>
            <p>
              Tras un proceso de repliegue y transmutación —donde dejé atrás el miedo a la &quot;intensidad&quot; de mi propuesta— permití que naciera mi deseo primal: <strong>crear un puente tangible que uniera el ritual interno con el cuidado externo.</strong>
            </p>
          </article>

          {/* Quote - Mobile/Tablet: original oval */}
          <div className="raices-oval-quote filo-mobile-only">
            ¡Y así nació Da Luz Consciente + Alkimya Da Luz! Para que le demos luz a nuestras sensaciones conectándonos con la magia y el goce de la Vida.
          </div>
          {/* Quote - Desktop: CircularCardBorder.svg background */}
          <div className="filo-desktop-only filo-circular-quote-wrap">
            <div className="filo-circular-quote-bg" aria-hidden>
              <img src="/svg/filosofia/filo/CircularCardBorder.svg" alt="" className="filo-circular-quote-svg" />
            </div>
            <p className="filo-circular-quote-text">
              ¡Y así nació Da Luz Consciente + Alkimya Da Luz! Para que le demos luz a nuestras sensaciones conectándonos con la magia y el goce de la Vida.
            </p>
          </div>
        </div>

        {/* Mi Caja de Herramientas - Title band (full width) */}
        <section className="raices-section-band" aria-labelledby="herramientas-title">
          <div className="raices-section-band-inner">
            <h2 id="herramientas-title" className="raices-section-band-title">
              Mi Caja de Herramientas: Formación y Saberes
            </h2>
          </div>
        </section>
        <div className="raices-content">
          {/* Intro text outside card */}
          <p className="raices-intro" style={{ marginBottom: '1rem' }}>
            Mi recorrido hacia el bioequilibrio integrando todos nuestros cuerpos será eterno, esa es mi certeza. Soy una aficionada a explorar las tecnologías de nuestros cuerpos, de habitarme para conocerme, así como también de adquirir herramientas y conocimientos teóricos para ir probando, corroborando y aprendiendo a gestionar mis propios recursos.
          </p>
          <p className="raices-intro" style={{ marginBottom: '1.5rem' }}>
            He explorado diversas disciplinas que son la base de los acompañamientos que brindo:
          </p>

          {/* 2 cards: Formaciones | Saberes */}
          <div className="raices-herramientas-grid">
            <div className="raices-herramientas-col">
              <h3 className="raices-herramientas-col-title-bordered">FORMACIONES</h3>
              <article className="raices-card">
                <ul className="raices-list">
                  {FORMACIONES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
            <div className="raices-herramientas-col">
              <h3 className="raices-herramientas-col-title-bordered">SABERES Y TALLERES</h3>
              <article className="raices-card">
                <ul className="raices-list">
                  {SABERES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </div>

        {/* El Propósito Final - Title band (full width) */}
        <section className="raices-section-band" aria-labelledby="proposito-title">
          <div className="raices-section-band-inner">
            <h2 id="proposito-title" className="raices-section-band-title">
              El Propósito Final: La Autogestión Consciente
            </h2>
          </div>
        </section>
        <div className="raices-content">
          <article className="raices-card raices-section-card">
            <p>
              Mi deseo es que expandas tu autogestión. Integramos la alquimia botánica con la tecnología del autoconocimiento para que recuperes tu equilibrio.
            </p>
            <p>
              <strong>Esta es tu comunidad si buscás:</strong>
            </p>
            <ul className="raices-list">
              <li><strong>Tu Ceremonia:</strong> Diagnósticos de Biotipo y rutinas de presencia.</li>
              <li><strong>Transparencia:</strong> Materia prima consciente y trazabilidad total.</li>
              <li><strong>Membresía:</strong> Un espacio de crecimiento, herramientas somáticas y Tesoros Da Luz.</li>
              <li><strong>Procesos Holísticos:</strong> Acompañamiento personalizado para acuerpar tu transformación.</li>
            </ul>
            <p>
              Te invito a dar el primer paso para crear desde la vitalidad y el coraje.
            </p>
          </article>
        </div>

        {/* CTAs outside card */}
        <section className="raices-cta-standalone">
          <div className="raices-cta-buttons">
            <Link href="/servicios/procesos/sesiones-integrales" className="raices-cta-button">
              SESIONES
            </Link>
            <Link href="/productos" className="raices-cta-button">
              TIENDA
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
