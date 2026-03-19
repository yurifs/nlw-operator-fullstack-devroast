# DevRoast

<p align="center">
  <strong>Paste seu código. Seja criticado.</strong>
</p>

<p align="center">
  A ferramenta de revisão de código que te diz exatamente quão ruim seu código é.
</p>

---

## O que é o DevRoast?

DevRoast é uma ferramenta de revisão de código que avalia seu código e te dá uma nota brutalmente honesta. Construído durante o NLW (Next Level Week) da [Rocketseat](https://www.rocketseat.com.br), ele combina análise estática com um toque de sarcasmo para te ajudar a melhorar suas habilidades de programação.

## Funcionalidades

- **Envio de Código** - Cole seu código e receba uma revisão instantânea
- **Pontuação Brutal** - Notas variam de 0-10, e sejamos honestos? A maioria não vai bem
- **Modo Roast** - Alterna entre feedback honesto e sarcasmo máximo
- **Leaderboard** - Veja o pior código da internet, ranqueado pela vergonha
- **Análise Detalhada** - Receba feedbacks específicos sobre o que está errado no seu código
- **Correções Sugeridas** - Veja como melhorar seu código com diff formatado
- **OpenGraph Images** - Imagens compartilháveis automáticas para redes sociais

## Tech Stack

- **Framework:** Next.js 16 (App Router, React Compiler, Turbopack)
- **API:** tRPC v11 + TanStack React Query v5
- **Database:** PostgreSQL 16 + Drizzle ORM
- **Styling:** Tailwind CSS v4 + tailwind-variants
- **Linting:** Biome
- **Image Generation:** Takumi (Rust-based OG images)
- **AI:** Groq API (LLM-powered code analysis)
- **Syntax Highlighting:** Shiki

## Como Funciona

1. Cole seu código no editor
2. Ative o "modo roast" para feedbacks mais picantes (opcional)
3. Clique em "roast_my_code"
4. Receba sua nota brutalmente honesta e análise

## Começando

```bash
# Clone o repositório
git clone <repo-url>

# Entre na pasta do projeto
cd devroast

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves:
# - DATABASE_URL (PostgreSQL connection string)
# - GROQ_API_KEY (Groq API key)

# Inicie o Docker Compose (PostgreSQL)
docker compose up -d

# Rode o servidor de desenvolvimento
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) para ver o DevRoast em ação.

## Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devroast"

# Groq API (obtenha em https://console.groq.com)
GROQ_API_KEY="gsk_..."

# URL base (para OG images)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Scripts

```bash
pnpm dev      # Servidor de desenvolvimento
pnpm build    # Build de produção
pnpm start    # Iniciar servidor de produção
pnpm lint     # Verificar código com Biome
pnpm typecheck # Verificar tipos TypeScript
pnpm db:push  # Push schema para o banco
pnpm db:seed  # Popular banco com dados de exemplo
```

## Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues e pull requests.

## Licença

MIT License - sinta-se livre para usar isso para suas próprias revisões de código brutais.

---

<p align="center">
  Construído com 🔥 durante o NLW pela <a href="https://www.rocketseat.com.br">Rocketseat</a>
</p>
