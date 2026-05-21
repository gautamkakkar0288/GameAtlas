# GameAtlas

A cinematic full-stack gaming platform — track your library, discover new games, review titles, compete on leaderboards, connect with the community, and play browser games in the Arcade.

## Run & Operate

- `pnpm --filter @workspace/game-atlas run dev` — run the frontend (port 5000)
- `PORT=8080 pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/db run seed` — seed DB with 10 games, achievements, demo user
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + TanStack Query + Wouter + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Styling: Tailwind CSS + glassmorphism design system
- Fonts: Orbitron (titles), Rajdhani (labels), Inter (body)
- Auth: Custom JWT (`gameatlas_token` in localStorage), bcryptjs passwords

## Where things live

- `artifacts/game-atlas/` — React/Vite frontend
  - `src/pages/` — All page components (Dashboard, Library, GameDetail, Profile, Achievements, Community, Leaderboards, Reviews, Discover, Search, Arcade)
  - `src/lib/api.ts` — All API client functions + TypeScript interfaces
  - `src/lib/auth.ts` — Auth helpers (getUser, getToken, logout)
  - `src/lib/communityData.ts` — rankTierConfig + ActivityEvent types
  - `src/components/layout/` — AppLayout, Sidebar, TopBar
  - `src/components/shared/` — PageTransition, SectionRow, GlobalSearch
- `artifacts/api-server/` — Express 5 API server (port 8080)
  - `src/routes/index.ts` — Route registration (all routers)
  - `src/controllers/` — auth, games, library, users, reviews, notifications, community, leaderboard
- `lib/db/` — Drizzle schema, migrations, seed
  - `src/schema/index.ts` — DB schema source of truth

## Architecture decisions

- Vite frontend proxies `/api/*` → `http://localhost:8080/api/*` (configured in vite.config.ts)
- All pages use TanStack Query for data fetching — no mock data in production
- JWT stored in localStorage under key `gameatlas_token`; sent as `Authorization: Bearer <token>`
- LibraryEntry links via `game.slug` (not game.id) — URL pattern: `/library/:slug`
- Leaderboard score formula: `achievements*100 + playtime*1 + reviews*50 + level*200`
- Arcade page uses external redirects only (Poki/CrazyGames) with localStorage for recently-played tracking

## Product

- **Dashboard** — welcome panel, live clock, currently playing games, playtime chart, trending games
- **Library** — full game library with status filters (playing/completed/wishlist/etc.), grid + list views, favorite/unfavorite
- **Game Detail** — cinematic hero with banner image, achievements panel, community reviews, similar games, library management
- **Discover** — featured hero carousel, genre/platform filters, trending/top-rated/new release rows
- **Search** — real-time search with genre/platform/rating filters
- **Achievements** — progress rings by rarity, unlock status, XP totals
- **Profile** — animated XP bar, favorite games, rare achievements, library breakdown, edit bio/display name
- **Community** — Nexus Feed with post creation (text/screenshot/clip/achievement/recommendation), likes, trending games sidebar
- **Leaderboards** — Hall of Champions podium (top 3), ranked table with scores, achievements, playtime
- **Reviews** — community reviews with star ratings, pros/cons, write review modal, rating distribution chart
- **Arcade** — browser game catalog (Poki + CrazyGames), genre filters, recently-played tracking via localStorage

## User preferences

- Preserve all cinematic animations and glassmorphism styling across all pages
- Real API data only — no mock data fallbacks in production pages
- Demo account: `demo@gameatlas.gg` / `demo1234`

## Gotchas

- Always restart the API Server workflow after adding new controllers/routes
- `gamesApi.search()` wraps `gamesApi.list({ search: query })` — same `/games` endpoint with search param
- `usersApi.getProfile()` merges `AuthUser + ProfileStats` into `UserProfile` client-side
- Library links use `game.slug` not `game.id` — the route param is named `:id` but treated as slug
- `unlockedAt` on Achievement is `string | null` (null = locked)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
