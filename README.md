# FlowNote

FlowNote sekarang sudah disiapkan dengan:
- PostgreSQL
- Prisma ORM
- Auth (NextAuth Credentials: email + password)

## 1) Install dependency

```bash
npm install
```

## 2) Siapkan environment

Copy file env template:

```bash
cp .env.example .env
```

Di Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Lalu isi `NEXTAUTH_SECRET` dengan random string yang panjang.

Untuk fitur AI di dashboard, isi juga:

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` (recommended: `openrouter/free`)
- `OPENROUTER_FALLBACK_MODEL` (optional, contoh: `meta-llama/llama-3.1-8b-instruct:free`)

## 3) Jalankan PostgreSQL

Project ini sudah punya `docker-compose.yml` untuk PostgreSQL lokal.

```bash
npm run db:up
```

## 4) Generate Prisma client + migrate DB

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init-auth
```

## 5) Jalankan aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Alur Auth yang tersedia

- Register: `POST /api/auth/register`
- Login: NextAuth Credentials via `/signin`
- Refresh session token: `POST /api/auth/refresh`
- Logout: tersedia di menu profile dashboard
- Protected route: semua `/dashboard/*` wajib login

## AI Workspace

- Halaman: `/dashboard/ai`
- Endpoint: `POST /api/ai` (protected)
- Mode: `summary`, `action-items`, `rewrite`, `smart-tags`, `ask-notes`
- Provider: OpenRouter (`https://openrouter.ai/api/v1/chat/completions`)

## Scripts tambahan

- `npm run db:up` -> start PostgreSQL
- `npm run db:down` -> stop PostgreSQL
- `npm run prisma:generate`
- `npm run prisma:migrate`
