import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId, platformSlug, rating } = await request.json();

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const { error } = await supabase.from('user_games').upsert(
      {
        user_id: user.id,
        game_id: gameId,
        platform_slug: platformSlug,
        personal_rating: rating,
      },
      {
        onConflict: 'user_id,game_id,platform_slug',
      }
    );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Rating error:', error);
    return NextResponse.json({ error: 'Failed to update rating' }, { status: 500 });
  }
}
