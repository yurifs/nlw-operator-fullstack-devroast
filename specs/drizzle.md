# Drizzle ORM - Specification

> Spec de implementação do banco de dados para o DevRoast usando Drizzle ORM + PostgreSQL + Docker Compose.

## Contexto

O DevRoast é um analisador de qualidade de código que da uma nota de 0 a 10. O usuário cola um trecho de código, opcionalmente ativa o "roast mode", e recebe:

- **Score** (0-10, decimal)
- **Verdict** (enum: `needs_serious_help`, `rough_around_edges`, `decent_code`, `solidwork`, `exceptional`)
- **Roast quote** (frase sarcástica gerada por IA)
- **Analysis items** (lista de findings com severidade `critical`, `warning` ou `good`)
- **Suggested fix** (diff do código original para o melhorado)

Submissões são **anonimas** - sem autenticação. Toda submissão entra automaticamente no **shame leaderboard** (sem opt-in).

A IA será integrada via **Vercel AI SDK** (provider-agnostico).

---

## Stack do banco

| Camada     | Tecnologia                  |
| ---------- | --------------------------- |
| ORM        | Drizzle ORM (`drizzle-orm`) |
| Migrations | Drizzle Kit (`drizzle-kit`) |
| Driver     | `postgres` (node-postgres)  |
| Banco      | PostgreSQL 16               |
| Container  | Docker Compose              |

---

## Enums

```typescript
// src/db/schema.ts

import { pgEnum } from "drizzle-orm/pg-core";

export const verdictEnum = pgEnum("verdict", [
  "needs_serious_help", // score 0-2
  "rough_around_edges", // score 2.1-4
  "decent_code", // score 4.1-6
  "solid_work", // score 6.1-8
  "exceptional", // score 8.1-10
]);

export const severityEnum = pgEnum("severity", [
  "critical", // vermelho - problema grave
  "warning", // amarelo - pode melhorar
  "good", // verde - ponto positivo
]);
```

## Tabelas

### `roasts`

Tabela principal. Cada row é uma submissão de código analisada.

| Coluna          | Tipo                      | Descrição                                           |
| --------------- | ------------------------- | --------------------------------------------------- |
| `id`            | `uuid` PK default random  | Identificador único do roast                        |
| `code`          | `text` NOT NULL           | Código fonte submetido pelo usuário                 |
| `language`      | `varchar(50)` NOT NULL    | Linguagem detectada ou informada (ex: `javascript`) |
| `line_count`    | `integer` NOT NULL        | Quantidade de linhas do código                      |
| `roast_mode`    | `boolean` default `false` | Se o usuário ativou o modo sarcasmo                 |
| `score`         | `real` NOT NULL           | Nota de 0 a 10 (ex: `3.5`)                          |
| `verdict`       | `verdict` NOT NULL        | Enum do veredito baseado no score                   |
| `roast_quote`   | `text`                    | Frase sarcástica gerada pela IA                     |
| `suggested_fix` | `text`                    | Código melhorado (diff/versão completa)             |
| `created_at`    | `timestamp with tz`       | Data de criação, default `now()`                    |

```typescript
import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  real,
  timestamp,
} from "drizzle-orm/pg-core";

export const roasts = pgTable("roasts", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  lineCount: integer("line_count").notNull(),
  roastMode: boolean("roast_mode").default(false).notNull(),
  score: real("score").notNull(),
  verdict: verdictEnum("verdict").notNull(),
  roastQuote: text("roast_quote"),
  suggestedFix: text("suggested_fix"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
```

### `analysis_items`

Cada finding da analise detalhada. Relacionada N:1 com `roasts`.

| Coluna        | Tipo                     | Descrição                                   |
| ------------- | ------------------------ | ------------------------------------------- |
| `id`          | `uuid` PK default random | Identificador único do item                 |
| `roast_id`    | `uuid` FK -> roasts.id   | Roast ao Qual pertence                      |
| `severity`    | `severity` NOT NULL      | Nível de severidade (critical/warning/good) |
| `title`       | `varchar(200)` NOT NULL  | Título curto do finding                     |
| `description` | `text` NOT NULL          | Explicação detalhada                        |
| `order`       | `integer` NOT NULL       | Ordem de exibição (0-indexed)               |

```typescript
export const analysisItems = pgTable("analysis_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  roastId: uuid("roast_id")
    .references(() => roasts.id, { onDelete: "cascade" })
    .notNull(),
  severity: severityEnum("severity").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
});
```

### Relações (Drizzle `relations`)

```typescript
import { relations } from "drizzle-orm";

export const roastRelations = relations(
  roasts,
  ({ many } => {
    analysisItems: many(analysisItems),
  }),
);

export const analysisItemsRelations = relations(analysisItems, ({ one }) => ({
  roast: one(roasts, {
    fields: [analysisItems.roastId],
    references: [roasts.id],
  }),
}));
```

