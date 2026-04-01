# Guía de Usuario: Sanity CMS para DaLuz

## Introducción

Sanity es el sistema de gestión de contenidos (CMS) de DaLuz. Es donde tú y tu equipo pueden crear y editar todo el contenido de la plataforma sin necesidad de conocimientos técnicos ni depender de desarrolladores.

### ¿Qué puedes gestionar desde Sanity?

- **Blog**: Artículos, autores y categorías
- **Membresía**: Contenido de los módulos del programa de 7 meses
- **Tesoros**: Recursos premium exclusivos por nivel de membresía
- **Enlaces Dinámicos**: Enlaces externos editables para distintas secciones
- **Productos**: Contenido relacionado con productos (descripciones, información)
- **Testimonios**: Reseñas y testimonios de clientes
- **Páginas**: Contenido de páginas estáticas

---

## Acceder a Sanity Studio

### URL de acceso

```
https://sanity.io/project/[TU_PROJECT_ID]/studio
```

### Credenciales

Usa las credenciales de tu cuenta de Sanity. Si no tienes acceso, contacta al administrador del proyecto.

### Primera vez que accedes

1. Ingresa a la URL de Sanity Studio
2. Inicia sesión con tu cuenta de Google o email registrado
3. Verás el panel de control con todas las secciones de contenido

---

## Estructura del Panel de Sanity

Cuando accedas a Sanity Studio, verás un menú lateral organizado por secciones:

```
📝 Blog
   ├── Artículos
   ├── Categorías
   └── Autores

🌿 Productos
   └── Contenido de Productos

🧘‍♀️ Membresía
   └── Módulos y Contenido

📄 Páginas

🛍️ Configuración Tienda

⭐ Testimonios

🎁 Tesoros Da Luz

🔗 Enlaces Dinámicos
   ├── Activos y Origen
   ├── Procesos
   ├── Sesiones
   ├── Ciclos
   └── Manifiesto/Reciclaje
```

---

## Guía por Sección

### 1. Blog - Artículos

**¿Para qué sirve?** Crear y gestionar artículos del blog de DaLuz.

#### Cómo crear un nuevo artículo

1. En el menú lateral, haz clic en **📝 Blog** → **Artículos**
2. Haz clic en el botón **Crear nuevo** (botón verde con +)
3. Rellena los campos:

| Campo                | Descripción                               | Obligatorio |
| -------------------- | ----------------------------------------- | ----------- |
| Título               | Título del artículo                       | Sí          |
| URL (Slug)           | Se genera automáticamente del título      | Sí          |
| Extracto             | Breve descripción que aparece en listados | No          |
| Imagen principal     | Imagen destacada del artículo             | No          |
| Autor                | Autor del artículo                        | No          |
| Categorías           | Categorías a las que pertenece            | No          |
| Fecha de publicación | Fecha cuando se publicará                 | Sí          |
| Contenido            | Cuerpo del artículo (texto con formato)   | Sí          |
| Published            | Marque para publicar el artículo          | Sí          |

4. Haz clic en **Publicar** para guardar y publicar

#### Cómo escribir contenido con formato

En el campo **Contenido**, puedes usar el editor de texto enriquecido:

- **Títulos**: Usa H2 y H3 para encabezados
- **Negrita**: Selecciona texto y presiona Ctrl+B
- **Cursiva**: Selecciona texto y presiona Ctrl+I
- **Listas**: Usa las opciones de lista numerada o con viñetas
- **Enlaces**: Selecciona texto, haz clic en el icono de enlace
- **Imágenes**: Haz clic en el icono de imagen para añadir

#### Cómo añadir una imagen

1. En el campo de contenido, haz clic en el icono de **imagen**
2. Arrastra una imagen o haz clic para seleccionar
3. Añade texto alternativo (descripción de la imagen)
4. La imagen se subirá automáticamente a Sanity

---

### 2. Blog - Categorías

**¿Para qué sirve?** Organizar artículos por temas (ej: "Bienestar", "Nutrición", "Autocuidado").

#### Cómo crear una categoría

1. Ve a **📝 Blog** → **Categorías**
2. Haz clic en **Crear nuevo**
3. Rellena:
   - **Título**: Nombre de la categoría
   - **Slug**: URL amigable (se genera solo)
4. Publica

---

### 3. Blog - Autores

**¿Para qué sirve?** Gestionar información de autores del blog.

#### Cómo crear un autor

1. Ve a **📝 Blog** → **Autores**
2. Haz clic en **Crear nuevo**
3. Rellena:
   - **Nombre**: Nombre del autor
   - **Imagen**: Foto del autor
   - **Bio**: Biografía corta
4. Publica

---

### 4. Membresía - Módulos y Contenido

**¿Para qué sirve?** Gestionar el contenido del programa de transformación de 7 meses. Cada documento representa un módulo/semana del programa.

#### Estructura de un módulo

