import { NextRequest, NextResponse } from "next/server";
import { getGamesByPlatform } from "@/lib/igdb";
import { getPlatformBySlug } from "@/lib/platforms";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platformSlug = searchParams.get("platform");
    const sort = searchParams.get("sort") || "name";
    const sortDirection = searchParams.get("sortDirection") || "asc";
    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "20");
    const decade = searchParams.get("decade");
    const genres = searchParams.get("genres")?.split(",").map(Number);
    const themes = searchParams.get("themes")?.split(",").map(Number);
    const hasVideos = searchParams.get("hasVideos") === "true";
    const hasScreenshots = searchParams.get("hasScreenshots") === "true";

    if (!platformSlug) {
      return NextResponse.json(
        { error: "Platform slug is required" },
        { status: 400 },
      );
    }

    const platform = getPlatformBySlug(platformSlug);
    if (!platform) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 404 });
    }

    // Handle decade filter - if provided, override platform default dates
    let dateFilter = platform.dateFilter;
    if (decade) {
      const decadeStart = parseInt(decade);
      const decadeEnd = decadeStart + 9;
      dateFilter = {
        min: new Date(`${decadeStart}-01-01`).getTime() / 1000,
        max: new Date(`${decadeEnd}-12-31`).getTime() / 1000,
      };
    }

    console.log(
      "Fetching games for platform:",
      platform.name,
      "ID:",
      platform.id,
    );
    console.log("Using date filter:", dateFilter);

    const games = await getGamesByPlatform(platform.id, {
      limit,
      offset,
      sort: sort as any,
      sortDirection: sortDirection as any,
      dateFilter,
      genres,
      themes,
      hasVideos,
      hasScreenshots,
    });

    console.log("Games fetched:", games.length);
    return NextResponse.json({ games, platform });
  } catch (error) {
    console.error("Games API error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Failed to fetch games",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
