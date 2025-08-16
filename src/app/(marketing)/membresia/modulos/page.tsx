import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Play, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Módulos Semanales | DA LUZ CONSCIENTE',
  description: 'Accede a todos los módulos semanales de tu programa de transformación.',
}

export default function ModulosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-jade-primary to-jade-secondary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Contenido Exclusivo
          </Badge>
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6">
            Módulos Semanales
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Accede a tu contenido semanal personalizado y descarga materiales exclusivos
          </p>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6 text-brand-primary">
              Tu Progreso Semanal
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cada semana desbloquea nuevo contenido diseñado para acompañarte en tu transformación
            </p>
          </div>

          <div className="grid gap-8">
            {[
              { week: 1, title: "Fundamentos del Despertar", status: "completed", theme: "alma" },
              { week: 2, title: "Conexión con los Elementos", status: "completed", theme: "ecos" },
              { week: 3, title: "Rituales de Purificación", status: "current", theme: "umbral" },
              { week: 4, title: "Sabiduría Ancestral", status: "locked", theme: "jade" },
              { week: 5, title: "Visión Interior", status: "locked", theme: "utopica" }
            ].map((module) => (
              <Card key={module.week} className={`relative overflow-hidden transition-all ${
                module.status === 'current' ? 'ring-2 ring-brand-primary shadow-lg' : 
                module.status === 'locked' ? 'opacity-60' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        module.status === 'completed' ? 'default' :
                        module.status === 'current' ? 'destructive' : 'outline'
                      }>
                        Semana {module.week}
                      </Badge>
                      <CardTitle className="font-velista text-xl">{module.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {module.status === 'completed' && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                      {module.status === 'current' && <div className="w-3 h-3 bg-brand-primary rounded-full animate-pulse" />}
                      {module.status === 'locked' && <div className="w-3 h-3 bg-gray-300 rounded-full" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Play className="w-5 h-5 text-brand-primary" />
                      <div>
                        <div className="font-medium text-sm">Video Guía</div>
                        <div className="text-xs text-gray-500">25 min</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-brand-primary" />
                      <div>
                        <div className="font-medium text-sm">Material PDF</div>
                        <div className="text-xs text-gray-500">12 páginas</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Download className="w-5 h-5 text-brand-primary" />
                      <div>
                        <div className="font-medium text-sm">Ejercicios</div>
                        <div className="text-xs text-gray-500">Prácticas</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      disabled={module.status === 'locked'}
                      className={module.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {module.status === 'completed' ? 'Revisar' : 
                       module.status === 'current' ? 'Continuar' : 'Bloqueado'}
                    </Button>
                    {module.status !== 'locked' && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Access Info */}
      <section className="py-20 px-6 bg-bg-cream">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6">
            Área de Miembros
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Para acceder al contenido completo, necesitas iniciar sesión con tu cuenta de miembro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/membresia">Conocer Membresía</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
