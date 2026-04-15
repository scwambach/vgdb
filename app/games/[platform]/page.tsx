import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import GameListing from '@/components/GameListing';
import { createClient } from '@/lib/supabase/server';
import { getPlatformBySlug } from '@/lib/platforms';
import { getGenres, getThemes } from '@/lib/igdb';

interface PageProps {
  params: Promise<{
    platform: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform: platformSlug } = await params;
  const platform = getPlatformBySlug(platformSlug);

  if (!platform) {
    return {
      title: 'Platform Not Found',
    };
  }

  return {
    title: `${platform.name} Games | RetroVault`,
    description: `Browse and discover classic games for ${platform.name}. Track your collection, rate games, and connect with other retro gaming fans.`,
    openGraph: {
      title: `${platform.name} Games | RetroVault`,
      description: `Browse and discover classic games for ${platform.name}`,
    },
  };
}

export default async function GamesPage({ params }: PageProps) {
  const { platform: platformSlug } = await params;
  const platform = getPlatformBySlug(platformSlug);

  if (!platform) {
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

  // Fetch genres and themes for filters
  const [genres, themes] = await Promise.all([
    getGenres(),
    getThemes(),
  ]);

  return (
    <>
      <Header user={profile} />
      <GameListing
        platformSlug={platform.slug}
        platformName={platform.name}
        genres={genres}
        themes={themes}
      />
    </>
  );
}
