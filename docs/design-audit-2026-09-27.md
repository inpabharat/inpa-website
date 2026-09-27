# INPA website design audit

Date: 27 September 2026. Method: `design-taste-frontend`, interpreted against INPA's institutional audience and the repository's product specification.

## Verdict

**Overall editorial judgment: 6/10.** The site has a coherent, credible visual foundation, but its hierarchy and incomplete visitor journeys currently prevent it from feeling like an active national scientific destination. Visual identity is stronger than content usefulness. Preserve the brand and refine the experience; a complete visual replacement is unnecessary.

Reading this as an institutional science website for researchers, students and collaborators, with a restrained, authoritative design language. The strongest improvements are earlier scientific evidence, a shorter mobile hero, and honest, useful destinations.

These ratings are subjective design judgments, not Lighthouse scores or measured user satisfaction:

| Dimension | Assessment | Reason |
| --- | --- | --- |
| Visual identity | Strong | Navy, gold, white and the association mark form a recognisable system. |
| Typography and hierarchy | Mixed | Readable editorial character, but too many large headings and supporting labels compete. |
| Scientific identity | Underdeveloped | Actual research is empty and deep in the homepage; the opening relies on mission statements and animation. |
| Navigation and task completion | Mixed | Clear groups and working disclosures; several prominent promises exceed available content. |
| Mobile experience | Mixed | Reflow works, but the hero delays actions on small phones. |
| Accessibility | Needs correction | Useful keyboard support; confirmed weak focus contrast and an uncontrolled continuous animation. |

## Scope and evidence

