import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Tu Ceremonia | ALKIMYA | DA LUZ CONSCIENTE',
  description: 'Rituales y ceremonias personalizadas para tu bienestar consciente.',
}

export default function TuCeremoniaPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6 text-brand-primary">
            Tu Ceremonia
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Rituales y ceremonias personalizadas
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-title text-2xl">Contenido en Desarrollo</CardTitle>
            <CardDescription>
              Esta sección está en construcción. Próximamente encontrarás guías para crear tus propios rituales y ceremonias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Estamos trabajando en crear contenido completo sobre cómo crear rituales y ceremonias personalizadas 
              que te ayuden a conectar profundamente con tus alkimyas y tu bienestar consciente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

