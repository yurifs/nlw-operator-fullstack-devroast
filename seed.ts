import { faker } from "@faker-js/faker";
import pg from "pg";

const pool = new pg.Pool({
  host: "localhost",
  port: 5432,
  database: "devroast",
  user: "devroast",
  password: "devroast",
});

async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

const VERDICTS = [
  "needs_serious_help",
  "rough_around_edges",
  "decent_code",
  "solid_work",
  "exceptional",
] as const;

const SEVERITIES = ["critical", "warning", "good"] as const;

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "go",
  "rust",
  "java",
  "php",
  "ruby",
  "sql",
  "bash",
  "html",
  "css",
  "json",
  "yaml",
  "cpp",
  "c",
  "csharp",
  "swift",
  "kotlin",
];

const CODE_TEMPLATES: Record<string, string[]> = {
  javascript: [
    `function ${faker.lorem.word()}(${faker.lorem.words(2)}) {
  let result = 0;
  for (let i = 0; i < ${faker.number.int({ min: 10, max: 100 })}; i++) {
    result += i * ${faker.number.int({ min: 1, max: 10 })};
  }
  return result;
}`,
    `const ${faker.lorem.word()} = async (${faker.lorem.words(2)}) => {
  const data = await fetch('${faker.internet.url()}');
  return data.json();
};`,
    `class ${faker.lorem.word().replace(/^./, (c) => c.toUpperCase())} {
  constructor(${faker.lorem.words(2)}) {
    this.${faker.lorem.word()} = ${faker.lorem.word()}();
  }
  
  ${faker.lorem.word()}() {
    return this.${faker.lorem.word()};
  }
}`,
  ],
  typescript: [
    `interface ${faker.lorem.word().replace(/^./, (c) => c.toUpperCase())} {
  id: string;
  name: string;
  ${faker.lorem.word()}: ${faker.helpers.arrayElement(["string", "number", "boolean"])};
}

function process${faker.lorem.word().replace(/^./, (c) => c.toUpperCase())}(data: ${faker.lorem.word().replace(/^./, (c) => c.toUpperCase())}[]): ${faker.lorem.word().replace(/^./, (c) => c.toUpperCase())} {
  return data.filter(item => item.${faker.lorem.word()} !== undefined);
}`,
    `type ${faker.lorem.word().replace(/^./, (c) => c.toUpperCase())} = {
  id: string;
  data: Record<string, unknown>;
};`,
  ],
  python: [
    `def ${faker.lorem.word()}(${faker.lorem.words(2)}):
    result = 0
    for i in range(${faker.number.int({ min: 10, max: 100 })}):
        result += i * ${faker.number.int({ min: 1, max: 10 })}
    return result`,
    `class ${faker.lorem.word().replace(/^./, (c) => c.toUpperCase())}:
    def __init__(self, ${faker.lorem.words(2)}):
        self.${faker.lorem.word()} = ${faker.lorem.word()}()
    
    def get_${faker.lorem.word()}(self):
        return self.${faker.lorem.word()}`,
  ],
  go: [
    `func ${faker.lorem.word()}(${faker.lorem.words(2)} string) ${faker.helpers.arrayElement(["string", "int", "error"])} {
    result := ""
    for i := 0; i < ${faker.number.int({ min: 10, max: 100 })}; i++ {
        result += fmt.Sprintf("%d", i)
    }
    return result
}`,
    `type ${faker.lorem.word().replace(/^./, (c) => c.toUpperCase())} struct {
    ID   string
    Name string
    ${faker.lorem.word()} ${faker.helpers.arrayElement(["string", "int", "bool"])}
}`,
  ],
  rust: [
    `fn ${faker.lorem.word()}(${faker.lorem.words(2)}: i32) -> i32 {
    let mut result = 0;
    for i in 0..${faker.number.int({ min: 10, max: 100 })} {
        result += i * ${faker.number.int({ min: 1, max: 10 })};
    }
    result
}`,
    `struct ${faker.lorem.word().replace(/^./, (c) => c.toUpperCase())} {
    id: String,
    name: String,
    ${faker.lorem.word()}: ${faker.helpers.arrayElement(["String", "i32", "bool"])},
}`,
  ],
  java: [
    `public ${faker.helpers.arrayElement(["class", "interface"])} ${faker.lorem.word().replace(/^./, (c) => c.toUpperCase())} {
    private ${faker.helpers.arrayElement(["String", "int", "boolean"])} ${faker.lorem.word()};
    
    public ${faker.lorem.word().replace(/^./, (c) => c.toUpperCase())}(${faker.lorem.words(2)}) {
        this.${faker.lorem.word()} = ${faker.lorem.word()};
    }
}`,
    `public static ${faker.helpers.arrayElement(["String", "int", "void"])} ${faker.lorem.word()}(${faker.lorem.words(2)}) {
    return ${faker.helpers.arrayElement(["null", "0", '""', "true"])};
}`,
  ],
};

