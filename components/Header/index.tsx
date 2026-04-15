"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Autocomplete,
  TextField,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Casino as RandomIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useHeaderLogic, SearchResult } from "./Logic";

interface HeaderProps {
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const {
    mode,
    toggleTheme,
    searchQuery,
    searchResults,
    searchLoading,
    anchorEl,
    handleSearchChange,
    handleSearchSelect,
    handleSearchKeyDown,
    handleRandomGame,
    handleMenuOpen,
    handleMenuClose,
    handleNavigation,
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
              <li {...props} key={`${option.type}-${option.id}`}>
                <Box>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.type === "game" ? "Game" : "Platform"}
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

        {/* User Menu */}
        {user ? (
          <>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                alt={user.username}
                src={user.avatar_url}
                sx={{ width: 32, height: 32 }}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => handleNavigation(`/user/${user.username}`)}
              >
                Profile
              </MenuItem>
              <MenuItem onClick={() => handleNavigation("/settings")}>
                Settings
              </MenuItem>
              <MenuItem onClick={() => handleNavigation("/api/auth/logout")}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            color="inherit"
            startIcon={<PersonIcon />}
            onClick={() => handleNavigation("/login")}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
