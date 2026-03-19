# Leaderboard Page Backend Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate leaderboard page with tRPC backend, replacing mock data with real database data.

**Architecture:** Server Component pattern using `prefetch` + `caller` for server-side data fetching. No client-side loading states needed - data available in initial HTML.

**Tech Stack:** Next.js App Router, tRPC v11, TanStack React Query v5, Drizzle ORM

---

## Task 1: Update `leaderboard/page.tsx` to use tRPC

**Files:**
- Modify: `src/app/leaderboard/page.tsx`

**Reference:**
- Pattern: `src/app/home-leaderboard.tsx` (Server Component using `caller`)
- Pattern: `src/app/page.tsx` (prefetch usage)

- [ ] **Step 1: Read current page.tsx**

```tsx
// Current imports - remove mock data
import {
  CodeBlockCodeArea,
  CodeBlockHeaderMetaContainer,
  CodeBlockHeaderMetaLanguage,
  CodeBlockHeaderMetaLineCount,
  CodeBlockHeaderMetaRank,
  CodeBlockHeaderMetaScore,
  CodeBlockRoot,
} from "@/components/ui/code-block";
```

- [ ] **Step 2: Add tRPC server imports**

```tsx
import { caller } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import { HydrateClient, prefetch } from "@/trpc/server";
```

- [ ] **Step 3: Add helper function for code truncation**

```tsx
function truncateCode(code: string, maxLines: number): string {
  const lines = code.split("\n");
  return lines.slice(0, maxLines).join("\n");
}
```

- [ ] **Step 4: Convert page to async Server Component with data fetching**

```tsx
export default async function LeaderboardPage() {
  // Parallel data fetching
  const [stats, { entries }] = await Promise.all([
    caller.roast.getStats(),
    caller.leaderboard.list({ limit: 20 }),
  ]);

  return (
    <HydrateClient>
      <main className="flex flex-col items-center min-h-screen bg-bg-page">
        <section className="flex flex-col gap-10 w-full max-w-[1440px] px-20 py-10">
          {/* Header with stats */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-accent-green text-3xl font-bold">{">"}</span>
              <h1 className="text-text-primary text-3xl font-bold">
                shame_leaderboard
              </h1>
            </div>
            <p className="text-text-secondary text-sm">
              {`// the most roasted code on the internet`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-text-tertiary text-xs">
                {`${stats.totalRoasts.toLocaleString()} submissions`}
              </span>
              <span className="text-text-tertiary text-xs">·</span>
              <span className="text-text-tertiary text-xs">
                {`avg score: ${stats.avgScore?.toFixed(1) ?? '0'}/10`}
              </span>
            </div>
          </div>

          {/* Leaderboard entries */}
          <div className="flex flex-col gap-5">
            {entries.map((entry, index) => (
              <CodeBlock key={entry.id}>
                <CodeBlockHeaderMetaContainer>
                  <div className="flex items-center gap-4">
                    <CodeBlockHeaderMetaRank rank={index + 1} />
                    <CodeBlockHeaderMetaScore score={entry.score} />
                  </div>
                  <div className="flex items-center gap-3">
                    <CodeBlockHeaderMetaLanguage>
                      {entry.language}
                    </CodeBlockHeaderMetaLanguage>
                    <CodeBlockHeaderMetaLineCount>
                      {entry.lineCount}
                    </CodeBlockHeaderMetaLineCount>
                  </div>
                </CodeBlockHeaderMetaContainer>
                <LeaderboardEntryCode
                  lineCount={entry.lineCount}
                  preview={
                    <CodeBlockCodeArea
                      code={truncateCode(entry.code, 5)}
                      language={entry.language}
                    />
                  }
                  fullCode={
                    <CodeBlockCodeArea
                      code={entry.code}
                      language={entry.language}
                    />
                  }
                />
              </CodeBlock>
            ))}
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
```

- [ ] **Step 5: Add import for LeaderboardEntryCode**

```tsx
import { LeaderboardEntryCode } from "@/app/leaderboard-entry-code";
```

- [ ] **Step 6: Remove mock data constant**

```tsx
// DELETE: const LEADERBOARD_DATA = [...]
```

- [ ] **Step 7: Remove hardcoded stats variables**

```tsx
// DELETE:
// const totalRoasts = 2847;
// const avgScore = 4.2;
```

- [ ] **Step 8: Add prefetch call for hydration**

Add after imports (before function):
```tsx
prefetch(trpc.roast.getStats.queryOptions());
```

---

## Task 2: Add metadata with dynamic data

**Files:**
- Modify: `src/app/leaderboard/page.tsx`

- [ ] **Step 1: Update metadata to use dynamic data**

```tsx
export async function generateMetadata() {
  const stats = await caller.roast.getStats();
  return {
    title: `Shame Leaderboard (${stats.totalRoasts.toLocaleString()} codes) | DevRoast`,
    description: "The most roasted code on the internet - ranked by shame",
  };
}
```

**Note:** Remove static `metadata` export and replace with `generateMetadata` function.

---

## Task 3: Run linter and typecheck

- [ ] **Step 1: Run lint**

Run: `pnpm lint`
Expected: No errors

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: No errors

- [ ] **Step 3: Run dev server and verify**

Run: `pnpm dev`
Expected: Leaderboard page loads with real data from database

---

## Task 4: Commit

- [ ] **Step 1: Stage and commit changes**

```bash
git add src/app/leaderboard/page.tsx
git commit -m "feat(leaderboard): integrate with tRPC backend"
```

---

## Verification Checklist

- [ ] Page displays 20 entries (or fewer if database has less)
- [ ] Entries ordered by score (lowest = worst = rank 1)
- [ ] Stats show correct totalRoasts and avgScore
- [ ] Each entry shows rank, score, language, line count
- [ ] Collapsible code works for entries > 5 lines
- [ ] Syntax highlighting works (shiki with vesper theme)
- [ ] Page title updates dynamically with total count
