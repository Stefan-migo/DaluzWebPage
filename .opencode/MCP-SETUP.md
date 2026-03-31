# Configuración de Notion MCP para DaLuz

## Opción 1: OAuth con Notion MCP (Recomendado)

El endpoint oficial de Notion MCP (`https://mcp.notion.com/mcp`) usa OAuth 2.0 para autenticación.

### Configuración en opencode

El archivo `.opencode/mcp.json` ya está configurado para usar el endpoint oficial.

### Pasos de autenticación

1. Ejecuta el comando de conexión MCP en opencode:

   ```
   /mcp connect notion
   ```

   o el equivalente en tu CLI de opencode.

2. Se abrirá un navegador para completar el OAuth flow de Notion.

3. Autoriza la aplicación "DaLuz Agent" en tu workspace de Notion.

4. Listo - el MCP estará conectado.

---

## Opción 2: Integration Token (para desarrollo/testing)

Si prefieres usar tu Integration Token directamente (token: `ntn_...`), puedes usar el servidor open-source o un bridge.

### Usando mcp-remote como bridge

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"],
      "env": {
        "NOTION_API_KEY": "ntn_tu_token_aqui"
      }
    }
  }
}
```

### Usando notion-mcp-server local

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "ntn_tu_token_aqui"
      }
    }
  }
}
```

---

## Integración con opencode

Para activar la skill de Notion en opencode:

1. **Configura el MCP** (una de las opciones arriba)

2. **Reinicia opencode** para que cargue el servidor MCP

3. **Verifica la conexión**:

   ```
   /mcp list
   ```

   Deberías ver "notion" en la lista.

4. **Activa la skill**:
   La skill `.opencode/agents/notion.md` se cargará automáticamente cuando menciones "notion" o uses prompts relacionados con Notion.

---

## Notas importantes

- **OAuth es recomendado** para producción porque:
  - No expone tu Integration Token
  - Permisos granulares por usuario
  - Token refresh automático

- **Integration Token** es útil para:
  - Testing rápido
  - Scripts automatizados (sin UI)
  - Desarrollo local

---

## Troubleshooting

### "MCP server not found"

- Verifica que el archivo `.opencode/mcp.json` existe
- Verifica que la sintaxis JSON es correcta (sin comentarios)

### "Authentication failed"

- OAuth: Intenta desconectar y reconectar el MCP
- Token: Verifica que el token está correctamente configurado

### "Rate limit exceeded"

- Espera 30-60 segundos
- Reduce la frecuencia de requests

### "Permission denied"

- Verifica que la integración tiene permisos en las páginas que intentas acceder
- En Notion: Abre la página → Share → busca tu integración y dale acceso
