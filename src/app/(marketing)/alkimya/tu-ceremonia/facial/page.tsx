import { Metadata } from 'next'
import '@/styles/ceremonia-facial.css'

export const metadata: Metadata = {
  title: 'Ceremonia Facial | ALKIMYA | DA LUZ CONSCIENTE',
  description: 'Descubrí tu ceremonia facial diaria. Transformá tu rutina de cuidado facial en un ritual consciente con DA LUZ Alkimya.',
}

export default function CeremoniaFacialPage() {
  return (
    <div className="ceremonia-facial-page">
      {/* Section 1 */}
      <section className="section-ceremonia-facial-1">
        {/* SVG Background */}
        <div className="section-ceremonia-facial-1-bg-container">
          <img
            src="/svg/ceremonias/CeremeniSection1bg.svg"
            alt="Ceremonia Facial Background"
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

        {/* Section 1 Content */}
        <div className="section-ceremonia-facial-1-content">
          {/* Main Title */}
          <h1 className="ceremonia-facial-section1-main-title">
            <div className="ceremonia-facial-section1-main-title-bg"></div>
            <span className="ceremonia-facial-section1-main-title-text">Ceremonia Facial</span>
          </h1>

          {/* Secondary Title */}
          <h2 className="ceremonia-facial-section1-secondary-title">
            El Rostro: Activación del Escudo Protector
          </h2>

          {/* Section Title */}
          <h3 className="ceremonia-facial-section1-section-title">
            <div className="ceremonia-facial-section1-section-title-bg"></div>
            <span className="ceremonia-facial-section1-section-title-text">1. Limpieza facial</span>
          </h3>

          {/* Left Column - Texts */}
          <div className="ceremonia-facial-section1-left-column">
            {/* Text 1 */}
            <div className="ceremonia-facial-section1-text1">
              <div className="ceremonia-facial-section1-text1-bg"></div>
              <div className="ceremonia-facial-section1-text1-content">
                <p className="ceremonia-facial-section1-text1-text">Propósito y Beneficio</p>
              </div>
            </div>

            {/* Text 2 */}
            <div className="ceremonia-facial-section1-text2">
              <div className="ceremonia-facial-section1-text2-bg"></div>
              <div className="ceremonia-facial-section1-text2-content">
                <p className="ceremonia-facial-section1-text2-text">
                  Elimina suciedad, sebo, maquillaje, células muertas y toxinas. Prepara la piel para tratamientos posteriores. Previene la obstrucción de poros, optimiza la regeneración celular y devuelve luminosidad.
                </p>
              </div>
            </div>

            {/* Text 3 */}
            <div className="ceremonia-facial-section1-text3">
              <div className="ceremonia-facial-section1-text3-bg"></div>
              <div className="ceremonia-facial-section1-text3-content">
                <p className="ceremonia-facial-section1-text3-text">
                  Con el agua, liberá la piel de lo que ya no necesita y conectate con la pureza para recibir el nuevo día o la noche.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="ceremonia-facial-section1-right-column">
            <div className="ceremonia-facial-section1-image">
              <img
                src="/svg/ceremonias/Sectio1Image.svg"
                alt="Ceremonia Facial"
                className="ceremonia-facial-section1-image-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="section-ceremonia-facial-2">
        {/* SVG Background */}
        <div className="section-ceremonia-facial-2-bg-container">
          <img
            src="/svg/ceremonias/Section2BgCeremoniaFacial.svg"
            alt="Ceremonia Facial Section 2 Background"
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

        {/* Section 2 Content */}
        <div className="section-ceremonia-facial-2-content">
          {/* Section Title */}
          <h3 className="ceremonia-facial-section2-section-title">
            <div className="ceremonia-facial-section2-section-title-bg"></div>
            <span className="ceremonia-facial-section2-section-title-text">Consejos de Aplicación</span>
          </h3>

          {/* Left Column */}
          <div className="ceremonia-facial-section2-left-column">
            {/* Text 1 */}
            <div className="ceremonia-facial-section2-text1">
              <div className="ceremonia-facial-section2-text1-bg"></div>
              <div className="ceremonia-facial-section2-text1-content">
                <p className="ceremonia-facial-section2-text1-text">Noche: Fundamental para retirar la suciedad acumulada.</p>
              </div>
            </div>

            {/* Text 2 */}
            <div className="ceremonia-facial-section2-text2">
              <div className="ceremonia-facial-section2-text2-bg"></div>
              <div className="ceremonia-facial-section2-text2-content">
                <p className="ceremonia-facial-section2-text2-text">Mañana: Para limpiar el exceso de grasa producido durante la noche y los desechos celulares nocturnos.</p>
              </div>
            </div>

            {/* Text 3 */}
            <div className="ceremonia-facial-section2-text3">
              <p className="ceremonia-facial-section2-text3-text">
                Usá tu Agua Micelar para desmaquillar y tu Limpiador Facial en Gel como segundo paso.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="ceremonia-facial-section2-right-column">
            {/* Text 4 */}
            <div className="ceremonia-facial-section2-text4">
              <p className="ceremonia-facial-section2-text4-text">Temperatura del Agua:</p>
            </div>

            {/* Text 5 */}
            <div className="ceremonia-facial-section2-text5">
              <div className="ceremonia-facial-section2-text5-bg"></div>
              <div className="ceremonia-facial-section2-text5-content">
                <p className="ceremonia-facial-section2-text5-text">
                  Agua Fría: Ayuda a cerrar los poros, estimula la circulación, ayuda a eliminar toxinas y tonificar la piel, y reduce la hinchazón. Evitar Agua Caliente: Deshidrata, elimina aceites naturales, causa sequedad, mayor producción de sebo, rojeces, irritaciones y eccemas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

