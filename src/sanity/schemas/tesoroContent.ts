import { defineField, defineType } from "sanity";

export const tesoroContentSchema = defineType({
  name: "tesoroContent",
  title: "Contenido de Tesoros",
  type: "document",
  icon: () => "🎁",
  fields: [
    // Basic Info
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Nombre del tesoro o contenido",
    }),
    defineField({
      name: "slug",
      title: "URL (Slug)",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
      description: "Breve descripción del contenido",
    }),

    // Access Control - REQUIRED FIELD for filtering
    defineField({
      name: "required_id",
      title: "ID de Acceso (required_id)",
      type: "string",
      validation: (Rule) => Rule.required(),
      description:
        "ID que determina quién puede ver este contenido. Opciones: tesoro-gral (cualquier compra), linea-ecos, linea-umbral, linea-prisma, linea-jade, linea-alma-terra, kit-alkimya, etc.",
      options: {
        list: [
          { title: "Tesoro General (cualquier compra)", value: "tesoro-gral" },
          { title: "Línea Ecos (Capilar)", value: "linea-ecos" },
          { title: "Línea Umbral (Cuerpo)", value: "linea-umbral" },
          {
            title: "Línea Prism.a / Utópica (Maquillaje)",
            value: "linea-prisma",
          },
          { title: "Línea Jade (Tratamiento)", value: "linea-jade" },
          {
            title: "Línea Alma Terra (Aromaterapia)",
            value: "linea-alma-terra",
          },
          { title: "Kit Alkimya", value: "kit-alkimya" },
          { title: "Kit Despertar", value: "kit-despertar" },
        ],
      },
    }),

    // Content Type
    defineField({
      name: "content_type",
      title: "Tipo de Contenido",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Video", value: "video" },
          { title: "Audio", value: "audio" },
          { title: "PDF", value: "pdf" },
          { title: "Texto Enriquecido", value: "text" },
        ],
      },
    }),

    // Video Content
    defineField({
      name: "video_url",
      title: "URL del Video (Bunny.net)",
      type: "url",
      description: "URL del video en Bunny.net o plataforma similar",
      hidden: ({ document }) => document?.content_type !== "video",
    }),

    // Audio Content
    defineField({
      name: "audio_file",
      title: "Archivo de Audio",
      type: "object",
      fields: [
        defineField({
          name: "url",
          title: "URL del Audio",
          type: "url",
          description: "URL del archivo MP3",
        }),
        defineField({
          name: "duration",
          title: "Duración (minutos)",
          type: "number",
        }),
      ],
      hidden: ({ document }) => document?.content_type !== "audio",
    }),

    // PDF Content
    defineField({
      name: "pdf_file",
      title: "Archivo PDF",
      type: "object",
      fields: [
        defineField({
          name: "url",
          title: "URL del PDF",
          type: "url",
        }),
        defineField({
          name: "name",
          title: "Nombre del archivo",
          type: "string",
        }),
      ],
      hidden: ({ document }) => document?.content_type !== "pdf",
    }),

    // Rich Text Content
    defineField({
      name: "rich_text",
      title: "Contenido de Texto Enriquecido",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Título H2", value: "h2" },
            { title: "Título H3", value: "h3" },
            { title: "Título H4", value: "h4" },
            { title: "Cita", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Itálica", value: "em" },
              { title: "Subrayado", value: "underline" },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Texto Alternativo",
            },
            {
              name: "caption",
              type: "string",
              title: "Descripción",
            },
          ],
        },
      ],
      hidden: ({ document }) => document?.content_type !== "text",
    }),

    // Linea y Kit (para organización)
    defineField({
      name: "linea",
      title: "Línea",
      type: "string",
      options: {
        list: [
          { title: "Ecos (Capilar)", value: "ecos" },
          { title: "Umbral (Cuerpo)", value: "umbral" },
          { title: "Prism.a / Utópica (Maquillaje)", value: "prisma" },
          { title: "Jade (Tratamiento)", value: "jade" },
          { title: "Alma Terra (Aromaterapia)", value: "alma-terra" },
        ],
      },
    }),
    defineField({
      name: "kit",
      title: "Kit",
      type: "string",
      options: {
        list: [
          { title: "Kit Alkimya", value: "alkimya" },
          { title: "Kit Despertar", value: "despertar" },
        ],
      },
    }),

    // Orden y metadata
    defineField({
      name: "sort_order",
      title: "Orden de Visualización",
      type: "number",
      description: "Número para ordenar dentro de la misma línea/Kit",
      initialValue: 0,
    }),
    defineField({
      name: "duration_minutes",
      title: "Duración (minutos)",
      type: "number",
      description: "Duración aproximada del contenido (para audio/video)",
    }),

    // Settings
    defineField({
      name: "is_active",
      title: "Activo",
      type: "boolean",
      description: "Si está desactivado, no se mostrará aunque haya acceso",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
      requiredId: "required_id",
      contentType: "content_type",
      isActive: "is_active",
    },
    prepare(selection) {
      const { title, requiredId, contentType, isActive } = selection;
      const status = isActive ? "✅" : "❌";
      return {
        title: `${status} ${title}`,
        subtitle: `${requiredId || "Sin ID"} • ${contentType || "Sin tipo"}`,
      };
    },
  },

  orderings: [
    {
      title: "Por orden de visualización",
      name: "sortOrderAsc",
      by: [{ field: "sort_order", direction: "asc" }],
    },
    {
      title: "Por ID de acceso",
      name: "requiredIdAsc",
      by: [{ field: "required_id", direction: "asc" }],
    },
  ],
});
