# Engineering Rules

## General

- Use TypeScript.
- Keep code simple, readable, and feature-scoped.
- Do not add unnecessary abstractions.
- Do not prematurely optimize.
- Do not add caching, Redis, queues, workers, Docker, microservices, or orchestration infrastructure without a demonstrated requirement.
- Do not use an ORM.
- Use PostgreSQL/Supabase directly.

## Feature Workflow

Build one V1 feature at a time.

For each feature:

1. Mark the roadmap row `IN_PROGRESS`.
2. Read the relevant docs.
3. Define detailed requirements for only that feature.
4. Design only the database/API/UI needed for that feature.
5. Build frontend and backend together.
6. Add reasonable tests where they provide value.
7. Validate and fix.
8. Mark the feature `DONE` only when complete.

Do not implement the next feature until explicitly requested.

## Security And Data

- Validate untrusted input.
- Enforce authorization on the server.
- Preserve tenant isolation.
- Use database constraints for important invariants.
- Preserve timestamps.
- Never store raw Stripe card data.
- Keep server-only credentials out of browser code.

## Naming

Use descriptive names.

Do not use the prohibited customer-group term from the initial project prompt anywhere in UI, source code, variables, API names, database names, or documentation. Use:

- guest count
- number of guests
- group size

## Errors

Use consistent, user-appropriate error handling. Avoid leaking sensitive internal details to guests or restaurant staff.

## Hardening

Comprehensive hardening happens in Part 4 after V1 features are functionally complete. During V1 feature work, still implement reasonable correctness, validation, authorization, and tests for the feature being built.
