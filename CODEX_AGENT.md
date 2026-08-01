# CODEX_AGENT.md

## Indian Nuclear Physics Association Website

- **Status:** Authoritative product and implementation source of truth
- **Last updated:** 2026-08-01
- **Primary source:** `INPA_Homepage Philosophy.docx`, authored by Prof. A. K. Jain
- **Implementation target:** Nuxt 3 on Cloudflare Workers

---

## 1. Authority and operating rule

This file is the source of truth for Codex and every implementation agent working on the Indian Nuclear Physics Association (INPA) website.

The product philosophy, audiences, homepage hierarchy, design language, and signature scientific-content concept in this file are derived from `INPA_Homepage Philosophy.docx` and are binding. The technical architecture and cost constraints record the final project decisions.

When instructions conflict, use this priority:

1. A new, explicit instruction from the user.
2. This `CODEX_AGENT.md`.
3. Existing repository conventions, provided they do not conflict with items 1 or 2.
4. Framework defaults and general best practices.

Do not silently reinterpret or remove a requirement. If a requested change conflicts with this file, identify the conflict and obtain explicit approval before changing the product or architecture.

When this file is deliberately changed, update its `Last updated` date and record the decision in the repository's decision log or pull-request description.

---

## 2. Project in one paragraph

Build the official digital home of the Indian Nuclear Physics Association: an authoritative, modern, science-first website that brings together India's nuclear physics community. The public website is predominantly static and must remain fast, indexable, accessible, and inexpensive to operate. A small number of trusted editors must be able to manage news, events, and homepage carousel items through a protected editor interface. There is no public member portal, payment system, or large-scale user platform in the approved scope.

---

## 3. Product north star

Within ten seconds of arriving, a visitor should understand:

> This is the official home of the Indian Nuclear Physics Association — the place where India's nuclear physics community comes together.

The website must serve and inspire four audiences simultaneously:

- Senior scientists.
- Young researchers and students.
- Industry and government.
- International collaborators.

INPA must not look like a conventional association website whose homepage is dominated by administration. Science itself must sit at the center of the experience. The site should become a national scientific destination that users revisit for research, history, education, opportunity, and inspiration as well as announcements.

The long-term purpose is not merely to administer an association. It is to help build a vibrant national scientific community and a lasting knowledge resource.

---

## 4. Fixed technical architecture

The following decisions are final unless the user explicitly changes them:

| Layer | Required technology |
| --- | --- |
| Application framework | Nuxt 3 |
| UI framework | Vue 3 |
| Language | TypeScript |
| Backend | Nuxt server routes / Nitro handlers in TypeScript |
| Hosting and execution | Cloudflare Workers with static assets |
| Relational data | Cloudflare D1 |
| Database schema and queries | Drizzle ORM and checked-in SQL migrations |
| Images and PDFs | Cloudflare R2 |
| Editor authentication | Cloudflare Access |
| Source control | GitHub |
| CI/CD | GitHub to automatic Cloudflare deployment |
| DNS, CDN, TLS and edge protection | Cloudflare |
| Expected annual infrastructure cost | Approximately INR 700-1,500, primarily the domain |

### 4.1 Architecture rules

- Use one Nuxt 3 repository unless a genuine platform limitation requires separation.
- Use Vue 3 Composition API and `<script setup lang="ts">`.
- Use Nuxt server routes under `server/api/` for backend endpoints.
- Use D1 through a Cloudflare binding. Do not add Supabase, Firebase, Neon, MongoDB, MySQL, a VPS database, or another database service without approval.
- Use R2 through a Cloudflare binding. Do not store binary files or base64 media in D1.
- Use Cloudflare Access to protect the editor UI and every administrative mutation endpoint.
- Use GitHub-integrated builds and deployments. Production must not depend on manual file uploads.
- Do not introduce Vercel, Netlify, AWS, Render, Railway, or a conventional always-on server without explicit approval.
- Do not introduce a Python backend. The approved backend is TypeScript in Nuxt/Nitro.
- Keep Cloudflare-specific code behind small adapters where practical so business logic remains testable.
- Prefer platform-native Web APIs over Node-only APIs. Add Node compatibility only when a documented dependency requires it.

### 4.2 Runtime shape

The application has three logical surfaces:

1. **Public site:** statically generated or edge-rendered pages, aggressively cached.
2. **Public read API:** cached read-only endpoints for current news, events, and carousel items.
3. **Editor surface:** `/admin/**` and `/api/admin/**`, protected by Cloudflare Access and never indexed.

The same Worker may serve all three surfaces. The distinction is logical and security-related, not necessarily separate infrastructure.

---

## 5. Approved scope and explicit non-goals

### 5.1 In scope

