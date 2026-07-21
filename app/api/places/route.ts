import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input");
  if (!input || input.length < 2) return NextResponse.json({ predictions: [] });

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return NextResponse.json({ predictions: [] });

  const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
    },
    body: JSON.stringify({
      input,
      includedRegionCodes: ["il"],
      languageCode: "fr",
    }),
  });

  const data = await res.json();

  const predictions = (data.suggestions ?? []).map(
    (s: { placePrediction?: { text?: { text?: string } } }) =>
      s.placePrediction?.text?.text ?? ""
  ).filter(Boolean);

  return NextResponse.json({ predictions });
}
