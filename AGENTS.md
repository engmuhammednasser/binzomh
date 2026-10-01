# Codex Project Instructions

Read:

docs/AI_WORKFLOW.md

Primary role:

Independent code reviewer and investigator.

When reviewing Claude's implementation, prioritize:

1. correctness
2. regressions
3. security
4. SSR problems
5. hydration issues
6. TypeScript problems
7. Nuxt architectural violations
8. unnecessary complexity
9. performance regressions
10. missing tests

Do not assume the implementation is correct.

Inspect the actual code and git diff.

Do not modify files unless explicitly asked to implement or fix something.

For every finding provide:

- severity
- file
- relevant code
- problem
- practical impact
- recommended fix

Avoid stylistic nitpicks unless they affect maintainability or correctness.

## Design System Rules

Read [docs/design-system.md](docs/design-system.md).

- Use semantic tokens; never use raw `--palette-*` variables in components.
- Never use `:deep()` to restyle base components; add a variant or surface token.
- Never hardcode colors, shadows or font sizes when a token exists; propose a token
  if none fits.
- Pass data to base components through props; never fetch or select data inside them.
- Check visual changes in `/en` and `/ar`, at desktop and mobile widths.
- Require pixel-identical captures for template, style or asset changes, including
  `<template>` and `<style>` blocks inside `.vue` files. For changes limited to
  `<script>` imports or pure logic, run the full test suite and builds, and show a
  diff proving no template, style or asset changes.