- A responsive, accessible public website.
- The full homepage experience specified in Section 7.
- Public content pages and archives for the approved site map.
- A protected editor dashboard for a small group of trusted office-bearers or editors.
- CRUD management for news, events, and carousel items.
- Image and PDF upload to R2.
- Draft, scheduled, published, archived, and expired content states where applicable.
- Content preview before publication.
- Revision metadata and auditability for editor actions.
- GitHub-based source control and automatic Cloudflare deployment.
- Search-engine metadata, structured data, sitemap, and robots controls.
- Accessible carousel/timeline/map interactions.
- Low-cost operation within Cloudflare's free tiers by default.

### 5.2 Not in scope

- Public user registration or login.
- A member dashboard or member database.
- Online membership management.
- Payment collection, payment gateways, subscriptions, donations processing, or receipts.
- Thousands of authenticated users.
- E-commerce.
- A custom journal-submission or peer-review platform.
- Secure elections or online voting.
- A general-purpose social network or discussion forum.
- Paid email marketing infrastructure.
- Native mobile applications.

The homepage may contain links labelled **Become a Member**, **Donations**, **Newsletter subscription**, or **Submit Manuscript**, because they are in the product philosophy. In the approved scope these must lead only to an informational page, official external system, email/contact action, or administrator-configured URL. They must not imply that an internal payment, account, submission, or subscription platform exists.

---

## 6. Content authority and truthfulness

The website represents a scientific association. Accuracy is more important than visual completeness.

- Do not invent office-bearers, institutional affiliations, facility details, scientific results, dates, awards, journal metrics, contact details, social links, or URLs.
- Examples in the source document such as proposed conferences, lectures, colloquia, schools, and research topics are conceptual examples, not verified announcements.
- Do not publish example or placeholder data to production as fact.
- Development fixtures must be visibly marked `Draft`, `Example`, or `Placeholder` and excluded from production builds or unpublished by default.
- Scientific imagery must be authentic, appropriately licensed, credited when necessary, and approved for use. Do not present generated or generic imagery as a real Indian facility or experiment.
- DOI links must be validated and use the canonical `https://doi.org/...` form.
- Institution profiles and map entries must be verified before publication.
- Dates must be stored unambiguously and displayed with an explicit Indian timezone where time matters.
- Preserve respectful, neutral, professional language in memorials and recognitions.

When official content is missing, create a clear content placeholder and add it to the content-readiness checklist. Do not fill gaps by guessing.

---

## 7. Authoritative homepage specification

The homepage is not a generic landing page. It is a guided institutional and scientific narrative. Preserve the following hierarchy unless user testing or an explicit decision changes it.

### 7.1 Hero section - full screen

Purpose: establish authority, scientific identity, and national scope immediately.

Required elements:

- A striking panoramic image of an accelerator facility, detector array, or approved collage of Indian nuclear physics laboratories.
- Headline: **Indian Nuclear Physics Association**.
- Tagline: **Advancing Nuclear Science • Connecting Researchers • Inspiring Future Generations**.
- Three prominent actions:
  - **Become a Member**.
  - **Nuclear Horizons**.
  - **Upcoming Conference**.

Implementation notes:

- The hero must remain legible on mobile, tablet, and desktop.
- Use responsive images, an art-directed crop, and a restrained overlay when required for contrast.
- Do not allow a background video or heavy animation to degrade loading, accessibility, or scientific authority.
- The three actions must be configurable, because their destinations may change.

### 7.2 President's welcome

Required elements:

- Approved professional photograph of the President.
- Concise welcome message.
- **Read Full Message** action leading to the complete presidential address.

Editorial intent:

> INPA is committed to advancing excellence in nuclear physics research, fostering collaboration among scientists, nurturing young researchers, and promoting the peaceful applications of nuclear science for the benefit of society.

The quoted text is an editorial direction until officially approved; do not attribute or publish it as the President's final message without confirmation.

### 7.3 Latest news

Purpose: show recent developments and keep the institutional presence current.

Each visible item must support:

- Image.
- Publication date.
- Title.
- Short summary.
- Detail-page or external link.
- Optional category and featured state.

Conceptual examples from the source document include:

- Annual conference announcements.
- New Nuclear Horizons issues.
- Young Scientist Colloquium updates.
- Foundation lectures.
- National schools on nuclear physics.
- Research highlights from Indian laboratories.

These examples are not verified production content.

### 7.4 Upcoming events

Present upcoming events as a clean, accessible chronological timeline.

Each event should support:

- Start date and optional end date.
- Title.
- Short description.
- Location or online status.
- Detail or official external URL.
- Optional image.
- Status such as draft, scheduled, published, postponed, cancelled, completed, or archived.

Past events must automatically leave the upcoming list and remain available in an archive when appropriate.

