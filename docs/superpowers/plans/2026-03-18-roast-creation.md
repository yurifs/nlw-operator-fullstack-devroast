# Roast Creation Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the roast creation feature allowing users to submit code for AI-powered analysis via Groq API.

**Architecture:** tRPC mutation receives code, calls Groq API, saves to PostgreSQL, returns ID for redirect. Details page fetches from DB with async RSC.

**Tech Stack:** Next.js 16, tRPC v11, Drizzle ORM, Groq API, React Compiler

---

## File Structure

```
src/
  lib/
    groq.ts                    # Groq API client
  trpc/
    routers/
      roast.ts                 # Add create + getById procedures
  components/
    code-editor.tsx            # Connect to mutation
  app/
    roast/
      [id]/
        page.tsx               # Convert to async RSC with DB data
        loading.tsx            # Skeleton
        not-found.tsx          # 404 page
```

---

## Task 1: Create Groq API Client

**Files:**
- Create: `src/lib/groq.ts`

- [ ] **Step 1: Create groq.ts with client**

```typescript
// src/lib/groq.ts
interface GroqConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface AnalysisItem {
  severity: "critical" | "warning" | "good";
  title: string;
  description: string;
}

interface RoastResponse {
  score: number;
  verdict: string;
  roastQuote: string;
  analysis: AnalysisItem[];
  suggestedFix?: string;
}

export async function analyzeCode(
  code: string,
  language: string,
  roastMode: boolean,
  config?: GroqConfig
): Promise<RoastResponse> {
  const apiKey = config?.apiKey || process.env.GROQ_API_KEY;
  const model = config?.model || "llama-3.1-70b-versatile";
  const maxTokens = config?.maxTokens || 2048;
  const temperature = config?.temperature || 0.7;

  const systemPrompt = roastMode
    ? `You are a brutally sarcastic code reviewer. Your job is to roast terrible code with maximum dramatic flair, theatrical despair, and genuinely scathing commentary. Make developers question their career choices. Use JSON ONLY.`
    : `You are a brutally honest code reviewer. Give constructive criticism with a sharp edge. Use JSON ONLY.`;

  const userPrompt = `Analyze this ${language} code and respond with valid JSON:

{
  "score": <0-10, where 0 is worst>,
  "verdict": "needs_serious_help" | "rough_around_edges" | "decent_code" | "solid_work" | "exceptional",
  "roastQuote": "<one line sarcastic/honest comment>",
  "analysis": [
    {"severity": "critical" | "warning" | "good", "title": "<short issue name>", "description": "<detailed explanation>"}
  ],
  "suggestedFix": "<optional diff in git format>"
}

Code:
\`\`\`${language}
${code}
\`\`\``;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content in Groq response");
  }

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, content];
  const jsonStr = jsonMatch[1] || content;

  try {
    return JSON.parse(jsonStr) as RoastResponse;
  } catch {
    throw new Error(`Failed to parse JSON: ${jsonStr.substring(0, 200)}`);
  }
}
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/groq.ts
git commit -m "feat: add Groq API client for code analysis"
```

---

## Task 2: Add tRPC Procedures

**Files:**
- Modify: `src/trpc/routers/roast.ts`

- [ ] **Step 1: Read current roast.ts**

Current content has only `getStats` procedure.

- [ ] **Step 2: Add create procedure**

```typescript
import { avg, count } from "drizzle-orm";
import { z } from "zod";
import { roasts, analysisItems } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";
import { analyzeCode } from "@/lib/groq";

// ... existing getStats

create: baseProcedure
  .input(
    z.object({
      code: z.string().min(1).max(10000),
      language: z.string(),
      roastMode: z.boolean(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Analyze with Groq
    const analysis = await analyzeCode(
      input.code,
      input.language,
      input.roastMode
    );

    // Validate analysis has at least 1 item
    if (!analysis.analysis || analysis.analysis.length === 0) {
      throw new Error("Analysis must have at least 1 item");
    }

    // Save roast
    const [roast] = await ctx.db
      .insert(roasts)
      .values({
        code: input.code,
        language: input.language,
        lineCount: input.code.split("\n").length,
        roastMode: input.roastMode,
        score: analysis.score,
        verdict: analysis.verdict,
        roastQuote: analysis.roastQuote,
        suggestedFix: analysis.suggestedFix || null,
      })
      .returning({ id: roasts.id });

    // Save analysis items
    await ctx.db.insert(analysisItems).values(
      analysis.analysis.map((item, index) => ({
        roastId: roast.id,
        severity: item.severity,
        title: item.title,
        description: item.description,
        order: index,
      })),
    );

    return { id: roast.id };
  }),
```

- [ ] **Step 3: Add getById procedure**

```typescript
getById: baseProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    const roast = await ctx.db.query.roasts.findFirst({
      where: (roasts, { eq }) => eq(roasts.id, input.id),
      with: {
        analysisItems: {
          orderBy: (items, { asc }) => [asc(items.order)],
        },
      },
    });

    if (!roast) return null;

    return roast;
  }),
