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

    // Get list of our supported platform IDs
    const supportedPlatformIds = Object.values(PLATFORMS).map((p) => p.id);

    const formattedGameResults = gameResults
      .map((game) => {
        // Find the first platform that matches our supported platforms
        const supportedPlatform = game.platforms?.find((p) =>
          supportedPlatformIds.includes(p.id),
        );

        if (!supportedPlatform) return null;

        const matchingPlatform = getPlatformById(supportedPlatform.id);

        return {
          id: game.id,
          name: game.name,
          slug: game.slug,
          type: "game" as const,
          platformId: supportedPlatform.id,
          platformSlug: matchingPlatform?.slug,
        };
      })
      .filter((game): game is NonNullable<typeof game> => game !== null);

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
