# Specs

Specs are written **before implementation** to research, decide, and document how a feature will be built.

## File format

- **Name:** `kebab-case.md` describing the feature (e.g. `drizzle.md`, `code-editor-syntax-highlight.md`)
- **Language:** Portuguese for prose, English for code

## Required sections

```markdown
# Spec: <Feature Name>

## Resumo

Uma ou duas frases descrevendo o que será feito e por que.

## Pesquisa realizada

Tabelas comparativas de abordagens, bibliotecas ou ferramentas avaliadas.
Cada tabela deve ter coluna de **Veredicto** com a decisão.

## Decisão

Arquitetura escolhida com justificativa. Diagramas ASCII quando útil.

## Especificação de implementação

- Componentes/arquivos a criar ou modificar
- APIs e assinaturas de funções (pseudocódigo TypeScript)
- Detalhes técnicos relevantes (CSS, performance, etc.)

## Dependências novas

Tabela com pacote, motivo e estimativa de bundle.
Omitir se não houver dependências novas.

## Riscos e considerações

Lista numerada de riscos com estratégias de mitigação.

## TODOs de implementação

Checklist com `- [ ]` de cada passo na ordem de execução.
Marcar com `- [x]` conforme implementado.
```

## Guidelines

- Specs are **living documents** - update TODOs as implementation progresses
- Include **bundle size estimates** when adding client-side dependencies
- Use **tables** for comparing alternatives (keeps decisions traceable)
- Code blocks are **pseudocode** - enough detail to guide implementation, not final code
