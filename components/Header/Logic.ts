import { useState, useEffect, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useThemeMode } from "@/app/ThemeProvider";

export interface SearchResult {
  id: number;
  name: string;
  slug: string;
  type: "game" | "platform";
  platformSlug?: string;
  platformId?: number;
}

export function useHeaderLogic() {
  const router = useRouter();
  const { mode, toggleTheme } = useThemeMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Keyboard shortcut for search (/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results || []);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchChange = (_event: SyntheticEvent, value: string) => {
    setSearchQuery(value);
  };

  const handleSearchSelect = (
    _event: SyntheticEvent,
    value: SearchResult | string | null,
  ) => {
    // Only handle object selection (clicking an item from dropdown)
    if (value && typeof value === "object") {
      if (value.type === "game" && value.platformSlug) {
        router.push(`/games/${value.platformSlug}/${value.slug}`);
      } else if (value.type === "platform") {
        router.push(`/games/${value.slug}`);
      }
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      event.preventDefault();
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleRandomGame = async () => {
    try {
      const response = await fetch("/api/random-game");
      if (response.ok) {
        const data = await response.json();
        if (data.game && data.platformSlug) {
          router.push(`/games/${data.platformSlug}/${data.game.slug}`);
        }
      }
    } catch (error) {
      console.error("Random game error:", error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    handleMenuClose();
  };

  return {
    mode,
    toggleTheme,
    searchQuery,
    searchResults,
    searchLoading,
    anchorEl,
    handleSearchChange,
    handleSearchSelect,
    handleSearchKeyDown,
    handleRandomGame,
    handleMenuOpen,
    handleMenuClose,
    handleNavigation,
  };
}
