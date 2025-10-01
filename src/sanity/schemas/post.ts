import { defineField, defineType } from 'sanity'

export const postSchema = defineType({
  name: 'post',
  title: 'Artículo del Blog',
  type: 'document',
  icon: () => '📝',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: Rule => Rule.required().max(100)
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
      name: 'excerpt',
      title: 'Resumen',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(200),
      description: 'Breve descripción del artículo para mostrar en listados'
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto Alternativo',
          description: 'Importante para SEO y accesibilidad'
        }
      ]
    }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }]
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: { type: 'author' },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de Publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'featured',
      title: 'Artículo Destacado',
      type: 'boolean',
      description: 'Mostrar en la sección de artículos destacados',
      initialValue: false
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
            { title: 'Título H2', value: 'h2' },
            { title: 'Título H3', value: 'h3' },
            { title: 'Título H4', value: 'h4' },
            { title: 'Cita', value: 'blockquote' }
          ],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
              { title: 'Subrayado', value: 'underline' },
              { title: 'Código', value: 'code' }
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
          name: 'callout',
          title: 'Destacado',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Texto',
              type: 'text'
            },
            {
              name: 'type',
              title: 'Tipo',
              type: 'string',
              options: {
                list: [
                  { title: 'Información', value: 'info' },
                  { title: 'Consejo', value: 'tip' },
                  { title: 'Advertencia', value: 'warning' },
                  { title: 'Importante', value: 'important' }
                ]
              }
            }
          ]
        }
      ]
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
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Productos Relacionados',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'IDs de productos relacionados con este artículo'
    })
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      publishedAt: 'publishedAt'
    },
    prepare(selection) {
      const { title, author, media, publishedAt } = selection
      return {
        title,
        subtitle: author && publishedAt 
          ? `por ${author} • ${new Date(publishedAt).toLocaleDateString('es-AR')}`
          : 'Sin fecha',
        media
      }
    }
  },

  orderings: [
    {
      title: 'Fecha de publicación (más reciente)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: 'Fecha de publicación (más antigua)',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }]
    },
    {
      title: 'Título A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ]
}) 