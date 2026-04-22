"use client";

import Link from "next/link";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Rating,
  Box,
  CircularProgress,
} from "@mui/material";
import { Favorite, FavoriteBorder, Add as AddIcon } from "@mui/icons-material";
import { useGameCardLogic, GameCardData } from "./Logic";
import { getIGDBImageUrl } from "@/lib/platforms";

interface GameCardProps {
  game: GameCardData;
  platformSlug: string;
  onAddToCollection?: (game: GameCardData) => void;
}

export default function GameCard({
  game,
  platformSlug,
  onAddToCollection,
}: GameCardProps) {
  const { isFavorite, favLoading, handleFavoriteToggle } = useGameCardLogic(
    game,
    platformSlug,
  );

  const coverUrl = game.cover?.image_id
    ? getIGDBImageUrl(game.cover.image_id, "cover_big")
    : "/placeholder-game.png";

  const gameUrl = `/games/${platformSlug}/${game.slug}`;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea component={Link} href={gameUrl} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="240"
          image={coverUrl}
          alt={game.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom noWrap>
            {game.name}
          </Typography>
          {game.rating && (
            <Rating
              value={game.rating / 20}
              precision={0.1}
              readOnly
              size="small"
            />
          )}
        </CardContent>
      </CardActionArea>

      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          gap: 0.5,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={handleFavoriteToggle}
          disabled={favLoading}
          sx={{ color: "white" }}
        >
          {favLoading ? (
            <CircularProgress size={20} />
          ) : isFavorite ? (
            <Favorite fontSize="small" />
          ) : (
            <FavoriteBorder fontSize="small" />
          )}
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCollection?.(game);
          }}
          sx={{ color: "white" }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
}
