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
  config?: GroqConfig,
): Promise<RoastResponse> {
  const apiKey = config?.apiKey || process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");
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
        max_tokens: maxTokens,
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

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [
    null,
    content,
  ];
  const jsonStr = jsonMatch[1] || content;

  try {
    return JSON.parse(jsonStr) as RoastResponse;
  } catch {
    // Retry with simpler prompt
    const retryPrompt = `Analyze this ${language} code and respond with ONLY valid JSON, no other text:

{"score": 5, "verdict": "decent_code", "roastQuote": "Needs review", "analysis": [{"severity": "warning", "title": "Review needed", "description": "This code could be improved"}]}

Now analyze:
${code}`;

    const retryResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: retryPrompt }],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      },
    );

    if (!retryResponse.ok) {
      throw new Error("Groq API retry failed");
    }

    const retryData = await retryResponse.json();
    const retryContent = retryData.choices[0]?.message?.content;

    if (!retryContent) {
      throw new Error("No content in Groq retry response");
    }

    try {
      return JSON.parse(retryContent) as RoastResponse;
    } catch {
      throw new Error(
        `Failed to parse JSON after retry: ${retryContent.substring(0, 200)}`,
      );
    }
  }
}

// Timeout wrapper
export async function analyzeCodeWithTimeout(
  ...args: Parameters<typeof analyzeCode>
): Promise<RoastResponse> {
  const timeout = 10000; // 10 seconds

  return Promise.race([
    analyzeCode(...args),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Analysis timed out after 10s")),
        timeout,
      ),
    ),
  ]);
}
