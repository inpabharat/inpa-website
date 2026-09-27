# Design audit refinements

Date: 27 September 2026. Status: implemented and verified; GitHub and production release authorised by the user on 27 September 2026.

## Scope

The user authorised fixing the technical and visual findings in `docs/design-audit-2026-09-27.md`, excluding problems caused by content that is not yet available. Preserve the institutional palette, official messaging, three hero actions, routes, homepage order, existing content records, and publishing workflow. No database content, membership process, payment integration, or deployment was changed.

## Changes

- Shorten the opening copy stack by reducing the phone title and mission scale, tightening spacing, and moving the secondary explanation below the featured update. All required actions remain present.
- Use explicit system sans and Georgia display font stacks instead of declaring an unavailable Inter font. Remove redundant section labels and decorative NNPI numbering/pathway duplication. Retain useful bulletin and President labels.
- Reduce section padding and let the research and bulletin panels follow their own content heights, so a short panel does not stretch into an empty feature.
- Use a dark blue focus outline on light surfaces and a pale gold outline on dark surfaces. Add an accessible pause/resume command for the nucleus background, preserving reduced-motion, offscreen, and hidden-document suspension. Respect reduced motion in the community carousel's programmatic scrolling.
- Add visible disclosure chevrons to desktop and phone navigation.
- Reduce the map introduction and replace its nested main landmark with a labelled section. Group nearby map targets according to rendered width; preserve every institution and its original coordinate data. Offer list-first presentation on phones, with an explicit map/list switch and selectable group members.
- Reconcile selection with both map filters, show a clear combined-filter empty state, and move focus to the selected institution profile when choosing a list or group member.
- Add public canonical URLs and minimal, factual homepage Organization JSON-LD. Canonicals omit query/hash state and exclude admin/API paths. Default to the existing production Worker origin; `NUXT_PUBLIC_SITE_URL` remains the setting for an approved future domain.

## Validation

- `pnpm test`: 14 files, 53 tests passed. New tests verify map grouping retains every institution exactly once, keeps targets separated at phone/desktop widths, handles empty/single-member sets, and canonicalises public paths without exposing admin/API URLs.
- `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `git diff --check`: passed. The build emits upstream Nitro external-dependency/unused-import warnings but completes successfully.
- Inspected the production build through Wrangler with existing local D1/R2 bindings. Existing news, carousel, and bulletin data loads. No browser errors or warnings appeared in the sampled built-site session.
- Homepage responsive checks: no horizontal overflow at 320 × 740, 390 × 844, 768 × 1024, 1280 × 720, and 1440 × 900. At 320 × 740, the three action bottoms are approximately 440, 492, and 544 CSS px, versus 789 through 918 px in the original audit. At 390 × 844, they are approximately 406, 458, and 510 px.
- Verified desktop keyboard menu opening/dismissal and focus restoration; phone disclosure expansion, visible chevrons, and navigation to the directory; list selection of IUAC; selection of IIT Kanpur from a phone map group; and an empty Colleges / High-Energy Nuclear Physics filter combination.
- Verified one main landmark and one h1 on the sampled pages, public canonical changes after client navigation, valid homepage JSON-LD, and no duplicate IDs or missing `aria-controls` targets on the homepage. Homepage eyebrow labels decreased from 13 to 4, with two at top-level section headers.
- Verified pause/resume changes the command label and pauses the rendered background. The existing reduced-motion guards were retained; browser media emulation and a screen-reader session were not available in this verification.

## Deferred content work

Approved research features, upcoming events, opportunity listings, membership procedures, article-level bulletin teasers, and additional institution data remain editorial dependencies. No facts, people, availability claims, or scientific material were invented to fill those gaps. The original audit is retained as the baseline; its dimensions describe the original deployed site, not this local revision.

This is focused UI and technical verification, not a full WCAG certification or a measured performance benchmark.

## Release and rollback

The user explicitly requested pushing this revision to GitHub and deploying production. Follow the existing feature-branch/pull-request workflow, then deploy the merged `main` revision with the checked-in production Worker configuration. No schema migration or content seed is required.

The production version before this release is `bf988227-4b8d-403a-b920-b1c856d1b019`, verified with Wrangler on 27 September 2026. If the deployment fails its smoke checks, restore that version using the existing procedure in `docs/deployment.md`. Worker rollback does not change D1 data or R2 objects.
