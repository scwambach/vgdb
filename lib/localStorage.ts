// Local storage utilities for game data

export interface UserGame {
  game_id: number;
  platform_slug: string;
  is_beaten: boolean;
  is_favorite: boolean;
  personal_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  games: Array<{
    game_id: number;
    platform_slug: string;
    added_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEYS = {
  USER_GAMES: "vgdb_user_games",
  COLLECTIONS: "vgdb_collections",
  THEME: "vgdb_theme",
} as const;

// User Games
export function getUserGames(): UserGame[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.USER_GAMES);
  return data ? JSON.parse(data) : [];
}

export function saveUserGames(games: UserGame[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USER_GAMES, JSON.stringify(games));
}

export function getUserGame(
  gameId: number,
  platformSlug: string,
): UserGame | null {
  const games = getUserGames();
  return (
    games.find(
      (g) => g.game_id === gameId && g.platform_slug === platformSlug,
    ) || null
  );
}

export function updateUserGame(
  gameId: number,
  platformSlug: string,
  updates: Partial<UserGame>,
): void {
  const games = getUserGames();
  const index = games.findIndex(
    (g) => g.game_id === gameId && g.platform_slug === platformSlug,
  );

  const now = new Date().toISOString();

  if (index >= 0) {
    games[index] = { ...games[index], ...updates, updated_at: now };
  } else {
    games.push({
      game_id: gameId,
      platform_slug: platformSlug,
      is_beaten: false,
      is_favorite: false,
      personal_rating: null,
      created_at: now,
      updated_at: now,
      ...updates,
    });
  }

  saveUserGames(games);
}

export function toggleFavorite(gameId: number, platformSlug: string): boolean {
  const game = getUserGame(gameId, platformSlug);
  const newValue = !game?.is_favorite;
  updateUserGame(gameId, platformSlug, { is_favorite: newValue });
  return newValue;
}

export function toggleBeaten(gameId: number, platformSlug: string): boolean {
  const game = getUserGame(gameId, platformSlug);
  const newValue = !game?.is_beaten;
  updateUserGame(gameId, platformSlug, { is_beaten: newValue });
  return newValue;
}

export function setRating(
  gameId: number,
  platformSlug: string,
  rating: number | null,
): void {
  updateUserGame(gameId, platformSlug, { personal_rating: rating });
}

export function getFavorites(): UserGame[] {
  return getUserGames().filter((g) => g.is_favorite);
}

export function getBeatenGames(): UserGame[] {
  return getUserGames().filter((g) => g.is_beaten);
}

// Collections
export function getCollections(): Collection[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
  return data ? JSON.parse(data) : [];
}

export function saveCollections(collections: Collection[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
}

export function createCollection(
  name: string,
  description: string = "",
): Collection {
  const collections = getCollections();
  const now = new Date().toISOString();

  const newCollection: Collection = {
    id: `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    games: [],
    created_at: now,
    updated_at: now,
  };

  collections.push(newCollection);
  saveCollections(collections);
  return newCollection;
}

export function updateCollection(
  id: string,
  updates: Partial<Omit<Collection, "id" | "created_at">>,
): void {
  const collections = getCollections();
  const index = collections.findIndex((c) => c.id === id);

  if (index >= 0) {
    collections[index] = {
      ...collections[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveCollections(collections);
  }
}

export function deleteCollection(id: string): void {
  const collections = getCollections();
  const filtered = collections.filter((c) => c.id !== id);
  saveCollections(filtered);
}

export function addGameToCollection(
  collectionId: string,
  gameId: number,
  platformSlug: string,
): void {
  const collections = getCollections();
  const collection = collections.find((c) => c.id === collectionId);

  if (collection) {
    const exists = collection.games.some(
      (g) => g.game_id === gameId && g.platform_slug === platformSlug,
    );

    if (!exists) {
      collection.games.push({
        game_id: gameId,
        platform_slug: platformSlug,
        added_at: new Date().toISOString(),
      });
      collection.updated_at = new Date().toISOString();
      saveCollections(collections);
    }
  }
}

export function removeGameFromCollection(
  collectionId: string,
  gameId: number,
  platformSlug: string,
): void {
  const collections = getCollections();
  const collection = collections.find((c) => c.id === collectionId);

  if (collection) {
    collection.games = collection.games.filter(
      (g) => !(g.game_id === gameId && g.platform_slug === platformSlug),
    );
    collection.updated_at = new Date().toISOString();
    saveCollections(collections);
  }
}

// Theme
export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (
    (localStorage.getItem(STORAGE_KEYS.THEME) as "light" | "dark") || "light"
  );
}

export function setTheme(theme: "light" | "dark"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}