```

- [ ] **Step 4: Add drizzle relation for analysisItems**

In `src/db/schema.ts`, add relation:

```typescript
export const roasts = pgTable(
  "roasts",
  { /* ... existing fields */ },
  (table) => [
    index("roasts_score_idx").on(table.score),
    index("roasts_created_at_idx").on(table.createdAt),
  ],
);

// Add relation (after roasts table definition, add this)
export const roastsRelations = relations(roasts, ({ many }) => ({
  analysisItems: many(analysisItems),
}));
```

And update analysisItems:

```typescript
export const analysisItems = pgTable(
  "analysis_items",
  {
    // ... existing fields
  },
  (table) => [
    index("analysis_items_roast_id_idx").on(table.roastId),
  ],
);

// Add relation
export const analysisItemsRelations = relations(analysisItems, ({ one }) => ({
  roast: one(roasts, {
    fields: [analysisItems.roastId],
    references: [roasts.id],
  }),
}));
```

- [ ] **Step 5: Run typecheck**

Run: `pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/trpc/routers/roast.ts src/db/schema.ts
git commit -m "feat(trpc): add create and getById procedures for roasts"
```

---

## Task 3: Connect CodeEditor to Mutation

**Files:**
- Modify: `src/components/code-editor.tsx`

- [ ] **Step 1: Add tRPC imports**

```tsx
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
```

- [ ] **Step 2: Add mutation hook**

Inside CodeEditor component, after existing hooks:

```tsx
const router = useRouter();
const trpc = useTRPC();

const createRoast = useMutation(
  trpc.roast.create.mutationOptions({
    onSuccess: (data) => {
      router.push(`/roast/${data.id}`);
    },
    onError: (error) => {
      console.error("Roast creation failed:", error);
      alert("Failed to create roast. Please try again.");
    },
  }),
);
```

- [ ] **Step 3: Update button onClick**

Change button:

```tsx
<Button 
  variant="primary" 
  disabled={isOverLimit || createRoast.isPending}
  onClick={() => createRoast.mutate({
    code,
    language: currentLanguage,
    roastMode,
  })}
>
  {createRoast.isPending ? "$ roasting..." : "$ roast_my_code"}
