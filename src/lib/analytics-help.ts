// Help text configuration for all analytics metrics

export const ANALYTICS_HELP = {
  // KPI Cards
  totalRevenue: {
    title: "Ingresos Totales",
    description: "Suma de todos los ingresos generados por pedidos pagados en el período seleccionado.",
    details: [
      "Solo cuenta pedidos con estado de pago 'Pagado'",
      "No incluye pedidos pendientes, cancelados o fallidos",
      "Se calcula en pesos argentinos (ARS)"
    ],
    formula: "Suma de total_amount donde payment_status = 'paid'",
    example: "Si tienes 10 pedidos pagados de $5.000 cada uno, el ingreso total es $50.000"
  },

  revenueGrowth: {
    title: "Crecimiento de Ingresos",
    description: "Porcentaje de crecimiento o decrecimiento de los ingresos comparado con el período anterior.",
    details: [
      "Compara ingresos del período actual vs período anterior del mismo tamaño",
      "Un valor positivo (+) indica crecimiento",
      "Un valor negativo (-) indica decrecimiento",
      "Se calcula automáticamente según el período seleccionado"
    ],
    formula: "((Ingresos Actuales - Ingresos Anteriores) / Ingresos Anteriores) × 100",
    example: "Período actual: $50.000, Período anterior: $125.000 → Crecimiento = ((50.000 - 125.000) / 125.000) × 100 = -60%"
  },

  totalOrders: {
    title: "Total de Pedidos",
    description: "Cantidad total de pedidos realizados en el período seleccionado, independientemente de su estado de pago.",
    details: [
      "Incluye todos los pedidos (pagados, pendientes, cancelados)",
      "Muestra el promedio de valor por pedido como información adicional"
    ],
    formula: "COUNT(orders) en el período",
    example: "Si se crearon 25 pedidos en los últimos 30 días, se muestra 25"
  },

  totalCustomers: {
    title: "Total de Clientes",
    description: "Cantidad total de clientes registrados en el sistema (no solo del período seleccionado).",
    details: [
      "Cuenta todos los perfiles en la base de datos",
      "No se limita al período seleccionado",
      "Muestra la tasa de conversión como información adicional"
    ],
    formula: "COUNT(profiles)",
    example: "Si hay 100 clientes registrados en total, se muestra 100"
  },

  conversionRate: {
    title: "Tasa de Conversión",
    description: "Relación entre pedidos realizados y nuevos clientes registrados en el período.",
    details: [
      "Mide qué tan efectivo es el sistema en convertir nuevos registros en ventas",
      "Un valor alto indica que los nuevos clientes compran rápidamente",
      "Un valor bajo puede indicar que los clientes se registran pero no compran",
      "Si hay 0 nuevos clientes, la tasa será 0%"
    ],
    formula: "(Total Pedidos / Nuevos Clientes) × 100",
    example: "10 pedidos y 5 nuevos clientes → (10 / 5) × 100 = 200% (cada cliente hizo 2 pedidos en promedio)"
  },

  // Charts
  salesTrend: {
    title: "Tendencia de Ventas",
    description: "Muestra la evolución de los ingresos durante el período seleccionado con visualización moderna.",
    details: [
      "Vista de Área: Muestra el volumen y flujo de ingresos con relleno gradiente",
      "Vista de Columnas: Compara ingresos por período con barras verticales (agrupa datos si son muchos días)",
      "Solo cuenta pedidos pagados (payment_status = 'paid')",
      "El gráfico muestra automáticamente: promedio, máximo y mínimo",
      "Grid lines ayudan a leer valores exactos"
    ],
    example: "Si ves un área grande en ciertos días, significa que esos días tuvieron más ventas. La vista de columnas agrupa por semanas si el período es largo."
  },

  customerAcquisition: {
    title: "Adquisición de Clientes",
    description: "Muestra cuántos nuevos clientes se registraron durante el período seleccionado.",
    details: [
      "Vista de Área: Muestra el crecimiento acumulativo de clientes nuevos",
      "Vista de Columnas: Compara registros por período (agrupa por semanas si son muchos días)",
      "Se basa en la fecha de creación del perfil (created_at)",
      "Ayuda a identificar períodos con mayor captación de clientes",
      "Útil para medir efectividad de campañas de marketing",
      "Incluye estadísticas: promedio, máximo, mínimo"
    ],
    example: "Si ves un pico en una semana específica, significa que esa semana se registraron más clientes. Esto puede coincidir con campañas publicitarias o promociones."
  },

  orderStatus: {
    title: "Estados de Pedidos",
    description: "Distribución de pedidos según su estado actual (pendiente, procesando, enviado, entregado).",
    details: [
      "Pending (Pendiente): Pedidos creados pero sin procesar",
      "Processing (Procesando): Pedidos en preparación",
      "Shipped (Enviado): Pedidos despachados pero no entregados",
      "Delivered (Entregado): Pedidos completados",
      "Cancelled (Cancelado): Pedidos cancelados",
      "Puedes cambiar entre vista circular (pie) o barras"
    ],
    example: "Si ves 60% entregados y 20% en proceso, tu sistema está funcionando bien"
  },

  customerSegmentation: {
    title: "Segmentación de Clientes",
    description: "Clasificación de clientes según su tipo de membresía o estado.",
    details: [
      "Miembros: Clientes con membresía activa (básica o premium)",
      "Premium: Clientes con membresía premium",
      "Básico: Clientes con membresía básica",
      "Sin Membresía: Clientes registrados sin membresía",
      "Útil para medir adopción del programa de membresías"
    ],
    example: "Si 40% son miembros, tu programa de membresías está teniendo buena adopción"
  },

  categoryRevenue: {
    title: "Ingresos por Categoría",
    description: "Muestra qué categorías de productos generan más ingresos.",
    details: [
      "Se calcula sumando el precio total de todos los items vendidos por categoría",
      "Solo aparecen categorías que tienen productos vendidos",
      "Si no ves todas las líneas de producto, es porque aún no tienen ventas registradas",
      "Las categorías se asignan a nivel de producto en el catálogo",
      "Puedes cambiar entre barras horizontales o gráfico circular"
    ],
    formula: "Suma de (cantidad × precio) por categoría de productos vendidos",
    example: "Si 'Aceites' generó $100.000 y 'Velas' $50.000, Aceites aparece primero"
  },

  topProducts: {
    title: "Productos Más Vendidos",
    description: "Ranking de productos que han generado más ingresos en el período.",
    details: [
      "Se ordena por ingresos totales (cantidad × precio)",
      "Solo muestra los top 8 productos",
      "Solo aparecen productos que se han vendido al menos una vez",
      "Si no ves todas tus líneas de producto, es porque aún no tienen ventas",
      "La información viene de pedidos reales (tabla order_items)",
      "Incluye el nombre tal como estaba al momento de la venta"
    ],
    formula: "Suma de total_price agrupado por product_id",
    example: "Si vendiste 5 unidades de 'Aceite de Lavanda' a $2.000, genera $10.000 de ingreso"
  }
};

// Empty state messages
export const EMPTY_STATE_MESSAGES = {
  noOrders: {
    title: "No hay pedidos registrados",
    message: "Aún no se han registrado pedidos en el sistema. Los datos aparecerán cuando los clientes realicen compras.",
    suggestion: "Puedes crear pedidos manualmente desde la sección de Pedidos."
  },
  noProducts: {
    title: "No hay productos vendidos",
    message: "No se han vendido productos en el período seleccionado.",
    suggestion: "Prueba seleccionar un período más amplio (90 o 365 días) o verifica que tengas productos activos en el catálogo."
  },
  noCustomers: {
    title: "No hay clientes nuevos",
    message: "No se registraron nuevos clientes en este período.",
    suggestion: "Los clientes pueden registrarse desde el sitio web o puedes crearlos manualmente desde la sección de Clientes."
  },
  noCategories: {
    title: "No hay categorías con ventas",
    message: "Las categorías aparecerán cuando tengas productos vendidos asignados a categorías.",
    suggestion: "Asegúrate de que tus productos tengan categorías asignadas en el catálogo."
  }
};

