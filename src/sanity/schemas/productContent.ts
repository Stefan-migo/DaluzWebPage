import { defineField, defineType } from 'sanity'

export const productContentSchema = defineType({
  name: 'productContent',
  title: 'Contenido de Producto',
  type: 'document',
  icon: () => '🌿',
  fields: [
    defineField({
      name: 'productId',
      title: 'ID del Producto',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'ID del producto en Supabase'
    }),
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
      name: 'shortDescription',
      title: 'Descripción Corta',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(200),
      description: 'Descripción breve para listados'
    }),
    defineField({
      name: 'detailedDescription',
      title: 'Descripción Detallada',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Título H2', value: 'h2' },
            { title: 'Título H3', value: 'h3' }
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
        }
      ]
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredientes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Nombre',
              type: 'string'
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text',
              rows: 2
            },
            {
              name: 'percentage',
              title: 'Porcentaje',
              type: 'number',
              validation: Rule => Rule.min(0).max(100)
            },
            {
              name: 'organic',
              title: 'Orgánico',
              type: 'boolean',
              initialValue: false
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'benefits',
      title: 'Beneficios',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Lista de beneficios del producto'
    }),
    defineField({
      name: 'howToUse',
      title: 'Modo de Uso',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [
            { title: 'Lista ordenada', value: 'number' },
            { title: 'Lista no ordenada', value: 'bullet' }
          ]
        }
      ]
    }),
    defineField({
      name: 'skinTypes',
      title: 'Tipos de Piel',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Piel Grasa', value: 'grasa' },
          { title: 'Piel Seca', value: 'seca' },
          { title: 'Piel Mixta', value: 'mixta' },
          { title: 'Piel Sensible', value: 'sensible' },
          { title: 'Piel Normal', value: 'normal' },
          { title: 'Todo Tipo de Piel', value: 'todas' }
        ]
      }
    }),
    defineField({
      name: 'certifications',
      title: 'Certificaciones',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Nombre',
              type: 'string'
            },
            {
              name: 'image',
              title: 'Imagen',
              type: 'image'
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonios',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'testimonial' } }]
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Imágenes',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto Alternativo'
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Descripción'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'faq',
      title: 'Preguntas Frecuentes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Pregunta',
              type: 'string'
            },
            {
              name: 'answer',
              title: 'Respuesta',
              type: 'text',
              rows: 3
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Productos Relacionados',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'IDs de productos relacionados'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        {
          name: 'metaTitle',
          title: 'Título Meta',
          type: 'string',
          validation: Rule => Rule.max(60)
        },
        {
          name: 'metaDescription',
          title: 'Descripción Meta',
          type: 'text',
          validation: Rule => Rule.max(160)
        },
        {
          name: 'keywords',
          title: 'Palabras Clave',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags'
          }
        }
      ]
    })
  ],

  preview: {
    select: {
      title: 'title',
      productId: 'productId'
    },
    prepare(selection) {
      const { title, productId } = selection
      return {
        title,
        subtitle: `ID: ${productId}`
      }
    }
  }
}) 