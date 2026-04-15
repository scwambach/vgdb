import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import GameDetail from '@/components/GameDetail';
import { createClient } from '@/lib/supabase/server';
import { getPlatformBySlug } from '@/lib/platforms';
import { getGameDetails } from '@/lib/igdb';

interface PageProps {
  params: Promise<{
    platform: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform: platformSlug, slug } = await params;
  const platform = getPlatformBySlug(platformSlug);

  if (!platform) {
    return { title: 'Game Not Found' };
  }

  const game = await getGameDetails(slug, platform.id);

  if (!game) {
    return { title: 'Game Not Found' };
  }

  return {
    title: `${game.name} (${platform.name}) | RetroVault`,
    description: game.summary || `Play ${game.name} on ${platform.name}`,
    openGraph: {
      title: `${game.name} (${platform.name}) | RetroVault`,
      description: game.summary || `Play ${game.name} on ${platform.name}`,
    },
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { platform: platformSlug, slug } = await params;
  const platform = getPlatformBySlug(platformSlug);

  if (!platform) {
    notFound();
  }

  const game = await getGameDetails(slug, platform.id);

  if (!game) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <>
      <Header user={profile} />
      <GameDetail
        game={game}
        platformSlug={platform.slug}
        platformName={platform.name}
      />
    </>
  );
}
