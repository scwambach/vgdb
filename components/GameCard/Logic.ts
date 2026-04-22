import { useState, useEffect } from "react";
import { getUserGame, toggleFavorite } from "@/lib/localStorage";

export interface GameCardData {
  id: number;
  name: string;
  slug: string;
  cover?: {
    image_id: string;
  };
  rating?: number;
}

export function useGameCardLogic(game: GameCardData, platformSlug: string) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Load favorite status on mount
  useEffect(() => {
    const userGame = getUserGame(game.id, platformSlug);
    setIsFavorite(userGame?.is_favorite || false);
  }, [game.id, platformSlug]);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent link navigation
    setFavLoading(true);

    try {
      const newValue = toggleFavorite(game.id, platformSlug);
      setIsFavorite(newValue);
    } catch (error) {
      console.error("Favorite toggle error:", error);
    } finally {
      setFavLoading(false);
    }
  };

  return {
    isFavorite,
    favLoading,
    handleFavoriteToggle,
  };
}
