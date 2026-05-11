# AGENTS.md — Remindler

## Project Overview

Remindler is a TypeScript monorepo managed with pnpm workspaces.

The repository is intentionally minimal. Avoid adding orchestration tools, frameworks, or
abstractions unless there is a concrete need.

## Product Vision

Remindler is a personal daily-life management application for individuals, not businesses.

The goal is to help users reduce mental load by giving them one simple place to capture,
organize, remember, and follow the small things that matter in everyday life.

The product should feel like a personal cockpit for daily life. It brings together quick notes,
tasks, reminders, shopping, expenses, budget tracking, ideas, wishlist items, and household
obligations without asking the user to build a complex system.

The core product loop is:

```text
capture -> organize -> remind -> follow
```

The central experience starts with a quick capture flow. A user can write a natural sentence such as:

```text
Acheter du lait demain
Dépense 18€ kebab hier
Idée : app pour gérer les patrons de couture
Penser à prendre RDV chez le vétérinaire
```

The application should keep the raw capture as an `InboxItem`, then help the user classify and
convert it into the right kind of object: task, expense, shopping item, idea, wishlist item, or
household item.

For V1, classification is semi-manual. The app does not need AI. The priority is to build a solid,
persistent inbox and a guided flow that lets the user capture quickly and organize later.

The product should be opinionated, simple, and guided. It should not feel like a database, a Notion
clone, a pure todo app, a pure budget app, or a pure notes app. Its value comes from connecting daily
life domains that are usually split across many apps.

## Workspace Structure

```text
apps/
  api/      # Backend entrypoint and runtime wiring
  web/      # Frontend app

packages/
  domain/   # Pure business domain
  shared/   # Shared technical contracts/types only when truly needed
```

## Package Policy

All workspace packages are private and are not intended to be published to npm.

Do not add package versions unless there is a concrete reason. Prefer internal dependencies with:

```json
"@remindler/domain": "workspace:*"
```

## Architecture

The project should move toward hexagonal architecture.

Keep the domain independent from apps and infrastructure:

- `packages/domain` contains pure business concepts and rules
- `apps/api` contains HTTP/runtime wiring and infrastructure implementations
- `apps/web` contains frontend UI and frontend-specific logic
- `packages/shared` must not become a catch-all; only put code there when it is genuinely shared

Avoid importing from apps inside packages.

## TypeScript

Use the shared root `tsconfig.base.json` for common compiler options.

Each workspace may define its own local alias:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

Do not add a root-level `@/* -> src/*` alias.

## Commands

Use pnpm for all scripts.

Run verification in this order:

```bash
pnpm lint
pnpm test
pnpm build
```

## Collaboration Workflow

Work step by step.

For meaningful architecture, product, or implementation changes, validate each step before moving
to the next one. Do not jump directly into large changes without first stating the immediate next
step and confirming it when the user expects staged work.

## Testing

Use Vitest.

Test files must live in a `__tests__` folder at the same level as the file under test and be named
`*.spec.ts`.
