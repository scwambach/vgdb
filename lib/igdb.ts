import { IGDBGame, IGDBSearchResult } from "./platforms";

let cachedAccessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedAccessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedAccessToken;
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: "POST" },
  );

  if (!response.ok) {
    throw new Error("Failed to get IGDB access token");
  }

  const data = await response.json();
  cachedAccessToken = data.access_token;
  // Set expiry to 5 minutes before actual expiry (tokens last ~60 days)
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

  return cachedAccessToken;
}

export async function igdbRequest(
  endpoint: string,
  body: string,
): Promise<any> {
  const token = await getAccessToken();

  console.log("IGDB Request to:", endpoint);
  console.log("Query:", body);

  const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body,
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("IGDB API error response:", errorText);
    throw new Error(`IGDB API error: ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  console.log(
    "IGDB Response:",
    Array.isArray(result) ? `${result.length} items` : result,
  );
  return result;
}

export async function searchGames(query: string): Promise<IGDBSearchResult[]> {
  const body = `
    search "${query}";
    fields name, slug, cover.image_id, platforms.id, platforms.name, first_release_date;
    where cover != null;
    limit 500;
  `;

  return igdbRequest("games", body);
}

export async function getGamesByPlatform(
  platformId: number,
  options: {
    limit?: number;
    offset?: number;
    sort?: "name" | "rating" | "first_release_date" | "aggregated_rating";
    sortDirection?: "asc" | "desc";
    dateFilter?: { min?: number; max?: number };
    genres?: number[];
    themes?: number[];
    hasVideos?: boolean;
    hasScreenshots?: boolean;
  } = {},
): Promise<IGDBGame[]> {
  const {
    limit = 20,
    offset = 0,
    sort = "name",
    sortDirection = "asc",
    dateFilter,
    genres,
    themes,
    hasVideos,
    hasScreenshots,
  } = options;

  let whereClause = `where platforms = (${platformId}) & cover != null`;

  if (dateFilter) {
    // Require release date when filtering by date
    whereClause += ` & first_release_date != null`;
    if (dateFilter.min)
      whereClause += ` & first_release_date >= ${dateFilter.min}`;
    if (dateFilter.max)
      whereClause += ` & first_release_date <= ${dateFilter.max}`;
  }

  if (genres && genres.length > 0) {
    whereClause += ` & genres = (${genres.join(",")})`;
  }

  if (themes && themes.length > 0) {
    whereClause += ` & themes = (${themes.join(",")})`;
  }

  if (hasVideos) {
    whereClause += ` & videos != null`;
  }

  if (hasScreenshots) {
    whereClause += ` & screenshots != null`;
  }

  const body = `
    fields name, slug, summary, cover.image_id, first_release_date, rating, rating_count, 
           aggregated_rating, aggregated_rating_count, genres.name, themes.name, 
           game_modes.name, involved_companies.company.name, involved_companies.developer, 
           involved_companies.publisher, screenshots.image_id, videos.video_id;
    ${whereClause};
    sort ${sort} ${sortDirection};
    limit ${limit};
    offset ${offset};
  `;

  return igdbRequest("games", body);
}

export async function getGameDetails(
  slug: string,
  platformId: number,
): Promise<IGDBGame | null> {
  const body = `
    fields name, slug, summary, storyline, cover.image_id, artworks.image_id, 
           screenshots.image_id, videos.video_id, videos.name, first_release_date, 
           rating, rating_count, aggregated_rating, aggregated_rating_count, 
           genres.id, genres.name, themes.id, themes.name, game_modes.id, game_modes.name,
           player_perspectives.id, player_perspectives.name,
           involved_companies.company.id, involved_companies.company.name, 
           involved_companies.developer, involved_companies.publisher, 
           platforms.id, platforms.name;
    where slug = "${slug}" & platforms = (${platformId}) & version_parent = null;
    limit 1;
  `;

  const results = await igdbRequest("games", body);
  return results[0] || null;
}

export async function getRandomGame(
  platformId?: number,
): Promise<IGDBGame | null> {
  // Get a random offset (IGDB doesn't have true random, so we approximate)
  const randomOffset = Math.floor(Math.random() * 500);

  let whereClause = "where cover != null & category = (0,8,9,10,11)";
  if (platformId) {
    whereClause += ` & platforms = (${platformId})`;
  }

  const body = `
    fields name, slug, cover.image_id, platforms.id;
    ${whereClause};
    limit 1;
    offset ${randomOffset};
  `;

  const results = await igdbRequest("games", body);
  return results[0] || null;
}

export async function getGenres(): Promise<
  Array<{ id: number; name: string }>
> {
  const body = "fields id, name; limit 100; sort name asc;";
  return igdbRequest("genres", body);
}

export async function getThemes(): Promise<
  Array<{ id: number; name: string }>
> {
  const body = "fields id, name; limit 100; sort name asc;";
  return igdbRequest("themes", body);
}

export async function getCompanies(): Promise<
  Array<{ id: number; name: string }>
> {
  const body =
    "fields id, name; limit 500; sort name asc; where developed != null | published != null;";
  return igdbRequest("companies", body);
}
