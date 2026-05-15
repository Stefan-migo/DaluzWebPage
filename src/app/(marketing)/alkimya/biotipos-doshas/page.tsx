'use client';

import { useState } from 'react';
import Link from 'next/link';
import BiotiposTablasCarousel from '@/components/biotipos/BiotiposTablasCarousel';

const BIOTIPOS_COLUMNS = [
  "Biotipo Cutáneo",
  "Correspondencia a Dosha/s",
  "Características Clave",
  "Necesidades Esenciales",
  "ALKIMYA RECOMENDADA",
];

const BIOTIPOS_TABLAS = [
  {
    title: "Piel Normal",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Normal (Eudérmica)",
        "Correspondencia a Dosha/s": "Tridoshic (Equilibrada)",
        "Características Clave": "Piel lisa, suave, color uniforme y brillo moderado. Representa el equilibrio perfecto.",
        "Necesidades Esenciales": "Mantenimiento y prevención. Foco en antioxidantes y humectantes ligeros.",
        "ALKIMYA RECOMENDADA": "SERENA",
      },
    ],
  },
  {
    title: "Piel Seca",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Seca (Alípica)",
        "Correspondencia a Dosha/s": "Vata (Éter y Aire)",
        "Características Clave": "Piel fina, tirante, con tendencia a la descamación y arrugas. Déficit en secreción sebácea.",
        "Necesidades Esenciales": "Nutrición intensa (aceites pesados), lípidos, ceramidas y alta humectación.",
        "ALKIMYA RECOMENDADA": "NUTRE",
      },
    ],
  },
  {
    title: "Piel Grasa",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Grasa y/o Acnéica",
        "Correspondencia a Dosha/s": "Kapha (Tierra y Agua)",
        "Características Clave": "Piel gruesa, brillante, con poros dilatados, tendencia a comedones y/o acné. Exceso de secreción sebácea.",
        "Necesidades Esenciales": "Regulación de sebo, activos astringentes (arcillas) y texturas ligeras.",
        "ALKIMYA RECOMENDADA": "ILUMINA",
      },
    ],
  },
  {
    title: "Piel Mixta",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Mixta",
        "Correspondencia a Dosha/s": "Vata/Kapha o Pitta/Kapha",
        "Características Clave": "Sebo excesivo en la Zona T y áreas normales/secas en las mejillas.",
        "Necesidades Esenciales": "Balancear. Regulación en Zona T y nutrición ligera en el resto del rostro.",
        "ALKIMYA RECOMENDADA": "ILUMINA (Zona T) / SERENA (Resto)",
      },
    ],
  },
  {
    title: "Piel Sensible",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Sensible",
        "Correspondencia a Dosha/s": "Pitta (Fuego y Agua)",
        "Características Clave": "Piel que reacciona fácilmente a estímulos externos, con tendencia a rojeces, picazón e inflamación.",
        "Necesidades Esenciales": "Calma, reparación de la barrera cutánea, activos desinflamatorios (Árnica, Manzanilla).",
        "ALKIMYA RECOMENDADA": "CALMA",
      },
    ],
  },
  {
    title: "Piel Madura",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Madura",
        "Correspondencia a Dosha/s": "Vata (Envejecimiento)",
        "Características Clave": "Piel con pérdida de firmeza, elasticidad, volumen y líneas de expresión profundas.",
        "Necesidades Esenciales": "Reafirmación, alta nutrición, colágeno vegetal y activos anti-edad.",
        "ALKIMYA RECOMENDADA": "NUTRE / SERENA",
      },
    ],
  },
];


