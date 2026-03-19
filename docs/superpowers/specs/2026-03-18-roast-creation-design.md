# Roast Creation Feature Design

## Overview

Implement the roast creation feature that allows users to submit code for AI-powered analysis. The system receives code, sends it to Groq API for analysis, stores the result, and redirects to a details page.

## Architecture

### Data Flow

```
CodeEditor (client component)
    ↓ submit (code + language + roastMode)
tRPC mutation: roast.create
    ↓ validate input
Groq API (Llama 3.1 70B)
    ↓ parse JSON response
Save to PostgreSQL (roasts + analysisItems)
    ↓ return { id }
Redirect to /roast/[id]
    ↓ fetch data
Display roast result
```

### Tech Stack

- **AI Provider**: Groq API (free tier, Llama 3.1 70B)
- **Database**: PostgreSQL with Drizzle ORM
- **API Layer**: tRPC v11 mutation
- **Frontend**: Next.js 16 with React Compiler

## API Integration

### Groq Client (`src/lib/groq.ts`)

```typescript
interface GroqConfig {
  apiKey: string;           // From env
  model: string;            // Default: llama-3.1-70b-versatile
  maxTokens: number;        // Default: 2048
  temperature: number;      // Default: 0.7
}

async function analyzeCode(
  code: string,
  language: string,
  roastMode: boolean
): Promise<RoastResponse>
```

### Response Schema

```typescript
interface RoastResponse {
  score: number;                    // 0-10 (0 = worst)
  verdict: Verdict;                 // From enum
  roastQuote: string;               // One-line sarcastic comment
  analysis: AnalysisItem[];         // 3-5 items (validate: min 1)
  suggestedFix?: string;            // Optional diff format
}

interface AnalysisItem {
  severity: "critical" | "warning" | "good";
  title: string;                    // Short issue name
  description: string;               // Detailed explanation
}

type Verdict = 
  | "needs_serious_help" 
  | "rough_around_edges" 
  | "decent_code" 
  | "solid_work" 
  | "exceptional";
```

### Prompt Templates

**Brutal Honest (roastMode: false):**
```
You are a code reviewer. Analyze the following {language} code.
Respond ONLY with valid JSON:

{
  "score": <0-10>,
  "verdict": "<verdict>",
  "roastQuote": "<one line honest comment>",
  "analysis": [
    {"severity": "critical", "title": "<title>", "description": "<desc>"},
    {"severity": "warning", "title": "<title>", "description": "<desc>"},
    {"severity": "good", "title": "<title>", "description": "<desc>"}
  ],
  "suggestedFix": "<optional diff>"
}
```

**Maximum Sarcasm (roastMode: true):**
```
Same as above but with EXTRA sarcasm, dramatic insults, and theatrical despair.
Make the roastQuote and descriptions genuinely funny and scathing.
```

## Database Schema

### Tables (already exist)

```typescript
roasts: {
  id: uuid,
  code: text,
  language: varchar(50),
  lineCount: integer,
  roastMode: boolean,
  score: real,
  verdict: enum(verdict),
  roastQuote: text,
  suggestedFix: text,
  createdAt: timestamp
}

analysisItems: {
  id: uuid,
  roastId: uuid (FK),
  severity: enum(severity),
  title: varchar(200),
  description: text,
  order: integer
}
```

## tRPC Router

### New Procedure: `roast.create`

```typescript
create: baseProcedure
  .input(z.object({
    code: z.string().min(1).max(10000),
    language: z.string(),
    roastMode: z.boolean(),
  }))
  .mutation(async ({ ctx, input }) => {
    // 1. Analyze with Groq (with 10s timeout, 1 retry)
    // 2. Validate response:
    //    - score: 0-10
    //    - verdict: valid enum value
    //    - analysis: min 1 item
    //    - each item: valid severity + non-empty title/description
    // 3. Save roast to DB
    // 4. Save analysisItems to DB
    // 5. Return { id }
  })
```

### New Procedure: `roast.getById`

```typescript
getById: baseProcedure
  .input(z.object({
    id: z.string().uuid(),
  }))
  .query(async ({ ctx, input }) => {
    // Fetch roast with related analysisItems
    // Return null if not found
  })

// Return type:
interface RoastWithAnalysis {
  id: string;
  code: string;
  language: string;
  lineCount: number;
  roastMode: boolean;
  score: number;
  verdict: Verdict;
  roastQuote: string;
  suggestedFix: string | null;
  createdAt: Date;
  analysisItems: Array<{
    id: string;
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
    order: number;
  }>;
}
```

## Frontend Components

### CodeEditor (`src/components/code-editor.tsx`)

**Changes:**
- Connect `$ roast_my_code` button to tRPC mutation
- Show loading state: `$ roasting...` with spinner
- Disable textarea during submission
- On success: `router.push(/roast/${id})`

### Roast Details Page (`src/app/roast/[id]/page.tsx`)

**Changes:**
- Convert to async RSC
- Fetch roast data via `caller.roast.getById(id)`
- Render with existing components:
  - ScoreRing for score visualization
  - CodeBlockCodeArea for code display (with border)
  - AnalysisCard components for items
  - DiffLine components for suggested fix

**Layout:**
```
[SOLVED] Score Hero
  - ScoreRing (180px)
  - Verdict badge
  - roastQuote (h1)
  - Meta: language, lineCount
  - NO share button (out of scope)

[--- divider ---]

[SOLVED] Code Section
  - Header: // your_submission
  - CodeBlockCodeArea (full code, border, no Mac header)

[--- divider ---]

[SOLVED] Analysis Section
  - Header: // detailed_analysis
  - Grid of AnalysisCard components

[--- divider ---]

[SOLVED] Diff Section (if suggestedFix exists)
  - Header: // suggested_fix
  - Diff display
```

### Loading State (`src/app/roast/[id]/loading.tsx`)

- Skeleton matching the page layout
- ScoreRing skeleton
- CodeBlock skeleton
- AnalysisCard skeletons (4 items)
- Diff skeleton

### Not Found (`src/app/roast/[id]/not-found.tsx`)

- Standard 404 page
- Message: "Roast not found"
- Link back to home

## Environment Variables

```bash
GROQ_API_KEY=          # From groq.cloud
```

## Error Handling

1. **Groq API failure**: Return error message, allow retry
2. **Invalid response format / JSON parse failure**:
   - Strategy 1: Retry once with simpler prompt (remove "Respond ONLY with JSON" emphasis)
   - Strategy 2: If still fails, return error to user with "Analysis failed, please try again"
   - Log raw response for debugging
3. **Database error**: Throw tRPC error, show user-friendly message
4. **Rate limiting (429)**: Handle gracefully, show cooldown message
5. **Timeout**: 10 second timeout, show "Analysis taking longer than expected" message

## Out of Scope

- Share roast functionality
- User authentication
- Code editing on result page
- Re-roasting (submit new analysis)

## Success Criteria

1. User can submit code and receive AI analysis
2. Roast mode toggle changes response style
3. Results are persisted to database
4. Details page displays all roast information
5. Loading and error states are handled gracefully
