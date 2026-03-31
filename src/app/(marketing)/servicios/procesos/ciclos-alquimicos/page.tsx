import { Metadata } from 'next';
import Link from 'next/link';
import {
  ProcesosBackground,
  ProcesosOvalBox,
} from '@/components/svg/ProcesosPageComponents';
import '../procesos-pages.css';
import './ciclos.css';

const PROCESOS_WRAPPER = 'procesos-pages';

export const metadata: Metadata = {
  title: 'Ciclos Alquímicos | DA LUZ CONSCIENTE',
  description:
    'Rutas de transformación consciente: Oasis, Metamorfosis y Génesis. Depuración natural y acompañamiento holístico para recuperar tu bioequilibrio.',
  openGraph: {
    title: 'Ciclos Alquímicos - DA LUZ CONSCIENTE',
    description:
      'Oasis, Metamorfosis y Génesis. Programas de sanación y purificación para tu viaje alquímico.',
    type: 'website',
  },
};

export default function CiclosAlquimicosPage() {
  return (
    <div className={PROCESOS_WRAPPER}>
      <div className="procesos-page-container">
        <ProcesosBackground variant="general" />

        {/* Cabecera - full width como Sesiones */}
        <section
          className="ciclos-header-band"
          aria-labelledby="ciclos-section-title"
        >
          <div className="ciclos-header-band-inner">
            <h1 id="ciclos-section-title" className="ciclos-section-header">
              CICLOS ALQUIMICOS
            </h1>
          </div>
        </section>

        <main className="ciclos-main" id="ciclos-content">
          {/* Bloque 1: Introducción */}
          <section
            className="ciclos-intro"
            aria-labelledby="ciclos-intro-heading"
          >
            <h2 id="ciclos-intro-heading" className="sr-only">
              Introducción a los Ciclos Alquímicos
            </h2>
            <p className="ciclos-intro-item ciclos-intro-left-1">
              Nuestros Ciclos Alquímicos son caminos de transformación consciente diseñados para reconectar tu biología con tu esencia.
            </p>
            <p className="ciclos-intro-item ciclos-intro-right">
              A través de la depuración natural y el acompañamiento holístico, recuperarás tu bioequilibrio y potenciarás tu bienestar.
            </p>
            <p className="ciclos-intro-item ciclos-intro-left-2">
              Iniciá el Viaje Alquímico: Donde la Biología y la Consciencia se unen.
            </p>

          </section>
          {/* Bloque 2: OASIS */}
          <article
            className="ciclos-cycle-block"
            aria-labelledby="ciclos-oasis-title"
          >
            <div className="ciclos-cycle-header">
              <h2 id="ciclos-oasis-title" className="ciclos-cycle-title">
                OASIS
              </h2>
            </div>
            <p className="ciclos-cycle-subtitle">
              <strong>Ideal para:</strong> Quien busca una sanación 100% a medida para comenzar.
            </p>
            <div className="ciclos-cycle-ovals">
              <ProcesosOvalBox className="ciclos-oval-left">
                <strong>Modalidad:</strong>
                <br />
                Individual, asistido con preparados de Flores de Bach o Aromaterapia.
              </ProcesosOvalBox>
              <ProcesosOvalBox className="ciclos-oval-right">
                <strong>Foco Principal:</strong> Acechar tus puntos débiles y reconocer tu potencial para mapear y restaurar tu bioequilibrio.
                <br /><br />
                <strong>Incluye:</strong> Mapeo Astrológico y meditaciones personalizados para tu viaje.
              </ProcesosOvalBox>
            </div>
            <div className="ciclos-cycle-cta">
              <Link href="#" className="procesos-btn-cream ciclos-detail-link">
                VER DETALLES COMPLETOS DE OASIS
              </Link>
            </div>
          </article>

          {/* Bloque 4: METAMORFOSIS */}
          <article
            className="ciclos-cycle-block"
            aria-labelledby="ciclos-metamorfosis-title"
          >
            <div className="ciclos-cycle-header">
              <h2 id="ciclos-metamorfosis-title" className="ciclos-cycle-title">
                METAMORFOSIS
              </h2>
              <p className="ciclos-cycle-subtitle">
                <strong>Duración:</strong> entre 3 a 5 meses de inmersión y purificación.
              </p>
            </div>
            <div className="ciclos-cycle-ovals">
              <ProcesosOvalBox className="ciclos-oval-left">
                <strong>Herramientas:</strong>
                <br />
                Medicina Herbal, Chamanismo y Elixires.
              </ProcesosOvalBox>
              <ProcesosOvalBox className="ciclos-oval-right">
                <strong>Foco Principal:</strong> Limpieza de filtros orgánicos para permitir el flujo vital con la sabiduría ancestral de las hierbas medicinales, y re-programación vibracional con Elixires asistentes.
                <br /><br />
                <strong>Incluye:</strong> Meditaciones y ejercicios personalizados.
              </ProcesosOvalBox>
            </div>
            <div className="ciclos-cycle-cta">
              <Link href="#" className="procesos-btn-cream ciclos-detail-link">
                VER DETALLES COMPLETOS DE METAMORFOSIS
              </Link>
            </div>
          </article>

          {/* Bloque 5: GENESIS */}
          <article
            className="ciclos-cycle-block ciclos-cycle-block-last"
            aria-labelledby="ciclos-genesis-title"
          >
            <div className="ciclos-cycle-header">
              <h2 id="ciclos-genesis-title" className="ciclos-cycle-title">
                GENESIS
              </h2>
              <p className="ciclos-cycle-subtitle">
                <strong>Duración:</strong> 7 meses, el ciclo completo para una renovación consciente.
              </p>
            </div>
            <div className="ciclos-cycle-ovals">
              <ProcesosOvalBox className="ciclos-oval-left">
                <strong>El Programa:</strong> Acceso paulatino al recorrido de los 6 Ejes para una purificación orgánica y psíquica total.
                <br /><br />
                <strong>La Diferencia:</strong> Incluye sesiones individuales mensuales (1h 15min) para ajustar el proceso a tu pulso único.
              </ProcesosOvalBox>
              <ProcesosOvalBox className="ciclos-oval-right">
                <strong>Foco Principal:</strong> Depuración integral con la potencia de las hierbas medicinales, enfocada en la limpieza profunda y específica de sistemas y órganos clave, llevando el bienestar a nivel celular.
                <br /><br />
                <strong>Incluye:</strong> Archivos descargables semanales y una sesión mensual uno a uno para una guía profunda + Elixir aromático-floral.
              </ProcesosOvalBox>
            </div>
            <div className="ciclos-cycle-cta">
              <Link href="#" className="procesos-btn-cream ciclos-detail-link">
                VER DETALLES COMPLETOS DE GENESIS
              </Link>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
