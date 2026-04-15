# The Heavenly HON — Collection Tracker & Price Watch

## Project Overview

A mobile-first web app for tracking a personal collection of Indiana Glass Hen-on-Nest (HON) covered dishes. The app serves two audiences: the **collector** (the owner) who manages her inventory, logs prices, and tracks her progress toward a complete set, and **visitors** who can browse a beautiful public gallery of her collection.

Indiana Glass produced HONs from the 1930s through 2002 in 22 verified colors. Each color has unique characteristics: production dates, item numbers, nest styles (stippled vs. striated), bead types (slotted vs. closed), rarity levels, and distinct glass colors. This app should celebrate the beauty and history of these pieces.

---

## Architecture — Keep It Dead Simple

**Principle:** No servers. No databases. No monthly bills. Everything is free-tier and maintenance-free.

```
┌─────────────────────┐       ┌──────────────────────────┐
│   GitHub Pages       │       │   Google Sheets           │
│   (Static React App) │──────▶│   (The "Database")        │
│   Vite + React       │       │                          │
│   Free hosting       │       │   Tab: Reference (22 HONs)│
└─────────────────────┘       │   Tab: Collection         │
         │                     │   Tab: Prices             │
         │                     │   Tab: EbayCache          │
         ▼                     └──────────┬───────────────┘
┌─────────────────────┐                   │
│   Google Apps Script │◀──────────────────┘
│   (Tiny API Layer)   │
│   Deployed as web app│
│   Reads/writes sheet │
│   Auth via Google    │
│   Free               │
└─────────────────────┘
```

### Tech Stack

