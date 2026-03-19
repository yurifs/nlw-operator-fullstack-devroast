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
