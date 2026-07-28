import { NextRequest, NextResponse } from "next/server";
import { fetchSanityPostsPage } from "@/shared/sanity/lib/fetch";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const start = Number(searchParams.get("start") ?? "0");
  const limit = Number(searchParams.get("limit") ?? "20");
  const category = searchParams.get("category") ?? "";

  const data = await fetchSanityPostsPage({
    start: Number.isFinite(start) ? Math.max(0, start) : 0,
    limit: Number.isFinite(limit) ? Math.max(1, limit) : 20,
    category,
  });

  return NextResponse.json(data);
}
