import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", "us");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "EcoEnergyGuardWebsite/1.0",
    },
  });

  const data = await response.json();

  return NextResponse.json(data);
}
