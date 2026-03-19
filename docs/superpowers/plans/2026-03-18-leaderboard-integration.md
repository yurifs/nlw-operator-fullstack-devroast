# Leaderboard Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the hardcoded `/leaderboard` page with real DB data — 20 entries with collapsible syntax-highlighted code blocks and live stats.

**Architecture:** Server Component pattern using `prefetch` + `caller` for server-side data fetching. Reuse existing `leaderboard.getLeaderboard` tRPC procedure (update limit to 20) and `roast.getStats`.

**Tech Stack:** Next.js 16 (App Router, RSC), tRPC v11, Drizzle ORM, Zod, Shiki (vesper theme)

---

### Task 1: Update `leaderboard.getLeaderboard` limit to 20

**Files:**
- Modify: `src/trpc/routers/leaderboard.ts:30-62`

**Reference:**
- Current: `limit: z.number().min(1).max(10).default(3)`
- Change to: `limit: z.number().min(1).max(100).default(20)`

**Step 1: Read current leaderboard.ts**

The existing `getLeaderboard` procedure is in `leaderboard.ts`, not `roast.ts`. It currently has:
```typescript
.input(z.object({ limit: z.number().min(1).max(10).default(3) }))
```

**Step 2: Update the max limit to 100 (to support 20 entries)**

Change line 31 from:
```typescript
.input(z.object({ limit: z.number().min(1).max(10).default(3) }))
```
To:
```typescript
.input(z.object({ limit: z.number().min(1).max(100).default(20) }))
```

**Step 3: Verify build compiles**

Run: `pnpm typecheck`
Expected: No errors

**Step 4: Commit**

```
feat(leaderboard): increase getLeaderboard max limit to 100
```

---

### Task 2: Rewrite `/leaderboard/page.tsx` as async RSC with real data

**Files:**
- Modify: `src/app/leaderboard/page.tsx`

**Reference:**
- Pattern: `src/app/home-leaderboard.tsx` (Server Component using `caller`)
- Pattern: `src/app/page.tsx` (prefetch usage)
- Existing components: `LeaderboardEntryCode`, `CodeBlock*` components

**Step 1: Read current page.tsx and home-leaderboard.tsx**

Current page has hardcoded mock data. Need to replace with real data from tRPC.

**Step 2: Add tRPC server imports**

```tsx
import { caller } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import { HydrateClient, prefetch } from "@/trpc/server";
```

**Step 3: Add imports for UI components**

```tsx
import {
  CodeBlock,
  CodeBlockCodeArea,
  CodeBlockHeaderMetaContainer,
  CodeBlockHeaderMetaLanguage,
  CodeBlockHeaderMetaLineCount,
  CodeBlockHeaderMetaRank,
  CodeBlockHeaderMetaScore,
  CodeBlockRoot,
} from "@/components/ui/code-block";
import { LeaderboardEntryCode } from "@/app/leaderboard-entry-code";
```

**Step 4: Add prefetch call for stats hydration**

After imports:
```tsx
prefetch(trpc.roast.getStats.queryOptions());
```

**Step 5: Add helper function for code truncation**

```tsx
function truncateCode(code: string, maxLines: number): string {
  const lines = code.split("\n");
  return lines.slice(0, maxLines).join("\n");
}
```

**Step 6: Convert page to async Server Component with data fetching**

Replace the entire page function:

```tsx
export default async function LeaderboardPage() {
  const [stats, { entries }] = await Promise.all([
    caller.roast.getStats(),
    caller.leaderboard.getLeaderboard({ limit: 20 }),
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
              <div key={entry.id} className="border border-border-primary">
                <CodeBlockRoot>
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
                </CodeBlockRoot>
              </div>
            ))}
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
```

**Step 7: Remove mock data constant**

Delete: `const LEADERBOARD_DATA = [...]`

**Step 8: Remove hardcoded stats**

Delete: `const totalRoasts = 2847;` and `const avgScore = 4.2;`

**Step 9: Verify the page renders**

Run: `pnpm dev` and navigate to `http://localhost:3000/leaderboard`
Expected: 20 entries from the DB with syntax highlighting and collapsible code blocks. Hero shows real stats.

**Step 10: Commit**

```
feat(leaderboard): replace mock data with tRPC backend
```

---

### Task 3: Run lint and typecheck

**Step 1: Run lint**

Run: `pnpm lint`
Expected: No errors

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: No errors

---

### Task 4: Final verification

**Checklist:**
- [ ] Page displays 20 entries (or fewer if database has less)
- [ ] Entries ordered by score (lowest = worst = rank 1)
- [ ] Stats show correct totalRoasts and avgScore
- [ ] Each entry shows rank, score, language, line count
- [ ] Collapsible code works for entries > 5 lines
- [ ] Syntax highlighting works (shiki with vesper theme)

---

### Verification Checklist

- [ ] Page displays 20 entries (or fewer if database has less)
- [ ] Entries ordered by score (lowest = worst = rank 1)
- [ ] Stats show correct totalRoasts and avgScore
- [ ] Each entry shows rank, score, language, line count
- [ ] Collapsible code works for entries > 5 lines
- [ ] Syntax highlighting works (shiki with vesper theme)
- [ ] Page title updates dynamically with total count
