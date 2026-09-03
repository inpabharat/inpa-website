# INPA editor guide

The editor manages only news, events and homepage carousel items. Institutional pages remain repository-managed until their text is formally approved.

## Local access

1. Copy `.dev.vars.example` to `.dev.vars`.
2. Run `pnpm db:setup:local`, `pnpm build`, and `pnpm preview`.
3. Open `http://127.0.0.1:8787/admin`.

The bypass works only with the local environment marker. Preview and production are protected by separate Cloudflare Access applications and validate their environment-specific audience tags.

## Editorial workflow

- Create records as **draft** and use the adjacent preview before publication.
- Use **scheduled** with a publication time to make a record public automatically after that time.
- Use **published** for immediate publication. News receives a publication timestamp automatically if none is supplied.
- Use **archived** to remove news from public listings without deleting its record.
- Events may additionally be postponed, cancelled, or completed. Past public events appear in the event archive.
- Deletion requires confirmation and retains an audit revision, but is not a substitute for D1 backups.
- Carousel items require an approved image and alternative text. Their start/end times and sort order control visibility and order.

## Media

Upload JPEG, PNG, WebP, or PDF files up to 8 MB from the Media tab. Meaningful images require alternative text. Supply photographer/source credit and a permission or licence note whenever they are known. The returned object key can be applied directly to a new news, event, or carousel record.

Do not upload unapproved portraits, event photographs, scientific figures, or publication PDFs. Production media must not contain local test files.

## Production safeguards

- Cloudflare Access explicitly allows Bhoomika Maheshwari (`bhoomika.physics@gmail.com`), Gagandeep Singh (`gags02@gmail.com`) and Dr Abhishek (`abi00779@gmail.com`). Update the reusable Access policy when authorised editors change.
- `/admin/**` and `/api/admin/**` are verified again by the Worker; a client-side page is never the security boundary.
- Every administrative response is private and non-cacheable.
- Mutation requests require same-origin requests, server validation, and an authenticated editor identity.
- Public routes expose only records whose publication state and dates make them public.
