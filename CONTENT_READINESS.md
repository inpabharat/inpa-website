# Beta-readiness and content checklist

The website publishes only information supported by supplied INPA material or explicit project correspondence. Missing material is shown as a normal unavailable or empty state; it is not replaced with invented content.

- [x] INPA logo image supplied and used.
- [ ] Formal brand usage guidance and production-ready logo files.
- [ ] Confirmed legal/official organisation name and abbreviation styling.
- [x] INPA-owned domain options purchased: `inpaindia.org`, `inpa-india.org` and `inpa-bharat.org`.
- [ ] Confirm the primary domain. `inpa-india.org` is the current preference, but DNS has not been connected.
- [x] President's name, title and portrait supplied; source-backed message summary available.
- [ ] Final author-approved President's web message and formal portrait credit.
- [ ] Approved About copy.
- [ ] Current Executive Council roster, roles, terms and affiliations.
- [ ] Current Constitution file and publication status.
- [x] Office address, Secretary's telephone number and public email address (approved by the INPA President on 10 August 2026).
- [x] Shared mission and high-level relationship between NNPI, the website and Nuclear Horizons (approved as strategic direction on 10 August 2026).
- [x] Proposed NNPI framing, three-element structure and homepage wording supplied in website comments in August 2026.
- [ ] Formal NNPI public-launch approval, framework figure, final document, owners and publication date.
- [ ] Owners, scope, launch status and approved destination content for the five proposed future initiatives.
- [ ] Official social-media URLs.
- [x] Membership amounts supplied: annual ₹1,000; life ₹6,000 or above; donor above ₹21,000; institutional amount undecided.
- [ ] Membership eligibility, duration, renewal, application process, approval process and destination.
- [ ] Donations information or approved destination, if shown.
- [ ] Nuclear Horizons latest issue, cover, editorial, archive and submission route.
- [x] Young Scientist Colloquium programme materials and records for the first two seminars supplied; both seminars are archived as past events.
- [x] Authentic photographs from the INPA inauguration and Nuclear Horizons release at Banaras Hindu University supplied.
- [ ] Verified upcoming news and event announcements.
- [ ] Featured-research selection, citation and publication permissions.
- [ ] Student resources, opportunity owners and review dates.
- [ ] Verified institution/map dataset and official links.
- [ ] Distinguished-scientist profiles and member-highlight approvals.
- [ ] Photographer credit and publication/consent metadata for supplied Banaras Hindu University event images.
- [ ] Identity, context, transcript, consent and caption for the supplied interview video.
- [ ] Scientific/facility imagery, credits, licences and alternative text for the homepage and research features.
- [ ] Privacy Policy and content-correction contact.

## Editor and operational readiness

- [x] INPA-owned GitHub repository connected to Cloudflare builds.
- [x] Separate preview and production Workers and D1 databases created; migrations applied.
- [x] Production editor routes fail closed when Cloudflare Access is absent or invalid.
- [x] Authorised editor names supplied: Bhoomika Maheshwari, Gagandeep Singh and Dr Abhishek.
- [ ] Official email address for each authorised editor.
- [ ] Cloudflare Access application, email allowlist, login method and application audience.
- [x] Editor CRUD interface and administrative APIs for news, events and carousel items, including scheduling, previews and audit revisions.
- [x] Separate R2 preview/production buckets, validated upload endpoint and public immutable-media delivery route.
- [x] Local editor workflow acceptance test and short operating guide.
- [ ] Production editor acceptance test through the final Cloudflare Access policy.

## Public beta blockers in priority order

1. Confirm the primary domain and connect it to the production Worker.
2. Supply the three authorised editor email addresses and configure Cloudflare Access.
3. Configure Cloudflare Access and complete the production editor acceptance test.
4. Supply the current Executive Council, committees and Constitution.
5. Approve the President’s final web message and portrait credit.
6. Confirm membership application instructions and eligibility rules.
7. Provide at least one current news item and one upcoming event, or explicitly approve launching with empty archives.
8. Confirm Nuclear Horizons web-distribution permissions and submission route.
9. Approve public privacy/correction wording and media credits.
10. Complete mobile, keyboard, accessibility, link, metadata and 404 release checks on the primary domain.

## Launch rule

Development fixtures must not be migrated to production. Incomplete routes must remain `noindex` until they contain approved content. No generated or generic image may be presented as a real Indian facility, experiment, scientist or event.
