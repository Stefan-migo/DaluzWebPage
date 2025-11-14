# How Local Supabase Works - Step by Step Explanation

## Overview: The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR DEVELOPMENT WORKFLOW                 │
└─────────────────────────────────────────────────────────────┘

1. LOCAL DEVELOPMENT (Docker)
   ├── Make changes to database schema
   ├── Test migrations locally
   ├── Verify everything works
   └── ✅ Ready to deploy

2. PUSH TO REMOTE
   ├── Link local to remote Supabase
   ├── Push migrations
   └── ✅ Production updated
```

---

## Step-by-Step: How Everything Works

### Phase 1: Initial Setup (One-Time)

#### Step 1: Docker Desktop Installation
**What it does:**
- Docker Desktop creates a virtual environment on your Windows machine
- It runs Linux containers (Supabase services) on Windows
- Think of it as a "virtual computer" inside your computer

**Why you need it:**
- Supabase CLI uses Docker to run all Supabase services locally
- Without Docker, you can't run a local database

**How to verify:**
```bash
docker ps
# Should return empty list (no error) = Docker is working ✅
```

#### Step 2: Supabase CLI Installation
**What it does:**
- The `supabase` package in `package.json` provides the CLI
- When you run `npm install`, it installs the Supabase CLI
- The CLI commands (`npm run supabase:start`) manage Docker containers

**What gets installed:**
- Supabase CLI tool
- All npm dependencies for your Next.js app

#### Step 3: First Start - Download Images
**What happens:**
```bash
npm run supabase:start
```

**Behind the scenes:**
1. Supabase CLI checks if Docker images exist
2. If not, downloads ~800MB of images:
   - PostgreSQL database image
   - PostgREST API server image
   - GoTrue auth service image
   - Storage service image
   - Realtime server image
   - Supabase Studio image
   - Mailpit email testing image
3. Creates Docker containers from these images
4. Starts all containers
5. Applies all migrations from `supabase/migrations/`
6. Seeds database (if configured)

**Time:** 5-10 minutes (one-time only)

**Result:**
- All Supabase services running locally
- Database with your schema applied
- Ready to use!

---

### Phase 2: Daily Development Workflow

#### Step 1: Start Local Supabase
```bash
npm run supabase:start
```

**What happens:**
- Checks if containers are already running
- If not, starts them (10-30 seconds)
- If yes, tells you they're already running

**Your data is preserved:**
- Docker stores data in "volumes"
- Even if you stop Supabase, data remains
- Next start = same data

#### Step 2: Configure Environment Variables
**File:** `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local_key>
SUPABASE_SERVICE_ROLE_KEY=<local_key>
```

**What this does:**
- Tells your Next.js app to connect to LOCAL Supabase
- Instead of connecting to remote (production)
- Your app now uses local database

**How it works:**
- Next.js reads `.env.local` on startup
- `NEXT_PUBLIC_*` variables are available in browser
- Other variables are server-only

#### Step 3: Start Next.js App
```bash
npm run dev
```

**What happens:**
- Next.js starts on `http://localhost:3000`
- App connects to local Supabase (from `.env.local`)
- You can now test your app with local database

**The connection:**
```
Your Browser → Next.js App → Local Supabase (Docker) → PostgreSQL
```

---

### Phase 3: Making Database Changes

#### Scenario: You Want to Add a New Table

#### Step 1: Create Migration File
```bash
npm run supabase -- migration new add_user_settings
```

**What happens:**
- Creates file: `supabase/migrations/20250113_add_user_settings.sql`
- File is empty, ready for your SQL

**Why timestamp in filename?**
- Migrations run in order (by filename)
- Timestamp ensures correct order
- Example: `20250113_120000` = January 13, 2025, 12:00:00

#### Step 2: Write SQL in Migration File
```sql
-- supabase/migrations/20250113_add_user_settings.sql
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  theme VARCHAR(50) DEFAULT 'light',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Best practices:**
- Use `IF NOT EXISTS` to make idempotent
- Can run multiple times without error

#### Step 3: Apply Migration Locally
```bash
npm run supabase:reset
```

**What happens:**
1. Stops Supabase
2. Deletes all data (fresh start)
3. Reapplies ALL migrations in order
4. Seeds database (if configured)
5. Starts Supabase again

**Result:**
- New table exists in local database
- You can test it immediately

**Alternative (faster):**
```bash
npm run supabase -- db reset
# Same as above, but shorter
```

#### Step 4: Test Locally
- Open Supabase Studio: http://127.0.0.1:54323
- Check Table Editor → see your new table
- Test in your app: `npm run dev`
- Verify everything works ✅

---

### Phase 4: Pushing to Remote (Production)

#### Step 1: Link Local to Remote (One-Time)
```bash
npm run supabase -- link --project-ref xdvemkyvgnfnibntfbwq
```

**What happens:**
- Connects your local Supabase CLI to remote project
- Stores link in `.supabase/config.toml`
- Now CLI knows which remote project to push to

**Authentication:**
- You'll be prompted to login to Supabase
- Use your Supabase account credentials

#### Step 2: Push Migrations
```bash
npm run supabase -- db push
```

**What happens:**
1. CLI compares local migrations with remote
2. Finds new migrations (not yet in remote)
3. Applies only new migrations to remote
4. **Does NOT delete data** (only adds schema)

**Safety:**
- Only adds new changes
- Doesn't modify existing data
- If migration fails, remote is unchanged

**Result:**
- Remote database now has your new table
- Production app can use it

#### Step 3: Verify in Production
- Go to Supabase Dashboard
- Check SQL Editor → run: `SELECT * FROM user_settings;`
- Verify table exists ✅

---

## Understanding the Architecture

### Local Development Stack

```
┌─────────────────────────────────────────┐
│         Your Windows Machine            │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │      Docker Desktop               │  │
│  │                                    │  │
│  │  ┌────────────────────────────┐  │  │
│  │  │   Supabase Containers      │  │  │
│  │  │                            │  │  │
│  │  │  ┌──────────────────────┐  │  │  │
│  │  │  │  PostgreSQL (54322) │  │  │  │
│  │  │  └──────────────────────┘  │  │  │
│  │  │  ┌──────────────────────┐  │  │  │
│  │  │  │  PostgREST (54321)  │  │  │  │
│  │  │  └──────────────────────┘  │  │  │
│  │  │  ┌──────────────────────┐  │  │  │
│  │  │  │  Studio UI (54323)   │  │  │  │
│  │  │  └──────────────────────┘  │  │  │
│  │  └────────────────────────────┘  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Next.js App (localhost:3000)   │  │
│  │   Reads .env.local              │  │
│  │   Connects to local Supabase    │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Remote Production Stack

