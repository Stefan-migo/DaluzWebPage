'use client';

import { NextPage } from 'next';
import {
  EcologicaVeganaIcon,
  PoderBotanicoIcon,
  TransmutacionCoherenciaIcon,
  NeurocosmeticaIcon,
  ManifiestoSection1Background,
  ManifiestoSection2MergedBackground
} from "@/components/svg/SVGComponents";

const AlkimyaPage: NextPage = () => {
  return (
    <div className="relative">
      {/* Section 1 - Features Grid with Background */}
      {/* Section height adapts to SVG aspect ratio: Mobile (1170 / 3950.83 ≈ 0.296) | Desktop (1920.08 / 3140.34 ≈ 0.611) */}
      <section
        className="relative px-6 overflow-hidden flex flex-col section-manifiesto-1"
      >
        {/* Background - Full section */}
        <ManifiestoSection1Background
          bgColor="#F6FBD6"
          className="opacity-100"
        />

        {/* Content Area - Flexible area for adding text and other elements */}
        <div className="relative z-10 flex-1 section-manifiesto-1-content">
          {/* Main Title */}
          <h1 className="manifiesto-text-element manifiesto-title">
            Manifiesto Alkimyco
          </h1>

          {/* Text 1 */}
          <p className="manifiesto-text-element manifiesto-text-1">
            Neurocosmética que Transforma: una fusión entre los saberes ancestrales y la química moderna. Creada para quienes buscan ir más allá de la cosmética, deseando una experiencia de transformación genuina
          </p>

          {/* Text 2 */}
          <p className="manifiesto-text-element manifiesto-text-2">
            Sabemos que la verdadera belleza radica en la armonía integral; por eso, inspirada en la sabiduría de las medicinas ancestrales que transformaron la conexión con mi cuerpo, he creado alquimias diversas con el sincero deseo de acompañarte a equilibrar no sólo la salud de tu piel, sino también la armonía de tus emociones y la claridad de tus pensamientos.
          </p>

          {/* Text 3 */}
          <p className="manifiesto-text-element manifiesto-text-3">
            Como la naturaleza misma, nuestros cuerpos hablan, y Da Luz es el puente para escucharlos, para que a través de cada aroma, cada toque, cada gota, y cada sonido puedas reconectar con lo más profundo de tu Ser.
          </p>

          {/* Text 4 */}
          <p className="manifiesto-text-element manifiesto-text-4">
            Nuestras fórmulas se elaboran con materias primas de alta calidad, ecológicas y libres de crueldad animal. Utilizamos aceites esenciales puros, aceites vegetales prensados en frío, hierbas medicinales y otros ingredientes cosméticos cuidadosamente seleccionados, que honran la integridad de tu cuerpo y la vitalidad de nuestro ecosistema, conscientes de la influencia mutua de nuestras elecciones.
          </p>

          {/* Text 5 */}
          <p className="manifiesto-text-element manifiesto-text-5">
            Te propongo una conexión Alquímica con tu propio cuerpo, tus sentidos y vos: una ceremonia de conexión.
          </p>

          {/* Manifiesto Image - Responsive (Mobile, Tablet, Desktop) */}
          <img 
            src="/images/manifiesto-image.png" 
            alt="Manifiesto Alkimyco"
            className="manifiesto-image-element"
          />

          {/* Mobile/Tablet Text Cards - Hidden on desktop */}
          <div className="section-manifiesto-1-text-cards">
            {/* Card 1: Neurocosmética que Transforma */}
            <div className="manifiesto-text-card">
              <p className="manifiesto-text-card-text">
                Neurocosmética que Transforma: una fusión entre los saberes ancestrales y la química moderna. Creada para quienes buscan ir más allá de la cosmética, deseando una experiencia de transformación genuina
              </p>
        </div>

            {/* Card 3: Armonía integral */}
            <div className="manifiesto-text-card">
              <p className="manifiesto-text-card-text">
                Sabemos que la verdadera belleza radica en la armonía integral; por eso, inspirada en la sabiduría de las medicinas ancestrales que transformaron la conexión con mi cuerpo, he creado alquimias diversas con el sincero deseo de acompañarte a equilibrar no sólo la salud de tu piel, sino también la armonía de tus emociones y la claridad de tus pensamientos.
          </p>
        </div>

            {/* Card 4: Nuestros cuerpos hablan */}
            <div className="manifiesto-text-card">
              <p className="manifiesto-text-card-text">
            Como la naturaleza misma, nuestros cuerpos hablan, y Da Luz es el puente para escucharlos, para que a través de cada aroma, cada toque, cada gota, y cada sonido puedas reconectar con lo más profundo de tu Ser.
          </p>
        </div>

            {/* Card 5: Materias primas */}
            <div className="manifiesto-text-card">
              <p className="manifiesto-text-card-text">
                Nuestras fórmulas se elaboran con materias primas de alta calidad, ecológicas y libres de crueldad animal. Utilizamos aceites esenciales puros, aceites vegetales prensados en frío, hierbas medicinales y otros ingredientes cosméticos cuidadosamente seleccionados, que honran la integridad de tu cuerpo y la vitalidad de nuestro ecosistema, conscientes de la influencia mutua de nuestras elecciones.
          </p>
        </div>

            {/* Card 6: Conexión Alquímica */}
            <div className="manifiesto-text-card">
              <p className="manifiesto-text-card-text">
                Te propongo una conexión Alquímica con tu propio cuerpo, tus sentidos y vos: una ceremonia de conexión.
          </p>
        </div>
          </div>
      </div>

        {/* Cards Container - Always positioned at the bottom */}
        <div className="relative z-10 container px-0 mx-auto max-w-7xl mb-[3rem] md:mb-[3rem] lg:mb-[8rem] xl:mb-[15rem] mt-auto section-manifiesto-1-cards">
          {/* Mobile: 2x2 grid (2 rows, 2 columns) | Desktop: 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            <div className="card-enhanced manifiesto-card text-center">
              <EcologicaVeganaIcon size={48} className="mx-auto mb-4 md:mb-6 manifiesto-card-icon" />
              <h3 className="font-subtitle text-brand-primary mb-3 md:mb-4 manifiesto-card-title">Ecológica y Vegana</h3>
              <p className="font-caption text-gray-600 manifiesto-card-text">Ecología y Consciencia: Respetamos toda forma de vida, eligiendo ingredientes sostenibles y envases conscientes en cada paso, asegurando la protección de la Madre Tierra.</p>
            </div>
            <div className="card-enhanced manifiesto-card text-center">
              <PoderBotanicoIcon size={48} className="mx-auto mb-4 md:mb-6 manifiesto-card-icon" />
              <h3 className="font-subtitle text-brand-primary mb-3 md:mb-4 manifiesto-card-title">Poder Botánico y Natural</h3>
              <p className="font-caption text-gray-600 manifiesto-card-text">Poder Botánico y Natural: Honramos el poder concentrado de las plantas (Fitoterapia, tradición herbolaria) y creamos con ellas para promover tu bienestar integral.</p>
            </div>
            <div className="card-enhanced manifiesto-card text-center">
              <TransmutacionCoherenciaIcon size={48} className="mx-auto mb-4 md:mb-6 manifiesto-card-icon" />
              <h3 className="font-subtitle text-brand-primary mb-3 md:mb-4 manifiesto-card-title">Transmutación y Coherencia</h3>
              <p className="font-caption text-gray-600 manifiesto-card-text">Coherencia y Transmutación: Fórmulas para tu Bioequilibrio. Fusionamos la sabiduría botánica con activos biotecnológicos conscientes para crear sinergias potenciadoras.</p>
            </div>
            <div className="card-enhanced manifiesto-card text-center">
              <NeurocosmeticaIcon size={48} className="mx-auto mb-4 md:mb-6 manifiesto-card-icon" />
              <h3 className="font-subtitle text-brand-primary mb-3 md:mb-4 manifiesto-card-title">Neurocosmética Vibracional</h3>
              <p className="font-caption text-gray-600 manifiesto-card-text">Neurocosmética Vibracional: Honramos la comunicación entre tu piel y tu mente. El uso intencionado de aceites esenciales refuerza tu bioequilibrio integralmente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 Merged */}
      <section
        className="relative px-6 overflow-hidden flex flex-col section-manifiesto-2-merged"
      >
        {/* Background - Full section */}
        <ManifiestoSection2MergedBackground
          bgColor="#F6FBD6"
          className="opacity-100"
        />

        {/* Content Area - Flexible area for adding text and other elements */}
        <div className="relative z-10 flex-1 section-manifiesto-2-merged-content">
          {/* Main Title */}
          <h1 className="manifiesto-section2-merged-text-element manifiesto-section2-merged-title">
            NUESTROS VALORES: COMPROMISO DETALLADO
          </h1>

          {/* Secondary Title 1: Ecología y Conciencia */}
          <h2 className="manifiesto-section2-merged-text-element manifiesto-section2-merged-subtitle-1">
            Ecología y Conciencia: Honrando el Planeta y toda forma de vida
          </h2>

          {/* Text 1 */}
          <p className="manifiesto-section2-merged-text-element manifiesto-section2-merged-text-1">
            Creemos que es innecesario dañar la Madre Tierra, nuestro propio cuerpo y/o los seres vivos con los que convivimos para cuidarnos. Por eso rechazamos el uso de cualquier ingrediente o subproducto de origen animal en nuestras formulaciones., así como tampoco realizamos pruebas en animales. y nos comprometemos a:
          </p>

          <h3 className="manifiesto-section2-merged-text-element manifiesto-section2-merged-subtitle-1a">
            Envases Conscientes:
          </h3>
          <p className="manifiesto-section2-merged-text-element manifiesto-section2-merged-text-1a">
            Nuestros envases son elegidos por su capacidad de ser reutilizados, reciclados o biodegradados. Te invitamos a darles una segunda vida.
          </p>
          <h3 className="manifiesto-section2-merged-text-element manifiesto-section2-merged-subtitle-1b">
            Balance en la Formulación:
          </h3>
          <p className="manifiesto-section2-merged-text-element manifiesto-section2-merged-text-1b">
            Buscamos un equilibrio consciente, utilizando activos sintéticos de origen vegetal cuando es la opción más responsable que evita agotar la naturaleza
          </p>

          {/* Secondary Title 2: Poder Botánico y Natural */}
          <h2 className="manifiesto-section2-merged-text-element manifiesto-section2-merged-subtitle-2">
            Poder Botánico y Natural: La Naturaleza a tu favor
          </h2>

          {/* Text 2 */}
          <p className="manifiesto-section2-merged-text-element manifiesto-section2-merged-text-2">
            La naturaleza es nuestra farmacia más sabia. Basándonos en la tradición herbolaria y en mi formación en fitoterapia, seleccionamos extractos, aceites esenciales, hidrolatos, aceites vegetales y tinturas madre por sus beneficios específicos para los diversos biotipos de piel, las emociones y la función de los diversos órganos.
          </p>

          {/* Secondary Title 3: Coherencia y Transmutación */}
          <h2 className="manifiesto-section2-merged-text-element manifiesto-section2-merged-subtitle-3">
            Coherencia y Transmutación: Fórmulas para tu Bioequilibrio
          </h2>

          {/* Text 3 */}
          <p className="manifiesto-section2-merged-text-element manifiesto-section2-merged-text-3">
            Cada producto está diseñado con una intención clara, fusionando la sabiduría botánica con activos biotecnológicos conscientes. Con base en la individualidad formulamos con consciencia de los diferentes tipos de piel y cabellos (biotipos y doshas) que existen, por eso mismo creamos sinergias potenciadoras que te invitan a nutrir tu Ser en coherencia con lo que tu cuerpo necesita, desde el Amor y la Presencia.
          </p>

          {/* Secondary Title 4: Neurocosmética Vibracional */}
          <h2 className="manifiesto-section2-merged-text-element manifiesto-section2-merged-subtitle-4">
            Neurocosmética Vibracional
          </h2>

          {/* Text 4 */}
          <p className="manifiesto-section2-merged-text-element manifiesto-section2-merged-text-4">
            Nuestra cosmética es una invitación a potenciar y honrar la comunicación entre tu piel y tu mente, usando tus Sentidos como un canal a tu favor. El uso intencionado de aceites esenciales no solo tiene beneficios físicos, sino que también crea una resonancia emocional y sensorial que refuerza tu bioequilibrio integralmente.
          </p>

          {/* Secondary Title 5: Nuestro compromiso sustentable */}
          <h2 className="manifiesto-section2-merged-text-element manifiesto-section2-merged-subtitle-5">
            Nuestro compromiso sustentable
          </h2>

          {/* Text 5 */}
          <p className="manifiesto-section2-merged-text-element manifiesto-section2-merged-text-5">
          En Da Luz, creemos en la importancia de ser conscientes de nuestros consumos y responsables con nuestros residuos. Por eso, nuestros envases son de vidrio color ámbar o transparente, lo que asegura una mejor conservación del producto y evita la liberación de sustancias tóxicas si las Alquimias quedan expuestas al sol o a altas temperaturas. Además, nuestros envases te invitan a la consciencia del re-ciclo y a la creatividad de re-utilizar.
          </p>

          {/* Secondary Title 6: Reutilizalos! */}
          <h2 className="manifiesto-section2-merged-text-element manifiesto-section2-merged-subtitle-6">
            Reutilizalos!
          </h2>

          {/* Text 6 */}
          <p className="manifiesto-section2-merged-text-element manifiesto-section2-merged-text-6">
            Podés devolver tus envases limpios y lavados para acceder a descuentos. <strong>Puntos de reciclaje:</strong> Si no te interesan las opciones anteriores, podes dejar tus envases (y todos los residuos que generes) en un punto cercano de reciclaje. Te dejamos 2 sitios para que encuentres la mejor opción y ubicación para hacerte cargo de tus consumos de forma consciente
          </p>


          {/* Mobile/Tablet Cards - Hidden on desktop */}
          <div className="manifiesto-section2-merged-mobile-cards">
            {/* Card 1: Ecología y Conciencia */}
            <div className="manifiesto-shaped-card manifiesto-section2-merged-card-1">
              <div className="manifiesto-shaped-card-bg"></div>
              <div className="manifiesto-shaped-card-content">
                <h2 className="manifiesto-shaped-card-title">
                  Ecología y Conciencia: Honrando el Planeta y toda forma de vida
                </h2>
                <p className="manifiesto-shaped-card-text">
                  Creemos que es innecesario dañar la Madre Tierra, nuestro propio cuerpo y/o los seres vivos con los que convivimos para cuidarnos. Por eso rechazamos el uso de cualquier ingrediente o subproducto de origen animal en nuestras formulaciones., así como tampoco realizamos pruebas en animales. y nos comprometemos a:
                </p>
                <h2 className="manifiesto-shaped-card-title mt-3">
                  Envases Conscientes:
                </h2>
                <p className="manifiesto-shaped-card-text">
                  Nuestros envases son elegidos por su capacidad de ser reutilizados, reciclados o biodegradados. Te invitamos a darles una segunda vida.
                </p>
                <h2 className="manifiesto-shaped-card-title mt-3">
                  Balance en la Formulación:
                </h2>
                <p className="manifiesto-shaped-card-text">
                  Buscamos un equilibrio consciente, utilizando activos sintéticos de origen vegetal cuando es la opción más responsable que evita agotar la naturaleza
                </p>
          </div>
        </div>

            {/* Card 2: Poder Botánico y Natural */}
            <div className="manifiesto-shaped-card manifiesto-section2-merged-card-2">
              <div className="manifiesto-shaped-card-bg"></div>
              <div className="manifiesto-shaped-card-content">
                <h2 className="manifiesto-shaped-card-title">
                  Poder Botánico y Natural: La Naturaleza a tu favor
                </h2>
                <p className="manifiesto-shaped-card-text2">
                  La naturaleza es nuestra farmacia más sabia. Basándonos en la tradición herbolaria y en mi formación en fitoterapia, seleccionamos extractos, aceites esenciales, hidrolatos, aceites vegetales y tinturas madre por sus beneficios específicos para los diversos biotipos de piel, las emociones y la función de los diversos órganos.
                </p>
              </div>
      </div>

            {/* Card 3: Coherencia y Transmutación */}
            <div className="manifiesto-shaped-card manifiesto-section2-merged-card-3">
              <div className="manifiesto-shaped-card-bg"></div>
              <div className="manifiesto-shaped-card-content">
                <h2 className="manifiesto-shaped-card-title">
                  Coherencia y Transmutación: Fórmulas para tu Bioequilibrio
                </h2>
                <p className="manifiesto-shaped-card-text3">
                  Cada producto está diseñado con una intención clara, fusionando la sabiduría botánica con activos biotecnológicos conscientes. Con base en la individualidad formulamos con consciencia de los diferentes tipos de piel y cabellos (biotipos y doshas) que existen, por eso mismo creamos sinergias potenciadoras que te invitan a nutrir tu Ser en coherencia con lo que tu cuerpo necesita, desde el Amor y la Presencia.
                </p>
              </div>
            </div>

            {/* Card 4: Neurocosmética Vibracional */}
            <div className="manifiesto-shaped-card manifiesto-section2-merged-card-4">
              <div className="manifiesto-shaped-card-bg"></div>
              <div className="manifiesto-shaped-card-content">
                <h2 className="manifiesto-shaped-card-title">
                  Neurocosmética Vibracional
                </h2>
                <p className="manifiesto-shaped-card-text4">
                  Nuestra cosmética es una invitación a potenciar y honrar la comunicación entre tu piel y tu mente, usando tus Sentidos como un canal a tu favor. El uso intencionado de aceites esenciales no solo tiene beneficios físicos, sino que también crea una resonancia emocional y sensorial que refuerza tu bioequilibrio integralmente.
                </p>
        </div>
      </div>

            {/* Card 5: Nuestro compromiso sustentable */}
            <div className="manifiesto-shaped-card manifiesto-section2-merged-card-5">
              <div className="manifiesto-shaped-card-bg"></div>
              <div className="manifiesto-shaped-card-content">
                <h2 className="manifiesto-shaped-card-title">
                  Nuestro compromiso sustentable
                </h2>
                <p className="manifiesto-shaped-card-text5">
                  En Da Luz, creemos en la importancia de ser conscientes de nuestros consumos y responsables con nuestros residuos. Por eso, nuestros envases son de vidrio color ámbar o transparente, lo que asegura una mejor conservación del producto y evita la liberación de sustancias tóxicas si las Alquimias quedan expuestas al sol o a altas temperaturas. Además, nuestros envases te invitan a la consciencia del re-ciclo y a la creatividad de re-utilizar.
                </p>
            </div>
            </div>

            {/* Card 6: Reutilizalos! */}
            <div className="manifiesto-shaped-card manifiesto-section2-merged-card-6">
              <div className="manifiesto-shaped-card-bg"></div>
              <div className="manifiesto-shaped-card-content">
                <h2 className="manifiesto-shaped-card-title">
                  Reutilizalos!
                </h2>
                <p className="manifiesto-shaped-card-text6">
                  Podés devolver tus envases limpios y lavados para acceder a descuentos. <strong>Puntos de reciclaje:</strong> Si no te interesan las opciones anteriores, podes dejar tus envases (y todos los residuos que generes) en un punto cercano de reciclaje. Te dejamos 2 sitios para que encuentres la mejor opción y ubicación para hacerte cargo de tus consumos de forma consciente
                </p>
            </div>
          </div>
        </div>
      </div>
      </section>
    </div>
  );
};

export default AlkimyaPage;