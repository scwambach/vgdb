"use client";

import { Metadata } from "next";
import { Container, Grid, Typography, Box, Chip } from "@mui/material";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import { useSearchPageLogic } from "./Logic";

interface SearchPageClientProps {
  query: string;
  initialGameResults: any[];
  initialPlatformResults: any[];
}

export default function SearchPageClient({
  query,
  initialGameResults,
  initialPlatformResults,
}: SearchPageClientProps) {
  const {
    filteredGames,
    selectedPlatform,
    availablePlatforms,
    handlePlatformFilter,
    clearFilter,
  } = useSearchPageLogic(initialGameResults);

  const platformResults = initialPlatformResults;

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Search Results
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {initialGameResults.length + platformResults.length > 0
              ? `Found ${platformResults.length} platform${platformResults.length !== 1 ? "s" : ""} and ${initialGameResults.length} game${initialGameResults.length !== 1 ? "s" : ""} for "${query}"`
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
        {initialGameResults.length > 0 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5">
                Games ({filteredGames.length}
                {selectedPlatform && ` on ${selectedPlatform}`})
              </Typography>
              {selectedPlatform && (
                <Chip
                  label="Clear Filter"
                  size="small"
                  onDelete={clearFilter}
                  onClick={clearFilter}
                />
              )}
            </Box>

            {/* Platform Filter Tags */}
            {availablePlatforms.length > 1 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Filter by platform:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {availablePlatforms.map((platform) => (
                    <Chip
                      key={platform.slug}
                      label={`${platform.name} (${platform.count})`}
                      clickable
                      onClick={() => handlePlatformFilter(platform.name)}
                      color={
                        selectedPlatform === platform.name
                          ? "primary"
                          : "default"
                      }
                      variant={
                        selectedPlatform === platform.name
                          ? "filled"
                          : "outlined"
                      }
                      sx={{
                        ...(selectedPlatform !== platform.name && {
                          borderColor: platform.color,
                          color: platform.color,
                          "&:hover": {
                            backgroundColor: `${platform.color}22`,
                          },
                        }),
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Grid container spacing={3}>
              {filteredGames.map((game) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={`${game.id}-${game.platformSlug}`}
                >
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
          initialGameResults.length === 0 &&
          platformResults.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h5" color="text.secondary">
                No results found for &quot;{query}&quot;
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