### 7.5 About INPA

Provide a concise introduction and a **Learn More** action to the full About section.

Approved conceptual description:

> The Indian Nuclear Physics Association (INPA) is the national professional body representing researchers, teachers, students, and institutions engaged in nuclear physics. It promotes scientific excellence, collaboration, education, and outreach across India and internationally.

This description must be institutionally verified before final publication.

### 7.6 Featured research

This is the scientific heart of the homepage.

Each month, the site should be able to feature one outstanding Indian research achievement as a **Research Spotlight**.

Required presentation fields:

- Research title.
- Concise, accessible summary.
- Authors.
- Institution or institutions.
- Journal.
- DOI.
- Approved image or figure when available.
- **Read More** action.

The module must give visibility to Indian research and keep the homepage intellectually alive. It must not become an uncurated automated paper feed.

### 7.7 Nuclear Horizons

Present Nuclear Horizons as a living publication, not merely a static PDF cover.

Required elements:

- Latest issue cover.
- Editorial.
- Featured review.
- Most-read article, if verified analytics support the claim.
- Archive link.
- **Submit Manuscript** link to an approved external submission route or instructions page.

Do not implement a manuscript-submission backend in this project.

### 7.8 Resources for students

This is where the next generation should first connect with INPA.

The section should surface clearly organised links to:

- Lecture notes.
- Recorded lectures.
- PhD opportunities.
- Summer schools.
- Fellowships.
- Career guidance.
- Frequently asked questions.

Resources must show an owner/source and a last-reviewed date where practical. Expired opportunities must not remain presented as current.

### 7.9 India's nuclear physics map

This should become a distinctive national resource.

Provide an accessible interactive map of India highlighting verified nuclear physics institutions and facilities. Initial categories and conceptual examples include:

- BARC.
- VECC.
- IUAC.
- RRCAT.
- IGCAR.
- TIFR.
- SINP.
- BHU.
- IITs.
- IISERs.
- Universities.

Selecting an institution should reveal, when verified:

- Institution profile.
- Research areas.
- Facilities.
- Relevant faculty or official directory link.
- Opportunities.
- Official website.

Requirements:

- The map must have a keyboard-accessible non-map list alternative.
- Do not use exact geolocation or profile data without verification.
- Prefer lightweight vector/geographic rendering over a heavy paid map provider.
- The first release may use a curated static dataset, but the component and schema must be extensible.

### 7.10 Distinguished scientists

Provide a rotating, curated gallery featuring pioneers and contemporary leaders in Indian nuclear physics.

Supported editorial series may include:

- Founder of the Month.
- Pioneer Series.
- Young Investigator.
- International Collaborator.

All biographies, photographs, affiliations, dates, and achievements must be verified and appropriately credited.

### 7.11 Member highlights

Celebrate the community with verified items such as:

- Awards.
- Promotions.
- New books.
- Retirements.
- Memorial tributes.
- International recognitions.

Do not expose private member information or publish personal announcements without approval.

### 7.12 Quick access

Provide large, legible, icon-supported links for:

- Membership.
- Constitution.
- Executive Council.
- Newsletter.
- Awards.
- Jobs.
- Contact.
- Donations.

Icons must reinforce labels, never replace them. Donation and membership actions are informational or external only under the approved scope.

### 7.13 Footer

Include verified and configurable:

- Contact information.
- Social media links.
- Newsletter subscription or approved contact action.
- Copyright notice.
- Privacy Policy.
- Executive Council link.
- Office address.

Also include accessibility, sitemap, and content-correction/contact links if approved.

---

## 8. INPA's signature recurring feature

The homepage must be capable of revealing something intellectually new on repeat visits. This is the differentiating editorial concept, not an optional decorative carousel.

Supported recurring formats:

- **Research of the Month**.
- **Historical Milestone**.
- **Figure of the Week**.
- **Nuclear Physics Explained**.
- **Did You Know?**

The design should allow these formats to share a common feature-card or feature-story model without making them visually indistinguishable.

Editorial rules:

- Every item must name its author/editor or source.
- Scientific statements require a source link or reference.
- Figures need permission, attribution, a caption, and accessible alternative text.
- Explanations should serve both specialists and interested students without oversimplifying into inaccuracy.
- Time-sensitive labels such as “of the week” or “of the month” must correspond to a real publication schedule.
- Curated quality is more important than update frequency.

---

## 9. Site map and route intent

Use human-readable, stable routes. The final information architecture may add child pages, but it must preserve these destinations:

