import { useState, useMemo } from "react";

interface GameResult {
  id: number;
  name: string;
  slug: string;
  cover: any;
  first_release_date?: number;
  platformSlug: string;
  platformName: string;
  platformColor: string;
}

interface PlatformSummary {
  name: string;
  slug: string;
  color: string;
  count: number;
}

export function useSearchPageLogic(initialGameResults: GameResult[]) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  // Get list of available platforms with game counts
  const availablePlatforms = useMemo(() => {
    const platformMap = new Map<string, PlatformSummary>();

    initialGameResults.forEach((game) => {
      const existing = platformMap.get(game.platformName);
      if (existing) {
        existing.count++;
      } else {
        platformMap.set(game.platformName, {
          name: game.platformName,
          slug: game.platformSlug,
          color: game.platformColor,
          count: 1,
        });
      }
    });

    // Sort by count (descending) then name
    return Array.from(platformMap.values()).sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });
  }, [initialGameResults]);

  // Filter games by selected platform
  const filteredGames = useMemo(() => {
    if (!selectedPlatform) {
      return initialGameResults;
    }
    return initialGameResults.filter(
      (game) => game.platformName === selectedPlatform,
    );
  }, [initialGameResults, selectedPlatform]);

  const handlePlatformFilter = (platformName: string) => {
    if (selectedPlatform === platformName) {
      setSelectedPlatform(null);
    } else {
      setSelectedPlatform(platformName);
    }
  };

  const clearFilter = () => {
    setSelectedPlatform(null);
  };

  return {
    filteredGames,
    selectedPlatform,
    availablePlatforms,
    handlePlatformFilter,
    clearFilter,
  };
}
