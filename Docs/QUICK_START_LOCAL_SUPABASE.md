# Quick Start: Local Supabase Setup

## Prerequisites Checklist

- [ ] Docker Desktop installed and running
- [ ] Node.js >= 18.0.0 installed
- [ ] Git Bash installed

## 5-Minute Setup

### 1. Install Docker Desktop
Download from: https://www.docker.com/products/docker-desktop/
- Install and start Docker Desktop
- Verify: `docker ps` (should not error)

### 2. Install Dependencies
```bash
cd /e/Proyectos/DaLuz/DaluzWebPage
npm install
```

### 3. Start Local Supabase
```bash
npm run supabase:start
```
⏱️ **First time:** 5-10 minutes (downloads images)  
⚡ **Next times:** 10-30 seconds

### 4. Get Credentials
```bash
npm run supabase:status
```
Copy the `anon key` and `service_role key`

### 5. Configure Environment
```bash
# Create .env.local
cp env.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste_anon_key_here>
SUPABASE_SERVICE_ROLE_KEY=<paste_service_role_key_here>
```

### 6. Start Development
```bash
npm run dev
```

## Access Points

- **App:** http://localhost:3000
- **Supabase Studio:** http://127.0.0.1:54323
- **Email Testing:** http://127.0.0.1:54324

## Daily Commands

```bash
# Start Supabase
npm run supabase:start

# Check status
npm run supabase:status

# Stop Supabase
npm run supabase:stop

# Reset database (apply all migrations)
npm run supabase:reset
```

## Pushing to Remote

```bash
# 1. Test locally first
npm run supabase:reset

# 2. Link to remote (one-time)
npm run supabase -- link --project-ref xdvemkyvgnfnibntfbwq

# 3. Push migrations
npm run supabase -- db push
```

## Troubleshooting

**Docker not running?**
- Start Docker Desktop
- Check system tray icon

**Port in use?**
```bash
npm run supabase:stop
npm run supabase:start
```

**Environment variables not working?**
- Restart Next.js: `Ctrl+C` then `npm run dev`
- Check `.env.local` exists and has correct values

## Full Documentation

See: `Docs/LOCAL_SUPABASE_DOCKER_SETUP_WINDOWS.md` for detailed guide.

