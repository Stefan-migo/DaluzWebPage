# Supabase CLI Setup and Usage Guide

**Project:** Da Luz Consciente  
**Environment:** Fedora Linux with Podman  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Environment Configuration](#environment-configuration)
5. [Common Commands](#common-commands)
6. [Migration Management](#migration-management)
7. [Database Access](#database-access)
8. [Troubleshooting](#troubleshooting)
9. [Daily Workflow](#daily-workflow)

---

## Overview

This project uses **Supabase CLI** for local database development. The CLI runs a complete local Supabase stack using Docker/Podman containers, including:

- PostgreSQL database
- PostgREST API server
- GoTrue authentication service
- Storage service
- Realtime server
- Kong API gateway
- Supabase Studio (web UI)
- Mailpit (email testing)
- Edge Functions runtime

---

## Prerequisites

### System Requirements

- **Fedora Linux** (or compatible distribution)
- **Podman** (Fedora's default container engine)
- **Node.js** >= 18.0.0
- **npm** or compatible package manager

### Required Packages

```bash
# Install Podman tools (if not already installed)
sudo dnf install -y podman podman-compose podman-docker

# Enable Podman socket for Docker compatibility
systemctl --user enable --now podman.socket

# Verify Podman is running
systemctl --user status podman.socket
```

### Environment Variable Setup

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
export DOCKER_HOST=unix:///run/user/$UID/podman/podman.sock
```

Then reload your shell:

```bash
source ~/.bashrc  # or source ~/.zshrc
```

### Verify Installation

```bash
# Check Podman version
podman --version

# Check Docker compatibility
docker --version  # Should show Podman emulating Docker

# Check if socket is running
docker ps  # Should return empty list without errors
```

---

## Initial Setup

The project already has Supabase CLI configured. You DON'T need to run `supabase init` again.

### Project Structure

```
DaluzWebPage/
├── supabase/
│   ├── config.toml           # Supabase configuration
│   ├── migrations/           # Database migrations (31 files)
│   └── seed-ecommerce.sql    # Seed data
├── .env.local                # Environment variables
└── package.json              # Includes Supabase scripts
```

### First-Time Start

```bash
cd "/run/media/stefan/Nuevo vol/Proyectos/DaLuz/DaluzWebPage"

# First start will download container images (~800MB, takes 5-10 minutes)
npm run supabase:start
```

**Important:** The first start downloads all container images. This is a ONE-TIME process. Subsequent starts take ~10-30 seconds.

---

## Environment Configuration

### Local Development Setup

For local development, update `.env.local` with local Supabase credentials:

```bash
# Local Supabase (for development)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

### Production Configuration

Keep production credentials in a separate file (`.env.production`) or environment:

```bash
# Production/Remote Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xdvemkyvgnfnibntfbwq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<production_service_role_key>
```

### Service URLs (When Running)

When Supabase is running locally, these URLs are available:

| Service | URL | Description |
|---------|-----|-------------|
| API | http://127.0.0.1:54321 | REST API endpoint |
| GraphQL | http://127.0.0.1:54321/graphql/v1 | GraphQL endpoint |
| Studio | http://127.0.0.1:54323 | Web UI for database management |
| Database | postgresql://postgres:postgres@127.0.0.1:54322/postgres | Direct DB connection |
| Mailpit | http://127.0.0.1:54324 | Email testing interface |

---

## Common Commands

### Starting and Stopping

```bash
# Start Supabase (uses backup if available, fast)
npm run supabase:start

# Stop Supabase (data is preserved in Docker volume)
npm run supabase:stop

# Check status and get URLs/keys
npm run supabase:status
```

### Database Management

```bash
# Reset database (reapply ALL migrations from scratch)
npm run supabase:reset

# Run any Supabase CLI command directly
npm run supabase -- <command>

# Examples:
npm run supabase -- db dump
npm run supabase -- db diff
npm run supabase -- functions list
```

### Using Supabase Studio

Open your browser to **http://127.0.0.1:54323**

Features:
- **Table Editor**: View/edit data visually
- **SQL Editor**: Run custom queries
- **Authentication**: Manage users
- **Storage**: View uploaded files
- **API Docs**: Auto-generated API documentation

---

## Migration Management

### Migration File Structure

Migrations are located in `supabase/migrations/` and run in **timestamp order** (filename-based).

**Critical:** Migration files MUST be named with timestamps that reflect their dependency order.

#### Current Migration Order

The project has restructured migrations to ensure proper dependency order:

1. **Base Tables** (December 2024)
   - `20241220000000_create_user_profiles.sql`
   - `20241220000001_create_ecommerce_system.sql`
   - `20241220000002_create_membership_system.sql`

2. **Admin System** (January 2025)
   - `20250116000000_setup_admin_users.sql`
   - `20250116000001_fix_admin_profile.sql`
   - etc.

3. **Reviews System** (July 2025)
   - `20250716001035_create_reviews_tables.sql`
   - `20250716001036_fix_review_notifications.sql`
   - etc.

### Creating New Migrations

```bash
# Generate a new migration file
npm run supabase -- migration new <migration_name>

# Example:
npm run supabase -- migration new add_user_settings
```

**Important:** Ensure the timestamp places the migration AFTER any tables it depends on!

### Applying Migrations

Migrations are automatically applied when you:
- Run `npm run supabase:start` (first time)
- Run `npm run supabase:reset`

### Migration Best Practices

1. **Use IF EXISTS/IF NOT EXISTS** to make migrations idempotent:
   ```sql
   DROP POLICY IF EXISTS "policy_name" ON table_name;
   CREATE POLICY "policy_name" ON table_name ...;
   ```

2. **Check dependencies**: Ensure referenced tables/columns exist
3. **Order matters**: Name files with appropriate timestamps
4. **Test locally first**: Always test migrations with `npm run supabase:reset` before deploying

---

## Database Access

### Via Supabase Studio (Recommended)

1. Start Supabase: `npm run supabase:start`
2. Open browser: http://127.0.0.1:54323
3. Navigate to "Table Editor" or "SQL Editor"

### Via Command Line (psql)

```bash
# Connect to local database
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Or use Supabase CLI wrapper
npm run supabase -- db psql
```

### Via Application Code

Your Next.js app connects automatically using the environment variables in `.env.local`.

---

## Troubleshooting

### Issue: "Cannot connect to Docker daemon"

**Solution:**
```bash
# Ensure Podman socket is running
systemctl --user status podman.socket

# If not running, enable it
systemctl --user enable --now podman.socket

# Ensure DOCKER_HOST is set
echo $DOCKER_HOST
# Should output: unix:///run/user/1000/podman/podman.sock

# If not set, add to ~/.bashrc and reload
export DOCKER_HOST=unix:///run/user/$UID/podman/podman.sock
source ~/.bashrc
```

### Issue: Migration Order Errors

**Symptoms:**
```
ERROR: relation "table_name" does not exist
```

**Solution:**
Migrations are running in wrong order. Check dependencies:

1. Identify which migration creates the missing table
2. Rename dependent migrations to run AFTER the table creation
3. Reset database: `npm run supabase:reset`

**Example:**
```bash
# If migration 20250116_feature.sql needs products table created in 20250716_ecommerce.sql
# Rename the feature migration:
mv supabase/migrations/20250116_feature.sql supabase/migrations/20250716_001100_feature.sql
```

### Issue: Duplicate Policy/Constraint Errors

**Symptoms:**
```
ERROR: policy "policy_name" already exists
```

**Solution:**
Add `DROP ... IF EXISTS` before `CREATE` statements in the migration:

```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
CREATE POLICY "policy_name" ON table_name ...;
```

### Issue: Slow First Start

**Expected Behavior:** First start takes 5-10 minutes to download ~800MB of container images.

**Subsequent starts:** ~10-30 seconds (uses cached images)

If subsequent starts are slow, check:
```bash
# Verify images are downloaded
docker images | grep supabase

# Check for running containers
docker ps
```

### Issue: Port Conflicts

**Symptoms:**
```
Error: Port 54321 already in use
```

**Solution:**
```bash
# Check what's using the port
sudo lsof -i :54321

# Or change ports in supabase/config.toml
[api]
port = 54321  # Change this to another port
```

---

## Daily Workflow

### Starting Development Session

```bash
# 1. Navigate to project
cd "/run/media/stefan/Nuevo vol/Proyectos/DaLuz/DaluzWebPage"

# 2. Start Supabase (if not running)
npm run supabase:start

# 3. Start Next.js dev server (in another terminal or same terminal)
npm run dev

# 4. Open Supabase Studio (optional)
# Browser: http://127.0.0.1:54323

# 5. Start coding! Your app runs on http://localhost:3000
```

### Ending Development Session

```bash
# Stop Next.js (Ctrl+C in the terminal running npm run dev)

# Stop Supabase (optional - you can leave it running)
npm run supabase:stop
```

### Making Database Changes

```bash
# 1. Create a new migration
npm run supabase -- migration new my_feature

# 2. Edit the generated SQL file in supabase/migrations/

# 3. Reset database to apply migration
npm run supabase:reset

# 4. Verify in Supabase Studio
# Browser: http://127.0.0.1:54323

# 5. Test in your app
npm run dev
```

### Deploying to Production

```bash
# 1. Ensure local migrations work
npm run supabase:reset  # Test locally

# 2. Link to remote project (one-time)
npm run supabase -- link --project-ref <your-project-ref>

# 3. Push migrations to production
npm run supabase -- db push

# 4. Verify in production Supabase dashboard
```

---

## Key Differences: Backup vs Fresh Start

### Starting from Backup (Normal)

```bash
npm run supabase:start

# Output:
# Starting database from backup...
# Started supabase local development setup.
```

**When it happens:**
- After a successful previous start
- Migrations already applied
- Fast (~10-30 seconds)

**Preserves:**
- All data you've added
- All migrations applied
- User accounts created

### Fresh Start (Reset)

```bash
npm run supabase:reset

# Output:
# Starting database...
# Initialising schema...
# Applying migration 20241220000000_create_user_profiles.sql...
```

**When it happens:**
- Running `npm run supabase:reset`
- First-ever start
- Slower (~1-2 minutes)

**Resets:**
- All data deleted
- Migrations reapplied from scratch
- Clean slate

---

## Advanced: Linking to Remote Supabase

If you want to sync local development with a hosted Supabase project:

```bash
# Link to remote project
npm run supabase -- link --project-ref xdvemkyvgnfnibntfbwq

# Pull remote database schema
npm run supabase -- db pull

# Push local migrations to remote
npm run supabase -- db push
```

---

## Summary for Code Agents

**To work with this project:**

1. **Verify environment:**
   - Check `DOCKER_HOST` is set
   - Check Podman socket is running
   
2. **Start Supabase:**
   ```bash
   npm run supabase:start
   ```

3. **Check status:**
   ```bash
   npm run supabase:status
   ```

4. **Access Studio UI:**
   - http://127.0.0.1:54323

5. **For new migrations:**
   - Create migration file with proper timestamp
   - Include `IF EXISTS/IF NOT EXISTS` clauses
   - Test with `npm run supabase:reset`

6. **Common issues:**
   - Migration order errors → Check timestamps
   - Duplicate errors → Add DROP IF EXISTS
   - Docker daemon errors → Check DOCKER_HOST env var

---

## Additional Resources

- [Supabase Local Development Docs](https://supabase.com/docs/guides/local-development)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Podman Documentation](https://docs.podman.io/)

---

**End of Documentation**

