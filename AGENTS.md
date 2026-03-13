# DevRoast - Project Patterns

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 with `@theme` variables
- **Linting:** Biome
- **Package manager:** pnpm

## Conventions

- **Language:** Portuguese for communication, English for code
- **Exports:** Always named exports. Never `export default`
- **Components:** Use composition pattern with sub-components (Root, Title, etc.)
- **Class merging:** Use `tv()` for variants, `twMerge()` for simple merges
- **Colors:** Defined in `@theme`, use canonical Tailwind classes
- **Fonts:** `font-sans` (system), `font-mono` (JetBrains Mono)

## Project Structure

```
src/
  app/                    # Next.js pages
  components/             # Feature-specific components
    ui/                  # Reusable UI primitives
  components/ui/AGENTS.md  # Component patterns
```

## Key Patterns

- UI components use composition pattern (Root, Sub, etc.)
- Server components for static rendering (CodeBlock)
- Client components for interactivity (Toggle, CodeEditor)
