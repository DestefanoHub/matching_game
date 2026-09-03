# Agent Guidance

## Project overview

- React and TypeScript application for a matching game.
- Source code is under `src/`.
- Reusable UI components are organized under `src/components/`.
- Redux state logic is under `src/store/`.
- Shared hooks and utilities are under `src/utils/`.

## Conventions

- Use TypeScript and existing React component patterns.
- Use React Router for navigation.
- Use Redux selectors and dispatch hooks from `src/utils/hooks`.
- Use SCSS modules for component styling.
- Preserve existing formatting and naming conventions.
- Prefer existing components and store actions before introducing new abstractions.
- Keep account/session behavior centralized in the session store and related account components.

## Validation

- Inspect `package.json` for the available scripts before running checks.
- Run the project’s existing lint, type-check, and test commands after changes.
- Do not modify generated files or dependencies unless required.

## Change scope

- Make focused changes relevant to the requested task.
- Update tests when behavior changes.
- Preserve accessibility attributes and semantic HTML in UI changes.