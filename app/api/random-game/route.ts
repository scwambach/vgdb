import { NextResponse } from 'next/server';
import { getRandomGame } from '@/lib/igdb';
import { PLATFORMS, getPlatformById } from '@/lib/platforms';

export async function GET() {
  try {
    // Get random game from any platform
    const randomPlatforms = Object.values(PLATFORMS);
    const randomPlatform = randomPlatforms[Math.floor(Math.random() * randomPlatforms.length)];
    
    const game = await getRandomGame(randomPlatform.id);

    if (!game) {
      return NextResponse.json(
        { error: 'No game found' },
        { status: 404 }
      );
    }

    // Find platform slug
    const platform = game.platforms?.[0];
    const matchingPlatform = platform ? getPlatformById(platform.id) : randomPlatform;

    return NextResponse.json({
      game,
      platformSlug: matchingPlatform?.slug,
    });
  } catch (error) {
    console.error('Random game error:', error);
    return NextResponse.json(
      { error: 'Failed to get random game' },
      { status: 500 }
    );
  }
}