| Area | Suggested route |
| --- | --- |
| Home | `/` |
| About INPA | `/about` |
| President's message | `/about/presidents-message` |
| Executive Council | `/about/executive-council` |
| Constitution | `/about/constitution` |
| News archive | `/news` |
| News detail | `/news/[slug]` |
| Events archive | `/events` |
| Event detail | `/events/[slug]` |
| Featured research | `/research` |
| Research detail | `/research/[slug]` |
| Nuclear Horizons | `/nuclear-horizons` |
| Nuclear Horizons archive | `/nuclear-horizons/archive` |
| Student resources | `/students` |
| Opportunities | `/students/opportunities` |
| Nuclear physics map | `/map` |
| Distinguished scientists | `/people` |
| Member highlights | `/community` |
| Awards | `/awards` |
| Jobs | `/jobs` |
| Membership information | `/membership` |
| Contact | `/contact` |
| Privacy Policy | `/privacy` |
| Editor dashboard | `/admin` |

Do not create empty public pages merely to satisfy the route list. A route may remain unlinked or intentionally return a draft/unavailable state until authoritative content is ready.

---

## 10. Rendering and caching strategy

Use hybrid rendering intentionally:

- Prerender stable institutional pages such as About, Constitution, static student resources, and policy pages.
- Edge-render or pre-generate dynamic detail pages for news, events, and research features.
- Cache public D1 reads at the edge with deliberate keys and invalidation.
- Invalidate only affected pages and API responses after an editor publishes, updates, archives, or deletes content.
- Never query D1 on every static asset request.
- Do not expose unpublished records in client-side payloads.
- Render essential news/event text in HTML for search engines and non-JavaScript resilience; do not rely exclusively on client-side fetching for indexable content.
- Mark the editor interface `noindex, nofollow` and keep it out of the sitemap.

Use UTC for stored timestamps. Render editorial dates in `Asia/Kolkata` unless a content item explicitly uses another event timezone.

---

## 11. Data ownership and content-source map

The approved dynamic database scope is deliberately small.

### 11.1 D1-managed in the first release

- News.
- Events.
- Carousel items.
- Minimal audit/revision metadata required to manage those records safely.

### 11.2 Repository-managed initially

Unless the user explicitly expands the editor scope, keep the following in typed repository content/configuration:

- About and institutional copy.
- President's message and profile.
- Executive Council.
- Constitution metadata and document link.
- Student-resource categories.
- Institution/map dataset.
- Distinguished scientist profiles.
- Nuclear Horizons presentation metadata.
- Quick links.
- Footer and contact information.

Repository-managed content must be typed, validated at build time, and easy to migrate to D1 later. Do not hard-code such content across multiple Vue components.

### 11.3 Future editable modules

Featured research, Nuclear Horizons issues, recurring signature features, institution profiles, people, student opportunities, and member highlights may later become editor-managed D1 modules. Design reusable components and repository schemas so this migration does not require a visual rewrite, but do not expand the database or dashboard prematurely.

---

## 12. Initial D1 and Drizzle model

Use text IDs suitable for distributed creation, such as UUIDs. Store timestamps as ISO-compatible values or integer epochs consistently. Add indexes for all public filters and sort orders.

### 12.1 `news`

Minimum fields:

- `id`.
- `slug`, unique.
- `title`.
- `summary`.
- `body` in a sanitised supported content format.
- `cover_image_key`, nullable R2 object key.
- `cover_image_alt`, required when an image exists.
- `category`, nullable.
- `status`: `draft`, `scheduled`, `published`, `archived`.
- `is_featured`.
- `publish_at`, nullable.
- `published_at`, nullable.
- `expires_at`, nullable.
- `external_url`, nullable.
- `created_at`.
- `updated_at`.
- `created_by`.
- `updated_by`.

### 12.2 `events`

Minimum fields:

- `id`.
- `slug`, unique.
- `title`.
- `summary`.
- `body`.
- `start_at`.
- `end_at`, nullable.
- `timezone`.
- `location_name`, nullable.
- `is_online`.
- `external_url`, nullable.
- `cover_image_key`, nullable.
- `cover_image_alt`, required when an image exists.
- `status`: `draft`, `scheduled`, `published`, `postponed`, `cancelled`, `completed`, `archived`.
- `is_featured`.
- `publish_at`, nullable.
- `created_at`.
- `updated_at`.
- `created_by`.
- `updated_by`.

### 12.3 `carousel_items`

Minimum fields:

- `id`.
- `eyebrow`, nullable.
- `title`.
- `summary`, nullable.
- `image_key`.
- `image_alt`.
- `cta_label`, nullable.
- `cta_url`, nullable.
- `linked_content_type`, nullable: `news`, `event`, or `custom`.
- `linked_content_id`, nullable.
- `sort_order`.
- `is_active`.
- `starts_at`, nullable.
- `ends_at`, nullable.
- `created_at`.
- `updated_at`.
- `created_by`.
- `updated_by`.

