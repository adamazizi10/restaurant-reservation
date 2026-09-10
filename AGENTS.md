# Agent Entry Point

Read this file before doing any work in this repository.

## Required Reading Order

1. Read `AGENTS.md` first.
2. Read `docs/PRODUCT_SPEC.md` for product scope.
3. Read `docs/BUSINESS_RULES.md` for business invariants.
4. Read `docs/ARCHITECTURE.md` for technology and system architecture.
5. Read `docs/DATABASE_RULES.md` before changing database design.
6. Read `docs/ENGINEERING_RULES.md` before coding.
7. Read `docs/ROADMAP.md` to determine current project and feature status.
8. Read `docs/LATER.md` before implementing anything that may be deferred.

## Scope Control

Implement only the feature or project part explicitly requested by the user.
Do not look ahead in `docs/ROADMAP.md` and implement future features simply because they are planned.
Do not implement `docs/LATER.md` items during V1.

Keep implementations simple. Do not add infrastructure without a current requirement. Do not use an ORM. Do not add Redis, queues, workers, Docker, microservices, or speculative abstractions unless a later explicit requirement proves they are needed.

## User Action Required

If work requires something the user must personally configure, stop and say exactly what is needed.

Use this format:

```text
USER ACTION REQUIRED

Where:
Supabase Dashboard -> [exact relevant location]

Do:
[short exact instructions]

Environment variable:
VARIABLE_NAME=...

Then:
[what to run or do next]
```

Never invent credentials. Never commit secret values. Never silently skip work that requires user action.

## Completion Rules

Update `docs/ROADMAP.md` after completing requested work. Do not mark something `DONE` unless it is actually complete. Run reasonable validation, typecheck, lint, or build checks before marking work `DONE`.

Never use the word prohibited by `docs/ENGINEERING_RULES.md` to describe customer groups in UI, source code, API names, database names, or documentation.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