| Campo                    | Descripción                        | Ejemplo                                                    |
| ------------------------ | ---------------------------------- | ---------------------------------------------------------- |
| Título                   | Nombre del módulo                  | "Semana 1: El Despertar"                                   |
| Número de Módulo         | Semana del programa (1-28)         | 1                                                          |
| Fase                     | Fase del programa                  | "Fase 1: Despertar"                                        |
| Descripción              | Descripción breve del contenido    | "Introducción al programa..."                              |
| Objetivos de Aprendizaje | Qué aprenderá el participante      | ["Conocer los fundamentos", "Establecer rutinas"]          |
| Contenido Principal      | Texto, videos, audios del módulo   | Artículos, videos de YouTube, meditaciones                 |
| Ejercicios Prácticos     | Ejercicios de la semana            | title: "Ejercicio 1", instructions: "..."                  |
| Material Descargable     | PDFs, audios para descargar        | Cuaderno de trabajo, audios de meditación                  |
| Preguntas de Reflexión   | Para el diario personal            | ["¿Qué descubriste sobre ti?", "¿Cómo te sientes?"]        |
| Afirmaciones             | Frases positivas del módulo        | ["Soy merecedor/a de transformación"]                      |
| Contenido Bloqueado      | Si requiere membresía activa       | Marcado = bloqueado                                        |
| Días para Desbloqueo     | Días desde que inició la membresía | 0 = disponible desde el día 1, 7 = se desbloquea en 7 días |

#### Cómo crear un módulo

1. Ve a **🧘‍♀️ Membresía** → **Módulos y Contenido**
2. Haz clic en **Crear nuevo**
3. Rellena los campos siguiendo la tabla anterior
4. **Importante**: En "Días para Desbloqueo", configura cuántos días después de inscrita la persona será accesible el contenido:
   - `0` = Disponible inmediatamente
   - `7` = Se desbloquea 1 semana después
   - `14` = Se desbloquea 2 semanas después
   - etc.

5. Publica cuando esté listo

#### Sistema de bloqueo (Drip Content)

El sistema de membresía usa **desbloqueo progresivo basado en días**:

- Cuando alguien se inscribe, se registra su fecha de inicio
- Cada módulo tiene configurado "Días para Desbloqueo"
- El sistema calcula: `Hoy - Fecha de inicio >= Días para Desbloqueo`
- Si se cumple, el contenido se muestra; si no, aparece bloqueado con los días restantes

---

### 5. Tesoros Da Luz

**¿Para qué sirve?** Gestionar recursos premium exclusivos según el nivel de membresía del usuario.

#### Tipos de tesoro

| Tipo  | Descripción           | Ejemplo               |
| ----- | --------------------- | --------------------- |
| Video | Videos de Bunny.net   | Meditaciones en video |
| Audio | Archivos de audio MP3 | Meditaciones en audio |
| PDF   | Documentos PDF        | Cuadernos de trabajo  |
| Texto | Contenido escrito     | Artículos, guías      |

#### Cómo crear un tesoro

1. Ve a **🎁 Tesoros Da Luz** → **Todos los Tesoros**
2. Haz clic en **Crear nuevo**
3. Rellena los campos:

| Campo              | Descripción                         |
| ------------------ | ----------------------------------- |
| Título             | Nombre del tesoro                   |
| URL (Slug)         | Se genera automáticamente           |
| Descripción        | Descripción breve                   |
| ID Requerido       | Qué nivel de acceso necesita        |
| Tipo de Contenido  | video, audio, pdf o text            |
| URL del Video      | (si es video) URL de Bunny.net      |
| Archivo de Audio   | (si es audio) Archivo MP3           |
| Archivo PDF        | (si es pdf) Archivo PDF             |
| Texto Enriquecido  | (si es texto) Contenido con formato |
| Línea              | Línea temática (opcional)           |
| Kit                | Kit relacionado (opcional)          |
| Orden              | Para mostrar primero                |
| Duración (minutos) | Duración aproximada                 |
| Activo             | Si está disponible para usuarios    |

#### Opciones de ID Requerido

- `tesoro-gral`: Tesoros para todos los miembros
- `linea-ecos`: Tesoros de línea Ecos
- `linea-umbral`: Tesoros de línea Umbral
- `linea-alchemist`: Tesoros de línea Alchemist
- `kit-alkimya`: Tesoros del kit Alkimya
- etc.

---

### 6. Enlaces Dinámicos

**¿Para qué sirve?** Gestionar enlaces externos que aparecen en diferentes secciones de la web. Permite cambiar enlaces sin código.

#### Secciones disponibles

- **Activos y Origen**: Enlaces de la sección Activos
- **Procesos**: Enlaces de procesos
- **Sesiones**: Enlaces de sesiones
- **Ciclos**: Enlaces de ciclos
- **Manifiesto/Reciclaje**: Enlaces de manifest y reciclaje

#### Cómo crear un grupo de enlaces

1. Ve a **🔗 Enlaces Dinámicos**
2. Selecciona la sección deseada (ej: "Sesiones")
3. Haz clic en **Crear nuevo**
4. Rellena:

| Campo   | Descripción                          |
| ------- | ------------------------------------ |
| Título  | Nombre descriptivo del grupo         |
| Sección | Sección donde aparecerán los enlaces |
| Enlaces | Lista de enlaces                     |

