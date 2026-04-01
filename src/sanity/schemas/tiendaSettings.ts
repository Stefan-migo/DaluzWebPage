import { defineField, defineType } from "sanity";

export const tiendaSettingsSchema = defineType({
  name: "tiendaSettings",
  title: "Configuración de Tienda",
  type: "document",
  icon: () => "🛍️",
  fields: [
    defineField({
      name: "heroImage",
      title: "Imagen del Hero",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Texto Alternativo",
        },
      ],
    }),
    defineField({
      name: "heroTitle",
      title: "Título del Hero",
      type: "string",
      initialValue: "TIENDA DA LUZ ALKIMYA",
      description: "Título principal que aparece en la cabecera de la tienda",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Subtítulo del Hero",
      type: "string",
      initialValue:
        "Descubre nuestra colección completa de biocosmética artesanal",
      description: "Subtítulo que aparece debajo del título",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Configuración de Tienda",
        subtitle: "Ajustes del hero y cabecera",
      };
    },
  },
});