```
┌─────────────────────────────────────────┐
│      Supabase Cloud (Remote)            │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   PostgreSQL Database            │  │
│  │   (Managed by Supabase)         │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   PostgREST API             │  │  │
│  │   https://...supabase.co    │  │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
         ↑
         │
    Your migrations
    (via db push)
```

---

## Key Concepts Explained

### 1. Docker Containers vs Images

**Image:**
- Like a "template" or "blueprint"
- Contains the software (PostgreSQL, etc.)
- Downloaded once, stored on your computer

**Container:**
- Like a "running instance" of an image
- When you start Supabase, containers are created from images
- Containers are where your data lives

**Analogy:**
- Image = Cookie cutter
- Container = Actual cookie (running instance)

### 2. Migrations

**What are migrations?**
- SQL files that describe database changes
- Each file = one change (add table, modify column, etc.)
- Run in order (by filename timestamp)

**Why use migrations?**
- Version control for database
- Can apply same changes to multiple environments
- Track history of database changes

**Example:**
```
supabase/migrations/
├── 20241220000000_create_user_profiles.sql    (oldest)
├── 20241220000001_create_ecommerce_system.sql
└── 20250113000000_add_user_settings.sql        (newest)
```

### 3. Environment Variables

**Local (.env.local):**
```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321  # Local
```

**Production (Vercel/Dashboard):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co  # Remote
```

**How Next.js chooses:**
- Development: Uses `.env.local`
- Production: Uses environment variables from hosting platform
- `NEXT_PUBLIC_*` = available in browser
- Others = server-only

### 4. Database Reset vs Stop

**Stop (`supabase:stop`):**
- Stops containers
- **Preserves data** in Docker volumes
- Next start = same data

**Reset (`supabase:reset`):**
- Stops containers
- **Deletes all data**
- Reapplies all migrations
- Fresh start

**When to use:**
- Stop: End of day, want to save data
- Reset: Testing migrations, want clean slate

---

## Common Workflows

### Workflow 1: Daily Development

```bash
# Morning
npm run supabase:start    # Start local database
npm run dev               # Start Next.js app
# ... code, test, debug ...

# Evening
# Ctrl+C to stop Next.js
npm run supabase:stop     # Optional: stop Supabase
```

### Workflow 2: Adding New Feature

```bash
# 1. Create migration
npm run supabase -- migration new add_feature

# 2. Edit migration file
# ... write SQL ...

# 3. Test locally
npm run supabase:reset

# 4. Verify in Studio
# Browser: http://127.0.0.1:54323

# 5. Test in app
npm run dev

# 6. When ready, push to remote
npm run supabase -- db push
```

### Workflow 3: Syncing Remote to Local

```bash
# Pull remote schema to local
npm run supabase -- db pull

# This creates new migration files
# Based on remote database structure
```

---

## Troubleshooting: Understanding Errors

### "Cannot connect to Docker daemon"
**Meaning:** Docker Desktop is not running
**Fix:** Start Docker Desktop

### "Port already in use"
**Meaning:** Another process using port 54321
**Fix:** Stop existing Supabase or change port

### "Migration failed: relation does not exist"
**Meaning:** Migration tries to use table that doesn't exist yet
**Fix:** Check migration order, ensure dependencies are created first

### "Environment variable not found"
**Meaning:** `.env.local` missing or wrong variable name
**Fix:** Create `.env.local` and add correct variables

---

## Summary: The Complete Flow

```
1. SETUP (One-time)
   Install Docker → npm install → supabase:start
   
2. DEVELOPMENT (Daily)
   supabase:start → Configure .env.local → npm run dev
   
3. MAKING CHANGES
   Create migration → Write SQL → supabase:reset → Test
   
4. DEPLOYING
   Test locally → Link remote → db push → Verify
```

**Remember:**
- Local = Your testing playground
- Remote = Production (be careful!)
- Always test locally first
- Migrations are your version control for database

---

**End of Explanation**

