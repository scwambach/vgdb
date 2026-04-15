import { NextResponse } from "next/server";
import { igdbRequest } from "@/lib/igdb";

export async function GET() {
  try {
    // Test categories for SNES games
    const snesGamesNoFilter = await igdbRequest(
      "games",
      `
      fields name, slug, category;
      where platforms = (19);
      limit 20;
    `,
    );

    console.log("SNES games (no category filter):", snesGamesNoFilter);

    // Test with category 0 only
    const snesGamesCategory0 = await igdbRequest(
      "games",
      `
      fields name, slug, category;
      where platforms = (19) & category = 0;
      limit 10;
    `,
    );

    console.log("SNES games (category 0 only):", snesGamesCategory0);

    // Get all unique categories
    const categories = new Set(snesGamesNoFilter.map((g: any) => g.category));

    return NextResponse.json({
      snesGamesNoFilter,
      snesGamesCategory0,
      uniqueCategories: Array.from(categories),
      categoryCount: snesGamesNoFilter.length,
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
