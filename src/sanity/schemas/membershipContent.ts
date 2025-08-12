import { defineField, defineType } from 'sanity'

export const membershipContentSchema = defineType({
  name: 'membershipContent',
  title: 'Contenido de Membresía',
  type: 'document',
  icon: () => '🧘‍♀️',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'URL (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      }
    }),
    defineField({
      name: 'moduleNumber',
      title: 'Número de Módulo',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(28),
      description: 'Número de semana/módulo (1-28 para el programa de 7 meses)'
    }),
    defineField({
      name: 'phase',
      title: 'Fase del Programa',
      type: 'string',
      options: {
        list: [
          { title: 'Fase 1: Despertar (Semanas 1-4)', value: 'despertar' },
          { title: 'Fase 2: Purificación (Semanas 5-8)', value: 'purificacion' },
          { title: 'Fase 3: Transformación (Semanas 9-16)', value: 'transformacion' },
          { title: 'Fase 4: Integración (Semanas 17-24)', value: 'integracion' },
          { title: 'Fase 5: Manifestación (Semanas 25-28)', value: 'manifestacion' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      description: 'Breve descripción del contenido del módulo'
    }),
    defineField({
      name: 'learningObjectives',
      title: 'Objetivos de Aprendizaje',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Qué aprenderá el participante en este módulo'
    }),
    defineField({
      name: 'content',
      title: 'Contenido Principal',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Título H2', value: 'h2' },
            { title: 'Título H3', value: 'h3' },
            { title: 'Cita', value: 'blockquote' }
          ]
        },
        {
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
          name: 'video',
          title: 'Video',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Título del Video',
              type: 'string'
            },
            {
              name: 'url',
              title: 'URL del Video',
              type: 'url',
              description: 'URL de YouTube, Vimeo, etc.'
            },
            {
              name: 'duration',
              title: 'Duración (minutos)',
              type: 'number'
            },
            {
              name: 'transcript',
              title: 'Transcripción',
              type: 'text',
              rows: 5
            }
          ]
        },
        {
          name: 'audio',
          title: 'Audio/Meditación',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Título del Audio',
              type: 'string'
            },
            {
              name: 'file',
              title: 'Archivo de Audio',
              type: 'file',
              options: {
                accept: 'audio/*'
              }
            },
            {
              name: 'duration',
              title: 'Duración (minutos)',
              type: 'number'
            },
            {
              name: 'type',
              title: 'Tipo',
              type: 'string',
              options: {
                list: [
                  { title: 'Meditación Guiada', value: 'meditacion' },
                  { title: 'Respiración', value: 'respiracion' },
                  { title: 'Relajación', value: 'relajacion' },
                  { title: 'Afirmaciones', value: 'afirmaciones' },
                  { title: 'Clase Teórica', value: 'teoria' }
                ]
              }
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'exercises',
      title: 'Ejercicios Prácticos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Título del Ejercicio',
              type: 'string'
            },
            {
              name: 'instructions',
              title: 'Instrucciones',
              type: 'array',
              of: [{ type: 'block' }]
            },
            {
              name: 'estimatedTime',
              title: 'Tiempo Estimado (minutos)',
              type: 'number'
            },
            {
              name: 'difficulty',
              title: 'Dificultad',
              type: 'string',
              options: {
                list: [
                  { title: 'Principiante', value: 'beginner' },
                  { title: 'Intermedio', value: 'intermediate' },
                  { title: 'Avanzado', value: 'advanced' }
                ]
              }
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'downloads',
      title: 'Material Descargable',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Título',
              type: 'string'
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text'
            },
            {
              name: 'file',
              title: 'Archivo',
              type: 'file'
            },
            {
              name: 'type',
              title: 'Tipo',
              type: 'string',
              options: {
                list: [
                  { title: 'PDF', value: 'pdf' },
                  { title: 'Audio', value: 'audio' },
                  { title: 'Video', value: 'video' },
                  { title: 'Imagen', value: 'image' },
                  { title: 'Otro', value: 'other' }
                ]
              }
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'journalPrompts',
      title: 'Preguntas de Reflexión',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Preguntas para el diario personal de transformación'
    }),
    defineField({
      name: 'affirmations',
      title: 'Afirmaciones',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Afirmaciones positivas para este módulo'
    }),
    defineField({
      name: 'nutritionTips',
      title: 'Consejos Nutricionales',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'tip',
              title: 'Consejo',
              type: 'string'
            },
            {
              name: 'explanation',
              title: 'Explicación',
              type: 'text'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'isLocked',
      title: 'Contenido Bloqueado',
      type: 'boolean',
      description: 'Si está marcado, solo miembros activos pueden acceder',
      initialValue: true
    }),
    defineField({
      name: 'releaseDate',
      title: 'Fecha de Liberación',
      type: 'datetime',
      description: 'Cuándo se libera este contenido en el programa'
    }),
    defineField({
      name: 'estimatedCompletionTime',
      title: 'Tiempo Estimado de Completar (horas)',
      type: 'number',
      validation: Rule => Rule.min(0.5).max(10)
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    })
  ],

  preview: {
    select: {
      title: 'title',
      moduleNumber: 'moduleNumber',
      phase: 'phase'
    },
    prepare(selection) {
      const { title, moduleNumber, phase } = selection
      return {
        title: `Módulo ${moduleNumber}: ${title}`,
        subtitle: phase ? phase.charAt(0).toUpperCase() + phase.slice(1) : 'Sin fase'
      }
    }
  },

  orderings: [
    {
      title: 'Por número de módulo',
      name: 'moduleNumberAsc',
      by: [{ field: 'moduleNumber', direction: 'asc' }]
    },
    {
      title: 'Por fecha de liberación',
      name: 'releaseDateAsc',
      by: [{ field: 'releaseDate', direction: 'asc' }]
    }
  ]
}) 