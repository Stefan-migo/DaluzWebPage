import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Origen | Raices Da Luz | DA LUZ CONSCIENTE',
  description: 'El camino que nos trajo hasta aquí, nuestra historia y orígenes.',
}

export default function OrigenPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6 text-brand-primary">
            Origen
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            El camino que nos trajo hasta aquí
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-title text-2xl">Contenido en Desarrollo</CardTitle>
            <CardDescription>
              Esta sección está en construcción. Próximamente encontrarás información sobre nuestros orígenes y el camino recorrido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Estamos trabajando en crear contenido completo sobre nuestros orígenes, el camino que nos trajo hasta aquí 
              y la historia que da forma a DA LUZ CONSCIENTE.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

