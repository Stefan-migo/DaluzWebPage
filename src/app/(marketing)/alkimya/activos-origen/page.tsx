'use client';

import { ActivosOrigenBackground } from '@/components/svg/SVGComponents';
import Link from 'next/link';

export default function ActivosOrigenPage() {
  return (
    <div className="activos-origen-page">
      <ActivosOrigenBackground bgColor="#F6FBD6" className="opacity-100" />

      {/* Section 1 */}
      <section className="activos-origen-section">
        {/* H1 - Activos y Origen with AYOTitle.svg */}
        <div className="ayo-title-band">
          <h1 className="ayo-title-text">Activos y Origen</h1>
        </div>

        {/* H2 - La Arquitectura de nuestras Fórmulas with AYOband.svg */}
        <div className="ayo-band-section">
          <h2 className="ayo-band-title">La Arquitectura de nuestras Fórmulas</h2>
        </div>

        {/* Content */}
        <div className="activos-origen-content-wrap">
          <blockquote className="ayo-blockquote">
            <strong>Habitar la propia medicina es un acto de soberanía.</strong>
          </blockquote>
          <p className="ayo-paragraph">
            Diseñamos soluciones dermocosméticas donde la sabiduría botánica se encuentra con la biotecnología verde.
          </p>
          <p className="ayo-paragraph">
            Nuestras fórmulas son <strong>Alquimias Activas</strong> diseñadas para respetar la inteligencia biológica de tu piel y su microbiota, nutriendo el diálogo entre tu naturaleza y tu bienestar.
          </p>
          <p className="ayo-paragraph">
            En <strong>Da Luz</strong>, no solo te entregamos un producto; te entregamos una herramienta de autogestión. Creemos que cuando entendés qué aplicás y por qué lo hacés, la eficacia de la Alquimia se potencia.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="activos-origen-section">
        {/* H2 - Transparencia Total with AYOband.svg */}
        <div className="ayo-band-section">
          <h2 className="ayo-band-title">Transparencia Total: Co-creá tu Bienestar</h2>
        </div>

        {/* Card with existing content */}
        <div className="ayo-transparency-card">
          <p className="ayo-card-text">
            En Da Luz, entendemos que toda Alquimia se sostiene en un pilar: <strong>la transparencia</strong>. Nuestro compromiso más sólido es que tengas conciencia plena del origen de lo que aplicás a tu cuerpo.
          </p>
          <p className="ayo-card-text">
            Queremos que seas <strong>co-creadora de tu bienestar</strong>. Por eso, te invitamos a explorar el origen, el propósito y los beneficios de cada componente que elegimos para tu fórmula.
          </p>
        </div>

        {/* Bullet points */}
        <ul className="ayo-bullet-list">
          <li>
            <strong>Ciencia Verde y Eficacia:</strong> Utilizamos activos de alta pureza (como Niacinamida, Prebióticos y Ácidos suaves) para garantizar resultados visibles, evitando siempre parabenos, siliconas y aceites minerales.
          </li>
          <li>
            <strong>Respeto por la Microbiota:</strong> Cada producto incorpora prebióticos como Xylitol e Inulina para nutrir las bacterias benéficas que protegen tu barrera cutánea.
          </li>
          <li>
            <strong>Potencia Botánica:</strong> Trabajamos con aceites vegetales de primera prensada e hidrolatos puros que conservan el pulso vital de la tierra.
          </li>
        </ul>
      </section>

      {/* Section 3 - Cards */}
      <section className="activos-origen-section ayo-section-cards">
        <h2 className="ayo-section-title">CONOCIMIENTO Y SOBERANÍA</h2>
        <h3 className="ayo-section-subtitle">Te invitamos a explorar el corazón de nuestra medicina a través de los siguientes accesos:</h3>

        <div className="ayo-cards-grid">
          <div className="ayo-card">
            <h4 className="ayo-card-heading">1. CIENCIA VERDE</h4>
            <p className="ayo-card-desc">
              Descubrí nuestra clasificación técnica: desde el Corazón Botánico hasta la Pureza Clínica. Entendé el origen y el &quot;porqué&quot; de esos nombres que suelen asustar, pero que son el secreto de nuestra eficacia.
            </p>
            <Link href="#" className="ayo-card-button">
              CIENCIA VERDE
            </Link>
          </div>

          <div className="ayo-card">
            <h4 className="ayo-card-heading">2. SABER SEGURO: Guía de Uso Responsable</h4>
            <p className="ayo-card-desc">
              Para que tu experiencia sea 100% saludable, consultá nuestras recomendaciones sobre fotosensibilidad, embarazo y periodos de descanso de las plantas.
            </p>
            <Link href="#" className="ayo-card-button">
              GUÍA DE SEGURIDAD
            </Link>
          </div>

          <div className="ayo-card">
            <h4 className="ayo-card-heading">3. BITÁCORA DE MATERIA PRIMA</h4>
            <p className="ayo-card-desc">
              El mapa detallado de nuestro Botiquín Alquímico. Un espacio para conocer los beneficios específicos de cada planta, activo y escudo nutritivo según tu tipo de piel.
            </p>
            <Link href="#" className="ayo-card-button">
              ABRIR BITÁCORA
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ayo-footer">
        <p><strong>Gracias por elegir una cosmética con conciencia, por respetar tu microbiota y por confiar en la inteligencia de la naturaleza.</strong></p>
      </footer>
    </div>
  );
}
