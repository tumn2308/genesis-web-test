import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleElearningRequest(request, path, "GET");
}

async function handleElearningRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const coinGeckoUrl = process.env.NEXT_PUBLIC_API_COIN_GECKO_URL;
    if (!coinGeckoUrl) {
      throw new Error("NEXT_PUBLIC_API_COIN_GECKO_URL is not configured");
    }

    const path = pathSegments.join("/");
    const targetUrl = `${coinGeckoUrl.replace(/\/$/, "")}/${path}`;

    // Get query parameters (exclude token parameter used for cache busting)
    const { searchParams } = new URL(request.url);
    const filteredParams = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (key !== "token") {
        filteredParams.append(key, value);
      }
    }
    const queryString = filteredParams.toString();
    const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

    // console.log("🎓 Proxy E-learning API Request:", {
    //   url: fullUrl,
    //   method,
    // });

    const response = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method !== "GET" ? await request.text() : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Coin Gecko API error:", errorText);
      return NextResponse.json(
        { error: "Coin Gecko API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔥 Coin Gecko proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
