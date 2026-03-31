import { Metadata } from 'next';
import Link from 'next/link';
import { ProcesosBackground } from '@/components/svg/ProcesosPageComponents';
import '../procesos-pages.css';
import './sesiones.css';

const PROCESOS_WRAPPER = 'procesos-pages';

export const metadata: Metadata = {
  title: 'Sesiones Integrales | DA LUZ CONSCIENTE',
  description:
    'Encuentros de alta potencia: Pausa Vital, Reprogramación Consciente y Visión y Presencia. Reiki, Chamanismo, Cuencos Sonoros y más.',
  openGraph: {
    title: 'Sesiones Integrales - DA LUZ CONSCIENTE',
    description:
      'Pausa Vital, Reprogramación Consciente y Visión y Presencia. Claridad y armonía para tu energía.',
    type: 'website',
  },
};

export default function SesionesIntegralesPage() {
  return (
    <div className={PROCESOS_WRAPPER}>
      <div className="procesos-page-container">
        <ProcesosBackground variant="general" />

        {/* 1. Cabecera */}
        <section className="sesiones-header-band">
          <div className="sesiones-header-band-inner">
            <h1 className="sesiones-page-title">Sesiones</h1>
          </div>
        </section>

        {/* 2. Introducción */}
        <section className="sesiones-intro">
          <p className="sesiones-intro-block sesiones-intro-left">
            Nuestras Sesiones Integrales son encuentros de alta potencia para tu energía. Te ofrecen la claridad y la armonía necesaria para avanzar. Aquí, el equilibrio se activa en el presente.
          </p>
          <p className="sesiones-intro-block sesiones-intro-right">
            ¿Qué Sesión Integral Desea Hoy tu Energía?
            <br />
            Tu cuerpo es un mapa; elegí la ruta para tu equilibrio.
          </p>
        </section>

        {/* 3. Grilla de sesiones */}
        <section className="sesiones-grid">
          {/* Columna 1: PAUSA VITAL */}
          <article className="sesiones-card">
            <h2 className="sesiones-card-title">Pausa Vital</h2>
            <div className="sesiones-card-body">
              <p><strong>Técnicas:</strong> Reiki Usui y Cuencos Sonoros.</p>
              <p><strong>Duración:</strong> 60 minutos.</p>
              <p><strong>Ideal para:</strong> Estados de ansiedad, insomnio, nerviosismo, estrés crónico y necesidad de una calma profunda.</p>
              <p><strong>Beneficio:</strong> El alivio necesario para el estrés y la ansiedad. Una recarga vital y calma profunda para resetear tu sistema y re-equilibrar tus centros energéticos.</p>
              <p><strong>Enfoque Da Luz:</strong> Un encuentro con la Presencia y el Amor para restaurar el equilibrio de tu energía vital.</p>
            </div>
            <div className="sesiones-card-cta">
              <Link href="#" className="procesos-btn-cream">
                VER DETALLES DE REPROGRAMACIÓN Y RESERVAR
              </Link>
            </div>
          </article>

          {/* Columna 2: REPROGRAMACIÓN CONSCIENTE */}
          <article className="sesiones-card">
            <h2 className="sesiones-card-title">Reprogramación Consciente</h2>
            <div className="sesiones-card-body">
              <p><strong>Técnicas:</strong> Chamanismo y Péndulo.</p>
              <p><strong>Duración:</strong> 75 minutos.</p>
              <p><strong>Ideal para:</strong> Quienes buscan transformar patrones limitantes, comprender bloqueos emocionales, disolver nudos energéticos y reprogramar sus creencias centrales.</p>
              <p><strong>Beneficio:</strong> Descifrar la información de tu subconsciente y alinear tu fuerza interior con tu camino evolutivo. Disolución de nudos y transformación de creencias limitantes a nivel profundo.</p>
              <p><strong>Incluye:</strong> Mapeo de lo abordado + Elixir personalizado.</p>
            </div>
            <div className="sesiones-card-cta">
              <Link href="#" className="procesos-btn-cream">
                VER DETALLES DE REPROGRAMACIÓN Y RESERVAR
              </Link>
            </div>
          </article>

          {/* Columna 3: VISIÓN Y PRESENCIA */}
          <article className="sesiones-card">
            <h2 className="sesiones-card-title">Visión y Presencia</h2>
            <div className="sesiones-card-body">
              <p><strong>Técnicas:</strong> Reiki Usui, Técnicas Chamánicas (Reprogramación Sutil) y Baño Sonoro.</p>
              <p><strong>Duración:</strong> 90 minutos.</p>
              <p><strong>Ideal para:</strong> La integración profunda del trabajo energético y físico. Cuando buscas una armonización completa y duradera para el cuerpo-mente.</p>
              <p><strong>Beneficio:</strong> Armoniza y equilibra tu energía con la suavidad sanadora del Reiki Usui y la potencia transformadora del chamanismo. Una integración total de tus cuerpos físico, mental y sutil.</p>
              <p><strong>Incluye:</strong> Elixir personalizado + Protocolo de Anclaje Somático post-sesión.</p>
            </div>
            <div className="sesiones-card-cta">
              <Link href="#" className="procesos-btn-cream">
                VER DETALLES DE REPROGRAMACIÓN Y RESERVAR
              </Link>
            </div>
          </article>
        </section>

      </div>
    </div>
  );
}