---

## Índices

```typescript
import { index } from "drizzle-orm/pg-core";

// Na definição de roasts, adicionar:
// - Index para leaderboard (score ASC, para buscar os piores primeiro)
// - Index para listagem cronológica

export const roasts = pgTable(
  "roasts",
  {
    // ... colunas acima
  },
  (table) => [
    index("roasts_score_idx").on(table.score),
    index("roasts_created_at_idx").on(table.createdAt),
  ],
);

// Na definição de analysis_items:
export const analysisItems = pgTable(
  "analysis_items",
  {
    // ... colunas acima
  },
  (table) => [index("analysis_items_roast_id_idx").on(table.roastId)],
);
```

---

## Estrutura de arquivos

```
src/
  db/
    index.ts        # Conexão com o banco (drizzle client)
    schema.ts       # Enums, tabelas, relações e índices
docker-compose.yml  # gostgreSQL container
drizzle.config.ts   # Config do Drizzle Kit
.env.local          # Variável DATABASE_URL (gitignored)
```

---

## Arquivos de configuração

### `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    volumes:
      - devroast_pgdata:/var/lib/postgresql/data

volumes:
  devroast_pgdata:
```

### `.env.local`

```
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

### `drizzle.config.ts`

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### `src/db/index.ts`

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
```

---

## scripts npm

Adicionar ao `package.json`

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## Dependências

### Produção

```bash
pnpm add drizzle-orm pg
```

### Desenvolvimento

```bash
pnpm add -D drizzle-kit @types/pg
```

---

## Queries esperadas

### Leaderboard (shame ranking)

```typescript
// Top N piores scores para o leaderboard
const leaderboard = await db
  .select()
  .from(roasts)
  .orderBy(roasts.score)
  .limit(20);
```

### Roast completo por ID (página de resultado)

```typescript
// Buscar roast + analysis items para a tela de resultado
const result = await db.query.roasts.findFirst({
  where: eq(roasts.id, roastId),
  with: {
    analysisItems: {
      orderBy: [analysisItems.order],
    },
  },
});
```

### Stats globais (footer)

```typescript
// Total de submissões e média de score
const stats = await db
  .select({
    totalRoasts: count(),
    avgScore: avg(roasts.score),
  })
  .from(roasts);
```

### Inserir novo roast (apos resposta da IA)

```typescript
// Inserir roast + analysis items em transaction
await db.transaction(async (tx) => {
  const [roast] = await tx
    .insert(roasts)
    .values({
      code,
      language,
      lineCount,
      roastMode,
      score,
      verdict,
      roastQuote,
      suggestedFix,
    })
    .returning();

  await tx.insert(analysisItems).values(
    items.map((item, index) => ({
      roastId: roast.id,
      severity: item.severity,
      title: item.title,
      description: item.description,
      order: index,
    })),
  );

  return roast;
});
```

---

## Diagrama ER

```
|--------------------------|
|         roasts          |
|--------------------------|
| id          uuid PK      |
| code        text         |
| language    varchar(50)  |
| line_count  integer      |
| roast_mode  boolean       |
| score       real          |
| verdict     verdict (enum)|
| roast_quote text          |
| suggested_fix text        |
| created_at    timestamptz |
|---------------------------|
              |
              | 1
              |
              | N
              |
|-----------------------------|
|       analysis_items       |
|-----------------------------|
| id          uuid PK         |
| roast_id    uuid FK         |
| severity    severity (enum) |
| title       varchar(200)    |
| description text            |
| order       integer         |
|-----------------------------|
```

---

## To-do de implementação

- [x] Criar `docker-compose.yml` na raiz do projeto
- [x] Instalar dependências (`drizzle-orm`, `pg`, `drizzle-kit`, `@types/pg`)
- [x] Criar `.env.local` com `DATABASE_URL`
- [x] Criar `drizzle.config.ts` na raiz
- [x] Criar `src/db/schema.ts` com enums, tabelas, relações e índices
- [x] Criar `src/db/index.ts` com o client do Drizzle
- [x] Adicionar scripts `db:generate`, `db:migrate`, `db:push`, `db:studio` ao `package.json`
- [ ] Subir o container: `docker compose up -d` (Docker não está rodando nesta máquina)
- [x] Gerar a primeira migration: `pnpm db:generate`
- [ ] Aplicar migration: `pnpm db:migrate` (após subir o container)
- [ ] Validar schema no Drizzle Studio: `pnpm db:studio` (após aplicar migration)
- [x] Adicionar `docker-compose.yml` e `drizzle/` ao `.gitignore` se necessário (drizzle/ committado, docker-compose.yml útil para outros devs)
