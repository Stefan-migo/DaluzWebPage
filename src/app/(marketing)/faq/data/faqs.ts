// =====================================================
// FAQ Data - Preguntas Frecuentes Da Luz
// Source: Notion - Sugerencias del Cliente
// =====================================================

export interface FAQItem {
  question: string;
  answer: string; // HTML permitido para links y formato
}

export interface FAQCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  items: FAQItem[];
}

export const FAQ_DATA: FAQCategory[] = [
  // =====================================================
  // A) COMPOSICIÓN Y TRANSPARENCIA
  // =====================================================
  {
    id: "composicion",
    name: "Composición y Transparencia",
    icon: "Leaf",
    items: [
      {
        question: "¿Cómo están compuestas las Alquimias Da Luz?",
        answer: `Todas nuestras Alquimias son creadas con <strong>materia prima de origen botánico</strong> y biotecnología de alta pureza. Utilizamos aceites vegetales prensados en frío, aceites esenciales puros, y hierbas medicinales.<br><br>
        <strong>El toque alquímico:</strong> Cada pieza es creada con una intención particular. Antes de entregarlas, les impregnamos las altas frecuencias de los cuencos tibetanos para potenciar sus beneficios y elevar su fuerza vital. Nuestras <strong>fórmulas son biodegradables y sustentables</strong>, libres de crueldad animal y creadas con un profundo respeto por la Pachamama.`,
      },
      {
        question: "¿Todos sus ingredientes son naturales?",
        answer: `"Nuestra base es <strong>100% Botánica</strong>, pero nuestra eficacia es <strong>Dermo-Cosmética</strong>.<br><br>
        En Da Luz practicamos la <strong>Ciencia Verde</strong>: combinamos lo mejor de la tierra (aceites prensados, hidrolatos y plantas) con activos de alta pureza (como Niacinamida o Ácido Mandélico) creados en laboratorio para ser idénticos a los de la naturaleza pero más estables y efectivos.<br><br>
        Evitamos lo controversial (parabenos, siliconas) y elegimos la <strong>pureza clínica</strong>. Si querés conocer el origen exacto de cada uno de nuestros activos, visitá nuestra <a href="/alkimya/activos-origen" class="text-brand-primary underline hover:opacity-80">Guía de Transparencia Botánica en nuestro Blog</a>."`,
      },
      {
        question: "¿Cómo sé qué contiene exactamente cada producto?",
        answer: `La transparencia es parte de nuestra medicina. En Da Luz, cada ingrediente tiene una razón de ser y un origen ético:<br><br>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>En el Carrito:</strong> Cada producto cuenta con su <strong>INCI detallado</strong> (nomenclatura internacional de ingredientes) para que sepas exactamente qué vas a aplicar en tu piel antes de comprar.</li>
          <li><strong>En Activos y Origen:</strong> Disponés de nuestra base de datos completa organizada en <strong>3 cuadros desplegables</strong> donde detallamos nuestros activos, sus orígenes biológicos y qué Alkimyas los contienen.</li>
          <li><strong>Beneficio Real:</strong> Allí explicamos qué aporte real le brinda cada componente a tu biología.</li>
        </ul><br>
        Podés consultar esta información completa en nuestra sección de <a href="/alkimya/activos-origen" class="text-brand-primary underline hover:opacity-80">ACTIVOS Y ORIGEN</a>.`,
      },
      {
        question:
          "¿Por qué declaran ingredientes como Limonene o Linalool si la marca es natural?",
        answer: `La transparencia es nuestra prioridad. Estos compuestos no son químicos agregados; son <strong>componentes naturales de los aceites esenciales puros</strong> (como Lavanda o Limón).<br><br>
        La ley nos exige declararlos para proteger a personas con <strong>hipersensibilidad a las fragancias</strong>, asegurando que tu elección sea siempre informada y segura.`,
      },
    ],
  },

  // =====================================================
  // B) BIOTIPOS Y CEREMONIA
  // =====================================================
  {
    id: "biotipos",
    name: "Biotipos y Ceremonia",
    icon: "Sparkles",
    items: [
      {
        question: "¿Cómo sé qué Alquimia es la adecuada para mí?",
        answer: `La clave de la dermo-cosmética consciente es la <strong>bio-individualidad</strong>.<br><br>
        Podés navegar nuestra sección de <a href="/alkimya/biotipos-doshas" class="text-brand-primary underline hover:opacity-80">Biotipos</a> para auto-conocerte y descubrir qué necesita tu piel hoy.<br><br>
        Desde allí, podrás acceder a tu <strong>CEREMONIA personalizada</strong>: un espacio donde te proponemos el ritual y las Alkimyas ideales para tu perfil específico.<br><br>
        Además, siempre podés consultarnos por WhatsApp para una asesoría personalizada gratuita.`,
      },
      {
        question: "¿Cómo se usan las Alquimias Da Luz?",
        answer: `En la descripción de cada producto en nuestra web encontrarás su <strong>modo de uso detallado</strong>. Además, para que tu experiencia sea completa, las indicaciones principales te llegarán en el <strong>Tesoro de Regalo</strong> que incluimos con tu compra.<br><br>
        Allí encontrarás la guía necesaria para integrar la Alkimya a tu ritual diario.`,
      },
    ],
  },

  // =====================================================
  // C) TESOROS DA LUZ
  // =====================================================
  {
    id: "tesoros",
    name: "Tesoros Da Luz",
    icon: "Gift",
    items: [
      {
        question: '¿Qué es el "Tesoro de Regalo" que recibo con mi compra?',
        answer: `Creemos que la medicina botánica se completa con el conocimiento. Por eso, con cada una de tus Alquimias, recibís un <strong>Tesoro de Regalo</strong>: una pieza informativa diseñada para guiarte en tu ritual, explicando desde el modo de uso hasta la energía de las plantas que te acompañan.<br><br>
        Podés conocer más sobre este intercambio en nuestra sección <a href="/alkimya/tesoros-daluz" class="text-brand-primary underline hover:opacity-80">TESORO DA LUZ</a>.`,
      },
      {
        question: "¿Puedo realizar mi pedido por fuera de la web?",
        answer: `¡Claro! Podés realizar tu pedido de forma personalizada a través de nuestro <strong>WhatsApp de atención</strong>. Allí te asesoramos directamente para que elijas las Alquimias que tu proceso necesita hoy.`,
      },
      {
        question:
          "¿Cómo accedo a mis Tesoros si hice mi compra por fuera de la web?",
        answer: `Para nosotros, el conocimiento es parte del intercambio soberano. Si compraste en un punto físico o por WhatsApp, para activar tu <strong>Acceso Premium</strong> seguí estos pasos:<br><br>
        <ol class="list-decimal pl-5 space-y-2">
          <li><strong>Registrate</strong> en nuestra web con tu correo electrónico.</li>
          <li><strong>Envianos un WhatsApp</strong> indicando ese mail y adjuntando cualquiera de estas 3 opciones para validar tu compra:</li>
        </ol><br>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Tu Foto Alquímica:</strong> Una foto de tus productos Da Luz.</li>
          <li><strong>Número de Lote:</strong> El código en la etiqueta del producto.</li>
          <li><strong>Palabra Clave:</strong> El nombre del revendedor o local donde lo adquiriste.</li>
        </ul><br>
        Una vez validado, vincularemos tu cuenta para que puedas disfrutar de todas las guías, rituales y frecuencias de tus Alkimyas.`,
      },
    ],
  },

  // =====================================================
  // D) PRECAUCIONES Y SEGURIDAD
  // =====================================================
  {
    id: "precauciones",
    name: "Precauciones y Seguridad",
    icon: "Shield",
    items: [
      {
        question: "¿Cuánto duran las Alquimias?",
        answer: `Consumir preferentemente dentro de los <strong>6 meses</strong> de abierto para asegurar la frescura y potencia de su fuerza vital botánica. (Símbolo PAO 6M).`,
      },
      {
        question: "¿Cómo realizo la prueba de parche?",
        answer: `Al ser fórmulas cargadas de activos vivos, realizá siempre una <strong>prueba en el antebrazo</strong> y esperá 24 hs antes de tu primer uso.`,
      },
      {
        question:
          "¿Puedo usar los Óleos y Elixires si estoy embarazada o amamantando?",
        answer: `Algunos aceites esenciales y plantas medicinales están contraindicados en esta etapa. Siempre realizamos una <strong>Anamnesis previa</strong> para adaptar la fórmula a tu estado actual.<br><br>
        Si elegís un producto de línea, consultanos antes de comprar si tenés dudas; estamos para acompañarte.`,
      },
      {
        question: "¿Qué es la fotosensibilidad en los cítricos y ácidos?",
        answer: `Nuestros elixires con notas cítricas (Limón, Bergamota, Naranja) y productos de renovación celular (Sérum Serena, Soy, Gel Exfoliante) exponen una 'piel nueva'. <strong>No deben aplicarse antes de la exposición solar directa</strong> ya que pueden generar manchas.<br><br>
        Recomendamos su uso nocturno y el uso <strong>obligatorio de protector solar</strong> durante el día.`,
      },
      {
        question:
          "¿Las plantas medicinales tienen contraindicaciones con medicamentos?",
        answer: `Sí. Plantas como el <strong>Hipérico o el Ginkgo Biloba</strong> pueden interactuar con medicación alopática. En nuestras sesiones de Anamnesis evaluamos tu historial clínico para asegurar que la sinergia botánica sea compatible y segura para tu tratamiento.`,
      },
      {
        question:
          "¿Es normal que mi piel se ponga roja después de una mascarilla?",
        answer: `Sí, se llama <strong>Hiperemia</strong>. Es la activación de la microcirculación producida por los minerales de las arcillas. Es un signo de que los activos están trabajando.<br><br>
        Si tenés rosácea activa o capilares frágiles, consultá nuestra <a href="/politicas/precauciones" class="text-brand-primary underline hover:opacity-80">Matriz de Precauciones</a>.`,
      },
      {
        question: "¿Debo descansar del uso de las tinturas o microdosis?",
        answer: `La medicina natural trabaja por ciclos. Generalmente recomendamos periodos de descanso (ej. <strong>3 semanas de uso por 1 de descanso</strong>) para que el cuerpo integre la información vibracional sin saturar los receptores.`,
      },
    ],
  },

  // =====================================================
  // E) OPERACIONES Y ENVÍOS
  // =====================================================
  {
    id: "operaciones",
    name: "Envíos y Operaciones",
    icon: "Truck",
    items: [
      {
        question: "¿Cómo elijo mis Alquimias?",
        answer: `Podés navegar por nuestras líneas (ECOS, JADE, PRISM.A), armar tu pedido personalizado o elegir un Kit y personalizarlo para tu biotipo.<br><br>
        <strong>Confirmación:</strong> Una vez que sumes tus productos al carrito, envianos el pedido. Te llegará un mail o mensaje para coordinar los detalles finales.`,
      },
      {
        question: "¿Cuándo recibo mi pedido?",
        answer: `<ul class="list-disc pl-5 space-y-2">
          <li><strong>Córdoba Capital:</strong> Entre 48 hs y 5 días hábiles.</li>
          <li><strong>Envíos Nacionales:</strong> Dependerá del transporte elegido (Correo Argentino/Andreani), coordinamos una vez realizado el pago.</li>
        </ul>`,
      },
      {
        question: "¿Cuáles son los métodos de pago?",
        answer: `<ul class="list-disc pl-5 space-y-2">
          <li><strong>Transferencia Bancaria:</strong> Al finalizar la compra, recibirás los datos (Alias/CBU).</li>
          <li><strong>Efectivo:</strong> Disponible exclusivamente para retiros y entregas coordinadas en Córdoba.</li>
          <li><strong>Mercado Pago:</strong> Aceptamos todas las tarjetas de débito, crédito y dinero en cuenta.</li>
        </ul>`,
      },
      {
        question: "¿Cuáles son las opciones de envío y retiro?",
        answer: `<ul class="list-disc pl-5 space-y-2">
          <li><strong>Córdoba Capital:</strong> Retiros en Zona Norte coordinados o cadetería (Miércoles y Viernes).</li>
          <li><strong>Envíos Nacionales:</strong> Correo Argentino / Andreani (coordinamos tras el pago).</li>
          <li><strong>Terceros:</strong> Puede retirar un tercero con nombre completo y número de orden.</li>
        </ul>`,
      },
    ],
  },
];

// Categoría especial para el CTA de contacto
export const FAQ_CONTACT_CTA = {
  title: "¿No encontrás tu respuesta?",
  subtitle: "Nuestra sabiduría está disponible para acompañarte.",
  buttonText: "Tu consulta personal",
  buttonLink: "https://wa.me/5493512344580",
};