// Quiz questions data
const quizQuestions = [
  {
    id: 1,
    question: '¿Cómo describirías la textura y temperatura general de tu piel?',
    options: {
      A: { text: 'Fina, fría, con tendencia a estar seca/áspera.', dosha: 'vata' },
      B: { text: 'Suave, ligeramente cálida, con tendencia a enrojecerse.', dosha: 'pitta' },
      C: { text: 'Gruesa, fresca, suave, con tendencia a ser grasa o húmeda.', dosha: 'kapha' }
    }
  },
  {
    id: 2,
    question: '¿Cómo manejas tu energía y tus emociones día a día?',
    options: {
      A: { text: 'Rápido, creativo, pero a veces ansioso o con insomnio.', dosha: 'vata' },
      B: { text: 'Perspicaz y enfocado, pero con tendencia a la irritabilidad o impaciencia.', dosha: 'pitta' },
      C: { text: 'Calmado y constante, pero a veces me cuesta empezar o me siento letárgico.', dosha: 'kapha' }
    }
  },
  {
    id: 3,
    question: '¿Cuál es la tendencia de tu cabello y cuero cabelludo?',
    options: {
      A: { text: 'Seco, con frizz, quebradizo, o escaso.', dosha: 'vata' },
      B: { text: 'Fino o normal, con tendencia a la caída prematura o al cuero cabelludo sensible/irritado.', dosha: 'pitta' },
      C: { text: 'Abundante, grueso, con tendencia a ser graso o pesado.', dosha: 'kapha' }
    }
  },
  {
    id: 4,
    question: '¿Cómo es tu estructura corporal y tu apetito?',
    options: {
      A: { text: 'Delgada, esbelta, con digestión variable y a veces gases.', dosha: 'vata' },
      B: { text: 'Mediana, musculatura definida, con un apetito fuerte y regular.', dosha: 'pitta' },
      C: { text: 'Robusta, con buena resistencia, tendencia a almacenar peso, buen apetito constante.', dosha: 'kapha' }
    }
  },
  {
    id: 5,
    question: '¿Qué te afecta más fácilmente del ambiente?',
    options: {
      A: { text: 'El frío, el viento, los cambios bruscos o el estrés.', dosha: 'vata' },
      B: { text: 'El calor, el sol intenso, la comida muy picante o los conflictos.', dosha: 'pitta' },
      C: { text: 'El frío, la humedad, los ambientes cargados o el exceso de apego/rutina.', dosha: 'kapha' }
    }
  },
  {
    id: 6,
    question: 'Si pudieras elegir un beneficio principal para tu piel ahora mismo, ¿cuál sería?',
    options: {
      A: { text: 'Nutrición profunda para evitar la tirantez y las líneas finas.', dosha: 'vata' },
      B: { text: 'Calma y refrescar para reducir el calor y el enrojecimiento.', dosha: 'pitta' },
      C: { text: 'Regulación y ligereza para evitar el brillo y la sensación pesada.', dosha: 'kapha' }
    }
  }
];

// Results mapping
const doshaResults = {
  vata: {
    name: 'VATA',
    biotipo: 'Piel Seca / Cabello Seco y Dañado',
    alkimya: 'NUTRE',
    description: 'Tu biotipo Vata se beneficia de nutrición profunda y cuidado intensivo.'
  },
  pitta: {
    name: 'PITTA',
    biotipo: 'Piel Sensible / Cabello Irritado',
    alkimya: 'CALMA',
    description: 'Tu biotipo Pitta necesita calma y equilibrio para reducir la sensibilidad.'
  },
  kapha: {
    name: 'KAPHA',
    biotipo: 'Piel Grasa / Cabello Graso',
    alkimya: 'ILUMINA',
    description: 'Tu biotipo Kapha se beneficia de regulación y ligereza para equilibrar.'
  },
  mixed: {
    name: 'MIXTO',
    biotipo: 'Piel Mixta',
    alkimya: 'ILUMINA (Zona T) / SERENA (Resto)',
    description: 'Tu biotipo mixto requiere cuidado diferenciado por zonas.'
  }
};

