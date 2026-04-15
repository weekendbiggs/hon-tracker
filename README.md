# The Heavenly HON

A mobile-first web app for tracking a personal collection of Indiana Glass Hen-on-Nest (HON) covered dishes. Public gallery for visitors; a private admin area for the owner to log pieces and prices.

**$0 recurring cost.** GitHub Pages hosts the site, the same GitHub repo stores the data (JSON files + photos), and a single fine-grained Personal Access Token is the only secret you need.

## Quick start (≈3 minutes)

```sh
npm install
./scripts/bootstrap.sh           # creates the repo, pushes, enables Pages
```

Then:

1. Open the PAT creation link the script prints (pre-filled with the right scopes).
2. Visit your site (`https://<you>.github.io/hon-tracker/`).
3. Tap **Admin**, paste the PAT once, and start adding HONs.

That's it. Writes commit directly to `main`, GitHub Pages redeploys on every push, and the admin UI updates optimistically so the ~30-second rebuild delay is invisible.

## No `gh` CLI?

Do it manually:

1. Create a new GitHub repo (public) called `hon-tracker`.
2. `git init -b main && git add . && git commit -m "init" && git remote add origin <url> && git push -u origin main`
3. Repo Settings → Pages → Source: **GitHub Actions**.
4. Create a fine-grained PAT: repo = `hon-tracker`, permissions = **Contents: Read & write**, **Metadata: Read-only**.
5. Visit the site, open Admin, paste the PAT.

## Architecture

- **Frontend** — Vite + React 18 + Tailwind + TypeScript + HashRouter. Deployed to GitHub Pages.
- **Data** — `public/data/collection.json` and `public/data/prices.json` are the database. They're served as static assets on reads, written via the GitHub Contents API on admin edits.
- **Photos** — drag-dropped images are committed to `public/photos/` via the Contents API. The raw file URL is stored on the collection item.
- **Auth** — a fine-grained GitHub PAT scoped to this one repo, stored in the admin user's `localStorage`.
- **Reference data** — all 22 HON colors are bundled in [src/data/colors.ts](src/data/colors.ts) so the UI renders instantly before any network fetch.

```
User opens /            →   Pages CDN serves index.html + bundle + data/*.json   →   instant gallery
Owner opens /admin      →   enters PAT once                                      →   localStorage
Owner adds a HON        →   PATCH/PUT Contents API on collection.json            →   commit on main
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
  auth/pat.ts                 PAT in localStorage
  hooks/                      useCollection, usePrices, useAdmin (single-source cache + emit)
  components/                 HonCard, HonGrid, CompletenessRing, NestEggDashboard,
                              PriceChart, ProductionTimeline, PhotoDrop, Nav, Guard, ui/
  pages/                      Gallery, HenDetail, Wishlist, Market, Timeline, Admin*
  styles/                     index.css (tokens + Tailwind), glass.css (skeuomorphism)
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

Local dev reads `public/data/*.json` directly (no network round-trip). To test writes locally, paste a PAT into Admin; writes will still hit GitHub — be careful, they really do commit.

## Deferred features

- eBay Browse API integration (manual price logging works today; add later via a simple GitHub Action that fetches and commits to a new `ebay-cache.json`).
- Dark mode.
- Export/share.
