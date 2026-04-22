"use client";

import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Checkbox,
  FormControlLabel,
  IconButton,
  Button,
  Rating,
  Card,
  CardMedia,
  AvatarGroup,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Add as AddIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGameDetailLogic, GameDetailData } from "./Logic";
import { getIGDBImageUrl } from "@/lib/platforms";

interface GameDetailProps {
  game: GameDetailData;
  platformSlug: string;
  platformName: string;
}

export default function GameDetail({
  game,
  platformSlug,
  platformName,
}: GameDetailProps) {
  const router = useRouter();
  const {
    isBeaten,
    isFavorite,
    personalRating,
    communityRating,
    actionLoading,
    developers,
    publishers,
    handleBeatenToggle,
    handleFavoriteToggle,
    handleRatingChange,
    handleOpenCollectionDialog,
    formatReleaseDate,
    getPlayerCount,
  } = useGameDetailLogic(game, platformSlug);

  const coverUrl = game.cover?.image_id
    ? getIGDBImageUrl(game.cover.image_id, "1080p")
    : "/placeholder-game.png";

  const handleBack = () => {
    const scrollPos = sessionStorage.getItem("gameListScrollPos");
    sessionStorage.removeItem("gameListScrollPos");
    router.push(`/games/${platformSlug}`);
    if (scrollPos) {
      setTimeout(() => window.scrollTo(0, parseInt(scrollPos)), 100);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mb: 3 }}>
        Back to {platformName} Games
      </Button>

      <Grid container spacing={3}>
        {/* Left Column - Box Art */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Image
              src={coverUrl}
              alt={game.name}
              width={600}
              height={800}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </Paper>

          {/* User Actions */}
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isBeaten}
                  onChange={handleBeatenToggle}
                  disabled={actionLoading}
                />
              }
              label="I've beaten this"
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handleFavoriteToggle}
                disabled={actionLoading}
                color={isFavorite ? "error" : "default"}
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenCollectionDialog}
                fullWidth
              >
                Add to Collection
              </Button>
            </Box>

            <Box>
              <Typography variant="body2" gutterBottom>
                Your Rating
              </Typography>
              <Rating
                value={personalRating}
                onChange={(_, value) => handleRatingChange(value)}
                precision={1}
                size="large"
              />
            </Box>
          </Box>
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" component="h1" gutterBottom>
            {game.name}
          </Typography>

          {/* Platform & Release Date */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Chip label={platformName} color="primary" />
            <Typography variant="body1" color="text.secondary">
              Released: {formatReleaseDate(game.first_release_date)}
            </Typography>
          </Box>

          {/* Ratings */}
          <Box sx={{ mb: 3 }}>
            {game.rating && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  IGDB Rating
                </Typography>
                <Rating value={game.rating / 20} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {(game.rating / 20).toFixed(1)} / 5
                </Typography>
              </Box>
            )}
            {communityRating > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Community Rating
                </Typography>
                <Rating value={communityRating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {communityRating.toFixed(1)} / 5
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Game Info */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {developers.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Developer{developers.length > 1 ? "s" : ""}
                </Typography>
                <Box
                  sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}
                >
                  {developers.map((dev) => (
                    <Chip key={dev} label={dev} size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {publishers.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Publisher{publishers.length > 1 ? "s" : ""}
                </Typography>
                <Box
                  sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}
                >
                  {publishers.map((pub) => (
                    <Chip key={pub} label={pub} size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {game.genres && game.genres.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Genre{game.genres.length > 1 ? "s" : ""}
                </Typography>
                <Box
                  sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}
                >
                  {game.genres.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {game.themes && game.themes.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Theme{game.themes.length > 1 ? "s" : ""}
                </Typography>
                <Box
                  sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}
                >
                  {game.themes.map((theme) => (
                    <Chip
                      key={theme.id}
                      label={theme.name}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Box>
              <Typography variant="body2" color="text.secondary">
                Player Count
              </Typography>
              <Typography variant="body1">{getPlayerCount()}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Summary */}
          {game.summary && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                About
              </Typography>
              <Typography variant="body1" paragraph>
                {game.summary}
              </Typography>
            </Box>
          )}

          {/* Storyline */}
          {game.storyline && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Story
              </Typography>
              <Typography variant="body1" paragraph>
                {game.storyline}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Screenshots */}
      {game.screenshots && game.screenshots.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Screenshots
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              pb: 2,
            }}
          >
            {game.screenshots.map((screenshot, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 400,
                  scrollSnapAlign: "start",
                }}
              >
                <CardMedia
                  component="img"
                  image={getIGDBImageUrl(screenshot.image_id, "screenshot_big")}
                  alt={`${game.name} screenshot ${index + 1}`}
                  sx={{ height: 225 }}
                />
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Videos */}
      {game.videos && game.videos.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Videos
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              pb: 2,
            }}
          >
            {game.videos.map((video) => (
              <Box
                key={video.video_id}
                sx={{
                  minWidth: 400,
                  scrollSnapAlign: "start",
                }}
              >
                <iframe
                  width="400"
                  height="225"
                  src={`https://www.youtube.com/embed/${video.video_id}`}
                  title={video.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 8 }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
}
