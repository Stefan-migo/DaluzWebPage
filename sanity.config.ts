import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";

// Import schemas - using simpler imports to avoid conflicts
import { postSchema } from "./src/sanity/schemas/post";
import { authorSchema } from "./src/sanity/schemas/author";
import { categorySchema } from "./src/sanity/schemas/category";
import { productContentSchema } from "./src/sanity/schemas/productContent";
import { pageSchema } from "./src/sanity/schemas/page";
import { membershipContentSchema } from "./src/sanity/schemas/membershipContent";
import { testimonialSchema } from "./src/sanity/schemas/testimonial";
import { tesoroContentSchema } from "./src/sanity/schemas/tesoroContent";
import { dynamicLinksSchema } from "./src/sanity/schemas/dynamicLinks";
import { tiendaSettingsSchema } from "./src/sanity/schemas/tiendaSettings";

export default defineConfig({
  name: "da-luz-consciente",
  title: "DA LUZ CONSCIENTE - CMS",
  projectId:
    process.env.SANITY_STUDIO_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:
    process.env.SANITY_STUDIO_DATASET ||
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    "production",

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            // Blog section
            S.listItem()
              .title("📝 Blog")
              .child(
                S.list()
                  .title("Blog")
                  .items([
                    S.listItem()
                      .title("Artículos")
                      .schemaType("post")
                      .child(S.documentTypeList("post").title("Artículos")),
                    S.listItem()
                      .title("Categorías")
                      .schemaType("category")
                      .child(
                        S.documentTypeList("category").title("Categorías"),
                      ),
                    S.listItem()
                      .title("Autores")
                      .schemaType("author")
                      .child(S.documentTypeList("author").title("Autores")),
                  ]),
              ),

            // Products section
            S.listItem()
              .title("🌿 Productos")
              .child(
                S.list()
                  .title("Contenido de Productos")
                  .items([
                    S.listItem()
                      .title("Contenido de Productos")
                      .schemaType("productContent")
                      .child(
                        S.documentTypeList("productContent").title(
                          "Contenido de Productos",
                        ),
                      ),
                  ]),
              ),

            // Membership section
            S.listItem()
              .title("🧘‍♀️ Membresía")
              .child(
                S.list()
                  .title("Contenido de Membresía")
                  .items([
                    S.listItem()
                      .title("Módulos y Contenido")
                      .schemaType("membershipContent")
                      .child(
                        S.documentTypeList("membershipContent").title(
                          "Contenido de Membresía",
                        ),
                      ),
                  ]),
              ),

            // Pages section
            S.listItem()
              .title("📄 Páginas")
              .schemaType("page")
              .child(S.documentTypeList("page").title("Páginas")),

            // Tienda Settings section
            S.listItem()
              .title("🛍️ Configuración Tienda")
              .schemaType("tiendaSettings")
              .child(
                S.documentTypeList("tiendaSettings").title(
                  "Configuración de Tienda",
                ),
              ),

            // Social proof section
            S.listItem()
              .title("⭐ Testimonios")
              .schemaType("testimonial")
              .child(S.documentTypeList("testimonial").title("Testimonios")),

            // Tesoros section
            S.listItem()
              .title("🎁 Tesoros Da Luz")
              .child(
                S.list()
                  .title("Contenido de Tesoros")
                  .items([
                    S.listItem()
                      .title("Todos los Tesoros")
                      .schemaType("tesoroContent")
                      .child(
                        S.documentTypeList("tesoroContent").title(
                          "Contenido de Tesoros",
                        ),
                      ),
                  ]),
              ),

            // Dynamic Links section
            S.listItem()
              .title("🔗 Enlaces Dinámicos")
              .child(
                S.list()
                  .title("Enlaces por Sección")
                  .items([
                    S.listItem()
                      .title("Activos y Origen")
                      .child(
                        S.documentList()
                          .title("Activos y Origen")
                          .filter(
                            '_type == "dynamicLinks" && section == "activos-origen"',
                          ),
                      ),
                    S.listItem()
                      .title("Procesos")
                      .child(
                        S.documentList()
                          .title("Procesos")
                          .filter(
                            '_type == "dynamicLinks" && section == "procesos"',
                          ),
                      ),
                    S.listItem()
                      .title("Sesiones")
                      .child(
                        S.documentList()
                          .title("Sesiones")
                          .filter(
                            '_type == "dynamicLinks" && section == "sesiones"',
                          ),
                      ),
                    S.listItem()
                      .title("Ciclos")
                      .child(
                        S.documentList()
                          .title("Ciclos")
                          .filter(
                            '_type == "dynamicLinks" && section == "ciclos"',
                          ),
                      ),
                    S.listItem()
                      .title("Manifiesto/Reciclaje")
                      .child(
                        S.documentList()
                          .title("Manifiesto/Reciclaje")
                          .filter(
                            '_type == "dynamicLinks" && section == "manifiesto-reciclaje"',
                          ),
                      ),
                  ]),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: [
      // Blog schemas
      postSchema,
      authorSchema,
      categorySchema,

      // Product schemas
      productContentSchema,

      // Page schemas
      pageSchema,

      // Membership schemas
      membershipContentSchema,

      // Social proof schemas
      testimonialSchema,

      // Tesoros schemas
      tesoroContentSchema,

      // Dynamic Links schemas
      dynamicLinksSchema,

      // Tienda settings
      tiendaSettingsSchema,
    ],
  },
});