### 12.4 `content_revisions`

Maintain a lightweight audit record for administrative writes:

- `id`.
- `entity_type`.
- `entity_id`.
- `action`.
- `editor_identity`.
- `previous_value`, nullable JSON text.
- `new_value`, nullable JSON text.
- `created_at`.

Do not treat the audit table as the only backup. D1 Time Travel and periodic exports remain operational safeguards.

### 12.5 Schema rules

- All schema changes require checked-in migrations.
- Apply migrations locally and in preview before production.
- Never edit production tables manually as a normal workflow.
- Use parameterised queries through Drizzle or the D1 binding.
- Add uniqueness, not-null, and check constraints where D1 supports them.
- Use transactions/batches for logically atomic multi-write operations.
- Keep migration files portable and reversible where practical.

---

## 13. R2 media rules

- Store original uploads in R2; store only object keys and metadata in D1.
- Use deterministic, collision-resistant object keys. Do not expose user-supplied filenames as storage paths without sanitisation.
- Permit only approved image formats and PDFs.
- Validate MIME type, extension, size, and file signature server-side.
- Set an explicit upload-size limit. Start conservatively and increase only when a real publication requires it.
- Require alternative text for meaningful images.
- Support decorative-image marking only when an image conveys no information.
- Generate or serve responsive image variants when justified; do not transform large originals on every request.
- Use long-lived cache headers for immutable keyed assets.
- Prevent unauthorised overwrites and orphaned-object accumulation.
- Do not make draft/unpublished media discoverable through public listings.
- Keep source/credit/licence metadata for scientific photographs and figures.

---

## 14. Editor dashboard

The editor experience must be usable by non-developer office-bearers.

Required first-release capabilities:

- Dashboard summary of drafts, scheduled items, current news, upcoming events, and active carousel slides.
- Create, edit, preview, publish, unpublish/archive, and delete news.
- Create, edit, preview, publish, postpone/cancel/archive, and delete events.
- Create, edit, activate/deactivate, schedule, reorder, and delete carousel items.
- Upload/select R2 images and PDFs where supported.
- Slug generation with collision checks and optional deliberate editing.
- Required-field validation with plain-language errors.
- Confirmation before destructive actions.
- Visible publication state and timestamps.
- Preview that reflects the real public component design.
- Audit identity and updated timestamp.

The editor UI must not expose Cloudflare, D1, Drizzle, R2, GitHub, or deployment concepts to ordinary editors.

Do not add a complicated roles system initially. Access is based on a small allowlist of trusted identities. If distinct editor and administrator privileges become necessary, add them deliberately rather than relying on hidden UI controls.

---

## 15. Authentication and security

### 15.1 Cloudflare Access

- Protect `/admin/**` and `/api/admin/**`.
- Allow only explicitly approved email addresses or an approved identity-provider group.
- Never use a rule that admits every valid email address.
- Validate the Access assertion or trusted identity at the Worker/server layer for administrative operations.
- Treat client-side route guards as convenience, not security.
- Keep session duration appropriately short for administrative access.
- Prefer MFA-capable identities for editors.

### 15.2 Application security

- Validate all inputs server-side.
- Sanitise or safely render rich text. Never render untrusted HTML directly.
- Use parameterised queries.
- Enforce allowed methods and content types.
- Check request origin and protect mutation routes against cross-site abuse.
- Rate-limit sensitive and public form endpoints where appropriate.
- Do not leak stack traces, bindings, secrets, database errors, or internal IDs to public clients.
- Store secrets only through Cloudflare secrets/environment configuration.
- Never commit credentials, Access secrets, account IDs that should remain private, or production data.
- Apply least privilege to GitHub and Cloudflare accounts.
- Keep dependencies current and review security advisories during maintenance.
- Log administrative actions without logging sensitive content unnecessarily.
- Provide a clear security-contact route.

### 15.3 Privacy

- Collect no public personal data unless a feature explicitly requires it.
- Do not add invasive analytics or advertising trackers.
- Prefer privacy-respecting Cloudflare Web Analytics if analytics are enabled.
- Provide a clear Privacy Policy.
- If a contact or newsletter form is later added, document purpose, consent, retention, deletion, and responsible contact before collecting data.
- Design with India's applicable data-protection obligations in mind, but do not claim legal compliance without an appropriate review.

---

## 16. Design language

The website should resemble the digital presence of a leading scientific organisation, not a generic club, template marketplace, government portal, or conventional association website.

### 16.1 Required visual character

- White background with generous spacing.
- Deep navy blue as the primary colour.
- Gold accents used sparingly for emphasis.
- Minimalist, modern typography.
- Scientific imagery rather than decorative graphics.
- Plenty of whitespace to create authority.
- Clear editorial hierarchy.
- Calm, credible motion rather than spectacle.