Inspected the [live public site](https://inpa-website.inpa-website.workers.dev/) and current repository presentation code. Live routes reviewed: `/`, `/membership`, `/students/opportunities`, `/research`, `/map`, and `/nuclear-horizons`. Tested the homepage at 1440 × 900, 1280 × 720, 768 × 1024, 390 × 844 and 320 × 740.

Used rendered screenshots, DOM geometry, public page text, keyboard interactions and source inspection. Tested desktop menu opening with Arrow Down and dismissal with Escape, mobile menu opening and Escape dismissal, and selection of IUAC from the institution list. Desktop Escape restored focus to its trigger. No horizontal homepage overflow appeared at the five tested sizes. No broken homepage images or captured browser warnings/errors appeared in the sampled checks.

This is a design audit, not a full accessibility certification, deployment audit, scientific fact-check or performance benchmark. No Lighthouse, field Core Web Vitals, screen-reader session, editor workflow or complete link crawl was performed. Deployed commit identity was not established. Current source was used to explain patterns also observed live.

## What should be preserved

- **Institutional palette.** Core tokens are navy `#061a2c`, institutional blue `#0b3558`, gold `#c89b3c`, white, and a cool subtle surface `#f2f6f8`. They suit the organisation. Gold remains an accent rather than overwhelming the page.
- **Editorial character.** Georgia headings can be justified by the scholarly publication context. Serif itself is not the problem; hierarchy and scale need refinement. The body stack declares Inter followed by system fallbacks, without a self-hosted font definition in the inspected CSS. Explicitly resolve the font choice for predictable rendering.
- **Restrained shapes.** Mostly square containers, modest button radii, and limited elevation suit this audience. Circular map markers and category pills have useful roles and need not be forced into one shape.
- **Real community material.** The President's photograph, association photographs and Nuclear Horizons covers provide more credible identity than decorative generic imagery. Their independent permissions and factual provenance were outside this audit.
- **Existing accessibility work.** Preserve the skip link, labelled controls, focus restoration, disclosure semantics, map list alternative, explicit image dimensions and lazy loading.
- **Useful destination grouping.** About, Science, News & Events, Publications, Students and Community are understandable. Improve disclosure cues and destination readiness without casually renaming routes.

## Priority findings

### 1. High: public promises exceed available journeys

The homepage presents “Find an Opportunity”, but its destination says “This route will separate current opportunities from expired listings” and lists the content fields still required. This is implementation planning exposed to visitors. Membership presents amounts but states that application and payment procedures remain unconfirmed. “Upcoming Conference” points to the events route while the homepage reports no upcoming events.

**Recommendation:** Replace implementation notes with concise visitor-facing availability information and an approved next step, such as the established contact route. Until listings exist, do not describe a destination as though it already provides them. Membership can remain informational; no new registration or payment backend is needed. Adapt the conference action to real availability while retaining the required three-action structure and obtaining approval for any configured label change.

Three discovery actions, facility, expertise and collaboration, currently lead to `/map`. That is a reasonable shared foundation, but the differing labels imply differing search capabilities. Explain the directory's current scope or provide meaningful entry states once the relevant data exists.

### 2. High: science arrives too late, and its main feature is empty

At 1440 × 900, the research/publication section begins approximately **3560 CSS px** below the document top. Before it, visitors encounter the hero, a large NNPI framework section, discovery links, association information and an empty updates section. The research card says that no feature is selected; `/research` also reports no published features.

**Recommendation:** Give a verified research story or the available Nuclear Horizons issue much earlier visual prominence. Reduce the amount of introductory explanation before the first concrete scientific item. Publishing one carefully selected feature would improve the experience more than adding decorative sections. If no approved research exists, use an honest compact state rather than an oversized empty feature card. Any section-order change should be an explicit product decision because `CODEX_AGENT.md` specifies homepage hierarchy.

### 3. High: the hero loses its actions on small phones

The desktop hero fits its actions at both tested desktop sizes. At 390 × 844, the title occupies four lines, the hero is about **1156 px** tall, and the third action ends at **853 px**, slightly beyond the first screen. At 320 × 740, the hero is about **1259 px** tall; the first action ends at **789 px**, so none of the three actions is fully visible initially.

The organisation name, mission heading, national tagline and explanatory paragraph repeat related ideas. The additional focus panel repeats them again.

**Recommendation:** Preserve the official name and approved messaging, but reduce mobile heading scale and introductory spacing. Give one supporting statement immediate priority and move secondary explanation lower. Keep the required three actions visible early. These are layout refinements, not reasons to invent shorter official copy or remove required actions.

### 4. High: focus contrast needs correction; animation needs control

The global focus outline uses `#f0bd4f`, 3 px thick with a 4 px offset. The live navigation confirmed that style on a white background. Calculated contrast is approximately **1.74:1**, below the **3:1** requirement for an authored focus indicator against adjacent colours. Use a darker outline on light surfaces and an appropriately contrasting outline on navy. See [W3C's non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

The nucleus canvas runs continuously, with no visible pause/stop control. Source code does respect reduced-motion preferences and suspends work when offscreen or the document is hidden, which are valuable safeguards. They do not provide every visitor an on-page choice to stop the animation. Add a simple pause control or render a static illustration. See [W3C's pause, stop and hide guidance](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

Source and live DOM also show a nested `<main>` on `/map`; use a section within the existing layout landmark. These findings do not establish the accessibility status of every route.

### 5. Medium: excessive labels make the composition feel templated

The seven top-level homepage sections contain **13 `.eyebrow` labels**, including nested labels. Every top-level section has one. The skill's guideline would allow roughly three section-header eyebrows across seven sections; nested category labels require separate contextual judgment. Current repetition still makes the hierarchy unnecessarily busy.

**Recommendation:** Remove redundant header labels first. “News and upcoming events” already identifies its topic; “Current activity” adds little. “Official INPA bulletin” carries useful status and may remain. Let titles, imagery and layout establish rhythm instead of repeating label-title-introduction everywhere. Define NNPI in plain language on first use; the inspected opening does not explain the acronym.

### 6. Medium: whitespace is not adapting to content availability

The homepage measures approximately **6132 px** tall at 1440 × 900 and **8436 px** at 390 × 844. Length alone is not a defect, but the news/events section uses about **646 px** on desktop despite showing only empty states. The research/publication section uses roughly **1048 px** while one side lacks content. The result is long stretches with little new information.

**Recommendation:** Retain generous spacing around meaningful material, but make empty states compact and let section height follow actual content. The NNPI monogram, numbered pillars and repeated pathway text also consume attention without demonstrating new scientific work.

### 7. Medium: the best features need stronger presentation

The map has institution categories, a scientific-area filter and a list alternative; selecting IUAC updated its profile, research areas and facility description. This is a useful scientific resource. Its very large heading pushes the map below the initial desktop screen, and northern markers are visually crowded. Reduce the introduction, bring filters/results forward, and consider list-first presentation or grouping at narrow widths. Multiple marker colours represent real categories and should be judged as semantic colours, not violations of the single-accent guideline.

Nuclear Horizons offers issue cover, month, page count, archive and PDF reading/downloading. Its public page currently emphasises generic introduction and editor/contact metadata; no article-level editorial or review teaser was visible. Add approved article titles, authors and short extracts with source links when available, so visitors can judge the issue before opening a PDF.

The mobile menu works but suppresses native disclosure markers without providing visible replacements. Add consistent chevrons so category rows communicate that they expand.

## Applying the skill fairly

Estimated current dials: `DESIGN_VARIANCE: 4`, `MOTION_INTENSITY: 4`, `VISUAL_DENSITY: 6` for the opening composition. Recommended direction: **4 / 2 / 4**. These are interpretive settings, not measured scores.

Do not mechanically penalise three hero actions, the navy hero/footer, scholarly serif, genuine photographic credits or map category colours. INPA's specification and content needs justify these patterns. Conversely, the skill's concerns about overloaded heroes, redundant micro-labels, decorative numbering, content promises and uncontrolled motion apply here. Punctuation and image-pagination preferences are minor editorial issues and should not displace more consequential fixes.

## Recommended implementation order

1. Correct focus contrast and provide animation control; remove implementation language from public availability pages.
2. Tighten the phone hero and add clear menu disclosure cues.
3. Secure one approved research feature and improve article-level Nuclear Horizons presentation.
4. Review homepage ordering as a product decision; compact empty sections and remove redundant labels.
5. Refine the map's heading, result density and narrow-screen interaction.
6. Run keyboard/screen-reader and automated accessibility checks, followed by measured mobile performance testing.

The sampled homepage contains title, description and social-image metadata, but no canonical link or JSON-LD was observed. Preserve existing routes and metadata during refinement; review canonical URLs, truthful structured data and published-only indexing separately. No ranking or search-traffic baseline was established.

## Source map

Relevant implementation locations: `app/pages/index.vue`, `app/components/home/SiteHero.vue`, `NucleusSimulation.vue`, `NnpiFront.vue`, `ExploreGateway.vue`, `UpdatesHub.vue`, `SciencePublications.vue`, `CommunityHighlights.vue`, `app/components/SiteHeader.vue`, `app/assets/css/main.css`, `motion.css`, `app/composables/useScrollReveal.ts`, `app/pages/map.vue`, `app/layouts/default.vue`, and `content/site/routes.ts`.

This audit changes documentation only. Website source, content, deployment and external data were not modified.
