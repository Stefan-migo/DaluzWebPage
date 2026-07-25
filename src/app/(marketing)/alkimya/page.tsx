'use client';

import { NextPage } from 'next';

/* Nube blanca festoneada (pilares 3 y 4) — se estira al alto del contenido */
const CloudShape = () => (
  <svg
    className="mf-cloud-svg"
    viewBox="0 0 300 200"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M20 16 C74 4 226 4 280 16 C297 21 296 60 295 100 C296 140 297 179 280 184 C226 196 74 196 20 184 C3 179 4 140 5 100 C4 60 3 21 20 16 Z"
      fill="#fdfbf4"
    />
  </svg>
);

/* Anillo decorativo de 4 flechas del ciclo de reciclaje (solo desktop/tablet) */
const ArrowRing = () => (
  <svg
    className="mf-arrow-ring"
    viewBox="0 0 1000 500"
    aria-hidden="true"
  >
    <g fill="none" stroke="#f6efd9" strokeWidth={5} strokeLinecap="round">
      <path d="M962.9 288.2 A470 220 0 0 1 581.6 466.7" />
      <path d="M418.4 466.7 A470 220 0 0 1 37.1 288.2" />
      <path d="M37.1 211.8 A470 220 0 0 1 418.4 33.3" />
      <path d="M581.6 33.3 A470 220 0 0 1 962.9 211.8" />
    </g>
    <g fill="#f6efd9">
      <g transform="translate(581.6 466.7) rotate(175.3)">
        <path d="M0 0 L-24 -13 L-24 13 Z" />
      </g>
      <g transform="translate(37.1 288.2) rotate(249.4)">
        <path d="M0 0 L-24 -13 L-24 13 Z" />
      </g>
      <g transform="translate(418.4 33.3) rotate(355.3)">
        <path d="M0 0 L-24 -13 L-24 13 Z" />
      </g>
      <g transform="translate(962.9 211.8) rotate(69.4)">
        <path d="M0 0 L-24 -13 L-24 13 Z" />
      </g>
    </g>
  </svg>
);

/* Banda crema con borde inferior ondulado (fondo de los títulos de sección) */
const BandWave = () => (
  <svg
    className="mf-band-wave"
    viewBox="0 0 1440 200"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M0,0 H1440 V52 C1400,55 1370,58 1330,60 C1250,66 1200,82 1120,95 C1010,112 950,150 850,150 C760,150 700,128 620,132 C520,138 460,116 360,120 C270,123 220,178 150,178 C90,178 50,160 0,150 Z"
      fill="#fff2db"
    />
  </svg>
);