### 16.2 Initial design tokens

Treat these as a coherent starting system, not immutable brand values. Replace them if official INPA brand standards are supplied.

- `--color-navy-950`: near-black navy for major headings and footer.
- `--color-navy-800`: primary institutional navy.
- `--color-gold-500`: restrained gold accent.
- `--color-surface`: white.
- `--color-surface-subtle`: very light cool grey.
- `--color-text`: high-contrast charcoal/navy.
- `--color-text-muted`: accessible muted grey.
- Content width: comfortable reading measure, with wider containers only for maps, timelines, and editorial feature layouts.
- Corners: restrained; avoid excessively rounded consumer-app styling.
- Shadows: subtle and rare.
- Section spacing: generous and responsive.

### 16.3 Typography

- Choose a highly readable, performant font pair or a single professional family.
- Use a distinguished editorial display treatment only where it supports scientific authority.
- Maintain comfortable reading size and line length.
- Do not use tiny text, overly light weights, or all-caps paragraphs.
- Use tabular numerals where dates/timelines benefit.

### 16.4 Carousel and motion

- Carousel controls must be keyboard and screen-reader accessible.
- Users must be able to pause motion.
- Respect `prefers-reduced-motion`.
- Do not rotate so quickly that content cannot be read.
- Avoid autoplay where a static featured composition works better.
- Never hide essential information exclusively inside a rotating slide.

---

## 17. Responsive, accessibility, and content standards

### 17.1 Accessibility target

Target WCAG 2.2 AA.

At minimum:

- Semantic landmarks and heading order.
- Keyboard access to all interactions.
- Visible focus states.
- Sufficient colour contrast.
- Text alternatives for images.
- Captions/transcripts for recorded media when available.
- Form labels, descriptions, and understandable errors.
- Accessible timeline, carousel, dialogs, and map alternative.
- No essential information conveyed by colour alone.
- Skip link and sensible focus management.
- Reduced-motion support.
- Minimum practical pointer target sizes.

### 17.2 Responsive behaviour

- Design mobile-first.
- Test at narrow mobile, large mobile, tablet, laptop, and wide desktop sizes.
- Navigation must remain usable without hiding essential destinations behind confusing interactions.
- Timelines, publication cards, and research metadata must reflow without horizontal scrolling.
- Tables, if any, require an accessible small-screen treatment.
- The hero image crop must not obscure its scientific subject at common aspect ratios.

### 17.3 Editorial style

- Use Indian/British English consistently unless official copy specifies otherwise.
- Write for an informed scientific audience while keeping summaries accessible to students and collaborators.
- Expand uncommon acronyms on first use.
- Use descriptive link labels rather than repeated “click here”.
- Separate verified facts from editorial interpretation.
- Display publication and last-updated dates where they help trust.

---

## 18. SEO and discoverability

- Render meaningful public content in HTML.
- Provide unique titles, descriptions, canonical URLs, and Open Graph metadata.
- Generate `sitemap.xml` from published routes only.
- Configure `robots.txt` to exclude editor, preview, and internal endpoints.
- Add structured data where truthful and useful, such as `Organization`, `NewsArticle`, `Event`, `Person`, and `ScholarlyArticle`.
- Do not mark unverified draft data as structured facts.
- Use stable, readable slugs and permanent redirects when slugs change.
- Ensure news, event, and research archives have crawlable pagination or indexable navigation.
- Provide appropriate social-preview images without embedding unsupported claims.

---

## 19. Performance and reliability budgets

The site is mostly static and must feel immediate on ordinary Indian mobile connections.

Targets for representative public pages:

- Lighthouse performance, accessibility, best-practices, and SEO scores should normally be 90 or above; accessibility issues classified as serious or critical block release.
- Largest Contentful Paint target: under 2.5 seconds at the 75th percentile when measurable.
- Cumulative Layout Shift target: under 0.1.
- Interaction to Next Paint target: under 200 ms where measurable.
- Avoid unnecessary client-side JavaScript.
- Lazy-load below-the-fold media.
- Preload only genuinely critical assets.
- Use responsive images and explicit dimensions.
- Cache immutable assets aggressively.
- Cache public D1 reads and invalidate deliberately.
- Keep the site usable when D1 is temporarily unavailable by serving recent cached public content where possible.
- Provide graceful empty states when no current news/event exists.

Do not pursue a numeric score by removing essential accessibility, content, or functionality.

---

## 20. Cost guardrail

The expected recurring infrastructure cost is approximately INR 700-1,500 per year, primarily for domain registration or renewal.

### 20.1 Default free services

