import { tv, type VariantProps } from "tailwind-variants";

const analysisCard = tv({
  base: ["border border-border-primary", "p-5", "flex flex-col gap-3"],
  variants: {
    variant: {
      critical: [],
      warning: [],
      good: [],
    },
  },
  defaultVariants: {
    variant: "critical",
  },
});

const severityDot = tv({
  base: ["w-2 h-2 rounded-full"],
  variants: {
    variant: {
      critical: ["bg-accent-red"],
      warning: ["bg-accent-amber"],
      good: ["bg-accent-green"],
    },
  },
  defaultVariants: {
    variant: "critical",
  },
});

const severityTitle = tv({
  base: ["font-mono text-xs"],
  variants: {
    variant: {
      critical: ["text-accent-red"],
      warning: ["text-accent-amber"],
      good: ["text-accent-green"],
    },
  },
  defaultVariants: {
    variant: "critical",
  },
});

type AnalysisCardVariants = VariantProps<typeof analysisCard>;

interface AnalysisCardRootProps extends AnalysisCardVariants {
  className?: string;
  children?: React.ReactNode;
}

function AnalysisCardRoot({
  variant,
  className,
  children,
}: AnalysisCardRootProps) {
  return <div className={analysisCard({ variant, className })}>{children}</div>;
}

interface AnalysisCardLabelProps extends VariantProps<typeof severityDot> {
  className?: string;
  children?: React.ReactNode;
}

function AnalysisCardLabel({
  variant,
  className,
  children,
}: AnalysisCardLabelProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className={severityDot({ variant })} />
      <span className={`font-mono text-xs ${severityTitle({ variant })}`}>
        {children}
      </span>
    </div>
  );
}

interface AnalysisCardTitleProps {
  className?: string;
  children?: React.ReactNode;
}

function AnalysisCardTitle({ className, children }: AnalysisCardTitleProps) {
  return (
    <p className={`font-mono text-sm text-text-primary ${className ?? ""}`}>
      {children}
    </p>
  );
}

interface AnalysisCardDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

function AnalysisCardDescription({
  className,
  children,
}: AnalysisCardDescriptionProps) {
  return (
    <p
      className={`font-mono text-xs text-text-secondary leading-relaxed ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

export {
  analysisCard,
  AnalysisCardRoot,
  AnalysisCardLabel,
  AnalysisCardTitle,
  AnalysisCardDescription,
};

export type {
  AnalysisCardVariants,
  AnalysisCardRootProps,
  AnalysisCardLabelProps,
  AnalysisCardTitleProps,
  AnalysisCardDescriptionProps,
};
