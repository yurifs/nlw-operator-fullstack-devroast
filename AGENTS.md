# DevRoast - Project Patterns

## Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Biome (lint/format)
- shiki (syntax highlighting)
- @base-ui/react

## UI Components (`src/components/ui/`)
- Composition pattern: `ComponentRoot`, `ComponentSub`, etc.
- Named exports only
- Tailwind v4 classes directly
- CSS variables via `@theme` in `globals.css`

## Component Structure
```tsx
// src/components/ui/example.tsx
import { tv } from "tailwind-variants";

const example = tv({
  base: [...],
  variants: {...},
});

function ExampleRoot({ children, className }) {
  return <div className={example({ className })}>{children}</div>;
}

function ExampleSub({ className, children }) {
  return <span className={className}>{children}</span>;
}

export const Example = Object.assign(ExampleRoot, { Sub: ExampleSub });
```

## Pages
- Layout: `src/app/layout.tsx` (includes Navbar)
- Home: `src/app/page.tsx`
- Components demo: `src/app/components/page.tsx`
