# DA LUZ - Documentación

Este directorio contiene la documentación del proyecto. **NotebookLM es el cerebro** — toda la documentación debe subirse allí para consultas con IA.

## Documentos Principales

| Documento | Descripción |
|-----------|-------------|
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Overview completo del sistema (base) |
| [NOTEBOOKLM_SETUP.md](./NOTEBOOKLM_SETUP.md) | Configuración y uso de NotebookLM |
| [UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md](./UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md) | Sistema de diseño y UI/UX |

## Workflow

1. Crear/actualizar docs en `Docs/`
2. Subir a NotebookLM: `npm run notebooklm:upload` o ver NOTEBOOKLM_SETUP.md
3. Consultar con el asistente de NotebookLM

## Estructura Futura (por módulo)

- `products/` - Catálogo, variantes, inventario
- `orders/` - Pedidos, MercadoPago, webhooks
- `admin/` - Panel, roles, notificaciones
- `auth/` - Autenticación, perfiles
