# Known issues

The two CMS issues below were recorded in the dashboard baseline before the
design-system cleanup. Both remain open by the owner's instruction; recording
them is not a fix.

## CMS-001 — Reload can overwrite edits made while its request is pending

- Severity: Medium
- Status: Open
- File: `layers/admin/app/composables/useAdminWorkspace.ts`, `reload()` and `accept()`.
- Relevant code: `accept(await request<WorkspaceResponse>(`${base}/api/admin/workspace`))`.
- Trigger: start reloading the workspace, then edit a field before the response arrives.
- Problem: the response replaces the current draft without checking whether it changed
  after the request started. A confirmation before reload does not protect later edits.
- Impact: unsaved changes made during the request can be lost.
- Suggested fix: capture the draft/version at request start and only replace it if the
  current draft still matches. Otherwise preserve the current input and explain that a
  newer server snapshot is available. Alternatively, explicitly prevent editing while
  reload is pending. Coordinate reload with other workspace mutations.
- Verification: delay the reload response, edit a field while waiting, then complete
  the request and verify that the new edit is preserved or editing was unavailable.

## CMS-002 — Failed logout leaves private client state and the current page in place

- Severity: Medium
- Status: Open
- File: `layers/admin/app/composables/useAdminSession.ts`, `logout()`.
- Related server file: `server/cms/auth.ts`, `endSession()` and `requireSession()`.
- Relevant code: `await $fetch(...)` runs before `clearNuxtState(...)` and navigation.
- Trigger: the session expires before logout, so the endpoint returns HTTP 401, or
  the logout request fails before the client cleanup runs.
- Problem: a rejected request exits the function before private client state is
  cleared and before navigation to the login page.
- Impact: the user can remain on an unusable admin screen with private editor state
  still held in memory. This does not bypass server-side session checks.
- Suggested fix: treat HTTP 401 as already signed out and guarantee the appropriate
  client cleanup/navigation. Handle transport failures explicitly without claiming
  that a server session was revoked when the request did not succeed.
- Verification: expire the session before logout, and separately simulate a network
  failure; verify cleanup, navigation, and truthful feedback about server revocation.

## Visual regression tooling is not versioned

- Severity: Medium
- Status: Open; migration deferred until after design-system Step 8.
- Current capture script: `.data/baseline-review/capture-stable-design-system.mjs`.
- Current comparison script: `.data/baseline-review/compare-captures.mjs`.
- Carousel stabilization: `settle(page)` in the capture script. It waits for fonts,
  network and image decoding, selects the second person and then the first, and
  asserts that the first remains active before and after capture.
- Gallery fixture capture and behavior checks: `.data/baseline-review/verify-gallery.mjs`.
- Current baselines and reports: `.data/design-system/`.
- Problem: these tools and artifacts exist only under gitignored `.data/`.
- Impact: a fresh checkout or CI cannot reproduce the visual verification from
  versioned files alone.
- Suggested fix: after Step 8, add the tooling and reproducible fixture setup under
  `tests/`, document its commands and baseline policy, and retain exact pixel
  comparison without masks or tolerance. Keep the current files in place until then.
