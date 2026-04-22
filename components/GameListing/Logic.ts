import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Fuse from "fuse.js";

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
  const [allGamesLoaded, setAllGamesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GameFilters>({});
  const [sortBy, setSortBy] = useState<
    "name" | "rating" | "first_release_date" | "aggregated_rating"
  >("rating");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fuse.js configuration for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(games, {
      keys: ["name"],
      threshold: 0.4, // More lenient for better matching
      ignoreLocation: true, // Search anywhere in the string
      minMatchCharLength: 2, // Minimum chars to match
      includeScore: true,
      isCaseSensitive: false,
    });
  }, [games]);

  // Filter games based on search query
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) {
      return games;
    }
    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  }, [games, searchQuery, fuse]);

  const loadGames = useCallback(
    async (reset: boolean = false, loadAll: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        const currentPage = reset ? 0 : page;
        const limit = loadAll ? 500 : 20; // Load 500 games for search
        const params = new URLSearchParams({
          platform: platformSlug,
          sort: sortBy,
          sortDirection,
          offset: String(loadAll ? 0 : currentPage * 20),
          limit: String(limit),
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

        if (reset || loadAll) {
          setGames(data.games);
          setPage(1);
          if (loadAll) {
            setAllGamesLoaded(true);
            setHasMore(false);
          }
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

        if (!loadAll) {
          setHasMore(data.games.length === 20);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [platformSlug, page, filters, sortBy, sortDirection],
  );

  // Load all games when search is initiated
  useEffect(() => {
    if (searchQuery.trim() && !allGamesLoaded) {
      loadGames(true, true);
    }
  }, [searchQuery, allGamesLoaded, loadGames]);

  // Initial load and filter changes
  useEffect(() => {
    setAllGamesLoaded(false);
    loadGames(true);
  }, [platformSlug, filters, sortBy, sortDirection]);

  // Infinite scroll observer (disabled when searching)
  useEffect(() => {
    if (searchQuery.trim()) return; // Don't use infinite scroll while searching

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
  }, [hasMore, loading, loadGames, searchQuery]);

  const handleFilterChange = (newFilters: Partial<GameFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (newSort: typeof sortBy) => {
    if (newSort === sortBy) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(newSort);
      // Default to descending for ratings, ascending for name/date
      setSortDirection(
        newSort === "name" || newSort === "first_release_date" ? "asc" : "desc",
      );
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    games: filteredGames,
    allGames: games,
    loading,
    error,
    filters,
    sortBy,
    sortDirection,
    drawerOpen,
    hasMore: hasMore && !searchQuery.trim(), // Disable infinite scroll when searching
    observerTarget,
    searchQuery,
    handleFilterChange,
    handleSortChange,
    toggleDrawer,
    handleSearchChange,
    clearSearch,
  };
}
