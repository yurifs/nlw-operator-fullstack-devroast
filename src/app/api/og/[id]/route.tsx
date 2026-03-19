import { ImageResponse } from "@takumi-rs/image-response";
import { eq } from "drizzle-orm";
import { OGFallback } from "@/components/og/og-fallback";
import { RoastImage } from "@/components/og/roast-image";
import { db } from "@/db";
import { roasts } from "@/db/schema";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return new ImageResponse(<OGFallback />, {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  }

  const [roast] = await db
    .select()
    .from(roasts)
    .where(eq(roasts.id, id))
    .limit(1);

  if (!roast) {
    return new ImageResponse(<OGFallback />, {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  }

  return new ImageResponse(<RoastImage roast={roast} />, {
    width: 1200,
    height: 630,
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
