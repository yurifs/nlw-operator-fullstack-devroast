interface GroqConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
}

interface AnalysisItem {
  severity: "critical" | "warning" | "good";
  title: string;
  description: string;
}

export interface RoastResponse {
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
  config?: GroqConfig,
): Promise<RoastResponse> {
  const apiKey = config?.apiKey || process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");
  const model = config?.model || "llama-3.3-70b-versatile";
  const temperature = config?.temperature || 0.7;

  const systemPrompt = roastMode
    ? "You are a brutally sarcastic code reviewer. Your job is to roast terrible code with maximum dramatic flair, theatrical despair, and genuinely scathing commentary. Make developers question their career choices."
    : "You are a brutally honest code reviewer. Give constructive criticism with a sharp edge.";

  const userPrompt = `Analyze this ${language} code and respond ONLY with valid JSON.

The JSON must have exactly this structure:
{
  "score": number (0-10, 0 is worst),
  "verdict": "needs_serious_help" | "rough_around_edges" | "decent_code" | "solid_work" | "exceptional",
  "roastQuote": "one line comment",
  "analysis": [
    {"severity": "critical" | "warning" | "good", "title": "issue name", "description": "explanation"}
  ],
  "suggestedFix": "improved code in git diff format with - for removed, + for added, space for context"
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\``;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        response_format: {
          type: "json_object",
        },
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content in Groq response");
  }

  try {
    return JSON.parse(content) as RoastResponse;
  } catch {
    throw new Error(`Failed to parse JSON: ${content.substring(0, 200)}`);
  }
}

export async function analyzeCodeWithTimeout(
  ...args: Parameters<typeof analyzeCode>
): Promise<RoastResponse> {
  const timeout = 30000;

  return Promise.race([
    analyzeCode(...args),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Analysis timed out after 30s")),
        timeout,
      ),
    ),
  ]);
}
