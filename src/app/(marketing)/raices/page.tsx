import { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/raices-filosofia.css'

export const metadata: Metadata = {
  title: 'Raíces | Filosofía y Propósito | DA LUZ CONSCIENTE',
  description: 'Filosofía, propósito y los 4 pilares de DA LUZ CONSCIENTE. Naturaleza, visión integral, ceremonia y placer.',
}

const PROCESOS_WRAPPER = 'raices-filosofia-pages raices-page'

export default function RaicesPage() {
  return (
    <div className={PROCESOS_WRAPPER}>
      <div className="raices-page-container">
        {/* Background */}
        <div className="raices-page-bg raices-bg-general" aria-hidden />

        {/* Desktop only (>= 1024px) - SVG backgrounds, absolute positioning */}
        <div className="raices-hero-desktop-only">
          <section className="raices-header-band raices-title-band" aria-labelledby="raices-title">
            <div className="raices-header-band-inner">
              <h1 id="raices-title" className="raices-band-title raices-band-title-deep">
                RAÍCES DA LUZ
              </h1>
            </div>
          </section>
          <p className="raices-band-subtitle raices-band-subtitle-white">FILOSOFÍA Y PROPÓSITO</p>
          <section className="raices-main-text-section">
            <p className="raices-intro raices-intro-deep raices-intro-1">
              <em>La vida se transforma cuando cada acción se convierte en un acto sagrado de atención y amor incondicional.</em>
            </p>
            <p className="raices-intro raices-intro-deep raices-intro-2">
              <strong>DA LUZ CONSCIENTE ES UNA INVITACIÓN</strong> a nutrir integralmente tu cuerpo, tus emociones, tu mente y tu espíritu. No somos una solución instantánea; somos el puente para quienes se comprometen a escuchar su propio pulso, a habitar la pausa y a comprender la salud como un proceso de autogestión y soberanía.
            </p>
            <p className="raices-intro raices-intro-deep raices-intro-3">
              Deseamos que nutrir tu Ser se convierta en un ritual diario donde la Presencia, la gratitud y el goce acompañen cada uno de tus pasos.
            </p>
            <p className="raices-intro raices-intro-deep raices-intro-4">
              Nuestro propósito es acompañarte a construir un equilibrio integral y autogestionado.{' '}
              <strong>Te invitamos a sumergirte en un viaje alquímico hacia tu interior, donde tu cuerpo es tratado como un templo.</strong>
            </p>
            <div className="raices-small-quote-wrap">
              <p className="raices-small-quote-text">Acá, la pausa es un acto sagrado.</p>
            </div>
          </section>
        </div>

        {/* Mobile/Tablet only (< 1024px) - Simple stacked layout, no SVGs */}
        <div className="raices-hero-mobile-only">
          <section className="raices-header-band raices-hero-mobile-band" aria-labelledby="raices-title-mobile">
            <div className="raices-header-band-inner">
              <h1 id="raices-title-mobile" className="raices-band-title">RAÍCES DA LUZ</h1>
              <p className="raices-band-subtitle">FILOSOFÍA Y PROPÓSITO</p>
            </div>
          </section>
          <div className="raices-content raices-hero-mobile-content">
            <p className="raices-intro">
              <em>La vida se transforma cuando cada acción se convierte en un acto sagrado de atención y amor incondicional.</em>
            </p>
            <p className="raices-intro">
              <strong>DA LUZ CONSCIENTE ES UNA INVITACIÓN</strong> a nutrir integralmente tu cuerpo, tus emociones, tu mente y tu espíritu. No somos una solución instantánea; somos el puente para quienes se comprometen a escuchar su propio pulso, a habitar la pausa y a comprender la salud como un proceso de autogestión y soberanía.
            </p>
            <p className="raices-intro">
              Deseamos que nutrir tu Ser se convierta en un ritual diario donde la Presencia, la gratitud y el goce acompañen cada uno de tus pasos.
            </p>
            <blockquote className="raices-quote">
              Acá, la pausa es un acto sagrado.
            </blockquote>
            <p className="raices-intro">
              Nuestro propósito es acompañarte a construir un equilibrio integral y autogestionado.{' '}
              <strong>Te invitamos a sumergirte en un viaje alquímico hacia tu interior, donde tu cuerpo es tratado como un templo.</strong>
            </p>
          </div>
        </div>

        {/* Main content - Pilares and CTA */}
        <div className="raices-content">

          {/* Los 4 Pilares */}
          <h2 className="pilares-section-title">LOS 4 PILARES DA LUZ</h2>
          <p className="pilares-section-subtitle">
            Viví en Presencia. Creá con Placer. Honrá tus Raíces.
          </p>

          <div className="raices-pilares-grid">
            <article className="raices-card">
              <h3 className="raices-card-title">1. Naturaleza y Ancestralidad</h3>
              <p>
                En Da Luz, todo lo que ofrecemos está intrínsecamente conectado con la sabiduría de la Madre Tierra, las hierbas medicinales, y las técnicas ancestrales de sanación y cuidado.
              </p>
              <p>
                Creemos profundamente que estas herramientas primales son esenciales en la actualidad para recuperar nuestro equilibrio y reconectar con el Ritmo natural de nuestro Ser.
              </p>
              <p>
                <strong>Compromiso Ecológico, Vegano y Sostenible:</strong> Utilizamos insumos Libres de Parabenos, Ftalatos, disruptores endocrinos y sustancias contaminantes que puedan afectar el planeta, los animales, el agua o nuestros propios cuerpos.
              </p>
              <p className="raices-card-subtitle">
                <em>Te invitamos a Reconocer tus raíces, para nutrir tus frutos.</em>
              </p>
            </article>

            <article className="raices-card">
              <h3 className="raices-card-title">2. Visión Integral y Autogestión</h3>
              <p>
                Entendemos que el equilibrio no solo deviene de la atención al cuerpo físico, sino también a tus emociones, pensamientos y energía.
              </p>
              <p>
                <strong>La Soberanía de los Cuerpos:</strong> La consciencia de que somos seres integrales nos da acceso a la autogestión de nuestra salud.
              </p>
              <p>
                Por eso, todas nuestras propuestas son creadas con conciencia de las diversas bio-individualidades. Así también ofrecemos un sendero práctico para que aprendas acuerpar la información y transformarla en herramientas de gestión propia.
              </p>
              <p>
                <strong>El Nuevo Paradigma:</strong> Inspirados en la Ayurveda, Medicina China y Sabiduría Floral, impulsamos el paso del estado de &quot;supervivencia&quot; al de &quot;soberanía activa&quot;.
              </p>
            </article>

            <article className="raices-card">
              <h3 className="raices-card-title">3. Ceremonia y Presencia</h3>
              <p className="raices-card-subtitle">
                <strong>La Magia de lo Cotidiano.</strong>
              </p>
              <p>
                En Da Luz, te invitamos a vivir una Ceremonia diaria. Es un llamado a la presencia, a habitar nuestros cuerpos y a conectar con nuestros sentidos de manera consciente.
              </p>
              <p>
                <strong>Cada producto es un portal para habitar tus sentidos, utilizando tu voz y tu cuerpo como herramientas principales de regulación.</strong>
              </p>
              <p>
                <strong>Convertí lo Cotidiano en Ritual:</strong> Un gran portal transformador y gozoso que te transporta hacia un mayor estado de Presencia.
              </p>
              <p>
                <strong>Recursos:</strong> Acceso a ejercicios prácticos y herramientas somáticas diseñadas para elevar la rutina al plano de lo sagrado.
              </p>
            </article>

            <article className="raices-card">
              <h3 className="raices-card-title">4. Placer y Creatividad</h3>
              <p className="raices-card-subtitle">
                <strong>Crear desde el placer es nuestro mantra.</strong>
              </p>
              <p>
                Te proponemos que explorés nuevas formas de vincularte con tus cuerpos y procesos, en conexión con tus sentidos y sensaciones.
              </p>
              <p>
                <strong>El goce no es un lujo, es la puerta de entrada a tu verdadero poder creador.</strong>
              </p>
              <p>
                Cada propuesta es una invitación a encontrar el goce y el asombro en los pequeños detalles, <strong>elevando el acto de cuidarnos a un plano sagrado.</strong>
              </p>
              <p>
                Hackeamos la resistencia a través del disfrute de lo suave, lo sutil y lo profundo, reconectando con tus aguas internas y tu sacralidad.
              </p>
            </article>
          </div>

          {/* CTA */}
          <section className="raices-cta-section">
            <p className="raices-cta-text">
              Tu bienestar empieza hoy, reconociendo tu esencia.
            </p>
            <Link href="/alkimya/biotipos-doshas" className="raices-cta-button">
              ¡DESCUBRÍ TU BIOTIPO AHORA!
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
