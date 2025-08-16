import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Video,
  Users,
  HelpCircle 
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Centro de Ayuda | DA LUZ CONSCIENTE',
  description: 'Encuentra ayuda y soporte para todos tus productos y servicios de DA LUZ CONSCIENTE.',
}

export default function AyudaPage() {
  const helpCategories = [
    {
      title: "Guías de Productos",
      description: "Aprende a usar correctamente cada producto de nuestras líneas",
      icon: BookOpen,
      color: "bg-alma-primary",
      items: ["Guías de aplicación", "Ingredientes y beneficios", "Combinaciones recomendadas"]
    },
    {
      title: "Soporte Técnico",
      description: "Ayuda con tu cuenta, pagos y problemas técnicos",
      icon: HelpCircle,
      color: "bg-ecos-primary", 
      items: ["Problemas de acceso", "Errores de pago", "Actualizaciones de cuenta"]
    },
    {
      title: "Programa de Membresía", 
      description: "Todo lo que necesitas saber sobre tu membresía",
      icon: Users,
      color: "bg-jade-primary",
      items: ["Acceso a contenido", "Calendario de módulos", "Beneficios exclusivos"]
    },
    {
      title: "Envíos y Devoluciones",
      description: "Información sobre envíos, seguimiento y políticas",
      icon: FileText,
      color: "bg-umbral-primary",
      items: ["Estado de pedidos", "Políticas de devolución", "Tiempos de entrega"]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Estamos Aquí para Ayudarte
          </Badge>
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6">
            Centro de Ayuda
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Encuentra respuestas, guías y soporte completo para tu experiencia con DA LUZ CONSCIENTE
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6 text-brand-primary">
              ¿Cómo podemos ayudarte?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Selecciona la categoría que mejor describe tu consulta
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpCategories.map((category, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer">
                <div className={`absolute top-0 left-0 right-0 h-1 ${category.color}`} />
                <CardHeader className="text-center">
                  <category.icon className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                  <CardTitle className="font-velista text-lg">{category.title}</CardTitle>
                  <CardDescription className="text-sm">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Resources */}
      <section className="py-20 px-6 bg-bg-cream">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6">
              Recursos Populares
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Los recursos más consultados por nuestra comunidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <Video className="w-8 h-8 text-brand-primary mb-2" />
                <CardTitle className="font-velista">Tutoriales en Video</CardTitle>
                <CardDescription>Aprende con nuestras guías visuales paso a paso</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Próximamente
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <FileText className="w-8 h-8 text-brand-primary mb-2" />
                <CardTitle className="font-velista">Guías Descargables</CardTitle>
                <CardDescription>PDFs con información detallada sobre productos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Próximamente
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-brand-primary mb-2" />
                <CardTitle className="font-velista">Preguntas Frecuentes</CardTitle>
                <CardDescription>Respuestas a las consultas más comunes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/faq">Ver FAQ</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6">
              Contacta Nuestro Equipo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Si no encontraste lo que buscas, nuestro equipo está listo para ayudarte personalmente
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardHeader className="text-center">
                <Mail className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <CardTitle className="font-velista">Soporte por Email</CardTitle>
                <CardDescription>Te respondemos en menos de 24 horas</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">info@daluzconsciente.com</p>
                <Button className="w-full" asChild>
                  <Link href="mailto:info@daluzconsciente.com">Enviar Email</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="text-center">
                <MessageCircle className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <CardTitle className="font-velista">WhatsApp</CardTitle>
                <CardDescription>Atención inmediata para consultas urgentes</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Lun a Vie: 9:00 - 18:00 hs</p>
                <Button className="w-full" asChild>
                  <Link href="/contacto">Contactar por WhatsApp</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
