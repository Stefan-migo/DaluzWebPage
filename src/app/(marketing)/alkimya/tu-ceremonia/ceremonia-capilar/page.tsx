import { Metadata } from 'next'
import './ceremonia-capilar.css'

export const metadata: Metadata = {
    title: 'Ceremonia Capilar | ALKIMYA',
    description: 'Descubre tu ceremonia capilar para un cabello radiante y sano.',
}

export default function CeremoniaCapilarPage() {
    return (
        <div className="ceremonia-capilar-page">
            <h1 className="ceremonia-capilar-title">CEREMONIA CAPILAR</h1>
            <div className="ceremonia-capilar-content">
                <p>
                    Bienvenida a tu ceremonia capilar. Aquí encontrarás los pasos para transformar el cuidado de tu cabello en un ritual consciente.
                </p>
            </div>
        </div>
    )
}
