# Leaderboard Page - Backend Integration Design

## Overview

Integrate the leaderboard page (`/leaderboard`) with the existing tRPC backend, replacing mock data with real data from the database. Display top 20 worst-code entries ranked by score.

## Architecture

### Data Fetching Strategy
- **Server Component Pattern**: Use `prefetch` + `caller` for server-side data fetching
- **No client-side loading state**: Data is available in initial HTML (SEO-friendly)
- **Parallel queries**: Fetch stats and leaderboard entries concurrently

### tRPC Integration

**Existing Procedures:**
- `roast.getStats`: Returns `{ totalRoasts: number, avgScore: number }`
- `leaderboard.list`: Returns roast entries ordered by score (ascending)

**Page Structure:**
```
leaderboard/page.tsx (Server Component)
├── prefetch(trpc.roast.getStats.queryOptions())
├── caller.roast.getStats()
└── caller.leaderboard.list({ limit: 20 })
    └── LeaderboardList component
```

## Changes

### `src/app/leaderboard/page.tsx`
- Remove `LEADERBOARD_DATA` mock array
- Add `prefetch(trpc.roast.getStats.queryOptions())`
- Fetch stats and entries using `caller`
- Render entries using existing components

### New: `src/app/leaderboard/leaderboard-list.tsx` (optional)
- Server Component that renders the list
- Reuses `CodeBlock`, `CodeBlockHeaderMetaContainer`, `LeaderboardEntryCode`
- Or: inline the logic directly in page.tsx

## Component Usage

Reuse existing UI components:
- `CodeBlock` (async RSC with Shiki)
- `CodeBlockHeaderMetaContainer`
- `CodeBlockHeaderMetaRank`
- `CodeBlockHeaderMetaScore`
- `CodeBlockHeaderMetaLanguage`
- `CodeBlockHeaderMetaLineCount`
- `CodeBlockCodeArea`
- `LeaderboardEntryCode` (client component for collapsible)

## Data Model

```typescript
interface LeaderboardEntry {
  id: string;
  code: string;
  language: string;
  lineCount: number;
  score: number;
}

interface LeaderboardStats {
  totalRoasts: number;
  avgScore: number | null;
}
```

## Error Handling

- If database query fails, tRPC will throw (no custom error handling needed for this phase)
- Show 0 for stats if null

## Success Criteria

1. Page displays 20 entries ordered by score (lowest = worst = rank 1)
2. Stats show total submissions and average score
3. Each entry shows rank, score, language, line count, and expandable code
4. Page loads with data already populated (no skeleton needed)
