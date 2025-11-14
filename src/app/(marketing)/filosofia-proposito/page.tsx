import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Filosofía y Propósito | Raices Da Luz | DA LUZ CONSCIENTE',
  description: 'Nuestra visión y valores fundamentales que guían nuestro propósito.',
}

export default function FilosofiaPropositoPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6 text-brand-primary">
            Filosofía y Propósito
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nuestra visión y valores fundamentales
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-title text-2xl">Contenido en Desarrollo</CardTitle>
            <CardDescription>
              Esta sección está en construcción. Próximamente encontrarás información detallada sobre nuestra filosofía y propósito.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Estamos trabajando en crear contenido completo sobre nuestra filosofía, valores fundamentales y el propósito 
              que guía todo lo que hacemos en DA LUZ CONSCIENTE.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