const AlkimyaPage: NextPage = () => {
  return (
    <div className="mf-page">
      {/* Fondo mesh rojo — idéntico al de biotipos y doshas */}
      <div className="biotipos-mesh-bg-global" aria-hidden="true" />

      {/* ============================================================
          SECCIÓN 1 — MANIFIESTO ALKIMYCO
          ============================================================ */}
      <section className="mf-section mf-manifiesto">
        <div className="mf-band-wrap">
          <div className="mf-band">
            <BandWave />
            <h1 className="mf-band-title">Manifiesto Alkimyco</h1>
          </div>
        </div>

        <div className="mf-manifiesto-body">
          <div className="mf-blob-block mf-cloud">
            <CloudShape />
            <p className="mf-lead">
              <em>
                Neurocosmética que Transforma: una fusión entre los saberes
                ancestrales y la química moderna.
              </em>
            </p>
            <p className="mf-text">
              Creada para quienes buscan ir más allá de la cosmética, deseando
              una experiencia de transformación genuina.
            </p>
          </div>

          <div className="mf-blob-block mf-cloud">
            <CloudShape />
            <p className="mf-text">
              Inspirada en la sabiduría de las medicinas ancestrales que
              transformaron la conexión con mi cuerpo, he creado alquimias
              diversas con el sincero deseo de acompañarte a equilibrar no sólo la
              salud de tu piel, sino también la armonía de tus emociones y la
              claridad de tus pensamientos.
            </p>
          </div>

          <div className="mf-blob-block mf-cloud">
            <CloudShape />
            <p className="mf-lead mf-lead--bold">
              Como la naturaleza misma, nuestros cuerpos hablan, y Da Luz es el
              puente para escucharlos,
            </p>
            <p className="mf-text">
              <em>
                para que a través de cada aroma, cada toque, cada gota, y cada
                sonido puedas reconectar con lo más profundo de tu Ser.
              </em>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN 2 — PILARES DE ALKIMYA DA LUZ
          ============================================================ */}
      <section className="mf-section mf-pilares">
        <div className="mf-band-wrap">
          <div className="mf-band">
            <BandWave />
            <h2 className="mf-band-title">Pilares de Alkimya Da Luz</h2>
          </div>
        </div>

        <div className="mf-pilares-grid">
          {/* Pilar 1 */}
          <article className="mf-pilar">
            <h3 className="mf-pilar-title">
              <span className="mf-pilar-num">1.</span> Ecología y Conciencia
            </h3>
            <div className="mf-pilar-body mf-cloud">
              <CloudShape />
              <p className="mf-text">
                Creemos que es innecesario dañar la Madre Tierra, nuestro propio
                cuerpo y/o los seres vivos con los que convivimos para cuidarnos.
                Por eso rechazamos el uso de cualquier ingrediente o subproducto
                de origen animal en nuestras formulaciones, así como tampoco
                realizamos pruebas en animales.
              </p>
              <p className="mf-text">
                <strong>Envases Conscientes:</strong> Nuestros envases son
                elegidos por su capacidad de ser reutilizados, reciclados o
                biodegradados.
              </p>
              <p className="mf-text">
                <strong>Balance en la Formulación:</strong> Buscamos un
                equilibrio consciente, utilizando activos sintéticos de origen
                vegetal cuando es la opción más responsable que evita agotar la
                naturaleza y potenciar tu Ser.
              </p>
            </div>
          </article>

          {/* Pilar 2 */}
          <article className="mf-pilar">
            <h3 className="mf-pilar-title">
              <span className="mf-pilar-num">2.</span> Botánica y Natural
            </h3>
            <div className="mf-pilar-body mf-cloud">
              <CloudShape />
              <p className="mf-lead">
                <em>La naturaleza es nuestra farmacia más sabia.</em>
              </p>
              <p className="mf-text">
                Basándonos en la tradición herbolaria y en lo aprendido en la
                formación en fitoterapia, seleccionamos extractos, aceites
                esenciales, hidrolatos, aceites vegetales y tinturas madre por sus
                beneficios específicos para los diversos biotipos de piel, las
                emociones y la función de los diversos órganos.
              </p>
              <p className="mf-text">
                Nuestras alquimias botánicas aprovechan el poder concentrado de
                las plantas para nutrir y promover el bienestar integral.
              </p>
            </div>
          </article>

          {/* Pilar 3 */}
          <article className="mf-pilar">
            <h3 className="mf-pilar-title">
              <span className="mf-pilar-num">3.</span> Coherencia y Transmutación
            </h3>
            <div className="mf-pilar-body mf-cloud">
              <CloudShape />
              <p className="mf-text">
                Cada producto está diseñado con una intención clara. Combinamos la
                sabiduría de las hierbas medicinales con activos biotecnológicos
                de procedencia vegetal para potenciar los beneficios.
              </p>
              <p className="mf-text">
                Creamos sinergias teniendo en cuenta los diferentes tipos de piel,
                y cabellos (biotipos y doshas), asegurando que cada alquimia nutra
                tu Ser en coherencia con lo que tu cuerpo necesita, desde el Amor y
                la Presencia.
              </p>
            </div>
          </article>

          {/* Pilar 4 */}
          <article className="mf-pilar">
            <h3 className="mf-pilar-title">
              <span className="mf-pilar-num">4.</span> Neurocosmética Vibracional
            </h3>
            <div className="mf-pilar-body mf-cloud">
              <CloudShape />
              <p className="mf-text">
                Nuestra cosmética es una invitación a potenciar y honrar la
                comunicación entre tu piel y tu mente, usando tus Sentidos como un
                canal a tu favor.
              </p>
              <p className="mf-text">
                El uso intencionado de aceites esenciales no solo tiene beneficios
                físicos, sino que también crea una resonancia emocional y sensorial
                que refuerza tu bioequilibrio integralmente.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN 3 — NUESTRO COMPROMISO SUSTENTABLE
          ============================================================ */}
      <section className="mf-section mf-sustentable">
        <h2 className="mf-sustentable-title">Nuestro Compromiso Sustentable</h2>

        <div className="mf-ciclo">
          <ArrowRing />
          <div className="mf-ciclo-content">
            <p className="mf-ciclo-lead">¡Reutilizalos!</p>
            <p className="mf-text">
              <strong>Puntos de reciclaje:</strong> Podés dejar tus envases (y
              todos los residuos que generes) en un punto cercano de reciclaje.
            </p>
            <p className="mf-text">
              Te dejamos 2 sitios para que encuentres la mejor opción y ubicación
              para hacerte cargo de tus consumos de forma consciente:
            </p>
            <div className="mf-ciclo-links">
              <a
                className="mf-recycle-btn"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                Punto de reciclaje 1
              </a>
              <a
                className="mf-recycle-btn"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                Punto de reciclaje 2
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlkimyaPage;