5. Para cada enlace:
   - **Texto del Enlace**: Lo que verá el usuario
   - **URL**: Dirección destino
   - **Icono**: Tipo de icono (play, documento, video, etc.)
   - **Abrir en nueva pestaña**: Si se abre en nueva pestaña
   - **Activo**: Si el enlace se muestra

#### Ejemplo práctico

Imagina que tienes una sesión de zoom que cambia cada semana:

1. Ve a **🔗 Enlaces Dinámicos** → **Sesiones**
2. Crea un documento llamado "Sesión en Vivo Marzo 2026"
3. Añade los enlaces:
   - Texto: "Unirse a Zoom", URL: "https://zoom.us/j/xxxxx"
   - Texto: "Ver grabación", URL: "https://youtube.com/xxxxx"
4. Activa solo el enlace correspondiente
5. La próxima semana, desactiva ese enlace y activa el nuevo

---

### 7. Testimonios

**¿Para qué sirve?** Gestionar reseñas y testimonios de clientes.

#### Cómo crear un testimonio

1. Ve a **⭐ Testimonios**
2. Haz clic en **Crear nuevo**
3. Rellena:
   - **Nombre**: Nombre de la persona
   - **Texto**: El testimonio propiamente dicho
   - **Rating**: Estrellas (1-5)
   - **Imagen**: Foto de la persona (opcional)
   - **Producto/Servicio**: A qué pertenece el testimonio
   - **Featured**: Si quieres que aparezca en el homepage
4. Publica

---

### 8. Páginas

**¿Para qué sirve?** Contenido de páginas estáticas (términos, políticas, etc.).

#### Cómo editar una página

1. Ve a **📄 Páginas**
2. Selecciona la página que quieres editar
3. Modifica el contenido
4. Publica los cambios

---

## Mejores Prácticas

### Antes de publicar

- ✅ Revisa ortografía y gramática
- ✅ Verifica que las imágenes tengan texto alternativo
- ✅ Prueba los enlaces externos
- ✅ Asegúrate de que el contenido esté completo

### Gestión de medios

- **Imágenes**: Usa imágenes de buena calidad pero optimizadas (máx 2MB por imagen)
- **Videos**: Sube videos grandes a Bunny.net y usa la URL en Sanity
- **Audios**: Para audios cortos (<10MB) puedes subirlos directamente; para más grandes, usa un servicio externo

### Organizar contenido

- Usa **categorías** para organizar el blog
- Mantén un **orden lógico** en tesoros y módulos
- Usa el campo **Descripción** para ayudar a otros a entender el contenido

### Previsualizar antes de publicar

Sanity tiene una función de previsualización. Antes de publicar, puedes ver cómo se verá el contenido en el sitio real.

---

## Solución de Problemas Comunes

### No puedo guardar un documento

- Verifica que los campos obligatorios estén llenos
- Busca mensajes de error en rojo debajo de los campos
- Algunos campos tienen validación (ej: números entre 1 y 28)

### La imagen no se carga

- Verifica que el archivo no sea muy grande (máx 2MB)
- Usa formatos compatibles: JPG, PNG, WebP
- Intenta subir la imagen de nuevo

### El contenido no aparece en la web

- Verifica que el documento esté **publicado** (no solo guardado como borrador)
- El webhook de revalidación puede tardar unos segundos
- Prueba actualizar la página

### Necesito ayuda

1. Consulta esta guía primero
2. Contacta al equipo técnico con:
   - URL del documento problemático
   - Descripción del problema
   - Capturas de pantalla si es posible

---

## Glosario

| Término           | Definición                                                    |
| ----------------- | ------------------------------------------------------------- |
| **CMS**           | Content Management System - Sistema de gestión de contenidos  |
| **Schema**        | Estructura que define qué campos tiene cada tipo de contenido |
| **Portable Text** | Texto enriquecido con formato (negritas, enlaces, etc.)       |
| **Drip Content**  | Contenido que se desbloquea progresivamente                   |
| **Webhook**       | Sistema que actualiza la web cuando se cambia algo en Sanity  |
| **Slug**          | URL amigable de un documento                                  |
| **Draft**         | Borrador - contenido no publicado                             |

---

## Referencias Técnicas (para el equipo técnico)

### Archivos relacionados

- Schema de membership: `src/sanity/schemas/membershipContent.ts`
- Schema de tesoros: `src/sanity/schemas/tesoroContent.ts`
- Schema de dynamic links: `src/sanity/schemas/dynamicLinks.ts`
- Queries: `src/sanity/lib/queries.ts`
- Webhook: `src/app/api/revalidate/route.ts`

### Variables de entorno

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_READ_TOKEN
SANITY_WEBHOOK_SECRET
```

### URLs de API

- Studio: `https://sanity.io/project/[PROJECT_ID]/studio`
- API: `https://[PROJECT_ID].api.sanity.io/v1`

---

_Documento actualizado: Marzo 2026_
_Proyecto: DaLuz Consciente_
_Versión: 1.0_
