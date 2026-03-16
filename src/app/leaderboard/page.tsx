import {
  CodeBlockCodeArea,
  CodeBlockHeaderMetaContainer,
  CodeBlockHeaderMetaLanguage,
  CodeBlockHeaderMetaLineCount,
  CodeBlockHeaderMetaRank,
  CodeBlockHeaderMetaScore,
  CodeBlockRoot,
} from "@/components/ui/code-block";

const LEADERBOARD_DATA = [
  {
    rank: 1,
    score: 1.2,
    code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
    language: "javascript",
    lineCount: 3,
  },
  {
    rank: 2,
    score: 1.8,
    code: `if (x == true) { return true; }
else if (x == false) { return false; }
else { return !false; }`,
    language: "typescript",
    lineCount: 3,
  },
  {
    rank: 3,
    score: 2.1,
    code: `SELECT * FROM users WHERE 1=1
-- TODO: add authentication`,
    language: "sql",
    lineCount: 2,
  },
  {
    rank: 4,
    score: 2.4,
    code: `function foo() {
  return foo();
}`,
    language: "javascript",
    lineCount: 3,
  },
  {
    rank: 5,
    score: 2.8,
    code: `var x = 1;
var y = 2;
var z = 3;`,
    language: "javascript",
    lineCount: 3,
  },
  {
    rank: 6,
    score: 3.1,
    code: `while (true) {
  console.log('ok');
}`,
    language: "javascript",
    lineCount: 3,
  },
  {
    rank: 7,
    score: 3.5,
    code: `try {
  // code here
} catch { }`,
    language: "javascript",
    lineCount: 3,
  },
  {
    rank: 8,
    score: 3.9,
    code: `const arr = new Array(1000).fill(0);`,
    language: "javascript",
    lineCount: 1,
  },
  {
    rank: 9,
    score: 4.2,
    code: `for (let i = 0; i < 10000; i++) {
  console.log(i);
}`,
    language: "javascript",
    lineCount: 3,
  },
  {
    rank: 10,
    score: 4.7,
    code: `function hack() {
  eval(atob('aHR0cDovL2N1c3RvbS5kZWY='));
}`,
    language: "javascript",
    lineCount: 3,
  },
];

export const metadata = {
  title: "Shame Leaderboard | DevRoast",
  description: "The most roasted code on the internet - ranked by shame",
};

export default function LeaderboardPage() {
  const totalRoasts = 2847;
  const avgScore = 4.2;

  return (
    <main className="flex flex-col items-center min-h-screen bg-bg-page">
      <section className="flex flex-col gap-10 w-full max-w-[1280px] px-20 py-10">
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
              {`${totalRoasts.toLocaleString()} submissions`}
            </span>
            <span className="text-text-tertiary text-xs">·</span>
            <span className="text-text-tertiary text-xs">
              {`avg score: ${avgScore}/10`}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {LEADERBOARD_DATA.map((entry) => (
            <div key={entry.rank} className="border border-border-primary">
              <CodeBlockRoot>
                <CodeBlockHeaderMetaContainer>
                  <div className="flex items-center gap-4">
                    <CodeBlockHeaderMetaRank rank={entry.rank} />
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
                <CodeBlockCodeArea
                  code={entry.code}
                  language={entry.language}
                />
              </CodeBlockRoot>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
