# AGENTS.md — Remindler

## Project Overview

Remindler is a TypeScript monorepo managed with pnpm workspaces.

The repository is intentionally minimal. Avoid adding orchestration tools, frameworks, or
abstractions unless there is a concrete need.

## Product Vision

Remindler is a family and home organization application for couples, families, shared homes,
and roommates.

The goal is to reduce domestic mental load by making it clear what needs to be done, who is
responsible for it, when it is due, and what its current status is.

V1 must focus on domestic task management. It should not include budgeting, wishlists, detailed
shopping lists, document management, or broad personal knowledge management. These modules may be
added later, but they are not part of the initial product foundation.

The core product loop is:

```text
house -> members -> tasks -> assignment -> due date -> status -> recurrence
```

The central experience starts with a house. A user can create a house, invite their partner
or family members, then plan and track everyday responsibilities such as:

```text
Sortir les poubelles
Faire les courses
Nettoyer la salle de bain
Appeler le vétérinaire
Payer une facture
Récupérer un colis
Changer les draps
Arroser les plantes
Gérer une démarche administrative
```

The application should be opinionated, simple, and guided. It should not feel like a database, a
Notion clone, a pure todo app, or a business task manager. Its value comes from helping the members
of a house share domestic responsibilities clearly and fairly.

The main product entities are:

- `User`: an application user
- `House`: a home, couple, family, or shared living group
- `HouseMember`: a user's membership in a house, with a role
- `HouseTask`: a domestic task linked to a house

The MVP task model should support:

- status: `todo`, `in_progress`, `done`, `cancelled`; `blocked` may be added if useful
- priority: `low`, `medium`, `high`
- category: `cleaning`, `shopping`, `admin`, `pet`, `health`, `maintenance`, `cooking`, `finance`,
  `other`
- one or more assignees
- optional due date
- simple recurrence: none, daily, weekly, monthly

The MVP must include:

- user authentication
- house creation
- invitation or addition of house members
- task creation
- task assignment to one or more members
- due dates
- priorities
- categories
- status changes
- a "Today" view
- an "All tasks" view
- filters by status, member, category, and date

The "Today" view is the primary screen. It should surface:

- my tasks due today
- house tasks due today
- overdue tasks
- unassigned tasks
- upcoming important tasks

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

Prefer `await` with `try`/`catch` for asynchronous control flow. Avoid `.then()` and `.catch()`
chains unless an API specifically requires promise chaining or the alternative would be less clear.

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
