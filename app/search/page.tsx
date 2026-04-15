import { Metadata } from "next";
import { Container, Grid, Typography, Box, Chip } from "@mui/material";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import { createClient } from "@/lib/supabase/server";
import { searchGames } from "@/lib/igdb";
import { PLATFORMS, getPlatformById } from "@/lib/platforms";

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";

  return {
    title: `Search: ${query} | RetroVault`,
    description: `Search results for "${query}" in RetroVault's retro gaming database`,
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || "";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  // Search for games and platforms
  let gameResults: any[] = [];
  let platformResults: any[] = [];

  if (query.trim().length >= 2) {
    // Search platforms
    platformResults = Object.values(PLATFORMS).filter((platform) =>
      platform.name.toLowerCase().includes(query.toLowerCase()),
    );

    // Search games via IGDB (no date/platform filtering here - get ALL matches)
    const games = await searchGames(query);
    const supportedPlatformIds = Object.values(PLATFORMS).map((p) => p.id);

    console.log(`Found ${games.length} total games for "${query}"`);
    console.log("Supported platform IDs:", supportedPlatformIds);

    gameResults = games
      .map((game) => {
        // Find ANY platform that matches our supported platforms
        const supportedPlatform = game.platforms?.find((p) =>
          supportedPlatformIds.includes(p.id),
        );

        if (!supportedPlatform) {
          return null;
        }

        const matchingPlatform = getPlatformById(supportedPlatform.id);

        if (!matchingPlatform) {
          return null;
        }

        // Apply date filter based on platform lifespan
        if (matchingPlatform.dateFilter && game.first_release_date) {
          const releaseDate = game.first_release_date;
          if (
            matchingPlatform.dateFilter.min &&
            releaseDate < matchingPlatform.dateFilter.min
          ) {
            console.log(
              `Filtered out "${game.name}" - released before ${new Date(matchingPlatform.dateFilter.min * 1000).getFullYear()}`,
            );
            return null;
          }
          if (
            matchingPlatform.dateFilter.max &&
            releaseDate > matchingPlatform.dateFilter.max
          ) {
            console.log(
              `Filtered out "${game.name}" - released after ${new Date(matchingPlatform.dateFilter.max * 1000).getFullYear()}`,
            );
            return null;
          }
        }

        return {
          id: game.id,
          name: game.name,
          slug: game.slug,
          cover: game.cover,
          first_release_date: game.first_release_date,
          platformSlug: matchingPlatform.slug,
          platformName: matchingPlatform.name,
          platformColor: matchingPlatform.color,
        };
      })
      .filter((game): game is NonNullable<typeof game> => game !== null);

    console.log(`Filtered to ${gameResults.length} games on retro platforms`);
  }

  return (
    <>
      <Header user={profile} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Search Results
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {gameResults.length + platformResults.length > 0
              ? `Found ${platformResults.length} platform${platformResults.length !== 1 ? "s" : ""} and ${gameResults.length} game${gameResults.length !== 1 ? "s" : ""} for "${query}"`
              : `Searching for "${query}"...`}
          </Typography>
        </Box>

        {/* Platform Results */}
        {platformResults.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Platforms ({platformResults.length})
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {platformResults.map((platform) => (
                <Chip
                  key={platform.slug}
                  label={platform.name}
                  component="a"
                  href={`/games/${platform.slug}`}
                  clickable
                  sx={{
                    backgroundColor: platform.color,
                    color: "white",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Game Results */}
        {gameResults.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Games ({gameResults.length})
            </Typography>
            <Grid container spacing={3}>
              {gameResults.map((game) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
                  <Box sx={{ position: "relative" }}>
                    <GameCard game={game} platformSlug={game.platformSlug} />
                    <Chip
                      label={game.platformName}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        backgroundColor: game.platformColor,
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* No Results */}
        {query.trim().length >= 2 &&
          gameResults.length === 0 &&
          platformResults.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h5" color="text.secondary">
                No results found for "{query}"
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                Try searching for a different game or platform
              </Typography>
            </Box>
          )}

        {query.trim().length < 2 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              Enter a search term to find games and platforms
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
}
