import { Metadata } from 'next'
import './ceremonia-corporal.css'

export const metadata: Metadata = {
    title: 'Ceremonia Corporal | ALKIMYA',
    description: 'Descubre tu ceremonia corporal para revitalizar tu piel y tu energía.',
}

export default function CeremoniaCorporalPage() {
    return (
        <div className="ceremonia-corporal-page">
            <h1 className="ceremonia-corporal-title">CEREMONIA CORPORAL</h1>
            <div className="ceremonia-corporal-content">
                <p>
                    Bienvenida a tu ceremonia corporal. Aquí encontrarás los pasos para transformar el cuidado de tu cuerpo en un ritual consciente, conectando con tu energía vital.
                </p>
            </div>
        </div>
    )
}
