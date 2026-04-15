import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const handleClick = () => {
    // Store scroll position
    sessionStorage.setItem('gameListScrollPos', String(window.scrollY));
    router.push(`/games/${platformSlug}/${game.slug}`);
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavLoading(true);

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
      console.error('Favorite toggle error:', error);
    } finally {
      setFavLoading(false);
    }
  };

  const handleAddToCollection = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // This will be handled by a dialog in the parent component
  };

  return {
    isFavorite,
    favLoading,
    handleClick,
    handleFavoriteToggle,
    handleAddToCollection,
  };
}
