import type { Config } from "tailwindcss";
import "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced DA LUZ Brand Colors
        brand: {
          primary: "var(--color-brand-primary)",
          secondary: "var(--color-brand-secondary)",
          accent: "var(--color-accent)",
          warning: "var(--color-warning)",
          highlight: "var(--color-highlight)",
        },
        // Enhanced DA LUZ Background Colors
        "bg-light": "var(--color-bg-light)",
        "bg-lighter": "var(--color-bg-lighter)",
        "bg-cream": "var(--color-bg-cream)",
        // Enhanced DA LUZ Text Colors
        "text-primary": "var(--color-text-primary)",
        "text-inverse": "var(--color-text-inverse)",

        // Dynamic Line Theme Colors (use CSS variables)
        line: {
          primary: "var(--line-primary)",
          secondary: "var(--line-secondary)",
          accent: "var(--line-accent)",
          light: "var(--line-light)",
          lightest: "var(--line-lightest)",
        },

        // Product Line Colors - Alma Terra
        alma: {
          primary: "var(--alma-primary)",
          secondary: "var(--alma-secondary)",
          accent: "var(--alma-accent)",
          light: "var(--alma-light)",
          lightest: "var(--alma-lightest)",
        },
        // Product Line Colors - Ecos
        ecos: {
          primary: "var(--ecos-primary)",
          secondary: "var(--ecos-secondary)",
          accent: "var(--ecos-accent)",
          light: "var(--ecos-light)",
          lightest: "var(--ecos-lightest)",
        },
        // Product Line Colors - Jade Ritual
        jade: {
          primary: "var(--jade-primary)",
          secondary: "var(--jade-secondary)",
          accent: "var(--jade-accent)",
          light: "var(--jade-light)",
          lightest: "var(--jade-lightest)",
        },
        // Product Line Colors - Umbral
        umbral: {
          primary: "var(--umbral-primary)",
          secondary: "var(--umbral-secondary)",
          accent: "var(--umbral-accent)",
          light: "var(--umbral-light)",
          lightest: "var(--umbral-lightest)",
        },
        // Product Line Colors - Utópica
        utopica: {
          primary: "var(--utopica-primary)",
          secondary: "var(--utopica-secondary)",
          accent: "var(--utopica-accent)",
          light: "var(--utopica-light)",
          lightest: "var(--utopica-lightest)",
        },
        // FAQ palette (azul monocromático)
        faq: {
          deepest: "#2A2543",
          deep: "#16345F",
          mid: "#1A3F71",
          ocean: "#005080",
          bright: "#0085B1",
          light: "#3FB6E0", // acento claro para íconos y detalles sobre fondo oscuro
          surface: "#E7F0F8", // tarjetas claras de preguntas
          "surface-hover": "#D8E7F4",
          ink: "#16345F", // texto sobre tarjeta clara
        },
        // Azul Institucional DA LUZ - iconografía y títulos de la tienda
        "azul-institucional": "#051341",
        // Beige suave - fondo de los campos de formulario de la tienda
        "beige-suave": "#FFF2E9",
        // Admin / UI accent colors (azul profundo #1E3A8A, dorado)
        "azul-profundo": "#1E3A8A",
        dorado: "#F8D794",
        "tierra-media": "#8B7355",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Enhanced DA LUZ Custom Animations
        "alkimya-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "alkimya-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "alkimya-shimmer": {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "200px 0" },
        },
        // Enhanced React Bits Compatible Animations
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(-50px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.8)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(50px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Enhanced DA LUZ Animations
        "alkimya-float": "alkimya-float 3s ease-in-out infinite",
        "alkimya-pulse": "alkimya-pulse 2s ease-in-out infinite",
        "alkimya-shimmer": "alkimya-shimmer 2s infinite",
        // Enhanced React Bits Animations
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.6s ease-out",
        "scale-in": "scale-in 0.6s ease-out",
        "slide-in-left": "slide-in-left 0.6s ease-out",
        "fade-in-down": "fade-in-down 0.6s ease-out",
      },
      fontFamily: {
        // ENHANCED FONT HIERARCHY - DA LUZ CONSCIENTE (Especificación oficial)
        display: ["var(--font-display)", "Malisha", "cursive"],
        title: ["var(--font-title)", "VELISTA", "serif"],
        subtitle: ["var(--font-subtitle)", "Playfair Display", "serif"],
        text: ["var(--font-text)", "EB Garamond", "Times New Roman", "serif"],
        caption: ["var(--font-caption)", "Inter", "sans-serif"],

        // LEGACY SUPPORT (existing)
        heading: ["var(--font-heading)", "Playfair Display", "serif"],
        body: ["var(--font-body)", "EB Garamond", "Times New Roman", "serif"],
        sans: ["var(--font-caption)", "Inter", "sans-serif"],
        serif: ["var(--font-heading)", "Playfair Display", "serif"],
        malisha: ["var(--font-malisha)", "Malisha", "cursive"],
        velista: ["var(--font-velista)", "VELISTA", "serif"],
        synthese: ["var(--font-synthese)", "Synthese", "sans-serif"],
      },
      fontSize: {
        // Enhanced Typography Scale using CSS variables
        xs: "var(--text-xs)" /* 12px */,
        sm: "var(--text-sm)" /* 14px */,
        base: "var(--text-base)" /* 16px */,
        lg: "var(--text-lg)" /* 18px */,
        xl: "var(--text-xl)" /* 20px */,
        "2xl": "var(--text-2xl)" /* 24px */,
        "3xl": "var(--text-3xl)" /* 30px */,
        "4xl": "var(--text-4xl)" /* 36px */,
        "5xl": "var(--text-5xl)" /* 48px */,
        "6xl": "3.75rem" /* 60px */,
        "7xl": "4.5rem" /* 72px */,
        "8xl": "6rem" /* 96px */,
        "9xl": "8rem" /* 128px */,
      },
      spacing: {
        // Enhanced Spacing System using CSS variables
        "1": "var(--space-1)" /* 4px */,
        "2": "var(--space-2)" /* 8px */,
        "3": "var(--space-3)" /* 12px */,
        "4": "var(--space-4)" /* 16px */,
        "6": "var(--space-6)" /* 24px */,
        "8": "var(--space-8)" /* 32px */,
        "12": "var(--space-12)" /* 48px */,
        "16": "var(--space-16)" /* 64px */,
        "24": "var(--space-24)" /* 96px */,
        // Additional spacing utilities
        "18": "4.5rem" /* 72px */,
        "20": "5rem" /* 80px */,
        "32": "8rem" /* 128px */,
        "40": "10rem" /* 160px */,
        "48": "12rem" /* 192px */,
        "56": "14rem" /* 224px */,
        "64": "16rem" /* 256px */,
        "72": "18rem" /* 288px */,
        "80": "20rem" /* 320px */,
        "88": "22rem" /* 352px */,
        "96": "24rem" /* 384px */,
        "128": "32rem" /* 512px */,
      },
      backgroundImage: {
        // Enhanced Gradient System
        "alkimya-gradient":
          "linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-secondary) 100%)",
        "line-gradient":
          "linear-gradient(135deg, var(--line-primary) 0%, var(--line-secondary) 100%)",

        // FAQ deep gradient (violeta → azul → teal)
        "faq-gradient":
          "linear-gradient(160deg, #2A2543 0%, #16345F 28%, #1A3F71 50%, #005080 78%, #0085B1 100%)",

        // Product Line Gradients
        "alma-gradient":
          "linear-gradient(135deg, var(--alma-primary) 0%, var(--alma-accent) 100%)",
        "ecos-gradient":
          "linear-gradient(135deg, var(--ecos-primary) 0%, var(--ecos-accent) 100%)",
        "jade-gradient":
          "linear-gradient(135deg, var(--jade-primary) 0%, var(--jade-accent) 100%)",
        "umbral-gradient":
          "linear-gradient(135deg, var(--umbral-primary) 0%, var(--umbral-accent) 100%)",
        "utopica-gradient":
          "linear-gradient(135deg, var(--utopica-primary) 0%, var(--utopica-accent) 100%)",

        // Enhanced Background Patterns
        "hero-pattern":
          "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        "card-pattern":
          "linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 75%)",
      },
      boxShadow: {
        // Enhanced Shadow System
        alkimya: "0 8px 25px rgba(174, 0, 0, 0.15)",
        "alkimya-lg": "0 20px 40px rgba(174, 0, 0, 0.2)",
        "alkimya-xl": "0 25px 50px rgba(174, 0, 0, 0.25)",

        // Dynamic Line Shadows
        line: "0 8px 25px var(--line-primary)",
        "line-lg": "0 20px 40px var(--line-primary)",

        // Product Line Shadows
        alma: "0 8px 25px rgba(155, 32, 26, 0.15)",
        ecos: "0 8px 25px rgba(18, 64, 111, 0.15)",
        jade: "0 8px 25px rgba(4, 65, 45, 0.15)",
        umbral: "0 8px 25px rgba(234, 79, 18, 0.15)",
        utopica: "0 8px 25px rgba(57, 46, 19, 0.15)",

        // Enhanced Generic Shadows
        soft: "0 2px 10px rgba(0, 0, 0, 0.08)",
        medium: "0 4px 20px rgba(0, 0, 0, 0.12)",
        strong: "0 8px 30px rgba(0, 0, 0, 0.16)",
        "inner-soft": "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "40px",
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
        alkimya: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
        "450": "450ms",
        "600": "600ms",
        "800": "800ms",
        "900": "900ms",
        "1200": "1200ms",
      },
      lineHeight: {
        relaxed: "1.6",
        loose: "1.8",
        "extra-loose": "2.0",
      },
      letterSpacing: {
        tighter: "-0.02em",
        tight: "-0.01em",
        normal: "0",
        wide: "0.01em",
        wider: "0.02em",
        widest: "0.04em",
      },
      zIndex: {
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
        toast: "1080",
      },
    },
  },
  plugins: [
    // tailcss-animate importado arriba
    // Custom DA LUZ Plugin for enhanced utilities
    function ({ addUtilities, theme }: any) {
      const lineColors = theme("colors.line");
      const newUtilities = {
        // Line Theme Utilities
        ".bg-line-primary": {
          backgroundColor: "var(--line-primary)",
        },
        ".bg-line-secondary": {
          backgroundColor: "var(--line-secondary)",
        },
        ".bg-line-accent": {
          backgroundColor: "var(--line-accent)",
        },
        ".bg-line-light": {
          backgroundColor: "var(--line-light)",
        },
        ".bg-line-lightest": {
          backgroundColor: "var(--line-lightest)",
        },
        ".text-line-primary": {
          color: "var(--line-primary)",
        },
        ".text-line-secondary": {
          color: "var(--line-secondary)",
        },
        ".text-line-accent": {
          color: "var(--line-accent)",
        },
        ".border-line-primary": {
          borderColor: "var(--line-primary)",
        },
        ".border-line-secondary": {
          borderColor: "var(--line-secondary)",
        },
        ".border-line-accent": {
          borderColor: "var(--line-accent)",
        },
        // Enhanced Typography Utilities
        ".text-heading": {
          fontFamily: "var(--font-heading)",
        },
        ".text-body": {
          fontFamily: "var(--font-body)",
        },
        // ===============================================
        // TIENDA - TIPOGRAFÍA UNIFICADA DE FILTROS
        // ===============================================
        // Título de cada bloque del sidebar/filtros de la tienda.
        // font-synthesis: none evita que el navegador simule negrita sobre
        // Synthese.otf, que ya es un corte Bold de por sí.
        ".tienda-section-title": {
          fontFamily: "var(--font-synthese), Synthese, sans-serif",
          fontWeight: "600",
          fontSynthesis: "none",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#051341",
        },
        // Sub-label de campo dentro de una tarjeta de filtros ("Tipo de Piel").
        // Deliberadamente en minúsculas, sans y atenuado: si compitiera con el
        // título en Synthese se aplanaría la jerarquía de la tienda.
        // El azul institucional al 65% mantiene la familia cromática y da 5.5:1
        // de contraste sobre el crema #fff2db de las tarjetas (AA).
        ".tienda-field-label": {
          fontFamily: "var(--font-caption), Inter, sans-serif",
          fontSize: "0.75rem",
          fontWeight: "500",
          letterSpacing: "0.01em",
          textTransform: "none",
          color: "rgb(5 19 65 / 0.65)",
        },
        // Trigger del <Select>: mismo lenguaje visual que el Input variant
        // "tienda" (beige + borde fino azul + Synthese), para que los campos
        // de un mismo formulario no se lean como controles distintos.
        // El 65% del estado placeholder da 5.52:1 sobre el beige (AA).
        // OJO con la clase duplicada: globals.css tiene una regla global
        // `button:not(.btn-no-radius)` que impone VELISTA + uppercase. Es
        // (0,1,1) y ademas se emite DESPUES de estas utilidades, asi que una
        // clase simple (0,1,0) pierde. Duplicarla da (0,2,0) y gana siempre.
        // El SelectTrigger de Radix renderiza un <button>, por eso le aplica.
        ".tienda-select-trigger.tienda-select-trigger": {
          fontFamily: "var(--font-synthese), Synthese, sans-serif",
          fontSynthesis: "none",
          backgroundColor: "#FFF2E9",
          borderWidth: "1px",
          borderColor: "#051341",
          color: "#051341",
          "&[data-placeholder]": {
            color: "rgb(5 19 65 / 0.65)",
          },
        },
        // Botones del sidebar de la tienda (lineas de producto, favoritos,
        // ofertas, vista). Misma pelea de especificidad que el trigger: solo
        // cambia la tipografia, el color de cada boton lo sigue poniendo su
        // variante para no pisar el bordo de las lineas de producto.
        ".tienda-button.tienda-button": {
          fontFamily: "var(--font-synthese), Synthese, sans-serif",
          fontSynthesis: "none",
        },
        // Botones de accion / filtro del sidebar (favoritos, ofertas, limpiar).
        // Estado activo via [data-active] en vez de cambiar la variante CVA:
        // line-primary arrastra shadow-line y hover:-translate-y-1, que es
        // justo el resplandor que este diseno pide eliminar.
        ".tienda-action-button.tienda-action-button": {
          fontFamily: "var(--font-synthese), Synthese, sans-serif",
          fontSynthesis: "none",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "#860119",
          backgroundColor: "#FFF2E9",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#860119",
          borderRadius: "0 15px",
          boxShadow: "none",
          filter: "none",
          transform: "none",
          transition: "background-color 0.2s ease, color 0.2s ease",
          "&:hover, &[data-active]": {
            backgroundColor: "#860119",
            color: "#FFF2E9",
            borderColor: "#860119",
            boxShadow: "none",
            filter: "none",
            transform: "none",
          },
        },
        // CTA "Ver todos los productos" de las paginas de linea.
        // El color de cada linea entra por la custom property --line-cta, que
        // se setea inline en el JSX. Es la unica forma de que el hover funcione:
        // si el color viniera en style={{ color }} inline, ninguna regla :hover
        // podria pisarlo (inline gana siempre sobre una hoja de estilos).
        // Clase duplicada para ganarle a la regla global de botones y al
        // hover:bg-accent de la variante outline.
        ".tienda-line-cta.tienda-line-cta": {
          fontFamily: "var(--font-synthese), Synthese, sans-serif",
          fontSynthesis: "none",
          backgroundColor: "transparent",
          color: "var(--line-cta)",
          borderColor: "var(--line-cta)",
          transition: "background-color 0.2s ease, color 0.2s ease",
          "&:hover": {
            backgroundColor: "var(--line-cta)",
            color: "#FFFFFF",
            borderColor: "var(--line-cta)",
            opacity: "1",
          },
        },
        // Badges de la ficha de producto ("Ultimas Unidades", "Destacado").
        // Usar SIEMPRE con variant="outline": la variante default del Badge
        // agrega la clase badge-default-hover, que en globals.css pisa el color
        // con !important y romperia el hover de abajo.
        ".tienda-badge": {
          backgroundColor: "#FFF2DB",
          color: "#791010",
          borderColor: "transparent",
          fontFamily: "EB Garamond, var(--font-text), serif",
          fontStyle: "italic",
          fontWeight: "500",
          transition: "background-color 0.2s ease, color 0.2s ease",
          "&:hover": {
            backgroundColor: "#791010",
            color: "#FFF2DB",
          },
        },
        // Superficie de las tarjetas del sidebar de la tienda. Reemplaza el
        // style={{ backgroundColor: "#fff2db" }} que estaba repetido inline en
        // 4 de las 5 tarjetas (la de Filtros Activos se habia quedado sin el y
        // caia al bg-bg-cream de la variante artisanal, visiblemente distinto).
        // Clase simple: aca no hay una regla de mayor especificidad que pisar,
        // solo la utilidad bg-bg-cream, y esta se emite despues.
        ".tienda-card": {
          backgroundColor: "#fff2db",
        },
        // Neutraliza el halo rojo de las variantes line-*: shadow-line y
        // shadow-line-lg estan definidas como "0 8px 25px var(--line-primary)"
        // SIN alpha (a diferencia del resto de la escala, que usa rgba a 0.15),
        // asi que pintan un resplandor opaco al 100%. Tambien anula el
        // hover:-translate-y, que dentro de un control segmentado con
        // overflow-hidden queda recortado.
        // Clase duplicada: hay que ganarle a .shadow-line (0,1,0) y a
        // .hover\\:shadow-line-lg:hover (0,2,0).
        ".tienda-flat.tienda-flat": {
          boxShadow: "none",
          filter: "none",
          transform: "none",
          "&:hover": {
            boxShadow: "none",
            filter: "none",
            transform: "none",
          },
        },
        // Items de la lista de categorias / lineas de producto.
        // Clase duplicada por la misma razon que .tienda-button: hay que
        // ganarle al letter-spacing: 1px de la regla global de botones.
        ".tienda-line-button.tienda-line-button": {
          fontFamily: "var(--font-synthese), Synthese, sans-serif",
          fontSynthesis: "none",
          letterSpacing: "0.15em",
          color: "#860119",
          textDecorationLine: "none",
          transition: "color 0.2s ease, text-decoration-color 0.2s ease",
          // Doble senal en hover: rojo mas profundo + subrayado institucional.
          // El subrayado ademas comunica que el item navega a otra pagina.
          "&:hover": {
            color: "#6B0114",
            textDecorationLine: "underline",
            textDecorationColor: "#051341",
            textDecorationThickness: "1px",
            textUnderlineOffset: "0.25em",
          },
        },
        // Panel desplegable del <Select>, en Synthese como el trigger.
        // OJO: Synthese.otf no trae "á" ni ":", así que las etiquetas de las
        // opciones se redactaron evitando esos caracteres ("Recientes" en vez
        // de "Más recientes", "Precio menor a mayor" sin dos puntos). Antes de
        // agregar una opción nueva, verificar los glifos.
        ".tienda-select-panel": {
          fontFamily: "var(--font-synthese), Synthese, sans-serif",
          fontSynthesis: "none",
          backgroundColor: "#FFF2E9",
          borderColor: "#051341",
          color: "#051341",
        },
        // Enhanced Animation Utilities
        ".animate-alkimya-float": {
          animation: "alkimya-float 3s ease-in-out infinite",
        },
        ".animate-alkimya-pulse": {
          animation: "alkimya-pulse 2s ease-in-out infinite",
        },
        ".animate-alkimya-shimmer": {
          animation: "alkimya-shimmer 2s infinite",
        },
        // Enhanced Spacing Utilities
        ".space-alkimya > * + *": {
          marginTop: "var(--space-4)",
        },
        ".space-alkimya-lg > * + *": {
          marginTop: "var(--space-8)",
        },
        ".space-alkimya-xl > * + *": {
          marginTop: "var(--space-12)",
        },
        // ===============================================
        // DA LUZ UNIFIED BUTTON SYSTEM (Cliente 2026)
        // ===============================================
        // Botón Global Unificado - USA ESTE ESTILO PARA TODOS
        ".btn-global": {
          fontFamily: "var(--font-title), VELISTA, serif",
          textTransform: "uppercase",
          fontSize: "0.875rem",
          fontWeight: "500",
          letterSpacing: "1px",
          backgroundColor: "#FFF2DB",
          color: "#791010",
          border: "none",
          borderRadius: "0px 15px",
          padding: "0.75rem 1.5rem",
          minHeight: "44px",
          transition: "all 0.2s ease",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        },
        ".btn-global:hover": {
          opacity: "0.9",
          transform: "translateY(-1px)",
        },
        // Botón primario (beige con texto rojo)
        ".btn-primary": {
          backgroundColor: "#FFF2DB",
          color: "#791010",
        },
        // Botón procesos (beige con verde)
        ".btn-procesos": {
          backgroundColor: "#FFF2DB",
          color: "#011f18",
        },
        // Botón alkimya/tienda (rojo oscuro con beige)
        ".btn-alkimya": {
          backgroundColor: "#7A160E",
          color: "#FFF4E0",
        },
        // Botón raíces/blog (azul con blanco)
        ".btn-raices": {
          backgroundColor: "#051341",
          color: "#FFFFFF",
        },
        // Botón umbral (naranja con blanco)
        ".btn-umbral": {
          backgroundColor: "#EA4F12",
          color: "#FFFFFF",
        },
        // Botón jade (verde oscuro con blanco)
        ".btn-jade": {
          backgroundColor: "#04412D",
          color: "#FFFFFF",
        },
        // Botón ecos (azul con blanco)
        ".btn-ecos": {
          backgroundColor: "#12406F",
          color: "#FFFFFF",
        },
        // Botón alma (rojo terracota con blanco)
        ".btn-alma": {
          backgroundColor: "#9B201A",
          color: "#FFFFFF",
        },
        // Botón utópica (marrón con beige)
        ".btn-utopica": {
          backgroundColor: "#392E13",
          color: "#FFF4E0",
        },
        // Texto en fondos
        ".text-on-beige": {
          color: "#791010",
        },
        ".text-on-color": {
          color: "#FFF4E0",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
} satisfies Config;

export default config;
