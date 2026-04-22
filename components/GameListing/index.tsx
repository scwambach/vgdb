"use client";

import {
  Container,
  Grid,
  Typography,
  Box,
  Drawer,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Skeleton,
  IconButton,
  Chip,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import GameCard from "@/components/GameCard";
import { useGameListingLogic } from "./Logic";

interface GameListingProps {
  platformSlug: string;
  platformName: string;
  genres?: Array<{ id: number; name: string }>;
  themes?: Array<{ id: number; name: string }>;
}

export default function GameListing({
  platformSlug,
  platformName,
  genres = [],
  themes = [],
}: GameListingProps) {
  const {
    games,
    allGames,
    loading,
    error,
    filters,
    sortBy,
    sortDirection,
    drawerOpen,
    hasMore,
    observerTarget,
    searchQuery,
    handleFilterChange,
    handleSortChange,
    toggleDrawer,
    handleSearchChange,
    clearSearch,
  } = useGameListingLogic(platformSlug);

  const decades = ["1980", "1990", "2000"];

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            flexWrap: "wrap",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              marginBottom: 1,
            }}
          >
            {platformName} Games
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              size="small"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
                endAdornment: searchQuery && (
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => handleSortChange(e.target.value as any)}
              >
                <MenuItem value="aggregated_rating">🔥 Popularity</MenuItem>
                <MenuItem value="rating">⭐ User Rating</MenuItem>
                <MenuItem value="name">🔤 Alphabetical</MenuItem>
                <MenuItem value="first_release_date">📅 Release Year</MenuItem>
              </Select>
            </FormControl>
            <Chip
              icon={
                sortDirection === "desc" ? <ArrowDownIcon /> : <ArrowUpIcon />
              }
              label={sortDirection === "desc" ? "High to Low" : "Low to High"}
              size="small"
              variant="outlined"
              onClick={() => handleSortChange(sortBy)}
              sx={{ cursor: "pointer" }}
            />
            <IconButton onClick={toggleDrawer} color="primary">
              <FilterIcon />
            </IconButton>
          </Box>
        </Box>

        {searchQuery && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {loading
                ? "Loading all games for search..."
                : `Showing ${games.length} of ${allGames.length} games matching "${searchQuery}"`}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {loading && games.length === 0
            ? Array.from({ length: 12 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <Skeleton variant="rectangular" height={300} />
                </Grid>
              ))
            : games.map((game) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
                  <GameCard game={game} platformSlug={platformSlug} />
                </Grid>
              ))}
        </Grid>

        {/* Infinite scroll sentinel */}
        {hasMore && (
          <Box ref={observerTarget} sx={{ py: 4, textAlign: "center" }}>
            {loading && <CircularProgress />}
          </Box>
        )}

        {games.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              No games found with the current filters
            </Typography>
          </Box>
        )}
      </Container>

      {/* Filters Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: 320,
            p: 3,
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
          {/* Decade */}
          <FormControl fullWidth size="small">
            <InputLabel>Era / Decade</InputLabel>
            <Select
              value={filters.decade || ""}
              label="Era / Decade"
              onChange={(e) =>
                handleFilterChange({ decade: e.target.value || undefined })
              }
            >
              <MenuItem value="">All</MenuItem>
              {decades.map((decade) => (
                <MenuItem key={decade} value={decade}>
                  {decade}s
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Genre */}
          <Autocomplete
            multiple
            options={genres}
            getOptionLabel={(option) => option.name}
            value={genres.filter((g) => filters.genres?.includes(g.id))}
            onChange={(_, value) =>
              handleFilterChange({ genres: value.map((v) => v.id) })
            }
            renderInput={(params) => (
              <TextField {...params} label="Genres" size="small" />
            )}
          />

          {/* Theme */}
          <Autocomplete
            multiple
            options={themes}
            getOptionLabel={(option) => option.name}
            value={themes.filter((t) => filters.themes?.includes(t.id))}
            onChange={(_, value) =>
              handleFilterChange({ themes: value.map((v) => v.id) })
            }
            renderInput={(params) => (
              <TextField {...params} label="Themes" size="small" />
            )}
          />

          {/* Player Count */}
          <Box>
            <Typography variant="body2" gutterBottom>
              Player Count
            </Typography>
            <ToggleButtonGroup
              value={filters.playerCount || "both"}
              exclusive
              onChange={(_, value) =>
                handleFilterChange({ playerCount: value })
              }
              size="small"
              fullWidth
            >
              <ToggleButton value="single">Single</ToggleButton>
              <ToggleButton value="multi">Multi</ToggleButton>
              <ToggleButton value="both">Both</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Has Videos */}
          <FormControlLabel
            control={
              <Switch
                checked={filters.hasVideos || false}
                onChange={(e) =>
                  handleFilterChange({ hasVideos: e.target.checked })
                }
              />
            }
            label="Has Videos"
          />

          {/* Has Screenshots */}
          <FormControlLabel
            control={
              <Switch
                checked={filters.hasScreenshots || false}
                onChange={(e) =>
                  handleFilterChange({ hasScreenshots: e.target.checked })
                }
              />
            }
            label="Has Screenshots"
          />

          <Button
            variant="outlined"
            fullWidth
            onClick={() =>
              handleFilterChange({
                decade: undefined,
                genres: [],
                themes: [],
                playerCount: "both",
                hasVideos: false,
                hasScreenshots: false,
              })
            }
          >
            Clear Filters
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
