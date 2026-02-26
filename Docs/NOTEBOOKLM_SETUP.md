# NotebookLM - Cerebro del Proyecto DA LUZ

**NotebookLM es el centro de documentación y conocimiento del proyecto.** Toda la documentación debe estar allí para consultas con IA.

---

## Configuración Inicial

### 1. Autenticación

```bash
# Primera vez: login manual con cookies
nlm login --manual --file cookies.json --profile daluz

# Verificar
nlm login --check --profile daluz
```

### 2. Crear Notebook del Proyecto

```bash
nlm notebook create "DA LUZ Project" --profile daluz
```

### 3. Subir Documentación

```bash
# Obtener ID del notebook
nlm notebook list --profile daluz

# Añadir PROJECT_OVERVIEW (reemplaza <NOTEBOOK_ID> con el ID real)
nlm source add <NOTEBOOK_ID> --file Docs/PROJECT_OVERVIEW.md --profile daluz --wait --title "Project Overview"
```

---

## Estructura de Documentación (para subir)

| Documento | Descripción | Prioridad |
|-----------|-------------|-----------|
| `Docs/PROJECT_OVERVIEW.md` | Overview completo del sistema | ✅ Base |
| `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md` | Sistema de diseño (especificaciones oficiales) | Alta |
| `Docs/modules/00-frontend-ui/MODULE.md` | Módulo Frontend/UI | Media |
| `Docs/MercadoPagoImplementationPlan.md` | Integración pagos | Media |
| `.cursor/skills/daluz-ecommerce-admin/SKILL.md` | Guías de desarrollo | Media |

---

## Comandos Útiles

```bash
# Listar notebooks
nlm notebook list --profile daluz

# Añadir nueva documentación
nlm source add <notebook-id> --file Docs/<archivo>.md --profile daluz --wait

# Consultar con IA
nlm notebook query <notebook-id> "¿Cómo funciona el flujo de checkout?"
```

---

## Workflow de Documentación

1. **Crear/actualizar** documentación en `Docs/`
2. **Subir** a NotebookLM con `nlm source add`
3. **Consultar** con el asistente de NotebookLM sobre el proyecto
4. **MCP en Cursor**: El servidor notebooklm-mcp permite usar NotebookLM desde Cursor

---

## Perfil por Defecto

Para usar daluz como perfil por defecto (MCP y CLI):

```bash
nlm login switch daluz
nlm config set auth.default_profile daluz
```