- Cloudflare Workers free tier.
- Cloudflare static asset delivery.
- D1 free tier.
- R2 free allowance.
- Cloudflare Access free plan for the small editor group.
- Cloudflare DNS, CDN, and TLS.
- GitHub private repository and Cloudflare build integration.
- Cloudflare Web Analytics if enabled.

### 20.2 Spending rule

- Do not enable a paid Cloudflare plan, paid SaaS, paid map provider, paid CMS, paid analytics, paid email platform, or paid asset service without explicit approval.
- Before any paid upgrade, report the measured limit, current usage, expected cost, and at least one lower-cost alternative.
- Configure usage visibility and safe limits where the platform permits.
- Treat INR 1,500/year as the normal infrastructure target, not a promise that third-party prices can never change.
- Domain and cloud accounts must be owned by INPA or its authorised representative, not by the developer personally.
- Development and annual maintenance labour are separate from infrastructure cost.

---

## 21. Repository and coding standards

### 21.1 Suggested structure

```text
.
├── app/
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   └── utils/
├── content/
│   ├── about/
│   ├── institutions/
│   ├── people/
│   ├── resources/
│   └── site/
├── server/
│   ├── api/
│   │   ├── public/
│   │   └── admin/
│   ├── database/
│   ├── middleware/
│   ├── services/
│   └── utils/
├── drizzle/
├── migrations/
├── public/
├── tests/
├── nuxt.config.ts
├── drizzle.config.ts
├── wrangler.jsonc
└── CODEX_AGENT.md
```

Adapt the top-level `app/` layout to the exact Nuxt 3 version and repository convention in use. Do not upgrade to Nuxt 4 or restructure solely to follow a newer default unless approved.

### 21.2 TypeScript and Vue

- Enable strict TypeScript.
- Avoid `any`; document rare justified exceptions.
- Use Vue Composition API.
- Keep components focused and reusable.
- Separate presentation, content mapping, validation, and persistence concerns.
- Use shared schemas/types for server validation and editor forms where practical.
- Do not place secrets or administrative logic in client bundles.
- Avoid global state when route data or local state is sufficient.
- Use Pinia only if a real cross-route client-state need emerges.

### 21.3 Dependencies

- Prefer the platform, Nuxt, Vue, and small focused libraries.
- Justify large UI/component libraries; the visual language should not be dictated by a generic theme.
- Do not add a dependency for functionality that can be implemented safely and clearly in a few lines.
- Pin major versions and commit the lockfile.
- If starting a new repository, prefer `pnpm`; otherwise respect the existing lockfile/package manager.

### 21.4 Errors and logging

- Return consistent API error shapes.
- Log request IDs and administrative action context without exposing personal or secret data.
- Provide user-friendly editor errors and actionable retry guidance.
- Use structured server logs where practical.
- Do not swallow errors or expose raw D1/R2 exceptions to clients.

---

## 22. GitHub and deployment workflow

- `main` represents production-ready code.
- Use short-lived feature branches and pull requests for substantive changes.
- Cloudflare must create preview deployments for pull requests where supported.
- Require lint, typecheck, unit tests, and a production build before merging.
- Run D1 migrations explicitly; do not hide production schema changes inside application startup.
- Apply local migrations during development and preview/test migrations before production.
- Document rollback for both application deployment and schema change.
- Keep production bindings/secrets outside GitHub.
- Tag meaningful releases.
- Record architecture decisions that change this file.

Suggested scripts, adjusted to the repository:

```text
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm db:generate
pnpm db:migrate:local
pnpm db:migrate:remote
pnpm deploy
```

---

## 23. Testing requirements

### 23.1 Automated

- Unit tests for validation, date/status logic, slug handling, content mapping, and cache invalidation helpers.
- D1 integration tests against a local test database.
- API tests for public filtering and administrative CRUD.
- Access-control tests proving unauthorised mutation attempts fail.
- Component tests for editor forms and high-risk interactive public components.
- End-to-end tests for:
  - Editor login boundary.
  - Create draft news.
  - Preview news.
  - Publish news and observe public update.
  - Create/update/cancel event.
  - Activate/reorder/deactivate carousel item.
  - Upload and render an approved image/PDF.
  - Archive content.
- Automated accessibility checks on representative routes.
- Link checking for internal links and critical configured external links.

### 23.2 Manual release checks

- Mobile, tablet, and desktop layouts.
- Keyboard-only navigation.
- Screen-reader smoke test for navigation, carousel, timeline, forms, and map alternative.
- Reduced-motion mode.
- Missing-image and empty-content states.
- Invalid, expired, draft, scheduled, archived, postponed, and cancelled states.
- Social-preview metadata.
- Sitemap and robots behaviour.
- Cache invalidation after editor changes.
- Production domain, HTTPS, redirect, and 404 behaviour.
- No placeholders or example claims exposed in production.

