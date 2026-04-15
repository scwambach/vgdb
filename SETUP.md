# RetroVault

## Setup Instructions

### 1. Database Setup

Run the SQL schema in your Supabase project:

```bash
# Go to your Supabase project dashboard
# Navigate to SQL Editor
# Copy and paste the contents of supabase/schema.sql
# Click "Run"
```

### 2. Environment Variables

Your `.env` file is already configured with:

- Twitch/IGDB credentials
- Supabase credentials
- Site URL

### 3. Install & Run

```bash
# Install dependencies (already done)
npm install

# Run development server
npm run dev
```

### 4. First Steps

1. Visit http://localhost:3000
2. Sign up for an account (http://localhost:3000/signup)
3. Browse platforms on the home page
4. Search for games using the search bar (press `/` to focus)
5. Click "Random Game" to discover new titles
6. Mark games as beaten, add favorites, and rate them

### 5. Testing

Run the test suite:

```bash
npm test
```

## Key Features Implemented

✅ **Core Application**

- Next.js 15 with App Router
- Material UI component library
- Tailwind CSS for utilities
- TypeScript throughout

✅ **Authentication**

- Supabase Auth (email/password)
- Login/Signup pages
- Protected routes
- User profiles

✅ **Game Features**

- Browse games by platform
- Advanced filtering (genre, theme, year, etc.)
- Game detail pages with media
- Search functionality (press `/`)
- Random game discovery

✅ **User Features**

- Mark games as beaten
- Favorite games
- Personal ratings (1-5 stars)
- Public user profiles
- Collection system (database ready)

✅ **UI/UX**

- Dark/Light mode toggle (persisted)
- Responsive design (mobile/tablet/desktop)
- Loading states and skeletons
- Error handling
- Keyboard shortcuts

✅ **Database**

- Complete schema with RLS policies
- User profiles
- Game interactions
- Collections system
- Activity feed support
- Follow system

## Architecture

### Component Structure

Every component follows the pattern:

- `index.tsx` - Pure JSX markup
- `Logic.ts` - All state and handlers
- `index.test.tsx` - React Testing Library tests
- `ComponentName.css` - Optional styles (only if needed)

### API Routes

- `/api/search` - Universal search
- `/api/random-game` - Random game
- `/api/games` - Game listing with filters
- `/api/user/*` - User actions (favorites, ratings, etc.)

### Pages

- `/` - Home (platform selection)
- `/games/[platform]` - Game listing
- `/games/[platform]/[slug]` - Game detail
- `/user/[username]` - User profile
- `/login` - Login page
- `/signup` - Signup page

## What's Next

To expand the application:

1. **Collections**: Add UI for creating/editing collections
2. **Social Feed**: Implement activity feed display
3. **Image Uploads**: Add avatar upload functionality
4. **Advanced Stats**: Add charts and visualizations
5. **Achievements**: Add gamification elements
6. **Export**: Allow users to export their collection
7. **Recommendations**: Add game recommendation engine

## Known Limitations

- Game cover images require IGDB API responses (real data)
- Community ratings need aggregation queries
- Some placeholder data in user profiles
- Collections UI is minimal (database structure complete)

## Support

For issues or questions, check:

- README.md for full documentation
- AGENTS.md for coding rules
- Supabase schema.sql for database structure
