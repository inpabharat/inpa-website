<script setup lang="ts">
import { nnpiConsultation } from '~~/content/site/nnpi'

const { cover, chapters } = nnpiConsultation
const reply = 'mailto:inpa.bharat@gmail.com?cc=ashkumarjain%40yahoo.com&subject=NNPI%20community%20consultation'
const figureDescriptions: Record<string, string[]> = {
  '/images/nnpi/vision-to-discovery.webp': [
    'Scientists, students, universities, laboratories, industry and government support INPA. INPA connects them through its community platform, knowledge sharing, support for young scientists, outreach, ethics and inclusivity, and excellence and integrity.',
    'Experiment, theory, instrumentation, AI and computation, nuclear data, and applications underpin the NNPI action framework. Its scientific missions, collaboration, infrastructure, human resource development, international partnerships, and coordination support fundamental knowledge, scientific leadership, innovation, and societal impact.',
  ],
  '/images/nnpi/science-led-planning.webp': [
    'Emerging scientific questions inform theory and predictions and are assessed alongside community scientific priorities. Those priorities determine the experimental and theoretical capabilities needed, including accelerators and beams, beamlines and experimental stations, detectors and instrumentation, computing and data infrastructure, and nuclear data and theory support.',
    'Existing facilities, upgrades, new facilities, and international facilities support experiments and observations. Data analysis and interpretation produce new questions, restarting the cycle. Community planning, national coordination, sustained support, and capacity building accompany that cycle.',
  ],
}

useSeoMeta({
  title: 'National Nuclear Physics Initiative',
  description: cover.subtitle + '. Draft for community consultation, version 1.0, 18 November 2026.',
  robots: 'index, follow',
})
</script>

<template>
  <div class="nnpi-page">
    <section class="nnpi-cover" aria-labelledby="nnpi-title">
      <div class="container nnpi-cover__layout">
        <div class="nnpi-cover__title">
          <h1 id="nnpi-title" data-nnpi-source>{{ cover.title }}</h1>
          <p class="nnpi-subtitle" data-nnpi-source>{{ cover.subtitle }}</p>
          <p class="nnpi-edition" data-nnpi-source>{{ cover.label }}</p>
          <p class="nnpi-version" data-nnpi-source>{{ cover.version }}</p>
          <div class="nnpi-actions">
            <a class="button button--gold" href="#chapter-1">Read the framework</a>
          </div>
        </div>

        <section id="consultation-message" class="nnpi-invitation" aria-labelledby="nnpi-message-title">
          <h2 id="nnpi-message-title">Community consultation</h2>
          <p data-nnpi-source><NnpiSourceText :text="cover.message" /></p>
          <p data-nnpi-source><NnpiSourceText :text="cover.response" /></p>
          <div class="nnpi-actions">
            <a class="text-link" :href="reply">Send comments <span aria-hidden="true">↗</span></a>
            <a class="text-link" href="#consultation">See consultation questions</a>
          </div>
        </section>
      </div>
    </section>

    <div id="nnpi-contents" class="container nnpi-reading-layout">
      <nav class="nnpi-contents" aria-label="Framework contents">
        <h2>Contents</h2>
        <ul>
          <li v-for="(chapter, index) in chapters" :key="chapter.id">
            <a :href="`#${chapter.id}`">
              <span v-if="chapter.id !== 'consultation'" class="nnpi-contents__chapter">Chapter {{ index + 1 }}</span>
              {{ chapter.title }}
            </a>
          </li>
        </ul>
      </nav>

      <article class="nnpi-article" aria-label="National Nuclear Physics Initiative consultation draft">
        <section
          v-for="chapter in chapters"
          :id="chapter.id"
          :key="chapter.id"
          class="nnpi-chapter"
          :aria-labelledby="`${chapter.id}-title`"
        >
          <header class="nnpi-chapter__header">
            <p class="nnpi-chapter__label" data-nnpi-source>{{ chapter.label }}</p>
            <h2 :id="`${chapter.id}-title`" data-nnpi-source>{{ chapter.title }}</h2>
            <ul v-if="chapter.sections.some(section => section.id)" class="nnpi-section-links" aria-label="Sections in this chapter">
              <li v-for="section in chapter.sections.filter(section => section.id)" :key="section.id">
                <a :href="`#${section.id}`">{{ section.title }}</a>
              </li>
            </ul>
          </header>

          <section
            v-for="(section, index) in chapter.sections"
            :id="section.id"
            :key="section.id ?? index"
            class="nnpi-section"
            :aria-labelledby="section.id ? `${section.id}-title` : undefined"
          >
            <h3 v-if="section.title" :id="`${section.id}-title`" data-nnpi-source>{{ section.title }}</h3>
            <template v-for="(block, blockIndex) in section.blocks" :key="blockIndex">
              <figure v-if="block.kind === 'figure'" class="nnpi-figure">
                <img :src="block.src" :alt="block.alt" :width="block.width" :height="block.height" loading="lazy" decoding="async">
                <figcaption>
                  <span data-nnpi-source>{{ block.caption }}</span>
                  <a :href="block.src" target="_blank" rel="noopener" class="text-link">Open full-size figure <span aria-hidden="true">↗</span></a>
                  <details v-if="figureDescriptions[block.src]" class="nnpi-figure-description">
                    <summary>Read figure description</summary>
                    <p v-for="line in figureDescriptions[block.src]" :key="line">{{ line }}</p>
                  </details>
                </figcaption>
              </figure>

              <table v-else-if="block.kind === 'table'" class="nnpi-table">
                <caption data-nnpi-source>{{ block.caption }}</caption>
                <thead>
                  <tr><th v-for="cell in block.rows[0]" :key="cell" scope="col" data-nnpi-source>{{ cell }}</th></tr>
                </thead>
                <tbody>
                  <tr v-for="row in block.rows.slice(1)" :key="row[0]">
                    <th scope="row" data-nnpi-source>{{ row[0] }}</th>
                    <td v-for="cell in row.slice(1)" :key="cell" data-nnpi-source>{{ cell }}</td>
                  </tr>
                </tbody>
              </table>

              <ol v-else-if="block.kind === 'list'" class="nnpi-questions">
                <li v-for="(item, itemIndex) in block.items" :key="itemIndex" data-nnpi-source><NnpiSourceText :text="item" /></li>
              </ol>

              <component
                :is="section.title ? 'h4' : 'h3'"
                v-else-if="block.kind === 'heading'"
                :id="block.id"
                class="nnpi-subheading"
                data-nnpi-source
              ><NnpiSourceText :text="block.text" /></component>

              <p v-else :class="{ 'nnpi-callout': block.kind === 'callout' }" data-nnpi-source><NnpiSourceText :text="block.text" /></p>
            </template>
          </section>
          <a class="text-link nnpi-back" href="#nnpi-contents">Back to contents <span aria-hidden="true">↑</span></a>
        </section>
      </article>
    </div>
  </div>
