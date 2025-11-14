import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Biotipos y Doshas | ALKIMYA | DA LUZ CONSCIENTE',
  description: 'Personalización según tu naturaleza a través de biotipos y doshas.',
}

export default function BiotiposDoshasPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6 text-brand-primary">
            Biotipos y Doshas
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Personalización según tu naturaleza
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-title text-2xl">Contenido en Desarrollo</CardTitle>
            <CardDescription>
              Esta sección está en construcción. Próximamente encontrarás información sobre biotipos y doshas para personalizar tu experiencia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Estamos trabajando en crear contenido completo sobre cómo identificar tu biotipo y dosha, 
              y cómo esto puede ayudarte a elegir las alkimyas más adecuadas para tu naturaleza única.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

