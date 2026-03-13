# UI Components - Padrões de Criação

Guia de referência para manter consistência ao criar novos componentes na pasta `src/components/ui`.

## Regras gerais

1. **Named exports apenas** - nunca use `export default`.
2. **Exporte o componente, a função de variantes (`tv`), e os tipos** para permitir reuso e composição.
3. **Estenda as props nativas do HTML** usando `ComponentProps<"elemento">` do React.
4. **Não declare `className` manualmente no tipo** - ela já vem de `ComponentProps`.
5. **Um arquivo por componente** - nomeie o arquivo em kebab-case (ex: `button.tsx`, `text-field.tsx`).

## Estilização

## Tailwind Variants (`tv`)

Use `tailwind-variants` para definir todas as variantes do componente:

```tsx
import { tv, type VariantProps } from "tailwind-variants";

const component = tv({
  base: [...],
  variants: {
    variant: { ... },
    size: { ... },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
```

### Merge de classes

**Não use `twMerge` diretamente** O `tailwind-variants` já faz merge internamente.
Passe `className` como propriedade na chamada de função `tv`:

```tsx
export function Component({
  variant,
  size,
  className,
  ...props
}: ComponentNameProps) {
  return <div className={component({ variant, size, className })} {...props} />;
}
```

### Cores do Tema

Todas as cores vêm de variáveis definidas em `@theme` no `globals.css`. Use as classes do Tailwind diretamente:

```
bg-accent-green     // fundo verde
text-text-primary  // texto primário
border-border-primary // borda
```

### Variáveis Personalizadas

Para valores inline dinâmicos, use `var()`:

```tsx
style={{ stroke: "var(--color-border-primary)" }}
```

### Cores Padrão do Tailwind

Para cores que não estão no tema, use as classes canônicas:
- `text-white`, `text-black`
- `bg-red-500`, `bg-blue-600`

### Fontes

Use as classes utilitárias nativas do Tailwind:

- `font-mono` - JetBrains Mono (monospace) - definido via `--font-mono` no globals.css
- `font-sans` - Fonte padrão do sistema (sans-serif) - já vem com Tailwind

## Estrutura do componente

```tsx
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

// 1. Definir variantes com tv()
const myComponent = tv({
  base: [...],
  variants: [...],
  defaultVariants: [...],
});

// 2. Extrair tipo das variantes
type MyComponentVariants = VariantProps<typeof myComponent>;

// 3. Combinar com props nativas do elemento HTML
type MyComponentProps = ComponentProps<"div"> & MyComponentVariants;

// 4. Implementar o componente
function MyComponent({ variant, size, className, ...props }: MyComponentProps) {
  return (
    <div className={myComponent({ variant, size, className })} { ...props } />
  );
}

// 5. Named exports de tudo
export {
  MyComponent,
  myComponent,
  type MyComponentProps,
  type MyComponentVariants,
}
```

## Checklist para novos componentes

- [ ] Arquivo em kebab-case dentro de `src/components/ui`
- [ ] Named exports (componentes, função tv, tipos)
- [ ] Props nativas estendidas via `ComponentProps<"elemento">`
- [ ] Variantes definidas com `tailwind-variants`
- [ ] `className` passado via `tv({ ..., className })` (sem `twMerge`)
- [ ] Classes do Tailwind do tema (bg-accent-green, text-text-primary, etc)
- [ ] Cores canônicas do Tailwind para cores padrão (white, black, red, etc)
- [ ] Fontes nativas: `font-mono` ou `font-sans`
- [ ] Sem cores hex hardcoded
- [ ] Sem `export default`
- [ ] Adicionar variante na página de exemplos (`/components`)

## Server Components

Para componentes que não precisam de interactivity (como CodeBlock), crie como Server Component:

```tsx
export async function CodeBlock({ code, language }: CodeBlockProps) {
  const html = await codeToHtml(code, { lang: language, theme: "vesper" });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

Use `// biome-ignore lint/security/noDangerouslySetInnerHtml` para justificar o uso com bibliotecas confiáveis como shiki.

## Base UI

Para componentes com comportamento (Toggle, etc), use `@base-ui/react`:

```tsx
"use client";
import { useState } from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
```

Use `"use client"` no topo do arquivo para componentes que precisam de estado.
