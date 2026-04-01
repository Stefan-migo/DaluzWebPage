/**
 * Script para crear contenido de prueba en Sanity
 *
 * Uso: npx tsx scripts/create-sanity-test-data.ts
 *
 * Este contenido es para testing - se puede eliminar después
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Debug: verificar que se cargó la variable
console.log(
  "🔍 Token loaded:",
  process.env.SANITY_API_WRITE_TOKEN ? "YES" : "NO",
);

// Configuración del cliente Sanity
const client = createClient({
  projectId: "os2881oz",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// Función helper para esperar
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// IDs de los documentos creados (para referencia)
const createdDocs: { type: string; id: string; title: string }[] = [];

async function createTestData() {
  console.log("🔧 Creando contenido de prueba en Sanity...\n");

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("❌ Error: Necesitas SANITY_API_WRITE_TOKEN en .env.local");
    console.log("\n📝 Para obtener un token:");
    console.log("   1. Ve a https://www.sanity.io/manage");
    console.log("   2. Selecciona tu proyecto");
    console.log("   3. Ve a API > Tokens");
    console.log("   4. Crea un token con permisos de escritura");
    console.log("   5. Agrégalo a .env.local como SANITY_API_WRITE_TOKEN");
    process.exit(1);
  }

  try {
    // =====================================================================
    // 1. AUTORES
    // =====================================================================
    console.log("📝 Creando autores de prueba...");

    const author1 = await client.create({
      _type: "author",
      name: "María González",
      bio: "Fundadora de DaLuz, especialista en bienestar holístico",
      image: null, // Sin imagen para testing
    });
    console.log(`   ✅ Autor: ${author1.name}`);
    createdDocs.push({ type: "author", id: author1._id, title: author1.name });

    const author2 = await client.create({
      _type: "author",
      name: "Carlos Ruiz",
      bio: "Instructor de meditación y yoga",
      image: null,
    });
    console.log(`   ✅ Autor: ${author2.name}`);
    createdDocs.push({ type: "author", id: author2._id, title: author2.name });

    await wait(500);

    // =====================================================================
    // 2. CATEGORÍAS
    // =====================================================================
    console.log("\n📂 Creando categorías de prueba...");

    const category1 = await client.create({
      _type: "category",
      title: "Bienestar",
      slug: { current: "bienestar" },
    });
    console.log(`   ✅ Categoría: ${category1.title}`);
    createdDocs.push({
      type: "category",
      id: category1._id,
      title: category1.title,
    });

    const category2 = await client.create({
      _type: "category",
      title: "Nutrición",
      slug: { current: "nutricion" },
    });
    console.log(`   ✅ Categoría: ${category2.title}`);
    createdDocs.push({
      type: "category",
      id: category2._id,
      title: category2.title,
    });

    const category3 = await client.create({
      _type: "category",
      title: "Autocuidado",
      slug: { current: "autocuidado" },
    });
    console.log(`   ✅ Categoría: ${category3.title}`);
    createdDocs.push({
      type: "category",
      id: category3._id,
      title: category3.title,
    });

    await wait(500);

    // =====================================================================
    // 3. BLOG POSTS
    // =====================================================================
    console.log("\n📝 Creando artículos de prueba...");

    const post1 = await client.create({
      _type: "post",
      title: "5 Rutinas Matutinas para Transformar tu Día",
      slug: { current: "5-rutinas-matutinas-transformar-tu-dia" },
      excerpt:
        "Descubre las mejores rutinas matutinas para empezar tu día con energía y claridad mental.",
      published: true,
      publishedAt: new Date().toISOString(),
      author: { _type: "reference", _ref: author1._id },
      categories: [
        { _type: "reference", _ref: category1._id },
        { _type: "reference", _ref: category3._id },
      ],
      mainImage: null,
      body: [
        {
          _type: "block",
          style: "normal",
          children: [
            {
              _type: "span",
              text: "Este es un artículo de prueba para verificar que el blog funciona correctamente. Puedes eliminarlo cuando quieras.",
            },
          ],
        },
      ],
    });
    console.log(`   ✅ Post: ${post1.title}`);
    createdDocs.push({ type: "post", id: post1._id, title: post1.title });

    const post2 = await client.create({
      _type: "post",
      title: "Guía de Alimentación Consciente",
      slug: { current: "guia-alimentacion-consciente" },
      excerpt:
        "Una guía completa para practicar una alimentación consciente y saludable.",
      published: true,
      publishedAt: new Date().toISOString(),
      author: { _type: "reference", _ref: author2._id },
      categories: [{ _type: "reference", _ref: category2._id }],
      mainImage: null,
      body: [
        {
          _type: "block",
          style: "normal",
          children: [
            {
              _type: "span",
              text: "Artículo de prueba para la categoría Nutrición. Este contenido se puede eliminar después de testing.",
            },
          ],
        },
      ],
    });
    console.log(`   ✅ Post: ${post2.title}`);
    createdDocs.push({ type: "post", id: post2._id, title: post2.title });

    await wait(500);

    // =====================================================================
    // 4. MEMBRESÍA - MÓDULOS
    // =====================================================================
    console.log("\n🧘‍♀️ Creando módulos de membresía de prueba...");

    for (let i = 1; i <= 4; i++) {
      const moduleDoc = await client.create({
        _type: "membershipContent",
        title: `Semana ${i}: ${i === 1 ? "El Despertar" : i === 2 ? "Conexión Interior" : i === 3 ? "Purificación" : "Transformación"}`,
        slug: { current: `semana-${i}-test` },
        moduleNumber: i,
        phase: i <= 4 ? "despertar" : "purificacion",
        description: `Este es un módulo de prueba para el programa de transformación. Semana ${i}. Puede eliminarse después de testing.`,
        isLocked: i > 1, // Solo el primero desbloqueado
        dias_para_desbloqueo: i === 1 ? 0 : i * 7, // 0, 7, 14, 21 días
        learningObjectives: [
          "Objetivo de aprendizaje 1",
          "Objetivo de aprendizaje 2",
        ],
        journalPrompts: [
          "¿Qué descubriste sobre ti hoy?",
          "¿Cómo te sentiste durante la práctica?",
        ],
        affirmations: [
          "Soy merecedor de transformación",
          "Cada día estoy más cerca de mi mejor versión",
        ],
      });
      console.log(`   ✅ Módulo ${i}: ${moduleDoc.title}`);
      createdDocs.push({
        type: "membershipContent",
        id: moduleDoc._id,
        title: moduleDoc.title,
      });
    }

    await wait(500);

    // =====================================================================
    // 5. TESOROS
    // =====================================================================
    console.log("\n🎁 Creando tesoros de prueba...");

    const tesoro1 = await client.create({
      _type: "tesoroContent",
      title: "Meditación Guiada: Conexión con la Tierra",
      slug: { current: "meditacion-conexion-tierra-test" },
      description:
        "Una meditación guiada para conectar con la energía de la tierra.",
      required_id: "tesoro-gral",
      content_type: "audio",
      is_active: true,
      sort_order: 1,
      duration_minutes: 15,
    });
    console.log(`   ✅ Tesoro: ${tesoro1.title}`);
    createdDocs.push({
      type: "tesoroContent",
      id: tesoro1._id,
      title: tesoro1.title,
    });

    const tesoro2 = await client.create({
      _type: "tesoroContent",
      title: "Guía: Ritual de Mañana",
      slug: { current: "guia-ritual-manana-test" },
      description: "PDF con ritual matutino para practicar cada día.",
      required_id: "linea-ecos",
      content_type: "pdf",
      is_active: true,
      sort_order: 2,
    });
    console.log(`   ✅ Tesoro: ${tesoro2.title}`);
    createdDocs.push({
      type: "tesoroContent",
      id: tesoro2._id,
      title: tesoro2.title,
    });

    const tesoro3 = await client.create({
      _type: "tesoroContent",
      title: "Video: Introducción al Automasaje",
      slug: { current: "video-introduccion-automasaje-test" },
      description: "Video tutorial de automasaje para relajación.",
      required_id: "linea-umbral",
      content_type: "video",
      video_url: "https://test-videos.bunny.net/test-video-1",
      is_active: true,
      sort_order: 3,
      duration_minutes: 20,
    });
    console.log(`   ✅ Tesoro: ${tesoro3.title}`);
    createdDocs.push({
      type: "tesoroContent",
      id: tesoro3._id,
      title: tesoro3.title,
    });

    await wait(500);

    // =====================================================================
    // 6. ENLACES DINÁMICOS
    // =====================================================================
    console.log("\n🔗 Creando enlaces dinámicos de prueba...");

    const dynamicLink1 = await client.create({
      _type: "dynamicLinks",
      title: "Sesiones de Marzo 2026",
      section: "sesiones",
      isActive: true,
      links: [
        {
          _type: "object",
          label: "Zoom - Sesión en Vivo",
          url: "https://zoom.us/j/test-session",
          icon: "video",
          openInNewTab: true,
          isActive: true,
        },
        {
          _type: "object",
          label: "Grabación Sesión Anterior",
          url: "https://youtube.com/watch?v=test",
          icon: "play",
          openInNewTab: true,
          isActive: true,
        },
      ],
    });
    console.log(`   ✅ Enlaces: ${dynamicLink1.title}`);
    createdDocs.push({
      type: "dynamicLinks",
      id: dynamicLink1._id,
      title: dynamicLink1.title,
    });

    const dynamicLink2 = await client.create({
      _type: "dynamicLinks",
      title: "Recursos Proceso 1",
      section: "procesos",
      isActive: true,
      links: [
        {
          _type: "object",
          label: "Documento PDF - Guía del Proceso",
          url: "https://example.com/guia-proceso-1.pdf",
          icon: "document",
          openInNewTab: true,
          isActive: true,
        },
      ],
    });
    console.log(`   ✅ Enlaces: ${dynamicLink2.title}`);
    createdDocs.push({
      type: "dynamicLinks",
      id: dynamicLink2._id,
      title: dynamicLink2.title,
    });

    await wait(500);

    // =====================================================================
    // 7. TESTIMONIOS
    // =====================================================================
    console.log("\n⭐ Creando testimonios de prueba...");

    const testimonial1 = await client.create({
      _type: "testimonial",
      name: "Ana López",
      text: "Esta experiencia cambió mi vida. Recomendado 100%. Este es un testimonio de prueba.",
      rating: 5,
      featured: true,
    });
    console.log(`   ✅ Testimonio: ${testimonial1.name}`);
    createdDocs.push({
      type: "testimonial",
      id: testimonial1._id,
      title: testimonial1.name,
    });

    const testimonial2 = await client.create({
      _type: "testimonial",
      name: "Pedro Martínez",
      text: "Muy buen servicio y atención. Prueba de testimonio.",
      rating: 4,
      featured: false,
    });
    console.log(`   ✅ Testimonio: ${testimonial2.name}`);
    createdDocs.push({
      type: "testimonial",
      id: testimonial2._id,
      title: testimonial2.name,
    });

    await wait(500);

    // =====================================================================
    // 8. CONFIGURACIÓN DE TIENDA
    // =====================================================================
    console.log("\n🛍️ Creando configuración de tienda de prueba...");

    const tiendaSettings = await client.create({
      _type: "tiendaSettings",
      heroTitle: "TIENDA DA LUZ - TEST",
      heroSubtitle: "Esta es una configuración de prueba. Puede eliminarse.",
    });
    console.log(`   ✅ Configuración: Tienda`);
    createdDocs.push({
      type: "tiendaSettings",
      id: tiendaSettings._id,
      title: "Tienda Settings",
    });

    // =====================================================================
    // RESUMEN
    // =====================================================================
    console.log("\n" + "=".repeat(60));
    console.log("✅ Contenido de prueba creado exitosamente!");
    console.log("=".repeat(60));
    console.log("\n📋 Resumen:");
    console.log(`   - Autores: 2`);
    console.log(`   - Categorías: 3`);
    console.log(`   - Posts: 2`);
    console.log(`   - Módulos de membresía: 4`);
    console.log(`   - Tesoros: 3`);
    console.log(`   - Enlaces dinámicos: 2`);
    console.log(`   - Testimonios: 2`);
    console.log(`   - Configuración tienda: 1`);
    console.log(`   TOTAL: ${createdDocs.length} documentos`);

    console.log("\n🗑️ Para eliminar todo el contenido de prueba:");
    console.log("   1. Ve a Sanity Studio");
    console.log("   2. Busca cada documento por su nombre");
    console.log("   3. Elimínalo manualmente");

    console.log("\n📝 IDs de documentos creados (para referencia):");
    createdDocs.forEach((doc) => {
      console.log(`   - ${doc.type}: ${doc.title}`);
      console.log(`     ID: ${doc.id}`);
    });
  } catch (error) {
    console.error("\n❌ Error al crear contenido:", error);
    process.exit(1);
  }
}

createTestData();
