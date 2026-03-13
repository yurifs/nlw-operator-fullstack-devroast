import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between h-14 px-10 border-b border-border-primary bg-bg-page">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-accent-green font-mono text-xl font-bold">
          &gt;
        </span>
        <span className="text-text-primary font-mono text-lg font-medium">
          devroast
        </span>
      </Link>
      <Link
        href="/leaderboard"
        className="text-text-secondary font-mono text-sm hover:text-text-primary transition-colors"
      >
        leaderboard
      </Link>
    </nav>
  );
}
