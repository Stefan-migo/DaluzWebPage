import { defineField, defineType } from "sanity";

export const dynamicLinksSchema = defineType({
  name: "dynamicLinks",
  title: "Enlaces Dinámicos",
  type: "document",
  icon: () => "🔗",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Nombre descriptivo para identificar este grupo de enlaces",
    }),
    defineField({
      name: "section",
      title: "Sección",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Activos y Origen", value: "activos-origen" },
          { title: "Procesos", value: "procesos" },
          { title: "Sesiones", value: "sesiones" },
          { title: "Ciclos", value: "ciclos" },
          { title: "Manifiesto/Reciclaje", value: "manifiesto-reciclaje" },
        ],
      },
      description: "Sección donde se mostrarán estos enlaces",
    }),
    defineField({
      name: "links",
      title: "Enlaces",
      type: "array",
      validation: (Rule) => Rule.required().min(1).max(10),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Texto del Enlace",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icono",
              type: "string",
              options: {
                list: [
                  { title: "Play", value: "play" },
                  { title: "Documento", value: "document" },
                  { title: "Video", value: "video" },
                  { title: "Audio", value: "audio" },
                  { title: "Imagen", value: "image" },
                  { title: "Enlace externo", value: "external" },
                ],
              },
            }),
            defineField({
              name: "openInNewTab",
              title: "Abrir en nueva pestaña",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "isActive",
              title: "Activo",
              type: "boolean",
              initialValue: true,
              description: "Si está desactivado, el enlace no se mostrará",
            }),
          ],
          preview: {
            select: {
              title: "label",
              url: "url",
              isActive: "isActive",
            },
            prepare(selection: Record<string, any>) {
              const { title, url, isActive } = selection;
              const status = isActive ? "✅" : "❌";
              return {
                title: `${status} ${title || "Sin texto"}`,
                subtitle: url || "Sin URL",
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "isActive",
      title: "Activo",
      type: "boolean",
      initialValue: true,
      description:
        "Si está desactivado, ningún enlace de esta sección se mostrará",
    }),
  ],
  preview: {
    select: {
      title: "title",
      section: "section",
      isActive: "isActive",
    },
    prepare(selection: Record<string, any>) {
      const { title, section, isActive } = selection;
      const status = isActive ? "✅" : "❌";
      return {
        title: `${status} ${title || "Sin título"}`,
        subtitle: `Sección: ${section || "No asignada"}`,
      };
    },
  },
  orderings: [
    {
      title: "Por sección",
      name: "sectionAsc",
      by: [{ field: "section", direction: "asc" }],
    },
  ],
});
