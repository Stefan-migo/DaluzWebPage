import { defineField, defineType } from 'sanity'

export const pageSchema = defineType({
  name: 'page',
  title: 'Página',
  type: 'document',
  icon: () => '📄',
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
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'pageType',
      title: 'Tipo de Página',
      type: 'string',
      options: {
        list: [
          { title: 'Nosotros', value: 'about' },
          { title: 'Contacto', value: 'contact' },
          { title: 'Términos y Condiciones', value: 'terms' },
          { title: 'Política de Privacidad', value: 'privacy' },
          { title: 'FAQ', value: 'faq' },
          { title: 'Misión y Visión', value: 'mission' },
          { title: 'Equipo', value: 'team' },
          { title: 'Historia', value: 'history' },
          { title: 'Otra', value: 'other' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumen',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(200),
      description: 'Breve descripción de la página'
    }),
    defineField({
      name: 'heroSection',
      title: 'Sección Hero',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        {
          name: 'title',
          title: 'Título Principal',
          type: 'string'
        },
        {
          name: 'subtitle',
          title: 'Subtítulo',
          type: 'text',
          rows: 2
        },
        {
          name: 'backgroundImage',
          title: 'Imagen de Fondo',
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
          name: 'ctaText',
          title: 'Texto del Botón',
          type: 'string'
        },
        {
          name: 'ctaLink',
          title: 'Enlace del Botón',
          type: 'string'
        }
      ]
    }),
    defineField({
      name: 'content',
      title: 'Contenido',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Título H1', value: 'h1' },
            { title: 'Título H2', value: 'h2' },
            { title: 'Título H3', value: 'h3' },
            { title: 'Título H4', value: 'h4' },
            { title: 'Cita', value: 'blockquote' }
          ],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
              { title: 'Subrayado', value: 'underline' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL'
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Abrir en nueva ventana'
                  }
                ]
              }
            ]
          }
        },
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
              title: 'Pie de Imagen'
            }
          ]
        },
        {
          name: 'gallery',
          title: 'Galería de Imágenes',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Título de la Galería',
              type: 'string'
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text',
              rows: 2
            }
          ]
        },
        {
          name: 'teamSection',
          title: 'Sección de Equipo',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Título de la Sección',
              type: 'string'
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text',
              rows: 3
            }
          ]
        },
        {
          name: 'faq',
          title: 'Preguntas Frecuentes',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Título de la Sección',
              type: 'string'
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text',
              rows: 2
            }
          ]
        },
        {
          name: 'contactInfo',
          title: 'Información de Contacto',
          type: 'object',
          fields: [
            {
              name: 'address',
              title: 'Dirección',
              type: 'text',
              rows: 2
            },
            {
              name: 'phone',
              title: 'Teléfono',
              type: 'string'
            },
            {
              name: 'email',
              title: 'Email',
              type: 'email'
            },
            {
              name: 'whatsapp',
              title: 'WhatsApp',
              type: 'string'
            },
            {
              name: 'hours',
              title: 'Horarios de Atención',
              type: 'text',
              rows: 3
            },
            {
              name: 'socialMedia',
              title: 'Redes Sociales',
              type: 'object',
              fields: [
                {
                  name: 'instagram',
                  title: 'Instagram',
                  type: 'url'
                },
                {
                  name: 'facebook',
                  title: 'Facebook',
                  type: 'url'
                },
                {
                  name: 'youtube',
                  title: 'YouTube',
                  type: 'url'
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'faqList',
      title: 'Lista de Preguntas Frecuentes',
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
              rows: 4
            }
          ]
        }
      ]
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
      name: 'teamMembers',
      title: 'Miembros del Equipo',
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
              name: 'role',
              title: 'Cargo',
              type: 'string'
            },
            {
              name: 'bio',
              title: 'Biografía',
              type: 'text',
              rows: 3
            },
            {
              name: 'image',
              title: 'Foto',
              type: 'image',
              options: { hotspot: true }
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'published',
      title: 'Publicada',
      type: 'boolean',
      description: 'La página está visible públicamente',
      initialValue: false
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
          validation: Rule => Rule.max(60),
          description: 'Título que aparece en Google (máx. 60 caracteres)'
        },
        {
          name: 'metaDescription',
          title: 'Descripción Meta',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(160),
          description: 'Descripción que aparece en Google (máx. 160 caracteres)'
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
      pageType: 'pageType',
      published: 'published'
    },
    prepare(selection) {
      const { title, pageType, published } = selection
      return {
        title,
        subtitle: `${pageType} ${published ? '• Publicada' : '• Borrador'}`,
        media: published ? '✅' : '📝'
      }
    }
  },

  orderings: [
    {
      title: 'Título A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    },
    {
      title: 'Tipo de página',
      name: 'pageTypeAsc',
      by: [{ field: 'pageType', direction: 'asc' }]
    }
  ]
}) 