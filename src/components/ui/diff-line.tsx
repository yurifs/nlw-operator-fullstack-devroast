import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv({
  base: ["font-mono text-sm", "flex gap-2 px-4 py-2"],
  variants: {
    type: {
      removed: ["bg-[#1A0A0A]", "text-text-secondary"],
      added: ["bg-[#0A1A0F]", "text-text-primary"],
      context: ["text-text-tertiary"],
    },
  },
  defaultVariants: {
    type: "context",
  },
});

type DiffLineVariants = VariantProps<typeof diffLine>;

type DiffLineProps = DiffLineVariants & {
  className?: string;
  code: string;
};

const prefixMap = {
  removed: "-",
  added: "+",
  context: " ",
} as const;

export function DiffLine({ type = "context", className, code }: DiffLineProps) {
  return (
    <div className={diffLine({ type, className })}>
      <span
        className={
          type === "removed"
            ? "text-accent-red"
            : type === "added"
              ? "text-accent-green"
              : "text-text-tertiary"
        }
      >
        {prefixMap[type]}
      </span>
      <span className="flex-1">{code}</span>
    </div>
  );
}

export { diffLine, type DiffLineVariants };
