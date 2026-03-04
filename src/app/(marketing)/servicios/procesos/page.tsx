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
          <h2 id="herramientas-title" className="procesos-section-title">
            HERRAMIENTAS DE AUTOGESTIÓN
          </h2>
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

        {/* 1. Ciclos Alquímicos */}
        <section className="procesos-section procesos-ciclos" aria-labelledby="ciclos-title">
          <h2 id="ciclos-title" className="procesos-section-title">
            1. CICLOS ALQUÍMICOS: Tu Transformación Profunda
          </h2>

          <article className="procesos-ciclo-card">
            <div className="procesos-ciclo-header">
              <h3 className="procesos-ciclo-name">OASIS (Personalización Total)</h3>
            </div>
            <ProcesosOrganicBox className="procesos-ciclo-body">
              <ul className="procesos-ciclo-list">
                <li><strong>Foco:</strong> Mapear y restaurar tu bioequilibrio inicial.</li>
                <li><strong>Herramientas:</strong> Mapeo Astrológico, Flores de Bach y Aromaterapia.</li>
                <li><strong>Ideal para:</strong> Quien busca una ruta de sanación 100% a medida para comenzar.</li>
              </ul>
              <Link href="/servicios/procesos/ciclos-alquimicos#ciclos-oasis-title" className="procesos-btn-cream procesos-btn-inline">
                DESCUBRIR MI OASIS PERSONAL
              </Link>
            </ProcesosOrganicBox>
          </article>

          <article className="procesos-ciclo-card">
            <div className="procesos-ciclo-header">
              <h3 className="procesos-ciclo-name">GÉNESIS (Suelo y Filtros)</h3>
            </div>
            <ProcesosOrganicBox className="procesos-ciclo-body">
              <ul className="procesos-ciclo-list">
                <li><strong>Foco:</strong> Depuración biológica y reconstrucción del Suelo (Eje 1). Limpieza de filtros orgánicos para permitir el flujo vital y re-programación vibracional con Elixires asistentes.</li>
                <li><strong>Herramientas:</strong> Medicina Herbal, Chamanismo y Elixires.</li>
              </ul>
              <Link href="/servicios/procesos/ciclos-alquimicos#ciclos-genesis-title" className="procesos-btn-cream procesos-btn-inline">
                INICIAR MI GÉNESIS
              </Link>
            </ProcesosOrganicBox>
          </article>

          <article className="procesos-ciclo-card procesos-ciclo-featured">
            <div className="procesos-ciclo-header">
              <h3 className="procesos-ciclo-name">EXPERIENCIA METAMORFOSIS (Membresía Premium)</h3>
            </div>
            <ProcesosOrganicBox className="procesos-ciclo-body">
              <ul className="procesos-ciclo-list">
                <li><strong>El Programa:</strong> Acceso paulatino al recorrido de los 6 Ejes para una purificación orgánica y psíquica total.</li>
                <li><strong>La Diferencia:</strong> Incluye sesiones individuales mensuales (1h 15min) para ajustar el proceso a tu pulso único + Elixir aromático-floral personalizado diseñado específicamente para asistir lo abordado en cada encuentro.</li>
                <li><strong>Incluye:</strong> Ejercicios semanales y el acompañamiento individual más profundo de Da Luz.</li>
              </ul>
              <Link href="/membresia" className="procesos-btn-cream procesos-btn-inline">
                SOLICITAR MI ACCESO A METAMORFOSIS
              </Link>
            </ProcesosOrganicBox>
          </article>
        </section>

        {/* 2. Sintonía Inmediata - Sesiones */}
        <section className="procesos-section procesos-sesiones" aria-labelledby="sesiones-title">
          <h2 id="sesiones-title" className="procesos-section-title">
            2. SINTONÍA INMEDIATA: Sesiones de Regulación
          </h2>

          <div className="procesos-sesiones-grid">
            <article className="procesos-sesion-card">
              <h3 className="procesos-sesion-title">Sesión PAUSA VITAL (60 min)</h3>
              <p className="procesos-sesion-desc">
                Reiki Usui + Cuencos. El alivio necesario para el estrés y la ansiedad. Una recarga vital y calma profunda para resetear tu sistema y re-equilibrar tus centros energéticos.
              </p>
              <Link href="/servicios/procesos/sesiones-integrales" className="procesos-btn-cream">
                AGENDAR MI PAUSA VITAL
              </Link>
            </article>

            <article className="procesos-sesion-card">
              <h3 className="procesos-sesion-title">Sesión REPROGRAMACIÓN CONSCIENTE (75 min)</h3>
              <p className="procesos-sesion-desc">
                Chamanismo + Péndulo. Disolución de nudos y transformación de creencias limitantes a nivel profundo. <em>Incluye: Mapeo de lo abordado + Elixir personalizado.</em>
              </p>
              <Link href="/servicios/procesos/sesiones-integrales" className="procesos-btn-cream">
                RESERVAR MI REPROGRAMACIÓN
              </Link>
            </article>

            <article className="procesos-sesion-card">
              <h3 className="procesos-sesion-title">Sesión VISIÓN Y PRESENCIA (90 min)</h3>
              <p className="procesos-sesion-desc">
                Reiki + Chamanismo + Baño Sonoro. Nuestra sesión más completa para armonizar cuerpo y espíritu. Una integración total de tus cuerpos físico, mental y sutil. <em>Incluye: Elixir personalizado + Protocolo de Anclaje Somático post-sesión.</em>
              </p>
              <Link href="/servicios/procesos/sesiones-integrales" className="procesos-btn-cream">
                SOLICITAR VISIÓN Y PRESENCIA
              </Link>
            </article>
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
