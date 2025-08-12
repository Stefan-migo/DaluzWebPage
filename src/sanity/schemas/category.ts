import { defineField, defineType } from 'sanity'

export const categorySchema = defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  icon: () => '🏷️',
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
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'colorHex',
      title: 'Color (Hex)',
      type: 'string',
      description: 'Color hexadecimal para identificar la categoría (ej: #D4AF37)',
      validation: Rule => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Debe ser un color hexadecimal válido (ej: #D4AF37)')
    }),
    defineField({
      name: 'featured',
      title: 'Destacada',
      type: 'boolean',
      description: 'Mostrar en la página principal',
      initialValue: false
    })
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'description'
    }
  }
}) 