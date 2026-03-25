# SaaS Business Dashboard - Setup Guide & Best Practices

## Tech Stack Overview
- **Framework**: Next.js 14+ (App Router)
- **UI/Styling**: Tailwind CSS v4, ShadCN UI, Framer Motion
- **Database**: Prisma ORM with SQLite (Swap with PostgreSQL via `DATABASE_URL`)
- **Authentication**: NextAuth.js (JWT Strategy) + bcrypt
- **Caching**: Redis (via ioredis)
- **Charts**: Recharts

## Complete Folder Structure
```text
/app
  /(auth) - Login and Registration Forms
  /(dashboard) - Protected SaaS Routes (Layout, Sidebar, Metrics)
  /api - REST API Routes (Auth, Analytics, etc.)
/components
  /ui - Reusable ShadCN components
  /dashboard - Specific dashboard layout components
/lib - Utility functions, DB Client, Redis Client, Auth Options
/prisma - Database schema and migrations
```

## Step-by-Step Setup Guide

**1. Clone or Open the Project**
Navigate to the project root directory.

**2. Configure Environment Variables**
Ensure `.env` exists with the following values:
```env
DATABASE_URL="file:./dev.db" # Or use Postgres connection string
NEXTAUTH_SECRET="your-super-secret-key-that-should-be-at-least-32-chars-long"
NEXTAUTH_URL="http://localhost:3000"
REDIS_URL="redis://localhost:6379"
```

**3. Set up the Database**
Run Prisma migrations to create the database schema:
```bash
npx prisma db push
npx prisma generate
```

**4. Run the Development Server**
Start the application locally:
```bash
npm run dev
```
Visit `http://localhost:3000/register` to create your first Admin account, and then log in to view the Dashboard.

## Architecture & Best Practices Implemented

**1. Multi-Tenant Organization Structure**
The Prisma schema introduces full data-isolation. Users belong to `Organization` entities via `Membership` (linking RBAC Roles like Admin/Manager/User). Every entity like `Product` or `Order` links back to `organizationId`. 

**2. Modern App Router + API Handlers**
The project exclusively uses the Next.js `app/` directory. Backend API logic uses Zod validation to sanitize inputs before DB execution in `app/api/.../route.ts`. 

**3. Database Connection Pooling in Dev**
Both `PrismaClient` and `Redis` are instantiated as Singletons bound to `globalThis` within `lib/db.ts` and `lib/redis.ts`. This prevents Next.js Hot-Module-Replacement (HMR) from exhausting connection pools.

**4. UI Component Library (ShadCN UI)**
The dashboard avoids inline magic styles. Instead, it relies on accessible, tested, Radix primitives installed via ShadCN into `components/ui`. Dark mode dynamically functions with `next-themes`.

---

> NOTE: To use Postgres instead of SQLite, update `.env` `DATABASE_URL` AND update `prisma/schema.prisma` datasource provider to `postgresql`.
