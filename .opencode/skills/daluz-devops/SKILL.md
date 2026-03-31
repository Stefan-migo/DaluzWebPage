---
name: daluz-devops
description: Guía para DevOps y CI/CD de DA LUZ. Usar al configurar GitHub Actions, desplegar a Vercel, gestionar environments, o automatizar workflows del proyecto.
---

# DevOps - Guía de Desarrollo

## Alcance

CI/CD pipelines, GitHub Actions, deployments a Vercel, gestión de environments, Git workflow, y automatización.

---

## Stack del Proyecto

| Área       | Tecnología                        |
| ---------- | --------------------------------- |
| Hosting    | Vercel                            |
| CI/CD      | GitHub Actions                    |
| Database   | Supabase (local + production)     |
| Repository | GitHub (Stefan-migo/DaluzWebPage) |

---

## Git Workflow

```
main (production) ← Protected, merge final
└── develop (integration) ← Default branch
    ├── feature/* (features)
    ├── fix/* (bug fixes)
    └── docs/* (documentación)
```

### Branch Naming

```
feature/add-new-product-component
feature/user-dashboard-redesign
fix/cart-validation-error
fix/login-redirect-issue
docs/update-api-documentation
experiment/new-payment-flow
```

### Commit Messages

```
feat: add new product card component
fix: resolve cart validation error
docs: update API documentation
refactor: extract useCart hook
test: add tests for checkout flow
```

---

## GitHub Actions

### PR Checks Workflow

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks

on:
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build
```

### Deploy Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build
      # Vercel deploy logic
```

### E2E Tests Workflow

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  pull_request:
    branches: [main, develop]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx playwright install chromium
      - run: npm run test:e2e
```

---

## Environments

### Variables de Entorno

| Environment | Archivo           | Secretos           |
| ----------- | ----------------- | ------------------ |
| Development | `.env.local`      | Locales, no commit |
| Preview     | Vercel Preview    | Secrets en Vercel  |
| Production  | Vercel Production | Secrets en Vercel  |

### Secrets Requeridos

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID
SANITY_API_TOKEN

# Resend (Email)
RESEND_API_KEY

# OAuth (Google)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

### Vercel Configuration

```json
// vercel.json (si existe)
{
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["gru1"]
}
```

---

## Deployment Flow

### Develop Branch

1. Push a `develop`
2. GitHub Action ejecuta: lint, type-check, test, build
3. Si pasa → Preview deploy en Vercel
4. URL de preview disponible en PR

### Main Branch

1. PR merge a `main`
2. GitHub Action ejecuta: lint, type-check, test, build
3. Si pasa → Production deploy en Vercel
4. Notificación en GitHub/Slack

### Rollback

1. Ir a Vercel Dashboard
2. Seleccionar deployment anterior
3. Click "Promote to Production"

---

## Supabase CLI

### Desarrollo Local

```bash
# Iniciar stack local
supabase start

# Ver estado
supabase status

# Detener
supabase stop

# Resetear con seed
supabase db reset

# Aplicar migraciones
supabase db push

# Traer schema de remoto
supabase db pull
```

### Migraciones

```bash
# Crear nueva migración
supabase migration new add_new_table

# Ver migraciones aplicadas
supabase migration list
```

---

## Branch Protection

### Main Branch

```yaml
protection:
  main:
    required_status_checks:
      - lint
      - type-check
      - test
      - build
    enforce_admins: true
    required_reviewers: 1
    allow_force_pushes: false
    allow_deletions: false
```

### CODEOWNERS

```
# CODEOWNERS
* @Stefan-migo
src/components/* @Stefan-migo
src/app/* @Stefan-migo
supabase/* @Stefan-migo
src/lib/* @Stefan-migo
.github/* @Stefan-migo
```

---

## Scripts Disponibles

```bash
# Install deps
npm ci

# Lint
npm run lint

# Type check
npm run type-check

# Format
npm run format

# Build
npm run build

# Tests
npm run test
npm run test:watch
npm run test:coverage

# E2E
npm run test:e2e
npm run test:e2e:headed
```

---

## Vercel Integration

### Dashboard

- **URL:** https://vercel.com/dashboard
- **Projects:** DaLuz WebPage

### Monitoreo

```bash
# Estado de deployments (via API)
curl -s "https://api.vercel.com/v6/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN"

# Ver deployment específico
curl -s "https://api.vercel.com/v13/deployments/<id>" \
  -H "Authorization: Bearer $VERCEL_TOKEN"
```

### Environment Variables en Vercel

1. Ir a Vercel Dashboard → Project → Settings → Environment Variables
2. Agregar cada variable con el scope correcto (Production, Preview, Development)
3. Re-desplegar para aplicar cambios

---

## Troubleshooting

### Build Fails en CI

```bash
# 1. Ver logs
gh run list --workflow=ci.yml
gh run view <id> --log

# 2. Replicar localmente
npm ci
npm run lint
npm run type-check
npm run build

# 3. Fix y pushear
git add . && git commit -m "fix: build error" && git push
```

### PR No Hace Merge

```bash
# Ver conflictos
gh pr view <pr-number> --json mergeable

# Rebasar
git checkout feature/rama
git rebase develop
git push --force
```

### Branch Desactualizado

```bash
git checkout feature/rama
git fetch origin
git merge origin/develop
git push
```

---

## Checklist Pre-Deploy

- [ ] `npm run lint` pasa sin errores
- [ ] `npm run type-check` pasa sin errores
- [ ] `npm run build` succeeds localmente
- [ ] Variables de entorno configuradas en Vercel
- [ ] Secrets no están en código
- [ ] Branch protection activo en main
- [ ] Tests pasando en CI

---

## Anti-Patrones a Evitar

❌ Secrets en código (usar GitHub Secrets / Vercel)
❌ Force push a main/develop
❌ Deploys manuales (usar CI/CD)
❌ Branches sin naming convention
❌ Commits directos a main
❌ .env commitado (agregar a .gitignore)

---

## Referencias

- **Agent devops:** `.opencode/agents/devops.md`
- **Agent github:** `.opencode/agents/github.md`
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Actions:** https://docs.github.com/en/actions
- **Supabase CLI:** https://supabase.com/docs/guides/cli
