# Local Supabase Docker Setup Guide - Windows

**Project:** Da Luz Consciente  
**Platform:** Windows 10/11  
**Last Updated:** January 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Environment Configuration](#environment-configuration)
5. [Daily Workflow](#daily-workflow)
6. [Pushing Changes to Remote](#pushing-changes-to-remote)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This guide will help you set up a **local Supabase database using Docker** on Windows. This allows you to:

- ✅ Test database changes locally before deploying
- ✅ Work offline without internet connection
- ✅ Avoid affecting production data
- ✅ Develop faster with local database
- ✅ Test migrations safely

The local Supabase stack includes:
- PostgreSQL database
- PostgREST API server
- GoTrue authentication service
- Storage service
- Realtime server
- Supabase Studio (web UI for database management)
- Mailpit (email testing)

---

## Prerequisites

### 1. Install Docker Desktop for Windows

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Download "Docker Desktop for Windows"
   - Choose the appropriate version (Intel/AMD or Apple Silicon)

2. **Install Docker Desktop:**
   - Run the installer
   - Follow the installation wizard
   - **Important:** Enable "Use WSL 2 instead of Hyper-V" if prompted (recommended for Windows 10/11)

3. **Start Docker Desktop:**
   - Launch Docker Desktop from Start Menu
   - Wait for Docker to start (whale icon in system tray should be steady)
   - Verify installation:
     ```bash
     docker --version
     docker ps
     ```

### 2. Install Node.js and npm

- **Node.js:** >= 18.0.0
- **npm:** Comes with Node.js
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 3. Install Git Bash (if not already installed)

- Git Bash comes with Git for Windows
- Download from: https://git-scm.com/download/win

---

## Step-by-Step Setup

### Step 1: Navigate to Project Directory

Open **Git Bash** and navigate to your project:

```bash
cd /e/Proyectos/DaLuz/DaluzWebPage
```

### Step 2: Verify Docker is Running

```bash
# Check Docker is running
docker ps

# Should return an empty list (no error) if Docker is working
```

**If you get an error:**
- Make sure Docker Desktop is running
- Check the Docker Desktop icon in system tray
- Restart Docker Desktop if needed

### Step 3: Install Project Dependencies

```bash
# Install npm packages (includes Supabase CLI)
npm install
```

### Step 4: Start Local Supabase

**First time (will download ~800MB of Docker images, takes 5-10 minutes):**

```bash
npm run supabase:start
```

**What happens:**
- Downloads all required Docker images (one-time process)
- Creates local Docker containers
- Applies all database migrations from `supabase/migrations/`
- Seeds database with initial data (if configured)
- Starts all Supabase services

**Expected output:**
```
Starting supabase local development setup...
Downloading images...
Starting services...
Applying migrations...
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Save these credentials!** You'll need them for your `.env.local` file.

### Step 5: Check Supabase Status

```bash
npm run supabase:status
```

This shows:
- All service URLs
- API keys (anon key and service role key)
- Database connection string

### Step 6: Access Supabase Studio

Open your browser and go to:
```
http://127.0.0.1:54323
```

**Supabase Studio features:**
- **Table Editor:** View and edit data visually
- **SQL Editor:** Run custom queries
- **Authentication:** Manage users
- **Storage:** View uploaded files
- **API Docs:** Auto-generated API documentation

### Step 7: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp env.example .env.local
```

Then edit `.env.local` with your **local Supabase credentials**:

```bash
# Local Supabase (for development)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key_from_status>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key_from_status>
```

**To get the keys:**
```bash
npm run supabase:status
```

Copy the `anon key` and `service_role key` from the output.

**Important:** Keep your production credentials separate! Only use local credentials in `.env.local`.

---

## Environment Configuration

### Local Development (`.env.local`)

```bash
# Local Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<local_service_role_key>
```

### Production (`.env.production` or Vercel environment variables)

```bash
# Production/Remote Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xdvemkyvgnfnibntfbwq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<production_service_role_key>
```

### Service URLs (When Running Locally)

| Service | URL | Description |
|---------|-----|-------------|
| API | http://127.0.0.1:54321 | REST API endpoint |
| GraphQL | http://127.0.0.1:54321/graphql/v1 | GraphQL endpoint |
| Studio | http://127.0.0.1:54323 | Web UI for database management |
| Database | postgresql://postgres:postgres@127.0.0.1:54322/postgres | Direct DB connection |
| Mailpit | http://127.0.0.1:54324 | Email testing interface |

---

## Daily Workflow

### Starting Development Session

```bash
# 1. Navigate to project
cd /e/Proyectos/DaLuz/DaluzWebPage

# 2. Start Supabase (if not running)
npm run supabase:start

# 3. Verify it's running
npm run supabase:status

# 4. Start Next.js dev server (in another terminal or same terminal)
npm run dev

# 5. Open Supabase Studio (optional)
# Browser: http://127.0.0.1:54323

# 6. Start coding! Your app runs on http://localhost:3000
```

### Ending Development Session

```bash
# Stop Next.js (Ctrl+C in the terminal running npm run dev)

# Stop Supabase (optional - you can leave it running)
npm run supabase:stop
```

**Note:** Stopping Supabase preserves your data in Docker volumes. Next time you start, your data will still be there.

### Making Database Changes

```bash
# 1. Create a new migration
npm run supabase -- migration new my_feature

# 2. Edit the generated SQL file in supabase/migrations/
# Example: supabase/migrations/20250113_my_feature.sql

# 3. Reset database to apply migration
npm run supabase:reset

# 4. Verify in Supabase Studio
# Browser: http://127.0.0.1:54323

# 5. Test in your app
npm run dev
```

---

## Pushing Changes to Remote

### Workflow: Local → Remote

**Step 1: Test Locally**
```bash
# Make your changes locally
# Test with: npm run supabase:reset
# Verify everything works
```

**Step 2: Link to Remote Project (One-time setup)**

```bash
# Link to your remote Supabase project
npm run supabase -- link --project-ref xdvemkyvgnfnibntfbwq
```

**Step 3: Push Migrations to Remote**

```bash
# Push local migrations to remote Supabase
npm run supabase -- db push
```

**What this does:**
- Compares local migrations with remote database
- Applies only new migrations
- **Does NOT delete data** (only adds schema changes)

**Step 4: Verify in Production**

- Go to your Supabase dashboard: https://supabase.com/dashboard
- Check the migrations tab
- Verify your changes are applied

### Alternative: Manual Migration Application

If you prefer to apply migrations manually:

1. **Export migration SQL:**
   ```bash
   # View the migration file
   cat supabase/migrations/20250113_my_feature.sql
   ```

2. **Apply in Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/xdvemkyvgnfnibntfbwq
   - Navigate to: SQL Editor
   - Paste and run the migration SQL

### Best Practices

1. **Always test locally first:**
   ```bash
   npm run supabase:reset  # Test migration
   ```

2. **Use descriptive migration names:**
   ```bash
   npm run supabase -- migration new add_user_preferences
   ```

3. **Make migrations idempotent:**
   ```sql
   -- Good: Uses IF EXISTS
   DROP POLICY IF EXISTS "policy_name" ON table_name;
   CREATE POLICY "policy_name" ON table_name ...;
   
   -- Bad: Will fail if run twice
   CREATE POLICY "policy_name" ON table_name ...;
   ```

4. **Backup production before major changes:**
   - Use Supabase dashboard backup feature
   - Or export data manually

---

## Troubleshooting

### Issue: "Cannot connect to Docker daemon"

**Symptoms:**
```
Error: Cannot connect to Docker daemon
```

**Solutions:**
1. **Check Docker Desktop is running:**
   - Look for Docker icon in system tray
   - If not running, start Docker Desktop

2. **Restart Docker Desktop:**
   - Right-click Docker icon → Restart
   - Wait for Docker to fully start

3. **Check Docker service:**
   ```bash
   docker ps
   ```
   Should return empty list (no error)

### Issue: Port Already in Use

**Symptoms:**
```
Error: Port 54321 already in use
```

**Solutions:**

1. **Check what's using the port:**
   ```bash
   # In PowerShell (not Git Bash)
   netstat -ano | findstr :54321
   ```

2. **Stop existing Supabase:**
   ```bash
   npm run supabase:stop
   ```

3. **Or change ports in `supabase/config.toml`:**
   ```toml
   [api]
   port = 54321  # Change to another port like 54325
   ```

### Issue: Migration Errors

**Symptoms:**
```
ERROR: relation "table_name" does not exist
```

**Solutions:**

1. **Check migration order:**
   - Migrations run in timestamp order (filename-based)
   - Ensure dependencies are created first

2. **Reset database:**
   ```bash
   npm run supabase:reset
   ```

3. **Check migration file:**
   - Open the failing migration in `supabase/migrations/`
   - Verify table/column names are correct

### Issue: Slow First Start

**Expected Behavior:**
- First start: 5-10 minutes (downloads ~800MB)
- Subsequent starts: 10-30 seconds

**If subsequent starts are slow:**

1. **Check Docker resources:**
   - Docker Desktop → Settings → Resources
   - Ensure enough CPU/Memory allocated

2. **Check for running containers:**
   ```bash
   docker ps -a
   ```

### Issue: "Migration file not found"

**Symptoms:**
```
Error: migration file not found
```

**Solutions:**

1. **Verify migration files exist:**
   ```bash
   ls supabase/migrations/
   ```

2. **Check file naming:**
   - Must start with timestamp: `YYYYMMDDHHMMSS_name.sql`
   - Example: `20250113120000_add_feature.sql`

### Issue: Environment Variables Not Working

**Symptoms:**
- App still connects to remote Supabase
- Local Supabase not being used

**Solutions:**

1. **Verify `.env.local` exists:**
   ```bash
   ls -la .env.local
   ```

2. **Check environment variables:**
   ```bash
   # In Git Bash
   cat .env.local | grep SUPABASE
   ```

3. **Restart Next.js dev server:**
   - Stop: `Ctrl+C`
   - Start: `npm run dev`
   - Next.js only loads `.env.local` on startup

4. **Verify local Supabase is running:**
   ```bash
   npm run supabase:status
   ```

### Issue: Docker Desktop Won't Start

**Solutions:**

1. **Check Windows features:**
   - Enable WSL 2 (Windows Subsystem for Linux)
   - Enable Virtual Machine Platform
   - Enable Hyper-V (if not using WSL 2)

2. **Update Docker Desktop:**
   - Check for updates in Docker Desktop
   - Update to latest version

3. **Check system requirements:**
   - Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
   - Windows 11 64-bit
   - WSL 2 feature enabled

---

## Common Commands Reference

```bash
# Start Supabase
npm run supabase:start

# Stop Supabase
npm run supabase:stop

# Check status and get credentials
npm run supabase:status

# Reset database (reapply all migrations)
npm run supabase:reset

# Create new migration
npm run supabase -- migration new migration_name

# Link to remote project
npm run supabase -- link --project-ref <project-ref>

# Push migrations to remote
npm run supabase -- db push

# Pull remote schema
npm run supabase -- db pull

# Access database via psql
npm run supabase -- db psql

# View logs
npm run supabase -- logs
```

---

## Summary

**Quick Start:**
1. Install Docker Desktop
2. `npm install`
3. `npm run supabase:start`
4. Copy credentials to `.env.local`
5. `npm run dev`

**Daily Workflow:**
1. `npm run supabase:start` (if not running)
2. `npm run dev`
3. Make changes
4. Test locally
5. Push to remote when ready

**Pushing to Remote:**
1. Test locally: `npm run supabase:reset`
2. Link: `npm run supabase -- link --project-ref xdvemkyvgnfnibntfbwq`
3. Push: `npm run supabase -- db push`

---

## Additional Resources

- [Supabase Local Development Docs](https://supabase.com/docs/guides/local-development)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- [WSL 2 Installation Guide](https://docs.microsoft.com/en-us/windows/wsl/install)

---

**End of Documentation**

