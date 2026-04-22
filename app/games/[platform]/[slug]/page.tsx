import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import GameDetail from "@/components/GameDetail";
import { getPlatformBySlug } from "@/lib/platforms";
import { getGameDetails } from "@/lib/igdb";

interface PageProps {
  params: Promise<{
    platform: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { platform: platformSlug, slug } = await params;
  const platform = getPlatformBySlug(platformSlug);

  if (!platform) {
    return { title: "Game Not Found" };
  }

  const game = await getGameDetails(slug, platform.id);

  if (!game) {
    return { title: "Game Not Found" };
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

  return (
    <>
      <Header />
      <GameDetail
        game={game}
        platformSlug={platform.slug}
        platformName={platform.name}
      />
    </>
  );
}
