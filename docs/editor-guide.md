# INPA editor guide

The editor manages news, events, homepage slides, Nuclear Horizons and featured research. Open `/admin` and sign in with the existing email verification flow. Access is restricted to authorised INPA editors; Cloudflare may show a generic “code sent” message even when an email is not allowed, and will not send a code in that case. Institutional pages remain repository-managed.

## Local access

1. Copy `.dev.vars.example` to `.dev.vars`.
2. Run `pnpm db:setup:local`, `pnpm build`, and `pnpm preview`.
3. Open `http://127.0.0.1:8787/admin`.

The bypass works only with the local environment marker. Preview and production are protected by separate Cloudflare Access applications and validate their environment-specific audience tags.

## Editorial workflow

- Create records as **draft** and use the adjacent preview before publication.
- Use **scheduled** with a publication time to make a record public automatically after that time. **Published** events are visible immediately when their event start date is upcoming; the publication schedule is ignored for them.
- Use **published** for immediate publication. News receives a publication timestamp automatically if none is supplied.
- Use **archived** to remove news from public listings without deleting its record.
- Events may additionally be postponed, cancelled, or completed. Past public events appear in the event archive.
- Deletion requires confirmation and retains an audit revision, but is not a substitute for D1 backups.
- Carousel items require an approved image and alternative text. Their start/end times and sort order control visibility and order.

## Media

**Images & PDFs** is the reusable media library. Upload JPEG, PNG, WebP or PDF files up to 8 MB. The library shows filenames, previews, descriptions and which saved content uses a file. Uploading alone does not add a file to a page. Choose the image or PDF inside the relevant content form, then publish that item. Images require a description for visitors who cannot see them. Direct file links are public; do not upload confidential files.

Files used by saved content, including drafts and archived items, cannot be deleted. Replace or remove the reference first. Preview and production use separate libraries: content uploaded in preview does not automatically appear in production.

## Nuclear Horizons

Select **Nuclear Horizons → Add an issue**. Enter the volume, issue number, issue heading, publication date and page count. Choose/upload the PDF and cover. Optionally add an introduction, editorial and featured review, including titles, authors and page references in the text. Check the preview and open the selected PDF, then **Save draft** or **Publish on website**.

The newest published issue appears on the homepage and Nuclear Horizons page; every published issue appears in the archive. To replace a corrected PDF, edit the existing issue and choose a new file, avoiding a duplicate issue. The two original issues remain editable. For month-only publication dates use the first day; public issue cards display month and year.

## Homepage slides

Select **Homepage slides → Add slide**. Enabling a slide makes it eligible for the homepage. Leave **Show from** and **Hide after** blank to display it immediately and continuously. Add either time only when a scheduled start or end is intentional; the form reads and displays these values in the editor’s computer timezone while storing them unambiguously in UTC. The slide list reports **Live now**, **Scheduled**, **Ended**, or **Inactive**, includes the reason, and shows the effective schedule in local time.

## Featured research

Select **Featured research → Add research**. Enter a title, summary, full story, authors, institutions, journal, DOI and story publication date. Optionally choose an image with description and caption/credit. Select **Feature on the homepage** for the spotlight. If several stories are selected, the most recently dated one appears first. Every published story has a detail page and appears in the Research list.

Plain text and paragraph breaks are supported. DOI syntax is validated and normalised to a link; editors should verify that the linked paper is correct. Keep the page address unchanged when editing so shared links continue working.

## Saving and publishing

Incomplete science items can be saved as drafts. Publish checks required fields. Future-dated published science items become visible on their publication date in India. Published changes need no code deployment; homepage/API caches may take up to one minute to refresh. Use **Publish changes** to update a live item; saving it as a draft removes it from public view.

**Remove from public view** archives an item so it can be republished. **Remove** confirms deletion of new items; removing one of the two original issues records a withdrawal so it cannot reappear from the baseline. Audit history is retained but is not an undo feature. Unsaved changes trigger a warning when leaving forms.

## Local integration checks

After building and applying local migrations, run `pnpm exec wrangler dev --env local --local --port 8790 --var NUXT_DEV_AUTH_BYPASS:true`, then `pnpm test:editor:local`. The script refuses remote hosts. It checks draft privacy, publishing, PDF replacement, file references, dates, archive, duplicates and cross-origin rejection, then removes its local fixture records and uploads. Audit entries remain. `INPA_TEST_URL` can change the local port.

## Production safeguards

- Cloudflare Access owns the authorised editor allowlist. Existing authorised editors receive these publishing tools without a new account or role.
- `/admin/**` and `/api/admin/**` are verified again by the Worker; a client-side page is never the security boundary.
- Every administrative response is private and non-cacheable.
- Mutation requests require same-origin requests, server validation, and an authenticated editor identity.
- Public routes expose only records whose publication state and dates make them public.
