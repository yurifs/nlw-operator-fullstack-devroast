# OpenGraph Image Generation - Design Spec

## Overview

Generate OpenGraph (OG) images for roast result pages automatically when shared on social media.

## Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Share URL  │───▶│  /roast/[id] │───▶│  OG Image   │
│  (Twitter,  │    │   page.tsx   │    │  1200x630   │
│   Discord)   │    │              │    │             │
└─────────────┘    └──────────────┘    └─────────────┘
                          │                   │
                          ▼                   ▼
                   <meta property="og:image"  Takumi ImageResponse
                   content="/api/og/[id]"    Built-in Geist font
```

## File Structure

```
src/
├── app/
│   ├── roast/[id]/
│   │   └── page.tsx          # Add meta tags for og:image
│   └── api/og/[id]/
│       └── route.tsx         # Takumi ImageResponse handler
└── components/og/
    └── roast-image.tsx       # JSX component for Takumi
```

## Data Requirements

From roast entity:
- `score`: number (0-10) → displayed as "X.X/10"
- `verdict`: string → displayed with color indicator
- `language`: string → shown in info
- `lineCount`: number → shown in info
- `roastQuote`: string → displayed as quote

## Color Logic

Based on score:
- 0-2.9 (critical) → Red dot: `#EF4444`
- 3-5.9 (warning) → Amber dot: `#F59E0B`
- 6-10 (good) → Green dot: `#10B981`

## OG Image Design

**Dimensions:** 1200x630

**Layout (from Pencil "Screen 4 - OG Image"):**
```
┌────────────────────────────────────────────────────────┐
│  > devroast                                    [logo] │
│                                                        │
│                    3.5/10                         [score]
│                  ─────────                              │
│                                                        │
│              ● needs_serious_help                  [verdict]
│                                                        │
│              lang: javascript · 7 lines            [info]
│                                                        │
│       "this code was written during a..."          [quote]
└────────────────────────────────────────────────────────┘
```

**Typography:**
- Logo: 24px bold, green (`#10B981`)
- Score number: 160px bold, amber (`#F59E0B`)
- Score denom: 56px, tertiary
- Verdict: 20px, color based on score
- Info: 16px mono, tertiary
- Quote: 22px, centered, primary

**Background:** Dark (`#0A0A0A`)

## Implementation Details

### Dependencies
```bash
pnpm add @takumi-rs/image-response
```

### Configuration

**next.config.ts:**
```ts
serverExternalPackages: ["@takumi-rs/core"]
```

### Route Handler

`GET /api/og/[id]`
- Validates UUID format
- Fetches roast from database
- Renders Takumi component
- Returns PNG image
- Sets Cache-Control headers for caching

### Fallback

If roast not found → return simple "404" OG image or redirect

## Timeline

- Setup: Install Takumi, configure Next.js
- Component: Create roast-image.tsx
- Route: Create /api/og/[id] route
- Integration: Add meta tags to /roast/[id]/page.tsx
- Test: Verify image renders correctly
