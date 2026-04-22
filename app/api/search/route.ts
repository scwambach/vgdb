import { NextRequest, NextResponse } from "next/server";
import { searchGames } from "@/lib/igdb";
import { PLATFORMS, getPlatformById } from "@/lib/platforms";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Search platforms
    const platformResults = Object.values(PLATFORMS)
      .filter((platform) =>
        platform.name.toLowerCase().includes(query.toLowerCase()),
      )
      .map((platform) => ({
        id: platform.id,
        name: platform.name,
        slug: platform.slug,
        type: "platform" as const,
      }));

    // Search games
    const gameResults = await searchGames(query);

    console.log(
      `API Search for "${query}": Found ${gameResults.length} games from IGDB`,
    );

    // Get list of our supported platform IDs
    const supportedPlatformIds = Object.values(PLATFORMS).map((p) => p.id);

    const formattedGameResults = gameResults.flatMap((game) => {
      // Find ALL platforms that match our supported platforms
      const supportedPlatforms =
        game.platforms?.filter((p: any) =>
          supportedPlatformIds.includes(p.id as any),
        ) || [];

      if (supportedPlatforms.length === 0) {
        return [];
      }

      // Create a result for EACH supported platform
      return supportedPlatforms
        .map((platform) => {
          const matchingPlatform = getPlatformById(platform.id);

          if (!matchingPlatform) {
            return null;
          }

          // Apply date filter based on platform lifespan
          if (matchingPlatform.dateFilter) {
            // If platform has date filtering, games MUST have a release date
            if (!game.first_release_date) {
              return null;
            }

            const releaseDate = game.first_release_date;
            if (
              matchingPlatform.dateFilter.min &&
              releaseDate < matchingPlatform.dateFilter.min
            ) {
              return null;
            }
            if (
              matchingPlatform.dateFilter.max &&
              releaseDate > matchingPlatform.dateFilter.max
            ) {
              return null;
            }
          }

          return {
            id: game.id,
            name: game.name,
            slug: game.slug,
            type: "game" as const,
            platformId: platform.id,
            platformSlug: matchingPlatform.slug,
            platformName: matchingPlatform.name,
          };
        })
        .filter(
          (result): result is NonNullable<typeof result> => result !== null,
        );
    });

    console.log(
      `API Search: After filtering, ${formattedGameResults.length} game results`,
    );

    // Combine results - platforms first, then games (don't limit yet)
    const combinedResults = [...platformResults, ...formattedGameResults];

    // For autocomplete dropdown, limit to 10 total
    const limitedResults = combinedResults.slice(0, 10);

    return NextResponse.json({
      results: limitedResults,
      total: combinedResults.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
