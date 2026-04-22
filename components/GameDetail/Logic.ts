import { useState, useEffect } from "react";
import {
  getUserGame,
  toggleBeaten,
  toggleFavorite,
  setRating,
} from "@/lib/localStorage";

export interface GameDetailData {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  storyline?: string;
  cover?: {
    image_id: string;
  };
  screenshots?: Array<{
    image_id: string;
  }>;
  videos?: Array<{
    video_id: string;
    name: string;
  }>;
  first_release_date?: number;
  rating?: number;
  aggregated_rating?: number;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  themes?: Array<{
    id: number;
    name: string;
  }>;
  game_modes?: Array<{
    id: number;
    name: string;
  }>;
  involved_companies?: Array<{
    company: {
      id: number;
      name: string;
    };
    developer: boolean;
    publisher: boolean;
  }>;
}

export function useGameDetailLogic(game: GameDetailData, platformSlug: string) {
  const [isBeaten, setIsBeaten] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [personalRating, setPersonalRating] = useState<number | null>(null);
  const [communityRating, setCommunityRating] = useState<number>(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);

  // Load user game data on mount
  useEffect(() => {
    const userGame = getUserGame(game.id, platformSlug);
    if (userGame) {
      setIsBeaten(userGame.is_beaten);
      setIsFavorite(userGame.is_favorite);
      setPersonalRating(userGame.personal_rating);
    }
  }, [game.id, platformSlug]);

  const handleBeatenToggle = async () => {
    setActionLoading(true);
    try {
      const newValue = toggleBeaten(game.id, platformSlug);
      setIsBeaten(newValue);
    } catch (error) {
      console.error("Failed to update beaten status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    setActionLoading(true);
    try {
      const newValue = toggleFavorite(game.id, platformSlug);
      setIsFavorite(newValue);
    } catch (error) {
      console.error("Failed to update favorite:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRatingChange = async (value: number | null) => {
    if (value === null) return;

    setPersonalRating(value);
    try {
      setRating(game.id, platformSlug, value);
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };

  const handleOpenCollectionDialog = () => {
    setCollectionDialogOpen(true);
  };

  const handleCloseCollectionDialog = () => {
    setCollectionDialogOpen(false);
  };

  const formatReleaseDate = (timestamp?: number) => {
    if (!timestamp) return "Unknown";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlayerCount = () => {
    const modes = game.game_modes?.map((m) => m.name.toLowerCase()) || [];
    const hasMulti = modes.some((m) => m.includes("multi"));
    const hasSingle = modes.some((m) => m.includes("single"));

    if (hasMulti && hasSingle) return "Single Player / Multiplayer";
    if (hasMulti) return "Multiplayer";
    if (hasSingle) return "Single Player";
    return "Unknown";
  };

  const developers =
    game.involved_companies
      ?.filter((ic) => ic.developer)
      .map((ic) => ic.company.name) || [];

  const publishers =
    game.involved_companies
      ?.filter((ic) => ic.publisher)
      .map((ic) => ic.company.name) || [];

  return {
    isBeaten,
    isFavorite,
    personalRating,
    communityRating,
    actionLoading,
    collectionDialogOpen,
    developers,
    publishers,
    handleBeatenToggle,
    handleFavoriteToggle,
    handleRatingChange,
    handleOpenCollectionDialog,
    handleCloseCollectionDialog,
    formatReleaseDate,
    getPlayerCount,
  };
}
