import { tv, type VariantProps } from "tailwind-variants";

const analysisCard = tv({
  base: [
    "rounded-md border border-border-primary",
    "p-5",
    "flex flex-col gap-3",
  ],
  variants: {
    variant: {
      critical: ["border-accent-red/30"],
      warning: ["border-accent-amber/30"],
      good: ["border-accent-green/30"],
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

interface AnalysisCardLabelProps {
  className?: string;
  children?: React.ReactNode;
}

function AnalysisCardLabel({ className, children }: AnalysisCardLabelProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      {children}
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
