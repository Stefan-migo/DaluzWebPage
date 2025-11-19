'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, ArrowRight, Check, AlertCircle } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    message?: string
  }>({})
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || 'Error al enviar el mensaje')
      }
      
      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
      
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Error al enviar el mensaje. Por favor intenta nuevamente.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    if (submitError) {
      setSubmitError(null)
    }
  }

  if (isSubmitted) {
    return (
      <div className="card-enhanced p-4 sm:p-6 lg:p-6 xl:p-8 rounded-2xl">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-subtitle text-xl text-gray-800 mb-2">
            ¡Mensaje Enviado!
          </h3>
          <p className="text-gray-600 mb-6">
            Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos dentro de las próximas 24 horas.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false)
              setFormData({ name: '', email: '', message: '' })
              setErrors({})
              setSubmitError(null)
            }}
            className="text-brand-primary hover:bg-brand-primary hover:text-white"
          >
            Enviar Otro Mensaje
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="card-enhanced p-4 sm:p-6 lg:p-6 xl:p-8 rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-subtitle font-medium text-gray-700 mb-3">
            Nombre Completo
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`form-enhanced w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 font-text ${
              errors.name ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="Tu nombre completo"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-subtitle font-medium text-gray-700 mb-3">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`form-enhanced w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 font-text ${
              errors.email ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="tu@email.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-subtitle font-medium text-gray-700 mb-3">
            ¿En qué podemos ayudarte?
          </label>
          <textarea
            rows={5}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className={`form-enhanced w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 font-text resize-none ${
              errors.message ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="Cuéntanos sobre tu consulta, dudas sobre productos, servicios o cualquier otra pregunta..."
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.message}
            </p>
          )}
        </div>
        
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium text-sm">Error al enviar</p>
              <p className="text-red-600 text-sm mt-1">{submitError}</p>
            </div>
          </div>
        )}
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="group btn-enhanced w-full py-4 text-lg text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Enviando...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Enviar Mensaje
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

