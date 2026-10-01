# Content architecture

## Versioned defaults and managed content

`content/en/` and `content/ar/` contain paired page objects typed by
`types/content.ts`. `content/brands/`, `content/images.ts` and `content/social.ts`
provide the brand roster, image slots/galleries and social defaults. Interface
strings live separately in `i18n/locales/` and `layers/admin/i18n/`.

The CMS is implemented. `server/cms/seed.ts` creates a workspace from the six page
pairs (home, about, brands, capabilities, network, contact), brand profiles, social
links and image slots; managed galleries start empty. `types/cms.ts` defines its
copy rows, brands, social URLs, slots and bilingual gallery descriptions.

`server/cms/store.ts` seeds SQLite only when the workspace row is absent. Existing
database content is not overwritten when a TypeScript default changes. Public
builds with CMS disabled render the versioned defaults; enabled builds load the
saved published workspace. Publishing does not rewrite source files or export a
static site.

## Editing, saving and publishing

`useAdminWorkspace()` keeps an editable client draft separate from the last server
response. Saving sends the draft and expected revision to `PUT /api/admin/workspace`.
`server/cms/validate.ts` checks the known field paths, roster and image references;
the store writes a new draft revision without changing published content.

Publishing uses `POST /api/admin/publish`: it validates the saved draft, then copies
it to the published snapshot in a transaction. Unsaved client edits are not included;
the workspace bar disables publish while dirty. Publishing requires both languages
for page copy and gallery descriptions, and for approved introduction/relationship
fields. Restoring a historical revision changes the draft, not the published snapshot.
Save, publish and restore reject a stale expected revision with HTTP 409.

The response includes the latest 30 revision entries; the revisions table itself is
not truncated to 30. Known reload/logout limitations remain in
[known issues](known-issues.md).

## Public rendering and saved-draft preview

`app/middleware/managed-content.global.ts` skips admin routes and CMS-disabled builds.
Otherwise it loads `/api/content`, or the authenticated `/api/admin/preview` for
`?preview=1`, into `useState('managed-content')`. It refreshes on initial load,
preview-mode changes and navigation back from admin. This is not live push or polling
of another editor's changes. Preview shows the saved server draft, not unsaved inputs.

`usePairedContent(en, ar, page)` selects the locale and applies the managed copy rows
through `shared/utils/cms-copy.ts`. `applyCopy()` only replaces existing string leaves;
it does not add fields. `useManagedSite()` supplies brands, social links, slots and
galleries with versioned fallbacks when managed state is absent.

Pages select galleries with `galleryFor(page)` and pass `images` to `BaseGallery`.
For example, `app/pages/about.vue` uses a computed gallery selection. `BaseGallery`
renders no section, heading or grid for `images=[]`; it does not select CMS data.

## Images and approval states

Authenticated uploads to `server/api/admin/media.post.ts` are decoded with Sharp,
resized within 2400 x 2400 without enlargement, re-encoded as WebP, and stored in
SQLite. `/images/admin/[name]` serves stored bytes: an image referenced by a published
slot/gallery is public; otherwise the handler requires a session. Static assets
continue to live under `public/`.

`ContentStatus` is `approved | draft | blocked | missing` (`types/content.ts`). These
are editorial states, not a general access-control system or a blanket page-publication
filter. `publicWorkspace()` removes brand notes and unapproved introduction,
relationship, image and ranges fields from both published and preview responses.
`content/brands/presentation.ts` also gates optional brand fields for presentation.
An authenticated preview therefore does not bypass those field approval filters.
Keep editorial decisions in [content approvals](unresolved-content-approvals.md).

## Extending the model

For a new page or field, update its paired defaults, types, rendering and SEO getters.
Managed additions also need the seed, validator and relevant editor wiring updated;
adding a brand changes the code-defined roster, which the validator currently fixes
by count, order and slug. Do not assume arbitrary pages or brands can be added through
the existing dashboard.

Plan a migration for existing databases before changing the managed field shape.
Automatic content-schema migration and CMS export to the static deployment are
not implemented by the current seed/store/build flow; they are future work, not
features delivered by this cleanup.
