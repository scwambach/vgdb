# RetroVault

A modern web application for tracking and discovering classic retro games across multiple platforms.

## Features

- 🎮 **15 Retro Platforms** — NES, SNES, Genesis, PlayStation, Game Boy, and more
- 🔍 **Universal Search** — Find games and platforms instantly (press `/` to focus)
- 🎲 **Random Game Discovery** — Explore new classic titles
- ⭐ **Personal Collection** — Mark games as beaten, favorite, and rate them
- 📚 **Custom Collections** — Organize games into public or private collections
- 👥 **Social Features** — Follow others, share activity, and see who's playing what
- 🌙 **Dark/Light Mode** — Persistent theme preference
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** Material UI (MUI) + Tailwind CSS
- **Auth & Database:** Supabase (PostgreSQL + Auth)
- **Game Data:** IGDB API (via Twitch)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
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
   - `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (keep secret!)
   - `NEXT_PUBLIC_SITE_URL` — Your site URL (e.g., `http://localhost:3000`)

4. Set up the database:
   - Go to your Supabase project
   - Open the SQL Editor
   - Run the SQL script from `supabase/schema.sql`

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
vgdb/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   ├── games/                # Game listing and detail pages
│   ├── user/                 # User profile pages
│   ├── login/                # Authentication pages
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── theme.ts              # MUI theme config
│   └── ThemeProvider.tsx     # Theme context provider
├── components/               # React components
│   ├── Header/               # Global header
│   ├── PlatformCard/         # Platform selection cards
│   ├── GameCard/             # Game card component
│   ├── GameListing/          # Game list with filters
│   └── GameDetail/           # Game detail view
├── lib/                      # Utilities and integrations
│   ├── supabase/             # Supabase client setup
│   ├── igdb.ts               # IGDB API integration
│   └── platforms.ts          # Platform definitions
├── supabase/                 # Database schema
│   └── schema.sql            # Database schema and migrations
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
- `GET /api/games?platform=<slug>` — Get games for a platform (with filters)
- `POST /api/user/favorites` — Add game to favorites
- `DELETE /api/user/favorites` — Remove from favorites
- `POST /api/user/game-status` — Mark game as beaten
- `POST /api/user/rating` — Rate a game

## Database Schema

Key tables:

- `profiles` — User profiles (extends Supabase auth.users)
- `user_games` — User-game interactions (beaten, favorite, rating)
- `collections` — User collections
- `collection_games` — Games in collections
- `follows` — User follow relationships
- `activities` — Activity feed entries

See `supabase/schema.sql` for complete schema with RLS policies.

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