| Layer | Choice | Cost |
|-------|--------|------|
| **Hosting** | GitHub Pages | Free |
| **Frontend** | Vite + React + Tailwind CSS | Free |
| **"Database"** | Google Sheets (one spreadsheet, multiple tabs) | Free |
| **API** | Google Apps Script (deployed as web app) | Free |
| **Auth** | Google Sign-In (checks owner's email) | Free |
| **Photos** | Paste URLs from Google Photos / Drive / anywhere | Free |
| **Charts** | Recharts | Free |
| **Price Data** | Manual entry + optional eBay via Apps Script | Free |
| **Domain** | `username.github.io/hon-tracker` (or custom domain) | Free |

**Total recurring cost: $0**

---

## Google Sheets Structure

One Google Spreadsheet with 4 tabs. The owner can also view/edit raw data directly in the sheet if she ever needs to — it's just a spreadsheet.

### Tab 1: `Reference`

Pre-populated with all 22 verified HON colors. The owner never needs to edit this unless new research emerges.

| Column | Example | Notes |
|--------|---------|-------|
| `id` | 1 | Row number |
| `name` | Iridescent Blue | Display name |
| `slug` | iridescent-blue | URL-friendly ID |
| `itemNumbers` | #2891 | Indiana Glass catalog numbers |
| `productionStart` | 1971 | Approximate year |
| `productionEnd` | 1980 | Approximate year |
| `nestTypes` | both | "stippled", "striated", or "both" |
| `hasSlottedBeads` | FALSE | Whether variant exists |
| `rarity` | common | "common", "uncommon", "scarce" |
| `ssinReferences` | SSIN16 | Shirley Smith book reference |
| `hexColor` | #1E3A5F | Primary glass color for UI |
| `hexColorSecondary` | #3A1E5F | Optional gradient end color |
| `isIridescent` | TRUE | Whether to show shimmer effect |
| `description` | Fifth longest production... | From the article |
| `ebaySearchQuery` | Indiana Glass hen on nest iridescent blue | Pre-built search string |
| `displayOrder` | 7 | Chronological sort position |

### Tab 2: `Collection`

One row per owned HON. She can own multiples of the same color.

| Column | Example | Notes |
|--------|---------|-------|
| `id` | 1 | Unique ID (timestamp-based) |
| `honColorId` | 7 | References row in Reference tab |
| `dateAcquired` | 2024-03-15 | When she got it |
| `purchasePrice` | 85.00 | What she paid |
| `purchaseSource` | eBay | Where acquired |
| `condition` | excellent | mint/excellent/good/fair/poor |
| `nestType` | striated | stippled or striated |
| `hasSlottedBeads` | FALSE | |
| `hasDecoration` | FALSE | Red-painted comb/wattle |
| `decorationCondition` | | intact/partial/missing |
| `photoUrl` | https://photos.google.com/... | Paste any image URL |
| `notes` | Beautiful shimmer, slight... | Free-form |
| `isFavorite` | TRUE | Pin to top |
| `createdAt` | 2024-03-15T10:30:00Z | Auto-set |

### Tab 3: `Prices`

Price observations from any source.

| Column | Example | Notes |
|--------|---------|-------|
| `id` | 1 | Unique ID |
| `honColorId` | 7 | References Reference tab |
| `price` | 145.00 | USD |
| `source` | ebay_sold | ebay_active/ebay_sold/etsy/antique_shop/auction/other |
| `condition` | good | Condition of observed item |
| `listingUrl` | https://ebay.com/itm/... | Optional link |
| `dateObserved` | 2024-06-01 | When observed |
| `notes` | | Optional |
| `isAutomated` | FALSE | Was this from eBay fetch |
| `createdAt` | 2024-06-01T14:00:00Z | Auto-set |

### Tab 4: `EbayCache`

Cached eBay active listing snapshots (one row per color per fetch date).

| Column | Example | Notes |
|--------|---------|-------|
| `honColorId` | 7 | |
| `snapshotDate` | 2024-06-01 | |
| `listingCount` | 12 | Number found |
| `minPrice` | 35.00 | |
| `maxPrice` | 185.00 | |
| `avgPrice` | 92.50 | |
| `medianPrice` | 85.00 | |
| `topListingsJson` | [{title, price, url}...] | JSON string of top 5 listings |

---

## Google Apps Script — The API Layer

A single Apps Script file deployed as a web app. It reads from and writes to the Google Sheet. This is the only "backend" — a few hundred lines of JavaScript running free on Google's servers.

### Endpoints

The Apps Script web app handles requests via `doGet(e)` and `doPost(e)`, routing based on an `action` parameter.

**Public endpoints (no auth needed):**

```
GET ?action=getReference          → Returns all 22 HON colors
GET ?action=getCollection         → Returns all collection items
GET ?action=getPrices             → Returns price observations
GET ?action=getPrices&colorId=7   → Returns prices for one color
GET ?action=getEbayCache          → Returns latest eBay snapshots
GET ?action=getStats              → Returns summary statistics
```

**Admin endpoints (require Google auth, email must match owner):**

```
POST action=addItem               → Add HON to collection
POST action=updateItem            → Update existing collection item
POST action=deleteItem            → Remove item from collection
POST action=addPrice              → Log a price observation
POST action=deletePrice           → Remove a price entry
POST action=fetchEbayPrices       → Trigger eBay active listing fetch
```

### Auth Model

- The React app uses **Google Identity Services** (Sign In With Google) for admin login
- On sign-in, the app gets the user's Google ID token
- Admin API calls send this token in the request body
- Apps Script verifies the token and checks if the email matches the `OWNER_EMAIL` constant
- If it matches → allow write. If not → reject with 403
- Public read endpoints require no auth at all

### Apps Script Implementation Notes

```javascript
const SPREADSHEET_ID = "your-sheet-id-here";
const OWNER_EMAIL = "her-email@gmail.com";

function doGet(e) {
  const action = e.parameter.action;
  let result;
  switch (action) {
    case "getReference":
      result = getSheetData("Reference");
      break;
    case "getCollection":
      result = getSheetData("Collection");
      break;
    case "getPrices":
      result = e.parameter.colorId
        ? getFilteredData("Prices", "honColorId", parseInt(e.parameter.colorId))
        : getSheetData("Prices");
      break;
    case "getEbayCache":
      result = getLatestEbayCache();
      break;
    case "getStats":
      result = computeStats();
      break;
    default:
      result = { error: "Unknown action" };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  // Verify admin: validate data.idToken, extract email, compare to OWNER_EMAIL
  // Route to handler based on data.action
  // Write to appropriate sheet tab
}

function getSheetData(tabName) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(tabName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return data.slice(1)
    .filter(row => row[0] !== "")  // skip empty rows
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
}
```

### eBay Integration (Optional — via Apps Script)

The Apps Script can fetch eBay Browse API active listings using `UrlFetchApp`. eBay credentials are stored as **Script Properties** (not in source code). Can be set up with a **daily time-driven trigger** for automatic price updates.

**If eBay feels like too much for v1**, skip it entirely. Manual price logging is valuable on its own, and the wishlist page can link directly to eBay search URLs (just `https://www.ebay.com/sch/i.html?_nkw={query}&LH_Sold=1`) — no API needed for that.

---

## Frontend — React App

### Project Structure

```
hon-tracker/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── public/
│   ├── favicon.svg
│   └── hen-silhouette.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx                  # HashRouter + layout
│   ├── config.ts                # Apps Script URL, Google Client ID
│   ├── api/
│   │   └── client.ts            # Fetch wrapper for Apps Script
│   ├── auth/
│   │   └── google.ts            # Google Sign-In setup + state
│   ├── data/
│   │   └── colors.ts            # Static HON color data (bundled for instant render)
│   ├── hooks/
│   │   ├── useCollection.ts
│   │   ├── usePrices.ts
│   │   └── useAdmin.ts
│   ├── pages/
│   │   ├── Gallery.tsx          # Landing — public collection grid
│   │   ├── HenDetail.tsx        # Individual HON detail
│   │   ├── Wishlist.tsx         # Missing pieces
│   │   ├── Market.tsx           # Price dashboard
│   │   ├── Timeline.tsx         # Production timeline
│   │   ├── Admin.tsx            # Admin dashboard
│   │   ├── AdminAdd.tsx         # Add/Edit collection item
│   │   └── AdminPrices.tsx      # Price management
│   ├── components/
│   │   ├── HonCard.tsx          # Glass-tinted card
│   │   ├── HonGrid.tsx          # Responsive card grid
│   │   ├── CompletenessRing.tsx # 22-segment SVG ring
│   │   ├── NestEggDashboard.tsx # Total value display
│   │   ├── PriceChart.tsx       # Line chart per color
│   │   ├── ProductionTimeline.tsx
│   │   ├── BeadedBorder.tsx     # Decorative element
│   │   ├── MobileNav.tsx        # Bottom tab bar
│   │   ├── AdminGuard.tsx       # Wraps admin routes
│   │   └── ui/                  # Button, Input, Modal, Badge, etc.
│   └── styles/
│       ├── index.css            # Globals + Tailwind + CSS vars
│       └── glass.css            # Glass/shimmer effects
```

### Routing (Hash-based for GitHub Pages)

```
#/                  → Gallery (public landing)
#/hen/:slug         → HON detail (public)
#/wishlist          → Missing pieces (public)
#/market            → Price dashboard (public)
#/timeline          → Production timeline (public)
#/admin             → Admin dashboard (requires sign-in)
#/admin/add         → Add new item (requires sign-in)
#/admin/edit/:id    → Edit item (requires sign-in)
#/admin/prices      → Price management (requires sign-in)
```

### Data Flow

- **Static color data is bundled in the app** (`src/data/colors.ts`). The UI renders instantly with all 22 color cards before any API call completes.
- API data (collection items, prices) loads async from Apps Script and overlays onto the static cards.
- If Apps Script is slow on cold start (2-3s), the user sees a beautiful skeleton UI with all 22 glass-tinted cards and subtle loading shimmers where dynamic data will appear.

---

## Design Direction

### Aesthetic: "Glass Cabinet Skeuomorphism"

The UI should feel like peering into a beautifully lit glass display cabinet. Luminous translucency, soft refractions, the way light passes through colored glass.

**Core visual principles:**
- **Translucent color cards** — each HON entry tinted with its actual glass color, with subtle transparency and light effects mimicking real glass
- **Warm, inviting lighting** — soft creams and warm whites, as if displayed in a curio cabinet with warm spotlights
- **Glass-inspired UI elements** — subtle bevels, soft inner shadows suggesting glass thickness, gentle top-edge highlights
- **Beaded border motif** — the iconic beaded rim of the HON nest as a decorative CSS border (row of small circles), used sparingly for section dividers
- **Clean readability** — text crisp and readable above all else

**Typography:**
- Display/headings: Warm serif with character — Playfair Display, Lora, or Crimson Text (Google Fonts)
- Body: Clean sans-serif — Source Sans 3 or DM Sans
- Do NOT use Inter, Roboto, Arial, or system fonts

**Color palette:**

```css
:root {
  /* App chrome */
  --bg-warm:          #FAF7F2;
  --bg-card:          #FFFFFF;
  --text-primary:     #2C2418;
  --text-secondary:   #7A6F60;
  --accent-gold:      #C8922A;
  --accent-success:   #2D8B46;
  --wood-dark:        #3D2B1F;

  /* Glass colors — one per HON */
  --glass-crystal:            #E8E8E8;
  --glass-milk:               #F5F0E8;
  --glass-riviera-blue:       #2B4C6F;
  --glass-olive:              #6B7D3A;
  --glass-amber:              #C8922A;
  --glass-carnival:           #D4A843;
  --glass-iridescent-blue:    #1E3A5F;
  --glass-iridescent-gold:    #8B6914;
  --glass-lime-satin-mist:    #8FBF47;
  --glass-iridescent-lime:    #4A7A2E;
  --glass-red-decorated:      #9B1B30;
  --glass-horizon-blue:       #3A8FBF;
  --glass-crystal-reissue:    #D4D4D4;
  --glass-yellow-mist:        #D4C36A;
  --glass-pink:               #D4A0A0;
  --glass-pastel-blue:        #7BA3C4;
  --glass-pastel-green:       #8FBF8F;
  --glass-emerald-green:      #2D8B46;
  --glass-peach:              #C4907A;
  --glass-evergreen:          #1A7A6D;
  --glass-evergreen-carnival: #1A6B60;
  --glass-cranberry:          #B03060;
}
```

**Glass card CSS effect:**
```css
.glass-card {
  background: linear-gradient(
    135deg,
    rgba(var(--card-rgb), 0.08),
    rgba(var(--card-rgb), 0.18)
  );
  border: 1px solid rgba(var(--card-rgb), 0.25);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
}
```

**Iridescent shimmer (for carnival glass cards):**
```css
.iridescent::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent 30%,
    rgba(255, 255, 255, 0.12) 45%,
    rgba(200, 180, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.12) 55%,
    transparent 70%
  );
  animation: shimmer 4s ease-in-out infinite;
  pointer-events: none;
}
@keyframes shimmer {
  0%, 100% { transform: translateX(-100%); }
  50%      { transform: translateX(100%); }
}
```

---

## Feature Specifications

### 1. Gallery (Landing Page) — `#/`

**Hero section:**
- Collection title (configurable in `config.ts`)
- **Completeness Ring** — circular SVG, 22 arc segments colored by glass color. Owned = filled + glow. Missing = dotted outline at 20% opacity. Center: "18/22"
- Stats row: items owned · estimated value · years collecting

**Collection grid:**
- All 22 colors in responsive grid (2 columns mobile, 3-4 desktop)
- Filter bar: All / Owned / Missing / by rarity
- Sort: Chronological (default), Rarity, Recently Added
- Owned cards: vivid glass-tinted backgrounds, photo if available
- Missing cards: faded/ghosted with "Not Yet Found" badge

### 2. HonCard Component

- Glass-tinted gradient background using HON's hex color
- Shimmer overlay for iridescent colors
- Photo (from URL) or hen silhouette SVG tinted with glass color
- Color name (serif), production years
- Rarity badge: ● Common, ◆ Uncommon, ★ Scarce
- If owned: condition badge, acquisition date
- If not owned: muted with "Missing" label
- Tap → detail page

### 3. HON Detail Page — `#/hen/:slug`

- Large photo or tinted silhouette placeholder
- Glass-tinted header
- Full info: name, item numbers, dates, nest types, beads, rarity
- Historical description
- **"In My Collection"** panel (if owned): date, price, source, condition, notes
- **Price History** chart (if price data exists)
- **Current Market** section (if eBay cache exists)
- ← Previous / Next → navigation

### 4. Completeness Ring

- SVG circle with 22 equal arc segments
- Filled with glass color if owned, dotted outline if missing
- Owned segments get subtle outer glow
- Center: large "18/22" with "colors collected" label
- Tap segment → navigate to that color
- Load animation: segments fill in sequentially

### 5. Wishlist — `#/wishlist`

- Only unowned HON colors
- Muted glass-colored cards with rarity badge
- Price range (from observations or eBay cache)
- "Search eBay" button → opens eBay search in new tab
- Empty state when complete: confetti + "You found them all!"

### 6. Production Timeline — `#/timeline`

- Horizontal scrollable view, 1930s–2000s
- Horizontal bar per color spanning production years
- Bars colored with glass hex
- Owned: solid fill. Missing: dashed outline
- Tap bar → detail page

### 7. Market Dashboard — `#/market`

**"Nest Egg" header:**
- Total estimated value
- Value trend chart (gold line on cream)
- Change indicator

**Per-color cards:**
- Price sparkline (last 6 data points)
- Current average price, range
- Tap → full price history

**Admin (when signed in):**
- "Log a Price" quick form
- "Refresh eBay Prices" button (if configured)
- Recent price entries

### 8. Admin — `#/admin`

**Before sign-in:** "Sign in with Google" button.

**After sign-in (email matches):**
- Quick stats, "Add a HON" button, recent additions

**Add/Edit form:**
- HON color dropdown with color swatch
- Date acquired, purchase price, purchase source
- Condition: segmented control (Mint / Excellent / Good / Fair / Poor)
- Nest type: Stippled / Striated
- Slotted beads toggle, decoration toggle + condition sub-field
- Photo URL: text input with live preview
- Notes, favorite toggle
- Save / Cancel / Delete

---

## Mobile Navigation

Bottom tab bar, 5 tabs:

| Icon | Label | Route |
|------|-------|-------|
| Grid | Collection | `#/` |
| Egg/search | Wishlist | `#/wishlist` |
| Chart | Market | `#/market` |
| Bars | Timeline | `#/timeline` |
| User | Admin | `#/admin` |

- Lucide React icons
- Active tab: amber gold accent
- Admin tab: lock overlay when not signed in
- Desktop (>768px): horizontal top nav

---

## Deployment

### GitHub Pages

1. Create repo, build with Vite to `dist/`
2. Use `gh-pages` package or GitHub Action to deploy
3. Set `base: '/hon-tracker/'` in `vite.config.ts`
4. Live at `https://username.github.io/hon-tracker/`

### Google Sheets + Apps Script

1. Create Google Sheet "HON Tracker" with 4 tabs
2. Add headers, populate Reference tab with 22 colors
3. Extensions → Apps Script → paste code → deploy as web app
4. Copy deployment URL to `src/config.ts`

### Google Sign-In

1. Google Cloud Console → Credentials → OAuth 2.0 Client ID
2. Add authorized origins: GitHub Pages URL + localhost
3. Copy Client ID to `src/config.ts`

---

## Reference Data — All 22 HON Colors

Bundle in `src/data/colors.ts` and pre-populate the Reference sheet tab:

```typescript
export const HON_COLORS = [
  {
    id: 1, name: "Crystal (Original)", slug: "crystal-original",
    itemNumbers: "No Number", productionStart: 1935, productionEnd: 1958,
    nestTypes: "stippled", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN19", hexColor: "#E8E8E8", hexColorSecondary: "",
    isIridescent: false,
    description: "The earliest HONs, made in Crystal and Crystal/Decorated. Some have red cold-painted decoration on the comb, wattle, and ear. The eye is spherical with an eyelid design. Stippled nest with no beading.",
    ebaySearchQuery: "Indiana Glass hen on nest crystal clear vintage",
    displayOrder: 1
  },
  {
    id: 2, name: "Milk Glass", slug: "milk-glass",
    itemNumbers: "#0539, #7155", productionStart: 1959, productionEnd: 1986,
    nestTypes: "both", hasSlottedBeads: true, rarity: "common",
    ssinReferences: "SSIN33, SSIN34", hexColor: "#F5F0E8", hexColorSecondary: "",
    isIridescent: false,
    description: "Second longest production run at 28 years. Over 5 million estimated produced. Found with slotted or unslotted beads, stippled or striated nests.",
    ebaySearchQuery: "Indiana Glass hen on nest milk glass white",
    displayOrder: 2
  },
  {
    id: 3, name: "Riviera Blue", slug: "riviera-blue",
    itemNumbers: "#2233", productionStart: 1963, productionEnd: 1969,
    nestTypes: "stippled", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN17", hexColor: "#2B4C6F", hexColorSecondary: "",
    isIridescent: false,
    description: "Labeled as simply Blue on the box. Also known as Confederate Blue, Smoky Blue, Midnight Blue, Denim Blue. Scarce and difficult to find.",
    ebaySearchQuery: "Indiana Glass hen on nest blue dark vintage",
    displayOrder: 3
  },
  {
    id: 4, name: "Olive", slug: "olive",
    itemNumbers: "#0546, #2562", productionStart: 1965, productionEnd: 1982,
    nestTypes: "both", hasSlottedBeads: true, rarity: "common",
    ssinReferences: "SSIN26", hexColor: "#6B7D3A", hexColorSecondary: "",
    isIridescent: false,
    description: "Fourth longest production run. Stippled or striated nests, slotted or unslotted beads. Olive slotted-bead variant is hardest to find of the three slotted-bead colors.",
    ebaySearchQuery: "Indiana Glass hen on nest olive green",
    displayOrder: 4
  },
  {
    id: 5, name: "Amber", slug: "amber",
    itemNumbers: "#0547, #1829", productionStart: 1965, productionEnd: 1985,
    nestTypes: "both", hasSlottedBeads: true, rarity: "common",
    ssinReferences: "SSIN10, SSIN11, SSIN24", hexColor: "#C8922A", hexColorSecondary: "#A07020",
    isIridescent: false,
    description: "Also called Gold and Golden Amber over the years. Hue varies between specimens. Indiana Glass never made a 'beer-bottle brown' HON despite collector rumors.",
    ebaySearchQuery: "Indiana Glass hen on nest amber gold golden",
    displayOrder: 5
  },
  {
    id: 6, name: "Carnival", slug: "carnival",
    itemNumbers: "Unknown", productionStart: 1971, productionEnd: 1972,
    nestTypes: "both", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN31", hexColor: "#D4A843", hexColorSecondary: "#E8C060",
    isIridescent: true,
    description: "Produced for just one to two years. Called Marigold by collectors but Indiana Glass called it Carnival. Never found in an official catalog. One of three 'mystery' colors.",
    ebaySearchQuery: "Indiana Glass hen on nest carnival marigold iridescent",
    displayOrder: 6
  },
  {
    id: 7, name: "Iridescent Blue", slug: "iridescent-blue",
    itemNumbers: "#2891", productionStart: 1971, productionEnd: 1980,
    nestTypes: "both", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN16", hexColor: "#1E3A5F", hexColorSecondary: "#3A1E5F",
    isIridescent: true,
    description: "Fifth longest production run. Readily available. Iridescence created by spraying salt solutions onto glass in a fuming chamber, then reheating.",
    ebaySearchQuery: "Indiana Glass hen on nest iridescent blue carnival",
    displayOrder: 7
  },
  {
    id: 8, name: "Iridescent Gold", slug: "iridescent-gold",
    itemNumbers: "#1260", productionStart: 1972, productionEnd: 1980,
    nestTypes: "both", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN25", hexColor: "#8B6914", hexColorSecondary: "#A08030",
    isIridescent: true,
    description: "Iridescence applied over Amber glass. Darker and more common than the Carnival/Marigold HON. Stippled nest version is scarce.",
    ebaySearchQuery: "Indiana Glass hen on nest iridescent gold carnival amber",
    displayOrder: 8
  },
  {
    id: 9, name: "Lime Satin Mist", slug: "lime-satin-mist",
    itemNumbers: "#7241", productionStart: 1972, productionEnd: 1975,
    nestTypes: "both", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN29", hexColor: "#8FBF47", hexColorSecondary: "",
    isIridescent: false,
    description: "Unique satin (acid-etched) finish from hydrofluoric acid. Moderately hard to find. Commands higher prices.",
    ebaySearchQuery: "Indiana Glass hen on nest lime satin mist green frosted",
    displayOrder: 9
  },
  {
    id: 10, name: "Iridescent Lime", slug: "iridescent-lime",
    itemNumbers: "#7643", productionStart: 1973, productionEnd: 1980,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN30", hexColor: "#4A7A2E", hexColorSecondary: "#6A9A4E",
    isIridescent: true,
    description: "Fourth iridescent color. Plentifully available. Same base glass as Emerald Green with iridescent sheen.",
    ebaySearchQuery: "Indiana Glass hen on nest iridescent lime green carnival",
    displayOrder: 10
  },
  {
    id: 11, name: "Red/Decorated", slug: "red-decorated",
    itemNumbers: "#2591", productionStart: 1974, productionEnd: 1978,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN39", hexColor: "#9B1B30", hexColorSecondary: "",
    isIridescent: false,
    description: "Known as Ruby Red. Amber HON with red stain all over. Amber visible when held to light. Difficult to find in good condition.",
    ebaySearchQuery: "Indiana Glass hen on nest red ruby decorated",
    displayOrder: 11
  },
  {
    id: 12, name: "Horizon Blue", slug: "horizon-blue",
    itemNumbers: "#7845", productionStart: 1974, productionEnd: 1980,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN14", hexColor: "#3A8FBF", hexColorSecondary: "",
    isIridescent: false,
    description: "Described as Aqua Blue or Turquoise Blue. A collector favorite — pricey due to color popularity rather than scarcity.",
    ebaySearchQuery: "Indiana Glass hen on nest horizon blue aqua turquoise",
    displayOrder: 12
  },
  {
    id: 13, name: "Crystal (Reissue)", slug: "crystal-reissue",
    itemNumbers: "#1582, #4423, #4645, #5270", productionStart: 1982, productionEnd: 1992,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN18", hexColor: "#D4D4D4", hexColorSecondary: "",
    isIridescent: false,
    description: "Reissued Crystal with beaded rim and striated base. Very easy to find at low prices. Perfect starter piece.",
    ebaySearchQuery: "Indiana Glass hen on nest crystal clear beaded",
    displayOrder: 13
  },
  {
    id: 14, name: "Yellow Mist", slug: "yellow-mist",
    itemNumbers: "Unknown", productionStart: 1981, productionEnd: 1985,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN40", hexColor: "#D4C36A", hexColorSecondary: "",
    isIridescent: false,
    description: "Extremely hard to find. Sometimes called Topaz. Color is in the glass. No known item number or catalog appearance. One of three 'mystery' colors.",
    ebaySearchQuery: "Indiana Glass hen on nest yellow mist topaz",
    displayOrder: 14
  },
  {
    id: 15, name: "Pink", slug: "pink",
    itemNumbers: "#4899", productionStart: 1984, productionEnd: 1989,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN37, SSIN38", hexColor: "#D4A0A0", hexColorSecondary: "",
    isIridescent: false,
    description: "Labeled Pastel Pink on packaging. Multiple shade variations exist. The darker variant is the separate Peach color.",
    ebaySearchQuery: "Indiana Glass hen on nest pink pastel",
    displayOrder: 15
  },
  {
    id: 16, name: "Pastel Blue", slug: "pastel-blue",
    itemNumbers: "#4901", productionStart: 1984, productionEnd: 1992,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "common",
    ssinReferences: "SSIN12, SSIN13", hexColor: "#7BA3C4", hexColorSecondary: "#B0C8DC",
    isIridescent: false,
    description: "Two distinct shades: darker cornflower blue (common) and lighter ice blue (scarce). Item number changed from #4901 to #1583.",
    ebaySearchQuery: "Indiana Glass hen on nest pastel blue cornflower",
    displayOrder: 16
  },
  {
    id: 17, name: "Pastel Green", slug: "pastel-green",
    itemNumbers: "#4900", productionStart: 1984, productionEnd: 1985,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN27", hexColor: "#8FBF8F", hexColorSecondary: "",
    isIridescent: false,
    description: "Scarcer of the pastels. Also sold as Chantilly Green through Tiara Exclusives. Production may have been diverted to Sandwich pattern.",
    ebaySearchQuery: "Indiana Glass hen on nest pastel green chantilly",
    displayOrder: 17
  },
  {
    id: 18, name: "Emerald Green", slug: "emerald-green",
    itemNumbers: "Unknown", productionStart: 1985, productionEnd: 1986,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN28", hexColor: "#2D8B46", hexColorSecondary: "",
    isIridescent: false,
    description: "Same glass as Iridescent Lime without iridescence, lighter than Olive. Commands high prices. One of three 'mystery' colors.",
    ebaySearchQuery: "Indiana Glass hen on nest emerald green lime",
    displayOrder: 18
  },
  {
    id: 19, name: "Peach", slug: "peach",
    itemNumbers: "#4899, #1584", productionStart: 1988, productionEnd: 1992,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN36", hexColor: "#C4907A", hexColorSecondary: "",
    isIridescent: false,
    description: "Deeper, more saturated Pink. Renamed from Pink to Peach in 1988. Look for fuller color saturation. Scarcer than Pink.",
    ebaySearchQuery: "Indiana Glass hen on nest peach pink dark",
    displayOrder: 19
  },
  {
    id: 20, name: "Evergreen", slug: "evergreen",
    itemNumbers: "#7206", productionStart: 1994, productionEnd: 1998,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN22", hexColor: "#1A7A6D", hexColorSecondary: "",
    isIridescent: false,
    description: "Teal color, same as Spruce Green for Tiara Exclusives. Marketed as 'Confections, by Indiana Glass.' Scarcer, shorter production run.",
    ebaySearchQuery: "Indiana Glass hen on nest evergreen teal spruce",
    displayOrder: 20
  },
  {
    id: 21, name: "Evergreen Carnival", slug: "evergreen-carnival",
    itemNumbers: "#7133", productionStart: 1994, productionEnd: 1998,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "scarce",
    ssinReferences: "SSIN23", hexColor: "#1A6B60", hexColorSecondary: "#2A8B80",
    isIridescent: true,
    description: "Iridescent carnival Evergreen. Look for teal hue under the lid to distinguish from Iridescent Blue. Scarce and difficult to find.",
    ebaySearchQuery: "Indiana Glass hen on nest evergreen carnival teal iridescent",
    displayOrder: 21
  },
  {
    id: 22, name: "Cranberry/Decorated", slug: "cranberry-decorated",
    itemNumbers: "#7520", productionStart: 1995, productionEnd: 1998,
    nestTypes: "striated", hasSlottedBeads: false, rarity: "uncommon",
    ssinReferences: "SSIN21", hexColor: "#B03060", hexColorSecondary: "",
    isIridescent: false,
    description: "Stained over clear glass with improved technique. 'Confections, by Indiana Glass.' Also made as cat and bunny dishes. Rumored to be the last HON color ever made.",
    ebaySearchQuery: "Indiana Glass hen on nest cranberry pink confections",
    displayOrder: 22
  }
];
```

---

## Development Phases

### Phase 1 — Foundation (MVP)
- Vite + React + Tailwind scaffolding with HashRouter
- Static color data in `src/data/colors.ts`
- Google Apps Script: read endpoints (getReference, getCollection, getStats)
- Google Apps Script: write endpoints (addItem, updateItem, deleteItem)
- Google Sign-In integration
- Gallery page with HonCard grid
- Completeness Ring
- Admin: add/edit/delete collection items
- Deploy to GitHub Pages

### Phase 2 — Detail & Polish
- HON detail page
- Wishlist page with eBay search links
- Glass card CSS effects + iridescent shimmer
- Hen silhouette SVG placeholder
- Beaded border decorative elements
- Mobile bottom nav + desktop top nav
- Loading skeleton states

### Phase 3 — Price Tracking
- Manual price logging (admin)
- Price history on detail pages
- Nest Egg value dashboard
- Price trend charts (Recharts)
- Market page

### Phase 4 — Optional Extras
- eBay Browse API integration via Apps Script
- Production Timeline view
- Dark mode
- Export/share features

---

## Notes for the Implementer

- The reference PDF contains authoritative details on all 22 HON colors. Consult it for any color history questions.
- The design should feel **warm and personal** — a passion collection, not a sterile inventory app.
- The **beaded border motif** (row of evenly-spaced small circles) comes from the HON's nest edge. Use sparingly as a CSS decorative border.
- The **Completeness Ring** is the emotional centerpiece. Make it beautiful and satisfying.
- Apps Script cold starts can take 2-3 seconds. Bundled static data ensures instant UI rendering.
- **Hash routing** (`#/path`) is required for GitHub Pages (no server-side rewrites).
- Keep Apps Script under 500 lines. Simplicity is the priority.
- Google Sheets handles this data volume trivially — capacity will never be a concern.
- Photos are just URLs pasted by the user. No upload handling, no storage, no image processing. She can use Google Photos sharing links, imgur, or any public image URL.
