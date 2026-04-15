import { useState } from 'react';

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

  const handleBeatenToggle = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/user/game-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          platformSlug,
          isBeaten: !isBeaten,
        }),
      });

      if (response.ok) {
        setIsBeaten(!isBeaten);
      }
    } catch (error) {
      console.error('Failed to update beaten status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/user/favorites', {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          platformSlug,
        }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRatingChange = async (value: number | null) => {
    if (value === null) return;

    setPersonalRating(value);
    try {
      await fetch('/api/user/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          platformSlug,
          rating: value,
        }),
      });
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };

  const handleOpenCollectionDialog = () => {
    setCollectionDialogOpen(true);
  };

  const handleCloseCollectionDialog = () => {
    setCollectionDialogOpen(false);
  };

  const formatReleaseDate = (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPlayerCount = () => {
    const modes = game.game_modes?.map((m) => m.name.toLowerCase()) || [];
    const hasMulti = modes.some((m) => m.includes('multi'));
    const hasSingle = modes.some((m) => m.includes('single'));

    if (hasMulti && hasSingle) return 'Single Player / Multiplayer';
    if (hasMulti) return 'Multiplayer';
    if (hasSingle) return 'Single Player';
    return 'Unknown';
  };

  const developers = game.involved_companies
    ?.filter((ic) => ic.developer)
    .map((ic) => ic.company.name) || [];

  const publishers = game.involved_companies
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
