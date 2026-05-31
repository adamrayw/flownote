# FlowNote

FlowNote sekarang sudah disiapkan dengan:
- PostgreSQL
- Prisma ORM
- RayTech Account SSO (auth terpusat)

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

Pastikan environment SSO terisi:
- `NEXT_PUBLIC_AUTH_URL`
- `RAYTECH_AUTH_URL`
- `RAYTECH_SESSION_COOKIE_NAME`

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

## Alur Auth

- Login/register diarahkan ke RayTech Account (`auth.raytech.cloud` atau URL auth lokal)
- Produk ini tidak lagi menyimpan credential login sendiri
- Protected route: semua `/dashboard/*` wajib login
- Endpoint session produk: `GET /api/auth/me`

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