const ANALYSIS_TITLES = {
  critical: [
    "Missing error handling",
    "No input validation",
    "SQL injection vulnerability",
    "Memory leak detected",
    "Unbounded loop",
    "Hardcoded credentials",
    "Missing null check",
    "Race condition",
  ],
  warning: [
    "Consider using const instead of let",
    "Missing JSDoc comments",
    "Function too long",
    "Magic numbers detected",
    "Duplicate code found",
    "Hardcoded configuration",
    "Nested callbacks",
    "Missing type hints",
  ],
  good: [
    "Good variable naming",
    "Clean function structure",
    "Proper async/await usage",
    "Good error handling",
    "Consistent code style",
    "Proper separation of concerns",
    "Good use of TypeScript types",
    "Efficient algorithm choice",
  ],
};

const ROAST_QUOTES = {
  needs_serious_help: [
    "Este código parece ter sido escrito durante um apagão emocional.",
    "Se o seu código fosse uma comida, estaría estragado há dias.",
    "Eu já vi programas melhores em desenhos animados.",
    "Isso merece um monumento - um monumento ao pior código do ano.",
    "Parabéns, você criou um monstro digital.",
  ],
  rough_around_edges: [
    "Quase bom, mas nãoooogente.",
    "Precisa de um polimento, mas tem potencial.",
    "Está no caminho certo, só precisa de mais café.",
    "Melhor que ontem, pior que amanhã.",
    "Um passo adiante, dois para trás.",
  ],
  decent_code: [
    "Funciona! Mas não me peça para manter isso.",
    "Não é beauty, mas também não é horrível.",
    "Código mediano, como aquele café sem graça do escritório.",
    "Faz o trabalho, só não olhe muito de perto.",
    "Adequado para produção, se você acreditar em дух",
  ],
  solid_work: [
    "Bom trabalho! Quase me Makes proud.",
    "Isso sim é código de gente grande.",
    "Parabéns, você knows what you're doing.",
    "Código limpo, mains Happy.",
    "Continue assim, você está no caminho certo!",
  ],
  exceptional: [
    "Uau! Isso está espetacular!",
    "Este código merece ser enmarbleizado!",
    "Mestre absoluto do código!",
    "Isso sim é arte!",
    "Absolutamente brilhante!",
  ],
};

const SUGGESTED_FIX_TEMPLATES = [
  `// Suggested improvement:
function improved_${faker.lorem.word()}(param) {
  try {
    const result = param?.transform() ?? defaultValue;
    return result;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}`,
  `// Refactored version:
class ImprovedHandler {
  constructor(private readonly service: Service) {}
  
  async execute(input: Input): Promise<Output> {
    if (!this.validate(input)) {
      throw new ValidationError('Invalid input');
    }
    return this.service.process(input);
  }
  
  private validate(data: Input): boolean {
    return data != null && typeof data === 'object';
  }
}`,
  `// Better approach:
export const processData = (data: Data[]) => {
  return data
    .filter(Boolean)
    .map(transform)
    .reduce(aggregate, initialValue);
};`,
];

function getScoreFromVerdict(verdict: string): number {
  switch (verdict) {
    case "needs_serious_help":
      return faker.number.float({ min: 0, max: 2, fractionDigits: 1 });
    case "rough_around_edges":
      return faker.number.float({ min: 2.1, max: 4, fractionDigits: 1 });
    case "decent_code":
      return faker.number.float({ min: 4.1, max: 6, fractionDigits: 1 });
    case "solid_work":
      return faker.number.float({ min: 6.1, max: 8, fractionDigits: 1 });
    case "exceptional":
      return faker.number.float({ min: 8.1, max: 10, fractionDigits: 1 });
    default:
      return faker.number.float({ min: 0, max: 10, fractionDigits: 1 });
  }
}

