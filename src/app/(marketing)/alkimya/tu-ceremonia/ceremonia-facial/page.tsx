import { Metadata } from 'next'
import './ceremonia-facial.css'

export const metadata: Metadata = {
    title: 'Ceremonia Facial | ALKIMYA',
    description: 'Descubre tu ceremonia facial para una piel radiante y conectada con tu ser.',
}

export default function CeremoniaFacialPage() {
    return (
        <div className="ceremonia-facial-page">
            <h1 className="ceremonia-facial-title">CEREMONIA FACIAL</h1>
            <div className="ceremonia-facial-content">
                <p>
                    Bienvenida a tu ceremonia facial. Aquí encontrarás los pasos para transformar tu cuidado en un ritual consciente, conectando la intención, el cuerpo y la mente.
                </p>
            </div>
        </div>
    )
}
