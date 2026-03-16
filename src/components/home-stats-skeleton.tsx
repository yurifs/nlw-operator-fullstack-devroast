export function HomeStatsSkeleton() {
  return (
    <section className="w-full flex items-center justify-center gap-6 text-text-tertiary text-xs mb-8">
      <span className="bg-bg-elevated animate-pulse rounded w-20 h-4" />
      <span>·</span>
      <span className="bg-bg-elevated animate-pulse rounded w-24 h-4" />
    </section>
  );
}
