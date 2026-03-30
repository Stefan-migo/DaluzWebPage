import { Metadata } from 'next';
import Link from 'next/link';
import {
  ProcesosBackground,
  ProcesosOrganicBox,
  ProcesosOvalPlaceholder,
} from '@/components/svg/ProcesosPageComponents';
import './procesos-pages.css';

const PROCESOS_WRAPPER = 'procesos-pages';

export const metadata: Metadata = {
  title: 'Procesos DA LUZ: La Alquimia de tu Soberanía | DA LUZ CONSCIENTE',
  description:
    'En Da Luz, el cuerpo refleja el funcionamiento del Alma. Herramientas de autogestión, Ciclos Alquímicos y Sesiones de Regulación para tu transformación profunda.',
  openGraph: {
    title: 'Procesos DA LUZ - La Alquimia de tu Soberanía',
    description:
      'Botiquín Alquímico, Cofre DA LUZ, Ciclos Alquímicos y Sesiones de Regulación. Abordamos la causa raíz para reequilibrar tus cuerpos.',
    type: 'website',
  },
};

export default function ProcesosPage() {
  return (
    <div className={PROCESOS_WRAPPER}>
      <div className="procesos-page-container">
        <ProcesosBackground variant="general" />

        {/* Cabecera */}
        <section className="procesos-header-band" aria-labelledby="procesos-title">
          <div className="procesos-header-band-inner">
            <h1 id="procesos-title" className="procesos-band-title">
              PROCESOS DA LUZ: LA ALQUIMÍA DE TU SOBERANÍA
            </h1>
          </div>
        </section>

        {/* Intro quote */}
        <section className="procesos-intro-quote" aria-label="Introducción">
          <p className="procesos-intro-quote-text">
            &ldquo;En Da Luz, el cuerpo refleja el funcionamiento del Alma. Abordamos la causa raíz para reequilibrar tus cuerpos físico, energético, emocional y mental.&rdquo;
          </p>
        </section>

        {/* Herramientas de Autogestión */}
        <section className="procesos-section procesos-herramientas" aria-labelledby="herramientas-title">
          <div className="procesos-herramientas-grid">
            <div className="procesos-herramienta-card">
              <div className="procesos-herramienta-image">
                <ProcesosOvalPlaceholder
                  src="/svg/procesos/image1%20Procesos.png"
                  alt="Botiquín Alquímico - tinturas, microdosis y elixires"
                />
              </div>
              <div className="procesos-herramienta-content">
                <h3 className="procesos-herramienta-name">EL BOTIQUÍN ALQUÍMICO</h3>
                <p className="procesos-herramienta-desc">
                  Tu farmacia natural para la autogestión diaria. (Tinturas, Microdosis, Elixires y Aromaterapia).
                </p>
                <Link href="/productos" className="procesos-btn-cream">
                  EXPLORAR EL BOTIQUÍN
                </Link>
              </div>
            </div>
            <div className="procesos-herramienta-card">
              <div className="procesos-herramienta-image">
                <ProcesosOvalPlaceholder
                  src="/svg/procesos/image2%20Procesos.png"
                  alt="Cofre DA LUZ - tecnologías vibracionales"
                />
              </div>
              <div className="procesos-herramienta-content">
                <h3 className="procesos-herramienta-name">COFRE DA LUZ</h3>
                <p className="procesos-herramienta-desc">
                  Tecnologías vibracionales que sostienen el campo de sanación. (Sonidos Ancestrales, Péndulo, Reiki y Mapeos de Personalidad).
                </p>
                <Link href="/servicios/procesos/sesiones-integrales" className="procesos-btn-cream">
                  ABRIR EL COFRE DE ALIADOS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="procesos-page-footer">
          <p className="procesos-page-cta-text">
            ¿No sabés por dónde empezar? Escribinos y te orientamos hacia el proceso que tu cuerpo está pidiendo hoy.
          </p>
          <div className="procesos-page-buttons">
            <a
              href="mailto:contacto@daluzconsciente.com"
              className="procesos-btn-cream"
            >
              ESCRIBINOS
            </a>
            <Link href="/servicios/procesos/ciclos-alquimicos" className="procesos-btn-cream">
              CICLOS ALQUÍMICOS
            </Link>
            <Link href="/servicios/procesos/sesiones-integrales" className="procesos-btn-cream">
              SESIONES INTEGRALES
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
