"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Autocomplete,
  TextField,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Casino as RandomIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useHeaderLogic, SearchResult } from "./Logic";

export default function Header() {
  const {
    mode,
    toggleTheme,
    searchQuery,
    searchResults,
    searchLoading,
    handleSearchChange,
    handleSearchSelect,
    handleSearchKeyDown,
    handleRandomGame,
  } = useHeaderLogic();

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            RetroVault
          </Typography>
        </Link>

        {/* Search */}
        <Box sx={{ flex: 1, maxWidth: 600 }}>
          <Autocomplete
            freeSolo
            options={searchResults}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            inputValue={searchQuery}
            onInputChange={handleSearchChange}
            onChange={handleSearchSelect}
            loading={searchLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                id="global-search"
                placeholder="Search games and platforms..."
                size="small"
                onKeyDown={handleSearchKeyDown}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searchLoading ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "background.paper",
                  },
                }}
              />
            )}
            renderOption={(props, option: SearchResult) => (
              <li
                {...props}
                key={`${option.type}-${option.id}-${option.platformSlug || ""}`}
              >
                <Box>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.type === "game"
                      ? `Game${option.platformName ? ` • ${option.platformName}` : ""}`
                      : "Platform"}
                  </Typography>
                </Box>
              </li>
            )}
          />
        </Box>

        {/* Random Game */}
        <IconButton
          color="inherit"
          onClick={handleRandomGame}
          title="Random Game"
        >
          <RandomIcon />
        </IconButton>

        {/* Theme Toggle */}
        <IconButton color="inherit" onClick={toggleTheme} title="Toggle Theme">
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
