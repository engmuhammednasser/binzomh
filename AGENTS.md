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