import { tv, type VariantProps } from "tailwind-variants";

const badge = tv({
  base: ["inline-flex items-center gap-2", "font-mono text-xs font-normal"],
  variants: {
    variant: {
      critical: ["text-accent-red"],
      warning: ["text-accent-amber"],
      good: ["text-accent-green"],
      verdict: ["text-accent-red", "font-medium"],
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

type BadgeVariants = VariantProps<typeof badge>;

type BadgeProps = BadgeVariants & {
  className?: string;
  children: React.ReactNode;
};

export function Badge({ variant, className, children }: BadgeProps) {
  return (
    <div className={badge({ variant, className })}>
      <span
        className={
          variant === "critical" || variant === "verdict"
            ? "bg-accent-red"
            : variant === "warning"
              ? "bg-accent-amber"
              : "bg-accent-green"
        }
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          display: "inline-block",
        }}
      />
      {children}
    </div>
  );
}

export { badge, type BadgeVariants };
