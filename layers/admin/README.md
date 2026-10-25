# Binzomah content workspace

A bilingual authenticated Nuxt dashboard with SQLite persistence. Development enables it; production requires `npm run build:admin`. Ordinary `npm run build` and `npm run generate` exclude its pages and layout, and its APIs return 404. Generating a static site with the dashboard enabled fails explicitly.

## What works

- Owner sign-in and server-side session checks on pages and all private APIs.
- Shared Arabic/English page-copy editing, contact details/social links, existing team names/roles and existing brand names/introductions/relationships.
- Independent image-slot replacement/removal and per-page galleries with descriptions and ordering.
- A media library listing every upload, site photo and logo with where the draft uses it. Upload once, then choose the image for any page slot, gallery or logo.
- Brand and partner logo replacement and restore-to-original; one change reaches every place that logo appears.
- Save, private saved-draft preview, explicit publication, content revision history and restore-as-draft. Stale writes return 409 instead of overwriting another tab.
- A real inbox with manual capture, search, filters, persisted status changes, copy email and a mailto reply link. No email is sent automatically. The public contact form stays disabled.

The approved brand/team/partner roster remains fixed: a logo's artwork can be replaced, but entries cannot be added or removed. This is a single-owner content workspace, not a multi-user CRM: adding roster members, brand ranges/artwork, roles, MFA and email delivery are not implemented. Unapproved brand introduction/relationship copy is excluded from the public and preview payloads. Explicit publication records the owner's approval in the content history.

## Editing workflow

The overview prioritizes new enquiries, editable brand text and publication status. The enquiry shortcut opens the manual capture form. Content history shows the latest three revisions and can expand to the last 30.

In **Page content**, choose a page and then **Text**, **Section images** or **Gallery**. Text is grouped into named sections; search spans all sections on that page. **Changed only** compares fields with the saved draft. Switching sections, image tabs or language views keeps edits in the shared workspace. Arabic/English fields stack on phones, with the current interface language first.

In **Media**, **All images** uploads files and filters by uploads, site photos or logos. Uploading stores the file privately; it reaches visitors only once a published page uses it. **Logos** replaces each brand or partner logo by uploading or choosing from the library, and **Restore original** returns it to the approved file. The replace dialog and the gallery also offer **Choose from library**.

The bottom bar distinguishes unsaved edits, a saved draft and published content. Save with **Save draft** or **Ctrl/⌘+S**, review **Preview saved draft**, then explicitly publish. Preview always shows the last saved version. **More actions** contains saved/published revision numbers and the reload action, which asks before discarding unsaved edits. Page indicators mark both text and image changes.

## Local setup

Use Node 24.20+ and `npm ci`, then:

```sh
npm run admin:account -- --email=owner@example.com
npm run dev
```

The account command generates a random password and saves it to ignored `.data/admin-local-access.txt`; it never places a password in source code or public config. Store the credentials in your password manager, then remove this local file. Open `/ar/admin/login` or `/en/admin/login`. There is no public registration or web bootstrap endpoint. To deliberately replace the owner and revoke every session, add `--reset` to the account command.

## Node deployment

GitHub Pages cannot run this dashboard. Deploy the **whole site** as a Node service with a persistent volume; publishing then updates that site's content. The existing GitHub Pages deployment remains an independent static snapshot of source content and does not read this database.

1. Install/build on the target OS (`npm ci`, `npm run build:admin`) so Sharp's native binary matches the host.
2. Set `NUXT_ADMIN_DB_PATH` to a private persistent absolute path, such as `/var/lib/binzomah/admin.sqlite`, and run the account command against that same path.
3. Set `NUXT_ADMIN_ORIGIN=https://your-domain.example` to the exact browser origin, without a trailing slash. This is required behind a TLS reverse proxy; forwarded host/IP headers are not trusted for authentication decisions.
4. Keep `NUXT_ADMIN_SECURE_COOKIES=true`, use HTTPS, and set `NUXT_PUBLIC_SITE_URL` to the public origin. Leave `NUXT_PUBLIC_CONTACT_FORM_ENDPOINT` empty.
5. Start `node .output/server/index.mjs` with the project as its working directory. Run one Node instance on a persistent local filesystem; SQLite/WAL on ephemeral/serverless or shared network storage is unsupported.
6. Verify login, save, preview, publish, logout, restart and backup restore on the chosen host before changing DNS. No hosting or DNS changes are performed by this implementation.

The default database path is `.data/admin.sqlite`. Keep its entire directory private and writable only by the service account; it contains contact information, password hashes, sessions, content history and image bytes. Do not expose it through the web server or commit it. Disk persistence does not replace backups.

## Backup and recovery

```sh
npm run admin:backup
# Or choose a new destination file:
npm run admin:backup -- /private/backups/binzomah-2026-09-30.sqlite
```

This uses SQLite's online backup API, including WAL changes and uploaded images. Copy backups to private storage outside the host and define retention with the operator. No backup schedule is created automatically. To recover, stop the Node service, preserve the existing database directory, place the backup in a fresh private directory, point `NUXT_ADMIN_DB_PATH` there and restart. Avoid reusing stale `-wal`/`-shm` files. Reset the owner after restoring to invalidate sessions carried by the backup.

Content history restore is different: it creates a draft without changing the published website. Review and publish separately. History lists the last 30 revisions; retained revisions and uploaded media stay in the database. Upload storage is capped at 512 MiB; unused media cleanup is an operator task and is not automatic because historical revisions may still reference it.

## Security and architecture

`server/cms` owns SQLite, password hashing, sessions, body limits, schema validation and publication. Route handlers only orchestrate these functions. `types/cms.ts` defines shared contracts; public composables overlay published content on the existing typed source fallback. The admin layer owns presentation, editor state and localized messages. Public static builds retain the source-only behavior.

Session cookies are HttpOnly, SameSite=Strict and Secure in production. Random 256-bit tokens are hashed in storage, expire after 8 hours and after 30 minutes idle, and are revoked on logout/reset. Mutations require a session CSRF token and matching Origin. Login is limited to 8 attempts per socket IP per 15 minutes; with a reverse proxy this intentionally becomes a shared limit rather than trusting spoofable forwarded IPs. There is no MFA or distributed rate limiter.

Server validation permits known copy paths and existing roster identities, validates social domains, enforces revision comparisons, and resolves uploaded image metadata from storage. Sharp decodes, strips metadata and re-encodes JPEG/PNG/WebP/AVIF as WebP; SVG/animated images are rejected. Limits: 10 MiB input, 25 megapixels, 2400px maximum output dimensions, 40 gallery entries per page. Unpublished image bytes require authentication. Preview responses and all admin responses use `private, no-store`.

## Verification

```sh
npm run lint
npm run typecheck
npm run build:admin
npm run test:admin
npm run test:admin:browser
npm run build
npm test
npm run test:browser
npm run generate
npm run test:static
```

The browser tests require `npx playwright install chromium`. Dashboard tests use isolated databases and generated credentials under ignored `.data`; they do not touch the owner database. API tests cover authentication/CSRF, invalid input, stale writes, private previews/media, logo validation and older drafts without logos, publication, server restart, restore, enquiry status conflicts, expiry, logout and throttling. Browser tests cover both languages, mobile/desktop, SSR/hydration, saving/publishing, cross-tab conflicts and editor flows, including the media library and logos.