</template>

<style scoped>
.nnpi-cover { background: var(--color-navy-950); }
.nnpi-cover__layout {
  display: grid;
  gap: clamp(1.8rem, 5vw, 4.8rem);
  align-items: center;
  padding-block: clamp(2.25rem, 6vw, 5.75rem);
}
.nnpi-edition,
.nnpi-chapter__label {
  font-size: 0.77rem;
  font-weight: 750;
  letter-spacing: 0.02em;
  color: var(--color-navy-700);
  margin-bottom: 0.65rem;
}
/* The cover's edition line reads as publication details under the subtitle, beside the version. */
.nnpi-edition { color: var(--color-gold-300); letter-spacing: 0.04em; margin-bottom: 0.2rem; }
.nnpi-cover h1 {
  color: var(--color-surface);
  font-size: clamp(2.45rem, 6vw, 5.25rem);
  margin-bottom: 0.85rem;
  text-wrap: balance;
}
.nnpi-subtitle {
  color: var(--color-sky-200);
  max-width: 36ch;
  font-size: clamp(1.05rem, 2.15vw, 1.45rem);
  margin-bottom: 1rem;
}
.nnpi-version { color: var(--color-sky-200); font-size: 0.9rem; }
.nnpi-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.65rem 1.2rem; }
.nnpi-invitation {
  padding: clamp(1.1rem, 3.3vw, 2rem);
  border-top: 3px solid var(--color-gold-500);
  background: var(--color-surface);
  overflow-wrap: anywhere;
}
.nnpi-invitation h2 { font-size: clamp(1.55rem, 3.2vw, 2.1rem); margin-bottom: 0.75rem; }
.nnpi-invitation p { margin-bottom: 0.9rem; }
.nnpi-reading-layout {
  display: grid;
  gap: clamp(2rem, 5vw, 5.5rem);
  padding-block: clamp(2.25rem, 6vw, 5rem);
  align-items: start;
}
.nnpi-contents { border-block: 1px solid var(--color-border); padding-block: 1rem; }
.nnpi-contents h2 { font-size: 1.3rem; margin-bottom: 0.4rem; }
.nnpi-contents ul,
.nnpi-section-links { list-style: none; margin: 0; padding: 0; }
.nnpi-contents li + li { border-top: 1px solid var(--color-border); }
.nnpi-contents a {
  display: block;
  padding: 0.7rem 0.4rem;
  font-weight: 650;
  line-height: 1.4;
  text-decoration: none;
}
.nnpi-contents a:hover { text-decoration: underline; text-underline-offset: 0.2em; }
.nnpi-contents__chapter { display: block; font-size: 0.78rem; color: var(--color-text-muted); font-weight: 600; }
.nnpi-article { min-width: 0; max-width: 52rem; }
.nnpi-chapter + .nnpi-chapter { margin-top: clamp(2.8rem, 7vw, 6rem); }
.nnpi-chapter__header {
  background: var(--color-surface-subtle);
  border-top: 2px solid var(--color-gold-500);
  padding: clamp(1.1rem, 3vw, 2rem);
  margin-bottom: clamp(1.25rem, 4vw, 2.45rem);
}
.nnpi-chapter__header h2 { font-size: clamp(1.85rem, 4.2vw, 3.15rem); margin: 0; }
.nnpi-section-links {
  display: grid;
  gap: 0.35rem;
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.9rem;
}
.nnpi-section-links a { text-underline-offset: 0.2em; }
.nnpi-section { font-size: clamp(1rem, 1.5vw, 1.105rem); line-height: 1.75; overflow-wrap: break-word; }
.nnpi-section + .nnpi-section { margin-top: clamp(2rem, 5vw, 3.3rem); }
.nnpi-section h3 { font-size: clamp(1.42rem, 3vw, 2.02rem); margin-bottom: 0.75rem; }
.nnpi-subheading { margin-top: 1.95rem; margin-bottom: 0.55rem; font-size: clamp(1.12rem, 2vw, 1.3rem); }
.nnpi-section p { margin-bottom: 0.95rem; max-width: 64ch; white-space: pre-line; }
.nnpi-section .nnpi-callout {
  padding: 0.85rem 1rem;
  border-inline-start: 1px solid var(--color-gold-500);
  background: var(--color-surface-subtle);
  color: var(--color-navy-900);
  font-weight: 620;
}
.nnpi-figure {
  margin: clamp(1.5rem, 4vw, 2.65rem) 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface-subtle);
}
.nnpi-figure img { display: block; margin: auto; width: 100%; height: auto; max-height: 51rem; object-fit: contain; background: white; }
.nnpi-figure figcaption { padding: 0.85rem 1rem; font-size: 0.9rem; line-height: 1.55; }
.nnpi-figure figcaption .text-link { display: block; width: fit-content; margin-top: 0.4rem; }
.nnpi-figure-description { border-top: 1px solid var(--color-border); margin-top: 0.75rem; padding-top: 0.7rem; }
.nnpi-figure-description summary { cursor: pointer; font-weight: 700; }
.nnpi-figure-description p { margin: 0.65rem 0 0; }
.nnpi-table {
  width: 100%;
  border-collapse: collapse;
  margin-block: 1.75rem;
  font-size: clamp(0.875rem, 1.45vw, 0.98rem);
  line-height: 1.55;
}
.nnpi-table caption { text-align: start; font-weight: 750; margin-bottom: 0.65rem; }
.nnpi-table th, .nnpi-table td { border: 1px solid var(--color-border); text-align: start; vertical-align: top; padding: clamp(0.5rem, 2vw, 0.85rem); }
.nnpi-table thead { color: white; background: var(--color-navy-900); }
.nnpi-table th:first-child { width: 27%; }
.nnpi-table tbody tr:nth-child(odd) { background: var(--color-surface-subtle); }
.nnpi-questions { max-width: 64ch; padding-inline-start: 1.5rem; margin-bottom: 1.25rem; }
.nnpi-questions li { padding-inline-start: 0.2rem; margin-bottom: 0.65rem; }
.nnpi-back { display: inline-block; margin-top: 0.8rem; }

@media (min-width: 54rem) {
  .nnpi-cover__layout { grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr); }
  .nnpi-reading-layout { grid-template-columns: minmax(10.5rem, 14rem) minmax(0, 1fr); }
  .nnpi-contents { position: sticky; top: calc(var(--header-height) + 1.25rem); }
}
</style>
