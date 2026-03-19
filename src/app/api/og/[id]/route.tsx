import { ImageResponse } from "@takumi-rs/image-response";
import { eq } from "drizzle-orm";
import { OGFallback } from "@/components/og/og-fallback";
import { RoastImage } from "@/components/og/roast-image";
import { db } from "@/db";
import { roasts } from "@/db/schema";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
};

function setCacheHeaders(response: Response): void {
  Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    const response = new ImageResponse(<OGFallback />, {
      width: 1200,
      height: 630,
    });
    setCacheHeaders(response);
    return response;
  }

  const [roast] = await db
    .select()
    .from(roasts)
    .where(eq(roasts.id, id))
    .limit(1);

  if (!roast) {
    const response = new ImageResponse(<OGFallback />, {
      width: 1200,
      height: 630,
    });
    setCacheHeaders(response);
    return response;
  }

  const response = new ImageResponse(<RoastImage roast={roast} />, {
    width: 1200,
    height: 630,
  });
  setCacheHeaders(response);
  return response;
}