export default function BiotiposDoshasPage() {
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C'>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<typeof doshaResults.vata | typeof doshaResults.mixed | null>(null);
  // Accordion state
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleAnswer = (option: 'A' | 'B' | 'C') => {
    const newAnswers = { ...answers, [currentQuestion + 1]: option };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<number, 'A' | 'B' | 'C'>) => {
    const scores = { vata: 0, pitta: 0, kapha: 0 };

    Object.entries(finalAnswers).forEach(([questionId, answer]) => {
      const question = quizQuestions.find(q => q.id === Number(questionId));
      if (question) {
        const dosha = question.options[answer].dosha;
        scores[dosha as keyof typeof scores]++;
      }
    });

    // Find the highest score
    const maxScore = Math.max(scores.vata, scores.pitta, scores.kapha);
    const winners = Object.entries(scores).filter(([_, score]) => score === maxScore);

    if (winners.length > 1) {
      // Tie - check for Vata/Kapha tie (mixed)
      if (scores.vata === maxScore && scores.kapha === maxScore) {
        setResult(doshaResults.mixed);
      } else {
        // Other ties - use the first one or suggest review
        const firstWinner = winners[0][0] as 'vata' | 'pitta' | 'kapha';
        setResult(doshaResults[firstWinner]);
      }
    } else {
      const winner = winners[0][0] as 'vata' | 'pitta' | 'kapha';
      setResult(doshaResults[winner]);
    }

    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
  };

  const goToQuestion = (questionIndex: number) => {
    if (questionIndex <= Object.keys(answers).length) {
      setCurrentQuestion(questionIndex);
    }
  };
  return (
    <>
      <div className="biotipos-mesh-bg-global"></div>
      {/* Section 1 */}
      <section className="relative overflow-hidden flex flex-col section-biotipos-1">

        {/* Content Area - Flexible area for adding text and other elements */}
        <div className="relative z-10 flex-1 section-biotipos-1-content">
          {/* Main Title */}
          <div className="biotipos-section1-main-title-wrapper">
            <div className="biotipos-section1-main-title-bg"></div>
            <h1 className="biotipos-text-element biotipos-section1-main-title">
              ¡DESCUBRÍ TU BIOTIPO!
            </h1>
          </div>

          {/* Subtitle */}
          <p className="biotipos-text-element biotipos-section1-subtitle" style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.3rem)' }}>
            El Reconocimiento de que Cada Ser es Único: Bio-individualidad y Sabiduría Ancestra
          </p>

          {/* Main Text with SVG Background */}
          <div className="biotipos-text-element biotipos-section1-main-text">
            <div className="biotipos-section1-main-text-bg"></div>
            <div className="biotipos-section1-main-text-content">
              <p className="biotipos-section1-main-text-paragraph" style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.2rem)' }}>
                El concepto de bio-individualidad es un pilar central para Da Luz, integrando lo ancestral (Ayurveda) y la autogestión.
                <br /><br />
                Comprender tu biotipo es el primer paso para elegir las Alquimias de Da Luz que mejor te acompañarán. No buscamos clasificar, buscamos honrar tu esencia única.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <a
            href="#section-pieles"
            className="biotipos-text-element biotipos-section1-button biotipos-section1-button-1"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('section-pieles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Pieles
          </a>

          <a
            href="#section-cabellos"
            className="biotipos-text-element biotipos-section1-button biotipos-section1-button-2"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('section-cabellos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Cabellos
          </a>
        </div>
      </section>

      {/* Section 2 */}
      <section className="relative px-6 overflow-hidden flex flex-col section-biotipos-2">

        <div className="relative z-10 flex-1 section-biotipos-2-content">
          {/* Section Title - Full Width at Top */}
          <h2 className="biotipos-text-element biotipos-section2-title">
            <div className="biotipos-section2-title-bg"></div>
            <span className="biotipos-section2-title-text">La Piel: Nuestra Frontera Activa</span>
          </h2>

          {/* Main Container: Left (Text) and Right (Quiz) */}
          <div className="biotipos-section2-main-container">
            {/* Left Column - Text Content */}
            <div className="biotipos-section2-left-column">
              {/* Text Box - Merged */}
              <div className="biotipos-text-element biotipos-section2-text-left">
                <div className="biotipos-section2-text-left-bg"></div>
                <div className="biotipos-section2-text-left-content">
                  <p className="biotipos-section2-text-paragraph">
                    Sus funciones vitales actúan como nuestra primera línea de defensa: Controlar la pérdida de agua, proteger contra el entorno y actuar como barrera frente a químicos y agentes externos.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Quiz */}
            <div className="biotipos-section2-right-column">
              <div className="biotipos-section2-quiz">
                {!showResult ? (
                  <>
                    <h3 className="biotipos-section2-quiz-title">
                      Descubre tu Dosha ALKIMYA
                    </h3>
                    <div className="biotipos-section2-quiz-progress">
                      <div className="biotipos-section2-quiz-progress-bar">
                        <div
                          className="biotipos-section2-quiz-progress-fill"
                          style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="biotipos-section2-quiz-progress-text">
                        Pregunta {currentQuestion + 1} de {quizQuestions.length}
                      </span>
                    </div>
                    <div className="biotipos-section2-quiz-content">
                      <h4 className="biotipos-section2-quiz-question">
                        {quizQuestions[currentQuestion].question}
                      </h4>
                      <div className="biotipos-section2-quiz-options">
                        {(['A', 'B', 'C'] as const).map((option) => (
                          <button
                            key={option}
                            className={`biotipos-section2-quiz-option ${answers[currentQuestion + 1] === option ? 'selected' : ''
                              }`}
                            onClick={() => handleAnswer(option)}
                          >
                            <span className="biotipos-section2-quiz-option-label">{option}</span>
                            <span className="biotipos-section2-quiz-option-text">
                              {quizQuestions[currentQuestion].options[option].text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    {currentQuestion > 0 && (
                      <button
                        className="biotipos-section2-quiz-back"
                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                      >
                        ← Anterior
                      </button>
                    )}
                  </>
                ) : (
                  <div className="biotipos-section2-quiz-result">
                    <h3 className="biotipos-section2-quiz-result-title">
                      Tu Dosha es: {result?.name}
                    </h3>
                    <div className="biotipos-section2-quiz-result-content">
                      <p className="biotipos-section2-quiz-result-biotipo">
                        <strong>Biotipo:</strong> {result?.biotipo}
                      </p>
                      <p className="biotipos-section2-quiz-result-alkimya">
                        <strong>ALKIMYA Recomendada:</strong> {result?.alkimya}
                      </p>
                      <p className="biotipos-section2-quiz-result-description">
                        {result?.description}
                      </p>
                    </div>
                    <button
                      className="biotipos-section2-quiz-restart"
                      onClick={resetQuiz}
                    >
                      Volver a hacer el quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel de Biotipos Cutáneos (reemplaza Sections 3-8) */}
      <section id="section-pieles" className="section-biotipos-tablas">
        <div className="biotipos-section3-main-title-wrapper">
          <div className="biotipos-section3-main-title-bg"></div>
          <h2 className="biotipos-section3-main-title">
            Reconocé tu Biotipo Cutáneo
          </h2>
        </div>
        <BiotiposTablasCarousel tablas={BIOTIPOS_TABLAS} />
      </section>

      {/* Section 9 */}
      <section id="section-cabellos" className="relative overflow-hidden flex flex-col section-biotipos-9">

        <div className="relative z-10 flex-1 section-biotipos-9-content">
          {/* Main Title */}
          <h2 className="biotipos-text-element biotipos-section9-main-title">
            <div className="biotipos-section9-main-title-bg"></div>
            <span className="biotipos-section9-main-title-text">Los Biotipos Capilares: Tu Bio-equilibrio en el Cabello</span>
          </h2>

          {/* Main Text */}
          <div className="biotipos-text-element biotipos-section9-main-text">
            <div className="biotipos-section9-main-text-bg"></div>
            <div className="biotipos-section9-main-text-content">
              <p className="biotipos-section9-main-text-paragraph">
                Al igual que el rostro, el cabello y el cuero cabelludo son un reflejo directo de nuestro equilibrio interno (Doshas). El cuero cabelludo no es más que la piel de la cabeza, con las mismas funciones protectoras y la misma composición de barrera hidrolipídica.
              </p>
            </div>
          </div>

          {/* Text Grid Container */}
          <div className="biotipos-section9-text-grid">
            {/* Left Side Text */}
            <div className="biotipos-text-element biotipos-section9-left-text">
              <div className="biotipos-section9-left-text-bg"></div>
              <div className="biotipos-section9-left-text-content">
                <p className="biotipos-section9-side-text-paragraph">
                  Tu biotipo capilar se define por el patrón de secreciones sebáceas en la raíz (Kapha, Vata, Pitta) y la estructura de la fibra (Vata, Pitta). Esto determina su tendencia a la oleosidad, la sequedad, la caída o la irritación.
                </p>
              </div>
            </div>

            {/* Right Side Text */}
            <div className="biotipos-text-element biotipos-section9-right-text">
              <div className="biotipos-section9-right-text-bg"></div>
              <div className="biotipos-section9-right-text-content">
                <p className="biotipos-section9-side-text-paragraph">
                  Comprender tu Dosha capilar es clave para elegir un tratamiento que no solo repare la fibra, sino que armonice la raíz y asegure la vitalidad a largo plazo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10 */}
      <section className="relative overflow-hidden flex flex-col section-biotipos-10">

        <div className="relative z-10 flex-1 section-biotipos-10-content">
          {/* Secondary Title */}
          <h3 className="biotipos-text-element biotipos-section10-secondary-title">
            <div className="biotipos-section10-secondary-title-bg"></div>
            <span className="biotipos-section10-secondary-title-text">Cabello Normal (Equilibrado)</span>
          </h3>

          {/* Main Table Information */}
          <div className="biotipos-text-element biotipos-section10-table-container">
            <div className="biotipos-section10-table-bg"></div>
            <div className="biotipos-section10-table-content">
              <table className="biotipos-section10-table">
                <thead>
                  <tr>
                    <th>Biotipo Capilar</th>
                    <th>Correspondencia a Dosha</th>
                    <th>Características Clave</th>
                    <th>Necesidades Esenciales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Biotipo Capilar">Normal (Equilibrado)</td>
                    <td data-label="Correspondencia a Dosha">Tridoshic (Equilibrada)</td>
                    <td data-label="Características Clave">Pelo suave, con brillo natural y cuero cabelludo equilibrado.</td>
                    <td data-label="Necesidades Esenciales">Mantenimiento, prevención y protección diaria.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11 */}
      <section className="relative overflow-hidden flex flex-col section-biotipos-11">

        <div className="relative z-10 flex-1 section-biotipos-11-content">
          {/* Secondary Title */}
          <h3 className="biotipos-text-element biotipos-section11-secondary-title">
            <div className="biotipos-section11-secondary-title-bg"></div>
            <span className="biotipos-section11-secondary-title-text">Seco, Dañado y/o Rizado</span>
          </h3>

          {/* Main Table Information */}
          <div className="biotipos-text-element biotipos-section11-table-container">
            <div className="biotipos-section11-table-bg"></div>
            <div className="biotipos-section11-table-content">
              <table className="biotipos-section11-table">
                <thead>
                  <tr>
                    <th>Biotipo Capilar</th>
                    <th>Correspondencia a Dosha</th>
                    <th>Características Clave</th>
                    <th>Necesidades Esenciales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Biotipo Capilar">Seco, Dañado y/o Rizado/Crespo</td>
                    <td data-label="Correspondencia a Dosha">Vata (Éter y Aire)</td>
                    <td data-label="Características Clave">Pelo poroso, con frizz, quebradizo, puntas abiertas. Incluye patrones rizados/crespos (naturalmente secos).</td>
                    <td data-label="Necesidades Esenciales">Nutrición e hidratación intensa (aceites, mantecas) y terapias calmantes.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Section 12 */}
      <section className="relative overflow-hidden flex flex-col section-biotipos-12">

        <div className="relative z-10 flex-1 section-biotipos-12-content">
          {/* Secondary Title */}
          <h3 className="biotipos-text-element biotipos-section12-secondary-title">
            <div className="biotipos-section12-secondary-title-bg"></div>
            <span className="biotipos-section12-secondary-title-text">Graso / Pesado</span>
          </h3>

          {/* Main Table Information */}
          <div className="biotipos-text-element biotipos-section12-table-container">
            <div className="biotipos-section12-table-bg"></div>
            <div className="biotipos-section12-table-content">
              <table className="biotipos-section12-table">
                <thead>
                  <tr>
                    <th>Biotipo Capilar</th>
                    <th>Correspondencia a Dosha</th>
                    <th>Características Clave</th>
                    <th>Necesidades Esenciales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Biotipo Capilar">Graso / Pesado</td>
                    <td data-label="Correspondencia a Dosha">Kapha (Tierra y Agua)</td>
                    <td data-label="Características Clave">Pelo grueso, pesado, con cuero cabelludo oleoso y tendencia a la congestión.</td>
                    <td data-label="Necesidades Esenciales">Regulación del sebo, detox, activos astringentes y texturas ligeras.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Section 13 */}
      <section className="relative overflow-hidden flex flex-col section-biotipos-13">

        <div className="relative z-10 flex-1 section-biotipos-13-content">
          {/* Secondary Title */}
          <h3 className="biotipos-text-element biotipos-section13-secondary-title">
            <div className="biotipos-section13-secondary-title-bg"></div>
            <span className="biotipos-section13-secondary-title-text">Cuero Cabelludo Irritado/Caspa</span>
          </h3>

          {/* Main Table Information */}
          <div className="biotipos-text-element biotipos-section13-table-container">
            <div className="biotipos-section13-table-bg"></div>
            <div className="biotipos-section13-table-content">
              <table className="biotipos-section13-table">
                <thead>
                  <tr>
                    <th>Biotipo Capilar</th>
                    <th>Correspondencia a Dosha</th>
                    <th>Características Clave</th>
                    <th>Necesidades Esenciales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Biotipo Capilar">Cuero Cabelludo Irritado/Caspa</td>
                    <td data-label="Correspondencia a Dosha">Pitta/Kapha</td>
                    <td data-label="Características Clave">Descamación, picazón, enrojecimiento o exceso de grasa. Signo de desequilibrio.</td>
                    <td data-label="Necesidades Esenciales">Calma, control de la inflamación, regulación del pH. Solución clave: Tónico Capilar.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Section 14 */}
      <section className="relative overflow-hidden flex flex-col section-biotipos-14">

        <div className="relative z-10 flex-1 section-biotipos-14-content">
          {/* Secondary Title */}
          <h3 className="biotipos-text-element biotipos-section14-secondary-title">
            <div className="biotipos-section14-secondary-title-bg"></div>
            <span className="biotipos-section14-secondary-title-text">Caída y/o Crecimiento Lento</span>
          </h3>

          {/* Main Table Information */}
          <div className="biotipos-text-element biotipos-section14-table-container">
            <div className="biotipos-section14-table-bg"></div>
            <div className="biotipos-section14-table-content">
              <table className="biotipos-section14-table">
                <thead>
                  <tr>
                    <th>Biotipo Capilar</th>
                    <th>Correspondencia a Dosha</th>
                    <th>Características Clave</th>
                    <th>Necesidades Esenciales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Biotipo Capilar">Caída y/o Crecimiento Lento</td>
                    <td data-label="Correspondencia a Dosha">Vata/Pitta</td>
                    <td data-label="Características Clave">Pérdida excesiva o lento crecimiento. Ligada a estrés, deficiencias o inflamación.</td>
                    <td data-label="Necesidades Esenciales">Fortalecimiento folicular, nutrición de la raíz, estimulación circulatoria. Solución clave: Tónico Capilar.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Section 15 */}
      <section className="relative overflow-hidden flex flex-col section-biotipos-15">

        <div className="relative z-10 flex-1 section-biotipos-15-content">
          {/* Main Text Container with SVG Background */}
          <div className="biotipos-section15-main-container">
            <div className="biotipos-section15-main-container-bg"></div>
            <div className="biotipos-section15-main-container-content">
              {/* Main Title */}
              <h2 className="biotipos-section15-main-title">
                <Link href="/alkimya/tu-ceremonia" className="biotipos-section15-main-title-link">
                  CLICK A CEREMONIA PARA TU RUTINA IDEAL
                </Link>
              </h2>

              {/* Main Text */}
              <div className="biotipos-section15-main-text">
                <p className="biotipos-section15-main-text-paragraph">
                  ¿Aún tienes dudas? ¡Te ayudamos a elegir!
                  <br /><br />
                  Si después de identificar tu biotipo todavía tienes dudas sobre cuál es el mejor producto para ti, contáctanos. ¡Estamos para guiarte en tu camino de bienestar!
                </p>
              </div>

              {/* Buttons Container */}
              <div className="biotipos-section15-buttons-container">
                <a
                  href="https://www.instagram.com/daluzconsciente/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="biotipos-section15-button biotipos-section15-button-instagram"
                >
                  Contactá por Instagram
                </a>
                <a
                  href="https://wa.me/5493512344580"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="biotipos-section15-button biotipos-section15-button-whatsapp"
                >
                  Consultá por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>




    </>
  )
}