function generateAnalysisItems(
  roastId: string,
  verdict: string,
): Array<{
  id: string;
  roast_id: string;
  severity: "critical" | "warning" | "good";
  title: string;
  description: string;
  item_order: number;
}> {
  const items: Array<{
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
  }> = [];

  const criticalCount =
    verdict === "needs_serious_help"
      ? faker.number.int({ min: 2, max: 4 })
      : verdict === "rough_around_edges"
        ? faker.number.int({ min: 1, max: 2 })
        : 0;

  const warningCount =
    verdict === "needs_serious_help"
      ? faker.number.int({ min: 1, max: 2 })
      : verdict === "rough_around_edges"
        ? faker.number.int({ min: 2, max: 3 })
        : verdict === "decent_code"
          ? faker.number.int({ min: 1, max: 2 })
          : 0;

  const goodCount =
    verdict === "exceptional"
      ? faker.number.int({ min: 3, max: 5 })
      : verdict === "solid_work"
        ? faker.number.int({ min: 2, max: 4 })
        : verdict === "decent_code"
          ? faker.number.int({ min: 1, max: 2 })
          : 0;

  for (let i = 0; i < criticalCount; i++) {
    items.push({
      severity: "critical",
      title: faker.helpers.arrayElement(ANALYSIS_TITLES.critical),
      description: faker.lorem.sentence(),
    });
  }

  for (let i = 0; i < warningCount; i++) {
    items.push({
      severity: "warning",
      title: faker.helpers.arrayElement(ANALYSIS_TITLES.warning),
      description: faker.lorem.sentence(),
    });
  }

  for (let i = 0; i < goodCount; i++) {
    items.push({
      severity: "good",
      title: faker.helpers.arrayElement(ANALYSIS_TITLES.good),
      description: faker.lorem.sentence(),
    });
  }

  return items.map((item, index) => ({
    id: faker.string.uuid(),
    roast_id: roastId,
    severity: item.severity,
    title: item.title,
    description: item.description,
    item_order: index,
  }));
}

async function seed() {
  console.log("🌱 Starting seed...");

  await query("DELETE FROM analysis_items");
  await query("DELETE FROM roasts");
  console.log("🗑️  Cleared existing data");

  const roastCount = 100;

  for (let i = 0; i < roastCount; i++) {
    const language = faker.helpers.arrayElement(LANGUAGES);
    const verdict = faker.helpers.arrayElement(VERDICTS);
    const score = getScoreFromVerdict(verdict);
    const roastMode = faker.datatype.boolean();
    const code = faker.helpers.arrayElement(
      CODE_TEMPLATES[language] || CODE_TEMPLATES.javascript,
    );
    const lineCount = code.split("\n").length;
    const roastId = faker.string.uuid();
    const roastQuote = faker.helpers.arrayElement(
      ROAST_QUOTES[verdict as keyof typeof ROAST_QUOTES],
    );
    const suggestedFix = faker.helpers.arrayElement(SUGGESTED_FIX_TEMPLATES);
    const daysAgo = faker.number.int({ min: 1, max: 90 });

    await query(
      `INSERT INTO roasts (id, code, language, line_count, roast_mode, score, verdict, roast_quote, suggested_fix, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() - INTERVAL '${daysAgo} days')`,
      [
        roastId,
        code,
        language,
        lineCount,
        roastMode,
        score,
        verdict,
        roastQuote,
        suggestedFix,
      ],
    );

    const analysisItems = generateAnalysisItems(roastId, verdict);

    for (const item of analysisItems) {
      await query(
        `INSERT INTO analysis_items (id, roast_id, severity, title, description, "order")
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          item.id,
          item.roast_id,
          item.severity,
          item.title,
          item.description,
          item.item_order,
        ],
      );
    }

    if ((i + 1) % 10 === 0) {
      console.log(`✅ Created ${i + 1} roasts...`);
    }
  }

  const result = await query<{ count: string }>(
    "SELECT COUNT(*) as count FROM roasts",
  );
  console.log(`🎉 Seed completed! Total roasts: ${result[0]?.count || 0}`);
  console.log(`📊 Verdict distribution:`);

  const distribution = await query<{ verdict: string; count: string }>(
    "SELECT verdict, COUNT(*) as count FROM roasts GROUP BY verdict ORDER BY count DESC",
  );

  for (const row of distribution) {
    console.log(`   ${row.verdict}: ${row.count}`);
  }

  await pool.end();
}

seed()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
