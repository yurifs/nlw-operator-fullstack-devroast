# OG Image Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate OpenGraph images for roast result pages automatically when shared on social media using Takumi.

**Architecture:** On-demand generation via Next.js API route `/api/og/[id]` using Takumi's Rust-based image rendering with built-in Geist fonts.

**Tech Stack:** @takumi-rs/image-response, Next.js 16 App Router, tRPC, Drizzle ORM

---

## File Structure

```
src/
├── app/
│   ├── roast/[id]/
│   │   └── page.tsx          # Add generateMetadata with og:image
│   └── api/og/[id]/
│       └── route.tsx         # Takumi ImageResponse handler
└── components/og/
    └── roast-image.tsx       # JSX component for Takumi
```

---

## Task 1: Setup - Install Takumi and Configure Next.js

**Files:**
- Modify: `next.config.ts`
- Modify: `package.json` (dependency added)

- [ ] **Step 1: Install Takumi**

Run: `pnpm add @takumi-rs/image-response`

Expected: Package installed successfully

- [ ] **Step 2: Configure Next.js serverExternalPackages**

Modify `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  cacheLife: {
    hourly: {
      stale: 3600,
      revalidate: 3600,
      expire: 86400,
    },
  },
  serverExternalPackages: ["@takumi-rs/core"],
};

export default nextConfig;
```

Run: `pnpm lint && pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add next.config.ts package.json pnpm-lock.yaml
git commit -m "feat: add Takumi for OG image generation"
```

---

## Task 2: Create RoastImage Component

**Files:**
- Create: `src/components/og/roast-image.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/og/roast-image.tsx`:

```tsx
import type { Roast } from "@/db/schema";

interface RoastImageProps {
  roast: Roast;
}

function getSeverityColor(score: number): string {
  if (score < 3) return "#EF4444"; // red
  if (score < 6) return "#F59E0B"; // amber
  return "#10B981"; // green
}

export function RoastImage({ roast }: RoastImageProps) {
  const scoreColor = getSeverityColor(roast.score);
  
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 64,
        gap: 28,
        fontFamily: "Geist, sans-serif",
      }}
    >
      {/* Logo Row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#10B981", fontSize: 24, fontWeight: 700 }}>
          &gt;
        </span>
        <span style={{ color: "#FAFAFA", fontSize: 20, fontWeight: 500 }}>
          devroast
        </span>
      </div>

      {/* Score Row */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span
          style={{
            color: scoreColor,
            fontSize: 160,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {roast.score.toFixed(1)}
        </span>
        <span style={{ color: "#737373", fontSize: 56 }}>/10</span>
      </div>

      {/* Verdict Row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: scoreColor,
          }}
        />
        <span style={{ color: scoreColor, fontSize: 20 }}>
          {roast.verdict}
        </span>
      </div>

      {/* Info */}
      <span style={{ color: "#737373", fontSize: 16, fontFamily: "Geist Mono, monospace" }}>
        lang: {roast.language} · {roast.lineCount} lines
      </span>

      {/* Quote */}
      <span
        style={{
          color: "#FAFAFA",
          fontSize: 22,
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        &ldquo;{roast.roastQuote}&rdquo;
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/og/roast-image.tsx
git commit -m "feat: create RoastImage component for OG generation"
```

---

## Task 3: Create OG Image API Route

**Files:**
- Create: `src/app/api/og/[id]/route.tsx`
- Create: `src/components/og/roast-image.tsx`
- Create: `src/components/og/og-fallback.tsx` (for 404 image)

- [ ] **Step 1: Create fallback component**

Create `src/components/og/og-fallback.tsx`:

```tsx
export function OGFallback() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 64,
        gap: 28,
        fontFamily: "Geist, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#10B981", fontSize: 24, fontWeight: 700 }}>
          &gt;
        </span>
        <span style={{ color: "#FAFAFA", fontSize: 20, fontWeight: 500 }}>
          devroast
        </span>
      </div>
      <span style={{ color: "#EF4444", fontSize: 48, fontWeight: 700 }}>
        404
      </span>
      <span style={{ color: "#737373", fontSize: 20 }}>
        Roast not found
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Create the API route with cache headers and built-in fonts**

Create `src/app/api/og/[id]/route.tsx`:

```tsx
import { ImageResponse } from "@takumi-rs/image-response";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { RoastImage } from "@/components/og/roast-image";
import { OGFallback } from "@/components/og/og-fallback";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return new ImageResponse(<OGFallback />, {
      width: 1200,
      height: 630,
    }, {
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
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
    }, {
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
    });
  }

  return new ImageResponse(<RoastImage roast={roast} />, {
    width: 1200,
    height: 630,
  }, {
    headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
  });
}
```

Note: Takumi comes with Geist and Geist Mono built-in by default, no font fetching needed.

- [ ] **Step 3: Run lint**

Run: `pnpm lint`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/api/og/[id]/route.tsx src/components/og/og-fallback.tsx
git commit -m "feat: create /api/og/[id] route with cache headers and fallback"
```

---

## Task 4: Add Meta Tags to Roast Page

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Add generateMetadata function**

Modify `src/app/roast/[id]/page.tsx` to add metadata:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
// ... existing imports

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  return {
    openGraph: {
      title: `DevRoast - ${id}`,
      images: [`${baseUrl}/api/og/${id}`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${baseUrl}/api/og/${id}`],
    },
  };
}

export default async function RoastResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ... existing code
```

- [ ] **Step 2: Run lint and build**

Run: `pnpm lint && pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: add OG meta tags to roast page"
```

---

## Task 5: Test OG Image Generation

**Prerequisite:** Create a test roast in the database (or use seed data UUID)

- [ ] **Step 1: Start dev server and test**

Run: `pnpm dev`

In another terminal, test the endpoint:
Run: `curl -s -o /dev/null -w "%{http_code} %{content_type}" http://localhost:3000/api/og/[valid-uuid]`
Expected: HTTP 200, Content-Type: image/png

Run: `curl -s -o /tmp/og-test.png http://localhost:3000/api/og/[valid-uuid] && file /tmp/og-test.png`
Expected: PNG image file

Run: `curl -s -o /tmp/og-404.png http://localhost:3000/api/og/00000000-0000-0000-0000-000000000000 && file /tmp/og-404.png`
Expected: PNG image file (fallback)

- [ ] **Step 2: Verify cache headers**

Run: `curl -I http://localhost:3000/api/og/[valid-uuid] | grep -i cache-control`
Expected: Cache-Control: public, max-age=86400, stale-while-revalidate=604800

- [ ] **Step 3: Test meta tags**

Open `http://localhost:3000/roast/[uuid]` in browser
Check page source for:
```html
<meta property="og:image" content="...">
<meta name="twitter:card" content="summary_large_image">
```

- [ ] **Step 4: Test sharing preview**

Use Twitter Card Validator or LinkedIn Post Inspector to verify OG image renders correctly

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete OG image generation feature"
```

---

## Summary

| Task | Status |
|------|--------|
| 1. Setup Takumi + Next.js config | ⬜ |
| 2. Create RoastImage component | ⬜ |
| 3. Create /api/og/[id] route | ⬜ |
| 4. Add meta tags to page | ⬜ |
| 5. Test OG image | ⬜ |
