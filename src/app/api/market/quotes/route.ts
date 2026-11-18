import { getMarketSnapshot } from "@/lib/market/market-service";
import { MarketAccessError } from "@/lib/providers/market/provider-factory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const headers = { "Cache-Control": "no-store" };
  if (new URL(request.url).search) {
    return Response.json(
      {
        error: {
          code: "INVALID_REQUEST",
          message: "This endpoint uses the configured instruments.",
        },
      },
      { status: 400, headers },
    );
  }
  try {
    return Response.json(
      { data: await getMarketSnapshot(request.signal) },
      { headers },
    );
  } catch (error) {
    const status = error instanceof MarketAccessError ? error.status : 503;
    const code =
      error instanceof MarketAccessError ? error.code : "PROVIDER_UNAVAILABLE";
    return Response.json(
      { error: { code, message: "Market data is currently unavailable." } },
      { status, headers },
    );
  }
}
