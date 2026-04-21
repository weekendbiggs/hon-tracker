# The Heavenly HON

A mobile-first web app for tracking a personal collection of Indiana Glass Hen-on-Nest (HON) covered dishes. Public gallery for visitors; a private admin area for the owner to log pieces and prices.

**$0 recurring cost.** GitHub Pages hosts the site, the same GitHub repo stores the data (JSON files + photos), and a Cloudflare Worker handles secure GitHub OAuth sign-in.

## Quick start

### 1. Clone & install

```sh
npm install
```

### 2. Set up GitHub OAuth

1. Go to https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**.
2. Set the homepage and callback URLs to your GitHub Pages URL (e.g. `https://<you>.github.io/hon-tracker/`).
3. Note the **Client ID** and generate a **Client Secret**.

### 3. Deploy the Cloudflare Worker

The `worker/` directory contains a tiny OAuth token-exchange proxy (~50 lines). Deploy it to Cloudflare's free tier:

```sh
cd worker
npm install
npx wrangler login
npx wrangler secret put GITHUB_CLIENT_ID      # paste your Client ID
npx wrangler secret put GITHUB_CLIENT_SECRET   # paste your Client Secret
npx wrangler deploy
```

Update `ALLOWED_ORIGIN` in `worker/wrangler.toml` to match your GitHub Pages origin before deploying.

### 4. Configure GitHub Pages

1. Repo Settings → Pages → Source: **GitHub Actions**.
2. Repo Settings → Secrets and variables → Actions → **Variables** → add:
   - `VITE_GITHUB_CLIENT_ID` — your OAuth App Client ID
   - `VITE_OAUTH_WORKER_URL` — your deployed worker URL (e.g. `https://hon-oauth-worker.your-account.workers.dev`)
3. Push to `main` — the site deploys automatically.

### 5. Add collaborators

Anyone who needs admin access should be added as a **collaborator** on the repo (Settings → Collaborators). They sign in with their own GitHub account — no tokens to share.

## Architecture

- **Frontend** — Vite + React 18 + Tailwind + TypeScript + HashRouter. Deployed to GitHub Pages.
- **Data** — `public/data/collection.json` and `public/data/prices.json` are the database. They're served as static assets on reads, written via the GitHub Contents API on admin edits.
- **Photos** — drag-dropped images are committed to `public/photos/` via the Contents API. The raw file URL is stored on the collection item.
- **Auth** — GitHub OAuth. A Cloudflare Worker exchanges the OAuth code for an access token (keeping the client secret server-side). The token is stored in the user's `localStorage`.
- **Reference data** — all 22 HON colors are bundled in [src/data/colors.ts](src/data/colors.ts) so the UI renders instantly before any network fetch.

```
Visitor opens /         →   Pages CDN serves index.html + bundle + data/*.json   →   instant gallery
Owner opens /admin      →   clicks "Sign in with GitHub"                         →   OAuth token in localStorage
Owner adds a HON        →   PUT Contents API on collection.json                  →   commit on main
Pages auto-rebuilds     →   new data live in ~30-60s (UI already optimistic)
```

## Layout

```
.github/workflows/pages.yml   Deploy workflow (build + publish on push to main)
public/
  data/collection.json        Owned HONs
  data/prices.json            Price observations
  photos/                     Uploaded photos
  favicon.svg, hen-silhouette.svg
src/
  data/colors.ts              22 HON colors (bundled, authoritative)
  api/reads.ts                Static fetch of data files
  api/github.ts               Contents API wrapper (GET sha, PUT base64)
  auth/oauth.ts               GitHub OAuth flow + token storage
  hooks/                      useCollection, usePrices, useAdmin (single-source cache + emit)
  components/                 HonCard, HonGrid, CompletenessRing, NestEggDashboard,
                              PriceChart, ProductionTimeline, PhotoDrop, Nav, Guard, ui/
  pages/                      Gallery, HenDetail, Wishlist, Market, Timeline, Admin*
  styles/                     index.css (tokens + Tailwind), glass.css (skeuomorphism)
worker/                       Cloudflare Worker for OAuth token exchange
scripts/bootstrap.sh          One-command deploy
```

## Development

```sh
npm install
npm run dev           # local dev server on :5173
npm run build         # typecheck + production build
npm run preview       # serve dist/
npm run typecheck     # TypeScript only
```

Local dev reads `public/data/*.json` directly (no network round-trip). To test writes locally, sign in via GitHub OAuth; writes will still hit GitHub — be careful, they really do commit.

## Deferred features

- eBay Browse API integration (manual price logging works today; add later via a simple GitHub Action that fetches and commits to a new `ebay-cache.json`).
- Dark mode.
- Export/share.
