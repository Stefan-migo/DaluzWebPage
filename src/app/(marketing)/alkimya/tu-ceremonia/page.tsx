import { Metadata } from 'next'
import Link from 'next/link'
import './ceremonia.css'

export const metadata: Metadata = {
  title: 'Tu Ceremonia | ALKIMYA | DA LUZ CONSCIENTE',
  description: 'Rituales y ceremonias personalizadas para tu bienestar consciente.',
}

export default function TuCeremoniaPage() {
  return (
    <div className="ceremonia-page">

      {/* Intro Section */}
      <section className="ceremonia-intro-section">
        <div className="ceremonia-intro-header">
          <h1 className="ceremonia-intro-title">TU CEREMONIA DIARIA</h1>
        </div>

        <h2 className="ceremonia-intro-subtitle">
          ¡Transformá tu Rutina<br />en un Ritual Consciente!
        </h2>

        <div className="ceremonia-intro-card">
          <p className="ceremonia-intro-text">
            El cuidado personal es una extensión de tu bienestar interno.<br />
            En DA LUZ Alkimya, no solo aplicamos productos, creamos una Ceremonia
            para conectar la intención, el cuerpo y la mente.
          </p>
        </div>

        <div className="ceremonia-intro-card">
          <p className="ceremonia-intro-text">
            Antes de comenzar el paso a paso,<br />
            te invitamos a frenar y recordar que la coherencia en la rutina<br />
            no solo transforma la piel o el cabello; ancla la intención en tu materia.
          </p>
        </div>

        <div className="ceremonia-intro-buttons">
          <Link href="/alkimya/tu-ceremonia/ceremonia-facial" className="ceremonia-button">
            IR A CEREMONIA FACIAL
          </Link>
          <Link href="/alkimya/tu-ceremonia/ceremonia-capilar" className="ceremonia-button">
            IR A CEREMONIA CAPILAR
          </Link>
          <Link href="/alkimya/tu-ceremonia/ceremonia-corporal" className="ceremonia-button">
            IR A CEREMONIA CORPORAL
          </Link>
        </div>
      </section>



    </div>
  )
}
