import { Metadata } from 'next'
import FAQClient from './FAQClient'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | DA LUZ CONSCIENTE',
  description: 'Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios.',
}

export default function FAQPage() {
  return <FAQClient />
}