</Button>
```

- [ ] **Step 4: Run typecheck**

Run: `pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/code-editor.tsx
git commit -m "feat(code-editor): connect to roast.create mutation"
```

---

## Task 4: Update Roast Details Page

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Rewrite as async RSC**

```tsx
import { notFound } from "next/navigation";
import { caller } from "@/trpc/server";
import {
  AnalysisCardDescription,
  AnalysisCardLabel,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import {
  CodeBlockCodeArea,
  CodeBlockRoot,
} from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";

export default async function RoastResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const roast = await caller.roast.getById({ id });

  if (!roast) {
    notFound();
  }

  // Parse suggested fix into diff lines
  const diffLines = roast.suggestedFix
    ? roast.suggestedFix.split("\n").map((line, i) => {
        if (line.startsWith("+")) {
          return { type: "added" as const, code: line.slice(1) };
        }
        if (line.startsWith("-")) {
          return { type: "removed" as const, code: line.slice(1) };
        }
        return { type: "context" as const, code: line };
      })
    : [];

  return (
    <main className="flex flex-col items-center bg-bg-page min-h-[calc(100vh-3.5rem)]">
      <section className="flex flex-col gap-10 w-full max-w-[1440px] px-20 py-10">
        {/* Score Hero */}
        <div className="flex items-center gap-12">
          <ScoreRing score={roast.score} className="w-[180px] h-[180px]" />
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-accent-red font-mono text-sm font-medium">
                verdict: {roast.verdict}
              </span>
            </div>
            <h1 className="text-2xl font-normal text-text-primary leading-relaxed">
              &ldquo;{roast.roastQuote}&rdquo;
            </h1>
            <div className="flex items-center gap-4 text-text-tertiary text-xs font-mono">
              <span>lang: {roast.language}</span>
              <span>·</span>
              <span>{roast.lineCount} lines</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-primary" />

        {/* Code Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              your_submission
            </span>
          </div>
          <div className="border border-border-primary">
            <CodeBlockRoot>
              <CodeBlockCodeArea
                code={roast.code}
                language={roast.language}
              />
            </CodeBlockRoot>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-primary" />

        {/* Analysis Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              detailed_analysis
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {roast.analysisItems.map((item) => (
              <AnalysisCardRoot key={item.id} variant={item.severity}>
                <AnalysisCardLabel>{item.severity}</AnalysisCardLabel>
                <AnalysisCardTitle>{item.title}</AnalysisCardTitle>
                <AnalysisCardDescription>{item.description}</AnalysisCardDescription>
              </AnalysisCardRoot>
            ))}
          </div>
        </div>

        {/* Divider - only show if suggested fix exists */}
        {diffLines.length > 0 && (
          <>
            <div className="h-px bg-border-primary" />

            {/* Diff Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="text-accent-green font-mono text-sm font-bold">
                  {"//"}
                </span>
                <span className="text-text-primary font-mono text-sm font-bold">
                  suggested_fix
                </span>
              </div>
              <div className="flex flex-col border border-border-primary rounded-md overflow-hidden">
                <div className="flex items-center h-10 px-4 border-b border-border-primary bg-bg-surface">
                  <span className="text-text-secondary font-mono text-xs font-medium">
                    your_code.js → improved_code.js
                  </span>
                </div>
                <div className="flex flex-col bg-bg-input">
                  {diffLines.map((line, i) => (
                    <DiffLine key={i} type={line.type} code={line.code} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Remove mock generateStaticParams**

Remove or update:

```tsx
// REMOVE THIS:
export async function generateStaticParams() {
  return [{ id: "550e8400-e29b-41d4-a716-446655440000" }];
}
```

- [ ] **Step 3: Run typecheck**

Run: `pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat(roast): convert to async RSC with DB data"
```

---

## Task 5: Create Loading and Not-Found Pages

**Files:**
- Create: `src/app/roast/[id]/loading.tsx`
- Create: `src/app/roast/[id]/not-found.tsx`

- [ ] **Step 1: Create loading.tsx**

```tsx
import { ScoreRing } from "@/components/ui/score-ring";

export default function RoastLoading() {
  return (
    <main className="flex flex-col items-center bg-bg-page min-h-[calc(100vh-3.5rem)]">
      <section className="flex flex-col gap-10 w-full max-w-[1440px] px-20 py-10">
        {/* Score Hero Skeleton */}
        <div className="flex items-center gap-12">
          <div className="w-[180px] h-[180px] rounded-full bg-bg-elevated animate-pulse" />
          <div className="flex flex-col gap-4 flex-1">
            <div className="w-40 h-4 bg-bg-elevated animate-pulse rounded" />
            <div className="w-3/4 h-8 bg-bg-elevated animate-pulse rounded" />
            <div className="w-32 h-4 bg-bg-elevated animate-pulse rounded" />
          </div>
        </div>

        <div className="h-px bg-border-primary" />

        {/* Code Section Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="w-40 h-4 bg-bg-elevated animate-pulse rounded" />
          <div className="h-[200px] bg-bg-elevated animate-pulse rounded" />
        </div>

        <div className="h-px bg-border-primary" />

        {/* Analysis Section Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="w-40 h-4 bg-bg-elevated animate-pulse rounded" />
          <div className="grid grid-cols-2 gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[120px] bg-bg-elevated animate-pulse rounded"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Create not-found.tsx**

```tsx
import Link from "next/link";

export default function RoastNotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] bg-bg-page">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-accent-green text-6xl font-bold font-mono">
          404
        </span>
        <h1 className="text-2xl text-text-primary font-bold">
          Roast not found
        </h1>
        <p className="text-text-secondary text-sm">
          This roast has been eaten or never existed.
        </p>
        <Link
          href="/"
          className="mt-4 px-4 py-2 border border-border-primary hover:bg-bg-elevated transition-colors"
        >
          <span className="text-text-secondary text-sm font-mono">
            $ go_home
          </span>
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Run typecheck**

Run: `pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/roast/[id]/loading.tsx src/app/roast/[id]/not-found.tsx
git commit -m "feat(roast): add loading and not-found pages"
```

---

## Verification Checklist

- [ ] Groq API client created and typed
- [ ] `roast.create` mutation calls Groq and saves to DB
- [ ] `roast.getById` returns roast with analysisItems
- [ ] CodeEditor button triggers mutation with loading state
- [ ] Redirect to `/roast/[id]` after success
- [ ] Details page shows score, verdict, code, analysis, diff
- [ ] Loading skeleton displays during navigation
- [ ] 404 page shows when roast not found
- [ ] No TypeScript errors
- [ ] No lint errors
