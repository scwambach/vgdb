import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId, platformSlug } = await request.json();

    const { error } = await supabase.from('user_games').upsert(
      {
        user_id: user.id,
        game_id: gameId,
        platform_slug: platformSlug,
        is_favorite: true,
      },
      {
        onConflict: 'user_id,game_id,platform_slug',
      }
    );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Favorites error:', error);
    return NextResponse.json({ error: 'Failed to update favorites' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId, platformSlug } = await request.json();

    const { error } = await supabase
      .from('user_games')
      .update({ is_favorite: false })
      .eq('user_id', user.id)
      .eq('game_id', gameId)
      .eq('platform_slug', platformSlug);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Favorites error:', error);
    return NextResponse.json({ error: 'Failed to update favorites' }, { status: 500 });
  }
}
