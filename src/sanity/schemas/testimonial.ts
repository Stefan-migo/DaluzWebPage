import { defineField, defineType } from 'sanity'

export const testimonialSchema = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  icon: () => '⭐',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del Cliente',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
      description: 'Para verificación (no se muestra públicamente)'
    }),
    defineField({
      name: 'avatar',
      title: 'Foto',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto Alternativo'
        }
      ]
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonio',
      type: 'text',
      rows: 5,
      validation: Rule => Rule.required().max(500),
      description: 'Máximo 500 caracteres'
    }),
    defineField({
      name: 'rating',
      title: 'Calificación',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5),
      description: 'De 1 a 5 estrellas'
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Producto', value: 'producto' },
          { title: 'Servicio', value: 'servicio' },
          { title: 'Membresía', value: 'membresia' },
          { title: 'Experiencia General', value: 'general' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'productOrService',
      title: 'Producto o Servicio',
      type: 'string',
      description: 'Nombre específico del producto o servicio mencionado'
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'string',
      description: 'Ciudad, Provincia (opcional)'
    }),
    defineField({
      name: 'featured',
      title: 'Destacado',
      type: 'boolean',
      description: 'Mostrar en la página principal',
      initialValue: false
    }),
    defineField({
      name: 'verified',
      title: 'Verificado',
      type: 'boolean',
      description: 'Cliente verificado',
      initialValue: false
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de Publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'beforeAfterImages',
      title: 'Imágenes Antes/Después',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        {
          name: 'before',
          title: 'Antes',
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto Alternativo'
            }
          ]
        },
        {
          name: 'after',
          title: 'Después',
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto Alternativo'
            }
          ]
        },
        {
          name: 'timeframe',
          title: 'Período de Tiempo',
          type: 'string',
          description: 'Ej: "Después de 3 meses de uso"'
        }
      ]
    }),
    defineField({
      name: 'skinConcerns',
      title: 'Problemas de Piel',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Acné', value: 'acne' },
          { title: 'Manchas', value: 'manchas' },
          { title: 'Arrugas', value: 'arrugas' },
          { title: 'Sequedad', value: 'sequedad' },
          { title: 'Grasa Excesiva', value: 'grasa' },
          { title: 'Sensibilidad', value: 'sensibilidad' },
          { title: 'Falta de Firmeza', value: 'firmeza' },
          { title: 'Poros Dilatados', value: 'poros' }
        ]
      },
      description: 'Problemas de piel que el producto ayudó a resolver'
    }),
    defineField({
      name: 'ageRange',
      title: 'Rango de Edad',
      type: 'string',
      options: {
        list: [
          { title: '18-25', value: '18-25' },
          { title: '26-35', value: '26-35' },
          { title: '36-45', value: '36-45' },
          { title: '46-55', value: '46-55' },
          { title: '56+', value: '56+' }
        ]
      }
    }),
    defineField({
      name: 'membershipPhase',
      title: 'Fase de Membresía',
      type: 'string',
      options: {
        list: [
          { title: 'Despertar', value: 'despertar' },
          { title: 'Purificación', value: 'purificacion' },
          { title: 'Transformación', value: 'transformacion' },
          { title: 'Integración', value: 'integracion' },
          { title: 'Manifestación', value: 'manifestacion' },
          { title: 'Programa Completo', value: 'completo' }
        ]
      },
      description: 'Solo para testimonios de membresía'
    }),
    defineField({
      name: 'transformationAreas',
      title: 'Áreas de Transformación',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Autoestima', value: 'autoestima' },
          { title: 'Relaciones', value: 'relaciones' },
          { title: 'Carrera Profesional', value: 'carrera' },
          { title: 'Salud Física', value: 'salud' },
          { title: 'Bienestar Emocional', value: 'emocional' },
          { title: 'Espiritualidad', value: 'espiritualidad' },
          { title: 'Propósito de Vida', value: 'proposito' },
          { title: 'Abundancia', value: 'abundancia' }
        ]
      },
      description: 'Solo para testimonios de membresía'
    }),
    defineField({
      name: 'socialMedia',
      title: 'Redes Sociales',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        {
          name: 'instagram',
          title: 'Instagram Handle',
          type: 'string',
          description: '@usuario (opcional, con permiso)'
        },
        {
          name: 'allowTag',
          title: 'Permitir Etiquetado',
          type: 'boolean',
          description: 'El cliente permite ser etiquetado en redes sociales'
        }
      ]
    }),
    defineField({
      name: 'internalNotes',
      title: 'Notas Internas',
      type: 'text',
      rows: 3,
      description: 'Notas internas (no se muestran públicamente)'
    })
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'testimonial',
      rating: 'rating',
      category: 'category',
      media: 'avatar'
    },
    prepare(selection) {
      const { title, subtitle, rating, category, media } = selection
      const stars = '⭐'.repeat(rating || 0)
      return {
        title: `${title} ${stars}`,
        subtitle: `${category} • ${subtitle?.substring(0, 60)}...`,
        media
      }
    }
  },

  orderings: [
    {
      title: 'Más recientes',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: 'Mejor calificación',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }]
    },
    {
      title: 'Destacados',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'rating', direction: 'desc' }
      ]
    }
  ]
}) 