# RetroVault

A modern web application for tracking and discovering classic retro games across multiple platforms.

## Features

- 🎮 **15 Retro Platforms** — NES, SNES, Genesis, PlayStation, Game Boy, and more
- 🔍 **Universal Search** — Find games and platforms instantly (press `/` to focus)
- 🎲 **Random Game Discovery** — Explore new classic titles
- 📊 **Smart Sorting** — Order games by popularity, rating, release date, or alphabetically
- 🔧 **Advanced Filters** — Filter by genre, theme, decade, and media availability
- ⭐ **Personal Collection** — Mark games as beaten, favorite, and rate them (stored locally)
- 📚 **Custom Collections** — Organize games into your own collections
- 🌙 **Dark/Light Mode** — Persistent theme preference
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** Material UI (MUI) + Tailwind CSS
- **Storage:** Browser Local Storage (no backend required)
- **Game Data:** IGDB API (via Twitch)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Twitch Developer account (for IGDB API)

### Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd vgdb
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your credentials:

   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `TWITCH_CLIENT_ID` — Get from Twitch Developer Console
   - `TWITCH_CLIENT_SECRET` — Get from Twitch Developer Console
   - `NEXT_PUBLIC_SITE_URL` — Your site URL (e.g., `http://localhost:3000`)

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

All your data (favorites, ratings, collections) is stored locally in your browser.

## Project Structure

```
vgdb/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── games/            # Game listing API
│   │   ├── search/           # Search API
│   │   ├── random-game/      # Random game API
│   │   └── test-igdb/        # IGDB test endpoint
│   ├── games/                # Game listing and detail pages
│   ├── search/               # Search results page
│   ├── globals.css           # Global styles & CSS variables
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page (platform selection)
│   ├── theme.ts              # MUI theme configuration
│   └── ThemeProvider.tsx     # Theme context provider
├── components/               # React components
│   ├── Header/               # Global header with search
│   ├── PlatformCard/         # Platform selection cards
│   ├── GameCard/             # Game card component
│   ├── GameListing/          # Game list with sorting & filters
│   └── GameDetail/           # Game detail view
├── lib/                      # Utilities and integrations
│   ├── localStorage.ts       # Local storage helpers
│   ├── igdb.ts               # IGDB API integration
│   └── platforms.ts          # Platform definitions & configs
└── public/                   # Static assets
```

## Component Structure

All React components follow this structure (per AGENTS.md):

```
ComponentName/
  index.tsx           # JSX markup only
  Logic.ts            # All state, handlers, hooks
  index.test.tsx      # React Testing Library tests
  ComponentName.css   # Optional, component-specific styles
```

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint
- `npm test` — Run tests in watch mode
- `npm run test:ci` — Run tests once (CI mode)

## API Routes

- `GET /api/search?q=<query>` — Search games and platforms
- `GET /api/random-game` — Get a random game
- `GET /api/games?platform=<slug>&sort=<field>&sortDirection=<asc|desc>` — Get games for a platform with sorting and filters
  - Sort options: `aggregated_rating` (popularity), `rating`, `name`, `first_release_date`
  - Additional filters: `decade`, `genres`, `themes`, `hasVideos`, `hasScreenshots`

## Local Storage Data

All user data is stored locally in your browser using localStorage:

- **User Games** — Favorites, beaten status, and personal ratings
- **Collections** — Custom game collections
- **Theme Preference** — Dark/light mode setting

Your data persists across browser sessions but is device-specific.

## Supported Platforms

- NES
- SNES
- Game Boy / Color / Advance
- GameCube
- Sega Genesis / Master System / Game Gear
- TurboGrafx-16
- PlayStation 1 / 2
- Dreamcast
- MS-DOS (1981-1995)
- Windows PC (1985-2005)

## Contributing

1. Follow the component structure defined in `AGENTS.md`
2. Use MUI components where applicable
3. Write tests for all components
4. Run linter before committing

## License

MIT

## Credits

- Game data provided by [IGDB](https://www.igdb.com/)
- Built with [Next.js](https://nextjs.org/)
- UI components from [Material UI](https://mui.com/)
- Database and auth by [Supabase](https://supabase.com/)
