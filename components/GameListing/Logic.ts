import { useState, useEffect, useRef, useCallback } from "react";

export interface GameFilters {
  decade?: string;
  genres?: number[];
  themes?: number[];
  playerCount?: "single" | "multi" | "both";
  hasVideos?: boolean;
  hasScreenshots?: boolean;
}

export interface GameCardData {
  id: number;
  name: string;
  slug: string;
  cover?: {
    image_id: string;
  };
  rating?: number;
  first_release_date?: number;
}

export function useGameListingLogic(platformSlug: string) {
  const [games, setGames] = useState<GameCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GameFilters>({});
  const [sortBy, setSortBy] = useState<
    "name" | "rating" | "first_release_date"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadGames = useCallback(
    async (reset: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        const currentPage = reset ? 0 : page;
        const params = new URLSearchParams({
          platform: platformSlug,
          sort: sortBy,
          sortDirection,
          offset: String(currentPage * 20),
          limit: "20",
        });

        if (filters.decade) params.append("decade", filters.decade);
        if (filters.genres?.length)
          params.append("genres", filters.genres.join(","));
        if (filters.themes?.length)
          params.append("themes", filters.themes.join(","));
        if (filters.playerCount && filters.playerCount !== "both") {
          params.append("playerCount", filters.playerCount);
        }
        if (filters.hasVideos) params.append("hasVideos", "true");
        if (filters.hasScreenshots) params.append("hasScreenshots", "true");

        const response = await fetch(`/api/games?${params}`);
        if (!response.ok) throw new Error("Failed to load games");

        const data = await response.json();

        if (reset) {
          setGames(data.games);
          setPage(1);
        } else {
          setGames((prev) => {
            // Deduplicate games by ID
            const existingIds = new Set(prev.map((g) => g.id));
            const newGames = data.games.filter(
              (g: GameCardData) => !existingIds.has(g.id),
            );
            return [...prev, ...newGames];
          });
          setPage((prev) => prev + 1);
        }

        setHasMore(data.games.length === 20);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [platformSlug, page, filters, sortBy, sortDirection],
  );

  // Initial load and filter changes
  useEffect(() => {
    loadGames(true);
  }, [platformSlug, filters, sortBy, sortDirection]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadGames(false);
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadGames]);

  const handleFilterChange = (newFilters: Partial<GameFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (newSort: typeof sortBy) => {
    if (newSort === sortBy) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(newSort);
      setSortDirection("asc");
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return {
    games,
    loading,
    error,
    filters,
    sortBy,
    sortDirection,
    drawerOpen,
    hasMore,
    observerTarget,
    handleFilterChange,
    handleSortChange,
    toggleDrawer,
  };
}
