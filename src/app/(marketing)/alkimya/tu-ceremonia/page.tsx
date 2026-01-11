import { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/tu-ceremonia.css'

export const metadata: Metadata = {
  title: 'Tu Ceremonia | ALKIMYA | DA LUZ CONSCIENTE',
  description: 'Transformá tu rutina en un ritual consciente. Conoce tu ceremonia diaria con DA LUZ Alkimya.',
}

export default function TuCeremoniaPage() {
  return (
    <div className="tu-ceremonia-page">
      {/* SVG Background */}
      <div className="tu-ceremonia-bg-container">
        <img
          src="/svg/ceremonias/TuCeremoniaPagebg2.svg"
          alt="Tu Ceremonia Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            minHeight: '100%',
            minWidth: '100%',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      </div>

      {/* Page Content */}
      <div className="tu-ceremonia-content">
        {/* Main Title */}
        <h1 className="tu-ceremonia-main-title">
          CONOCE TU CEREMONIA DIARIA
        </h1>

        {/* Secondary Title */}
        <h2 className="tu-ceremonia-secondary-title">
          ¡Transformá tu Rutina en un Ritual Consciente!
        </h2>

        {/* Text Card 1 */}
        <div className="tu-ceremonia-text-card tu-ceremonia-text-card-1">
          <div className="tu-ceremonia-text-card-bg"></div>
          <div className="tu-ceremonia-text-card-content">
            <p className="tu-ceremonia-text-card-text">
              El cuidado personal es una extensión de tu bienestar interno. En DA LUZ Alkimya, no solo aplicamos productos, creamos una Ceremonia para conectar la intención, el cuerpo y la mente.
            </p>
          </div>
        </div>

        {/* Text Card 2 */}
        <div className="tu-ceremonia-text-card tu-ceremonia-text-card-2">
          <div className="tu-ceremonia-text-card-bg"></div>
          <div className="tu-ceremonia-text-card-content">
            <p className="tu-ceremonia-text-card-text">
              Tu ritual diario es un acto sagrado de autoconciencia. 
              <br /><br />
              Antes de comenzar el paso a paso, te invitamos a detenerte y recordar que la coherencia en la rutina no solo transforma la piel o el cabello; ancla la intención en tu materia.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="tu-ceremonia-buttons">
          <Link href="/alkimya/tu-ceremonia/facial" className="tu-ceremonia-button tu-ceremonia-button-1">
            IR A CEREMONIA FACIAL
          </Link>
          <Link href="/alkimya/tu-ceremonia/capilar" className="tu-ceremonia-button tu-ceremonia-button-2">
            IR A CEREMONIA CAPILAR
          </Link>
          <Link href="/alkimya/tu-ceremonia/corporal" className="tu-ceremonia-button tu-ceremonia-button-3">
            IR A CEREMONIA CORPORAL
          </Link>
        </div>
      </div>
    </div>
  )
}

