'use client';

import { ActivosOrigenBackground } from '@/components/svg/SVGComponents'

export default function ActivosOrigenPage() {
  return (
    <section className="relative px-6 overflow-hidden flex flex-col section-activos-origen">
      {/* Background - Full section */}
      <ActivosOrigenBackground
        bgColor="#F6FBD6"
        className="opacity-100"
      />

      {/* Content Area - Flexible area for adding text and other elements */}
      <div className="relative z-10 flex-1 section-activos-origen-content">
        {/* Main Title */}
        <h1 className="activos-origen-text-element activos-origen-title">
          Activos y Origen
        </h1>

        {/* Subtitle */}
        <p className="activos-origen-text-element activos-origen-subtitle">
          Transparencia Total: Co-creá tu Bienestar
        </p>

        {/* Card with SVG background and text */}
        <div className="activos-origen-text-element activos-origen-main-card">
          <div className="activos-origen-main-card-bg"></div>
          <div className="activos-origen-main-card-content">
            <p className="activos-origen-main-card-text">
              En Da Luz, entendemos que toda Alquimia se sostiene en un pilar: la transparencia. Nuestro compromiso más profundo es que tengas conciencia plena del origen de lo que aplicas a tu cuerpo.
              <br /><br />
              Queremos que seas co-creadora de tu bienestar. Por eso, explorá el origen, el propósito y los beneficios de cada componente que elegimos para tu fórmula.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <button className="activos-origen-text-element activos-origen-button activos-origen-button-1">
          Plantas Medicinales: El Alma de la Tierra
        </button>

        <button className="activos-origen-text-element activos-origen-button activos-origen-button-2">
          Activos Cosméticos: La Ciencia al Servicio de la Alquimia
        </button>

        <button className="activos-origen-text-element activos-origen-button activos-origen-button-3">
          Lípidos y Ceras: El Escudo Nutritivo Natural
        </button>
      </div>
    </section>
  )
}

