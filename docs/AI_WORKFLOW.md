# Engineering Rules

## Project

This is a Nuxt application.

Before changing code:
- Inspect the existing architecture.
- Follow existing conventions.
- Do not introduce new architectural patterns unnecessarily.
- Do not install new dependencies unless required.

## Nuxt

- Prefer Nuxt-native APIs and conventions.
- Respect SSR behavior.
- Do not access browser-only APIs during SSR without guards.
- Use composables for reusable application logic where appropriate.
- Keep components focused on presentation when possible.
- Keep server-side logic inside the appropriate server layer.
- Do not expose secrets through runtimeConfig.public.

## TypeScript

- Avoid `any` unless there is a justified reason.
- Preserve existing project types.
- Do not suppress TypeScript errors without understanding the cause.

## Security

Review changes for:

- XSS
- IDOR
- authorization bypass
- unsafe redirects
- exposed secrets
- unsafe server endpoints
- missing input validation
- client-controlled sensitive values
- insecure cookies or tokens

Never trust client-side validation for security-sensitive behavior.

## SSR

Check for:

- hydration mismatch
- browser APIs running server-side
- duplicated requests
- incorrect caching
- state leaking between SSR requests

## Performance

Avoid:

- unnecessary watchers
- unnecessary deep reactivity
- duplicate API requests
- oversized client bundles
- importing server-only code into client bundles
- unnecessary eager loading

## Dependencies

Do not add dependencies unless the existing stack cannot solve the problem cleanly.

Explain why a new dependency is needed before adding it.

## Testing

After relevant changes run the existing project verification commands.

At minimum verify:
- build
- typecheck if configured
- lint if configured
- relevant tests if configured

## Git

- Never commit automatically.
- Never push automatically.
- Never reset unrelated changes.
- Never modify unrelated files.
- Never rewrite Git history.

## Definition of Done

A task is complete only when:

1. implementation is complete
2. existing conventions are respected
3. build succeeds
4. relevant checks pass
5. security implications were reviewed
6. SSR behavior was considered
7. final git diff was inspected
8. Codex review findings were addressed