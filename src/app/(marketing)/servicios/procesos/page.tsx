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
  title: 'Procesos Holísticos | DA LUZ CONSCIENTE',
  description:
    'Acompañamiento desde el Ser: plantas medicinales, esencias florales, alquimias y herramientas para tu recorrido hacia adentro. El Botiquín Alquímico y Cofre DA LUZ.',
  openGraph: {
    title: 'Procesos Holísticos - DA LUZ CONSCIENTE',
    description:
      'Terapias para el bienestar integral. Descubre el Botiquín Alquímico y el Cofre DA LUZ.',
    type: 'website',
  },
};

export default function ProcesosPage() {
  return (
    <div className={PROCESOS_WRAPPER}>
      <div className="procesos-page-container">
        <ProcesosBackground variant="general" />

        {/* Cabecera - mismo estilo que Sesiones */}
        <section className="procesos-header-band" aria-labelledby="procesos-title">
          <div className="procesos-header-band-inner">
            <h1 id="procesos-title" className="procesos-band-title">
              Procesos
            </h1>
          </div>
        </section>

        {/* Central content - Z composition */}
        <section className="procesos-central-content">
          <div className="procesos-z-grid">
            {/* Top-left: Imagen 1 - meditación */}
            <div className="procesos-cell-oval-1">
              <ProcesosOvalPlaceholder
                src="/svg/procesos/image1%20Procesos.png"
                alt="Meditación y transformación consciente en un espacio alquímico"
              />
            </div>

            {/* Top-right: Text box 1 */}
            <div className="procesos-cell-text-1">
              <ProcesosOrganicBox>
                Acompaño desde mi Ser, desde mis saberes, desde las plantas
                medicinales, las esencias florales, las alquimias y las diversas
                herramientas adquiridas en mi Recorrido hacia adentro.
              </ProcesosOrganicBox>
            </div>

            {/* Bottom-left: Text box 2 */}
            <div className="procesos-cell-text-2">
              <ProcesosOrganicBox>
                <p className="mb-4">
                  <strong>EL BOTIQUÍN ALQUÍMICO:</strong> Tu farmacia natural
                  para la autogestión diaria. (Tinturas, Microdosis, Elixires y
                  Aromaterapia).{' '}
                  <Link href="/servicios/procesos/ciclos-alquimicos" className="font-bold">
                    EXPLORAR EL BOTIQUÍN
                  </Link>
                </p>
                <p>
                  <strong>COFRE DA LUZ:</strong> Tecnologías vibracionales que
                  sostienen el campo de sanación. (Sonidos Ancestrales,
                  Péndulo, Reiki y Mapeos de Personalidad).{' '}
                  <Link href="/servicios/procesos/sesiones-integrales" className="font-bold">
                    ABRIR EL COFRE DE ALIADOS
                  </Link>
                </p>
              </ProcesosOrganicBox>
            </div>

            {/* Bottom-right: Imagen 2 - tinturas */}
            <div className="procesos-cell-oval-2">
              <ProcesosOvalPlaceholder
                src="/svg/procesos/image2%20Procesos.png"
                alt="Cofre con tinturas y elixires naturales"
              />
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="procesos-page-footer">
          <p className="procesos-page-cta-text">
            Obtené más info haciendo click en uno de estos botones
          </p>
          <div className="procesos-page-buttons">
            <Link
              href="/servicios/procesos/sesiones-integrales"
              className="procesos-btn-cream"
            >
              Sesiones
            </Link>
            <Link
              href="/servicios/procesos/ciclos-alquimicos"
              className="procesos-btn-cream"
            >
              Ciclos
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
