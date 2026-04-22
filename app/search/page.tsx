import { Metadata } from "next";
import { searchGames } from "@/lib/igdb";
import { PLATFORMS, getPlatformById } from "@/lib/platforms";
import SearchPageClient from "./SearchPageClient";

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";

  return {
    title: `Search: ${query} | RetroVault`,
    description: `Search results for "${query}" in RetroVault's retro gaming database`,
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || "";

  // Search for games and platforms
  let gameResults: any[] = [];
  let platformResults: any[] = [];

  if (query.trim().length >= 2) {
    // Search platforms
    platformResults = Object.values(PLATFORMS).filter((platform) =>
      platform.name.toLowerCase().includes(query.toLowerCase()),
    );

    // Search games via IGDB (no date/platform filtering here - get ALL matches)
    const games = (await searchGames(query)) as any[];
    const supportedPlatformIds = Object.values(PLATFORMS).map((p) => p.id);

    console.log(`Found ${games.length} total games for "${query}"`);
    console.log("Supported platform IDs:", supportedPlatformIds);

    gameResults = games.flatMap((game) => {
      // Find ALL platforms that match our supported platforms
      const supportedPlatforms =
        game.platforms?.filter((p: any) =>
          supportedPlatformIds.includes(p.id),
        ) || [];

      if (supportedPlatforms.length === 0) {
        return [];
      }

      // Create a result for EACH supported platform
      return supportedPlatforms
        .map((platform: any) => {
          const matchingPlatform = getPlatformById(platform.id);

          if (!matchingPlatform) {
            return null;
          }

          // Apply date filter based on platform lifespan
          if (matchingPlatform.dateFilter) {
            // If platform has date filtering, games MUST have a release date
            if (!game.first_release_date) {
              console.log(
                `Filtered out "${game.name}" on ${matchingPlatform.name} - no release date and platform has date filter`,
              );
              return null;
            }

            const releaseDate = game.first_release_date;
            if (
              matchingPlatform.dateFilter.min &&
              releaseDate < matchingPlatform.dateFilter.min
            ) {
              console.log(
                `Filtered out "${game.name}" on ${matchingPlatform.name} - released before ${new Date(matchingPlatform.dateFilter.min * 1000).getFullYear()}`,
              );
              return null;
            }
            if (
              matchingPlatform.dateFilter.max &&
              releaseDate > matchingPlatform.dateFilter.max
            ) {
              console.log(
                `Filtered out "${game.name}" on ${matchingPlatform.name} - released after ${new Date(matchingPlatform.dateFilter.max * 1000).getFullYear()}`,
              );
              return null;
            }
          }

          return {
            id: game.id,
            name: game.name,
            slug: game.slug,
            cover: game.cover,
            first_release_date: game.first_release_date,
            platformSlug: matchingPlatform.slug,
            platformName: matchingPlatform.name,
            platformColor: matchingPlatform.color,
          };
        })
        .filter((result: any) => result !== null);
    });

    console.log(`Filtered to ${gameResults.length} games on retro platforms`);
  }

  return (
    <SearchPageClient
      query={query}
      initialGameResults={gameResults}
      initialPlatformResults={platformResults}
    />
  );
}