---

## 24. Definition of done

A feature is done only when:

- It satisfies the relevant requirement in this file.
- It uses the approved architecture.
- It works at representative responsive sizes.
- It is keyboard accessible and has appropriate semantic markup.
- It has loading, empty, error, and success states.
- Server-side validation and authorisation are present.
- Tests cover its primary logic and critical flow.
- It does not publish unverified content.
- It does not add an unapproved recurring cost.
- Documentation and content schema are updated.
- Lint, typecheck, tests, and production build pass.
- The production or preview behaviour has been visually inspected.

The project release is done only when all public links resolve, editor mutations are protected, production contains no example data, domain ownership is correct, and rollback/recovery instructions have been documented.

---

## 25. Delivery phases

### Phase 0 - Foundation

- Repository, Nuxt 3, TypeScript strictness, package manager, linting, tests.
- Cloudflare Worker/static-assets setup.
- Local and preview D1/R2 bindings.
- Drizzle schema and migrations.
- Cloudflare Access design and route protection.
- Base design tokens and application shell.

### Phase 1 - Public institutional site

- Hero, navigation, President's welcome, About, Quick Access, and Footer.
- Static institutional pages and policy routes.
- Responsive design, accessibility baseline, SEO foundation.

### Phase 2 - News, events, carousel, and editor dashboard

- D1 CRUD and audit metadata.
- R2 media uploads.
- Public news/event routes and archives.
- Upcoming-event timeline.
- Accessible hero/feature carousel.
- Protected editor forms, previews, scheduling, and cache invalidation.

### Phase 3 - Science-first modules

- Featured Research.
- Nuclear Horizons.
- Signature recurring scientific feature.
- Student resources.
- Distinguished scientists and member highlights.

Initially these may use verified repository-managed content while preserving future editor extensibility.

### Phase 4 - National map and refinement

- Verified institution dataset.
- Accessible interactive India map and list alternative.
- Institution detail surfaces.
- Performance, accessibility, editorial, and cross-device QA.
- Production launch and editor training.

Do not let phase boundaries justify a generic or administratively dominated homepage. Even early public releases must preserve the science-first direction.

---

## 26. Required inputs that Codex must not invent

Track these explicitly and request them when they become blocking:

- Official INPA logo and brand usage guidance.
- Confirmed legal/official organisation name and abbreviation styling.
- Approved domain and ownership contact.
- Official President's name, title, photograph, and message.
- Approved About copy.
- Current Executive Council.
- Constitution file and publication status.
- Office address and contact channels.
- Official social-media URLs.
- Membership process and destination URL.
- Donations information/destination, if it should be shown.
- Nuclear Horizons issue, editorial, archive, and submission links.
- Verified events and news for launch.
- Featured research selection and publication permissions.
- Student resources and opportunity owners.
- Institution/map dataset and official links.
- Distinguished scientist and member-highlight approvals.
- Approved scientific imagery, credits, licences, and alternative text.
- Privacy Policy and content-correction contact.

The absence of these inputs must not trigger fabricated production content.

---

## 27. Rules for Codex and future implementation agents

1. Read this entire file before making a plan or changing code.
2. Inspect the repository and existing work before proposing a new structure.
3. Preserve user changes and avoid unrelated rewrites.
4. State assumptions and convert consequential assumptions into explicit decisions or questions.
5. Do not expand scope into payments, member accounts, or paid services.
6. Do not substitute a different framework, database, host, storage service, or authentication provider.
7. Do not publish placeholder facts.
8. Build the smallest coherent feature that satisfies the product philosophy and acceptance criteria.
9. Prefer reusable scientific/editorial components over one-off homepage markup.
10. Keep public delivery static or cached wherever possible.
11. Treat `/admin/**` and `/api/admin/**` as a security boundary.
12. Verify accessibility, responsive behaviour, and content truthfulness before declaring completion.
13. Measure before proposing paid infrastructure.
14. Update documentation, migrations, tests, and this file when an approved decision changes them.
15. End every implementation task with a concise report of changes, verification performed, remaining content dependencies, and any cost impact.

---

## 28. Final decision summary

Build a science-first INPA website in **Nuxt 3 + Vue 3 + TypeScript**, using **Nuxt server routes** on **Cloudflare Workers**, **D1 + Drizzle** for news/events/carousel data, **R2** for media, **Cloudflare Access** for a small trusted editor group, and **GitHub-triggered automatic Cloudflare deployment**. Keep the public site predominantly static or cached, exclude public accounts and payments, never invent scientific or institutional facts, and hold normal recurring infrastructure cost to approximately **INR 700-1,500 per year**, primarily the domain.
