// Platform identifiers
export const PLATFORMS = {
  NES: {
    id: 18,
    slug: "nes",
    name: "NES",
    color: "#E32636",
    dateFilter: { min: 410227200, max: 820454400 },
  }, // 1983-1995
  SNES: {
    id: 19,
    slug: "snes",
    name: "SNES",
    color: "#8B4789",
    dateFilter: { min: 631152000, max: 946684800 },
  }, // 1990-1999
  GAMEBOY: {
    id: 33,
    slug: "gameboy",
    name: "Game Boy",
    color: "#9BBC0F",
    dateFilter: { min: 607392000, max: 1072915200 },
  }, // 1989-2003
  GAMEBOYCOLOR: {
    id: 22,
    slug: "gameboycolor",
    name: "Game Boy Color",
    color: "#FFD700",
    dateFilter: { min: 883612800, max: 1072915200 },
  }, // 1998-2003
  GAMEBOYADVANCE: {
    id: 24,
    slug: "gameboyadvance",
    name: "Game Boy Advance",
    color: "#0066CC",
    dateFilter: { min: 983404800, max: 1199145600 },
  }, // 2001-2008
  GAMECUBE: {
    id: 21,
    slug: "gamecube",
    name: "GameCube",
    color: "#6A5ACD",
    dateFilter: { min: 999302400, max: 1167609600 },
  }, // 2001-2007
  GENESIS: {
    id: 29,
    slug: "genesis",
    name: "Sega Genesis",
    color: "#000080",
    dateFilter: { min: 568080000, max: 852076800 },
  }, // 1988-1997
  MASTERSYSTEM: {
    id: 64,
    slug: "mastersystem",
    name: "Sega Master System",
    color: "#DC143C",
    dateFilter: { min: 473385600, max: 694224000 },
  }, // 1985-1992
  GAMEGEAR: {
    id: 35,
    slug: "gamegear",
    name: "Sega Game Gear",
    color: "#000000",
    dateFilter: { min: 631152000, max: 852076800 },
  }, // 1990-1997
  TURBOGRAFX16: {
    id: 86,
    slug: "turbografx16",
    name: "TurboGrafx-16",
    color: "#FF4500",
    dateFilter: { min: 536457600, max: 757382400 },
  }, // 1987-1994
  PLAYSTATION: {
    id: 7,
    slug: "playstation",
    name: "PlayStation",
    color: "#003791",
    dateFilter: { min: 757382400, max: 1136073600 },
  }, // 1994-2006
  PLAYSTATION2: {
    id: 8,
    slug: "playstation2",
    name: "PlayStation 2",
    color: "#0070CC",
    dateFilter: { min: 951868800, max: 1356998400 },
  }, // 2000-2013
  DREAMCAST: {
    id: 23,
    slug: "dreamcast",
    name: "Dreamcast",
    color: "#FF6600",
    dateFilter: { min: 883612800, max: 1009843199 },
  }, // 1998-2001
  MSDOS: {
    id: 13,
    slug: "msdos",
    name: "MS-DOS",
    color: "#000000",
    dateFilter: { min: 315532800, max: 820454400 },
  }, // 1981-1995
  WINDOWS: {
    id: 6,
    slug: "windows",
    name: "Windows PC",
    color: "#00A4EF",
    dateFilter: { min: 473385600, max: 1136073600 },
  }, // 1985-2005
} as const;

export type PlatformSlug = (typeof PLATFORMS)[keyof typeof PLATFORMS]["slug"];

export function getPlatformBySlug(slug: string) {
  return Object.values(PLATFORMS).find((p) => p.slug === slug);
}

export function getPlatformById(id: number) {
  return Object.values(PLATFORMS).find((p) => p.id === id);
}

// IGDB Types
export interface IGDBGame {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  storyline?: string;
  cover?: {
    id: number;
    url: string;
    image_id: string;
  };
  artworks?: Array<{
    id: number;
    url: string;
    image_id: string;
  }>;
  screenshots?: Array<{
    id: number;
    url: string;
    image_id: string;
  }>;
  videos?: Array<{
    id: number;
    video_id: string;
    name: string;
  }>;
  first_release_date?: number;
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  themes?: Array<{
    id: number;
    name: string;
  }>;
  game_modes?: Array<{
    id: number;
    name: string;
  }>;
  player_perspectives?: Array<{
    id: number;
    name: string;
  }>;
  involved_companies?: Array<{
    id: number;
    company: {
      id: number;
      name: string;
    };
    developer: boolean;
    publisher: boolean;
  }>;
  platforms?: Array<{
    id: number;
    name: string;
  }>;
}

export interface IGDBSearchResult {
  id: number;
  name: string;
  slug: string;
  cover?: {
    image_id: string;
  };
  platforms?: Array<{
    id: number;
    name: string;
  }>;
}

// Utility to convert IGDB image ID to URL
export function getIGDBImageUrl(
  imageId: string,
  size:
    | "thumb"
    | "cover_small"
    | "cover_big"
    | "screenshot_med"
    | "screenshot_big"
    | "1080p" = "cover_big",
) {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}
