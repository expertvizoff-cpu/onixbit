# Onixbit Publication Plan

Last updated: 2026-07-05
Status: active plan from the current point to publication

This file is the detailed route from the finished logo/brandbook stage to the future publication of the redesigned Onixbit website.

## Production Freeze

The working `onixbit.ru` production site must not be touched, replaced, pushed over, or auto-deployed during redesign.

Publication happens only after Aleksander explicitly approves the final migration.

Until then, work happens in:

- Figma boards;
- local project files;
- safe preview routes such as `/preview-onixbit-home-final`;
- screenshots, PDF/PNG exports, and review packages;
- staging only if Aleksander separately approves it.

## Current Point

Done:

- final logo package;
- final brandbook v1.1;
- requisites PDF/DOCX;
- hybrid site architecture direction;
- production-freeze rule in `PROJECT_STATE.md` and `ONIXBIT_SITE_ROADMAP.md`;
- Stage 1 URL inventory approved by Aleksander: preserve all 18 current sitemap URLs, no special legacy redirects planned unless concrete old URLs appear before migration.

Current next implementation step:

```text
Create /preview-onixbit-home-final with the final brand and the first interactive request-route scene.
```

## Definition Of Publication

Publication is not just a push to `main`.

Publication means all of these are true:

1. Aleksander approved the final visual design.
2. Aleksander approved the main copy and page structure.
3. Core routes, forms, navigation, SEO, and analytics are ready.
4. URL preservation and the redirect/no-redirect decision are reviewed.
5. `npm run check` passes.
6. E2E tests pass for main routes and forms.
7. Desktop, laptop, tablet, and mobile screenshots are reviewed.
8. Backup and rollback plan is written.
9. Aleksander gives explicit approval to transfer to production.
10. Only then may production deployment begin.

## Work Tracks

The redesign moves through six connected tracks:

1. Product message and copy: what Onixbit promises and proves.
2. Visual system: final logo, typography, color, components, motion.
3. Public site: homepage, services, proof, articles, contacts.
4. Process demos: dark interactive pages that show real business routes.
5. Conversion system: forms, phone, messengers, Bitrix24 lead path, analytics.
6. Migration system: redirect/no-redirect decision, deployment, smoke tests, rollback.

## Approval Gates

Each gate can be approved, corrected, or paused by Aleksander.

| Gate | Name | Main Question | Output |
| --- | --- | --- | --- |
| G1 | Homepage concept | Does the first screen and message feel like the future Onixbit? | `/preview-onixbit-home-final`, screenshots |
| G2 | Interactive proof | Does the request route clearly explain site + CRM + 1C + control? | reusable scene plus process page draft |
| G3 | Public structure | Are services, navigation, and CTAs clear? | preview pages and site map |
| G4 | Proof and trust | Is there enough evidence for a serious B2B buyer? | cases, certificates, about, article system |
| G5 | Conversion and SEO | Can the site receive, track, and explain leads cleanly? | forms, metadata, schema, analytics plan |
| G6 | Pre-publish QA | Is the redesign safe to move to production? | test results, screenshots, migration checklist |
| G7 | Publication | Are we ready to touch `onixbit.ru`? | explicit approval, deployment, smoke test |

## Target Site Hierarchy

```text
Homepage (/)
├── Services
│   ├── Bitrix24 implementation (/vnedrenie-bitrix24)
│   ├── 1C-Bitrix websites (/razrabotka-saitov-na-1c-bitrix)
│   ├── 1C:Enterprise work (/raboty-po-1c-predpriyatie)
│   └── Licenses and tariffs (/tarify-licenziy)
├── Process demos
│   ├── Request route (/processy/marshrut-zayavki)
│   ├── Website order through CRM and 1C (/processy/zakaz-s-sayta-v-crm-i-1c)
│   ├── Exchange failure (/processy/sboy-obmena)
│   └── Executive control (/processy/kontrol-rukovoditelya)
├── Proof
│   ├── Cases (/cases)
│   ├── Case detail (/cases/[slug])
│   └── Certificates (/certificates)
├── Knowledge
│   ├── Articles (/articles)
│   └── Article detail (/articles/[slug])
├── Company
│   ├── About (/o-kompanii)
│   ├── Contacts (/contacts)
│   └── Privacy (/privacy)
└── System pages
    ├── Sitemap
    └── 404
```

## Target Navigation

Header:

1. Услуги
2. Процессы
3. Кейсы
4. Сертификаты
5. Статьи
6. Контакты
7. CTA: Получить диагностику

Footer:

- Услуги: Bitrix24, 1C-Bitrix, 1C, лицензии.
- Процессы: маршрут заявки, заказ через CRM и 1C, сбой обмена, контроль руководителя.
- Доверие: кейсы, сертификаты, о компании.
- Контакты: 8 800 100-53-03, прямой номер 8 920 272-48-28, email, messengers.
- Документы: privacy, requisites.

## Stage 0 - Locked Foundation

Status: done enough to proceed.

Artifacts:

- `ONIXBIT_BRANDBOOK.md`
- `output/logos/final/`
- `output/brandbook/onixbit-brandbook-final-package-2026-07-05.zip`
- `output/requisites/onixbit-requisites-11.pdf`
- `output/requisites/onixbit-requisites-11.docx`
- `ONIXBIT_SITE_ROADMAP.md`
- this file

Done criteria:

- logo is not reopened without explicit request;
- brandbook is the visual source of truth;
- production-freeze rule is active.

## Stage 1 - Current Site Inventory

Status: approved by Aleksander on 2026-07-05.

Decision: preserve all 18 current sitemap URLs, do not plan special redirects from unknown old URLs, and use `8 800 100-53-03` as the primary phone plus `8 920 272-48-28` as the direct display phone.

Goal: understand what must be preserved before any migration.

Tasks:

1. List current important production URLs.
2. Mark URLs that must be preserved.
3. Mark pages that can be replaced later.
4. Record that no special legacy redirects are planned unless concrete old URLs appear before migration.
5. Record current contact, form, analytics, and legal requirements.

Artifacts:

- `ONIXBIT_PRODUCTION_URL_INVENTORY.md`
- no separate redirect plan is needed unless concrete old URLs appear before migration

Done criteria:

- no important live URL is forgotten;
- there is a clear difference between preview work and future production replacement.

## Stage 2 - Signature Homepage Preview

Goal: create the first serious future-facing homepage without touching production.

Route:

```text
/preview-onixbit-home-final
```

Core sections:

1. First screen: final logo, core offer, phone, CTA, connected-system visual.
2. Route scene: site/form/chat -> CRM -> manager/task -> 1C/EDO -> control.
3. Service directions: Bitrix24, 1C-Bitrix websites, 1C, licenses.
4. Business pains: lost requests, manual copying, unclear responsibility, exchange failures.
5. Proof strip: certificates, cases, partner statuses, articles.
6. Diagnosis/contact block: phone, messengers, short form.

Done criteria:

- Aleksander approves the direction;
- desktop, laptop, tablet, and mobile screenshots are reviewed;
- no horizontal overflow;
- final logo is used correctly;
- copy is concrete and serious;
- motion has business meaning and reduced-motion fallback.

## Stage 3 - Reusable Interaction System

Goal: turn the homepage scene into reusable process-demo building blocks.

Tasks:

1. Build reusable route nodes: source, CRM, manager, 1C, EDO, control.
2. Build state transitions: new request, assigned, synced, risk, closed.
3. Build reduced-motion static fallback.
4. Build mobile version that is clear without tiny labels.
5. Keep the scene explainable without instructions.

Artifacts:

- reusable component or component family;
- screenshot set;
- Playwright interaction checks.

Done criteria:

- the scene can be reused on homepage and process pages;
- it does not depend on production data;
- it works without external services.

## Stage 4 - First Dark Process Page

Goal: create the flagship wow proof page.

Target route after approval:

```text
/processy/marshrut-zayavki
```

Recommended preview route first:

```text
/preview-processy-marshrut-zayavki
```

Page story:

1. Client sends request from site, form, chat, or channel.
2. Bitrix24 creates the deal with source and context.
3. Manager gets responsibility, task, and next action.
4. 1C or EDO status is checked where relevant.
5. Director sees status, risk, SLA, and responsible person.

Done criteria:

- Aleksander approves the scenario and tone;
- dark page feels premium but not decorative;
- page links back to Bitrix24 service, cases/proof, and contact;
- E2E checks cover interaction and mobile layout.

## Stage 5 - Public Service Pages

Goal: rebuild commercial pages around the connected-system positioning.

Priority pages:

1. `/vnedrenie-bitrix24`
2. `/razrabotka-saitov-na-1c-bitrix`
3. `/raboty-po-1c-predpriyatie`
4. `/tarify-licenziy`

Each page must include:

- service-specific H1;
- who it is for;
- what Onixbit does;
- process and responsibility;
- risks Onixbit removes;
- proof links;
- related process demo;
- CTA to diagnosis/contact.

Done criteria:

- pages are coherent as a group;
- header/footer navigation supports them;
- internal links connect service -> process -> proof -> contact;
- metadata drafts exist.

## Stage 6 - Proof And Trust System

Goal: make the site credible enough for serious buyers.

Tasks:

1. Create `CASE_TEMPLATE.md`.
2. Create or refine `CONTENT_GUIDE.md`.
3. Prepare at least one real case draft if source material exists.
4. Improve certificate presentation if needed.
5. Prepare company/about page with calm proof, not hype.
6. Connect articles to services and process pages.

Pages:

- `/cases`
- `/cases/[slug]`
- `/certificates`
- `/o-kompanii`
- `/articles`
- `/articles/[slug]`

Done criteria:

- no invented results, clients, or credentials;
- proof blocks are linked from commercial pages;
- article and case tone matches Onixbit brand.

## Stage 7 - Conversion System

Goal: make the site useful as a lead source.

Tasks:

1. Define main CTA: diagnostic consultation.
2. Define form fields and required consent.
3. Define Bitrix24 lead/deal destination.
4. Define email fallback if Bitrix24 integration is not ready.
5. Define phone and messenger tracking.
6. Add success, error, loading, and validation states.
7. Confirm privacy text and legal links.

Done criteria:

- forms work in preview/staging;
- failed submissions are not silently lost;
- no secrets are committed;
- Aleksander knows what credentials/settings are needed for final Bitrix24 integration.

## Stage 8 - SEO, Schema, Analytics

Goal: make the redesign publishable without losing search clarity.

Tasks:

1. Write metadata for all main pages.
2. Keep one clear H1 per page.
3. Add breadcrumbs where useful.
4. Add schema for organization, breadcrumbs, articles, and services where appropriate.
5. Prepare sitemap/robots review.
6. Keep the approved no-redirect decision; prepare a redirect map only if concrete old URLs appear before migration.
7. Define analytics events: CTA click, phone click, messenger click, form start, form submit, process interaction.

Done criteria:

- metadata and schema pass review;
- internal links are deliberate;
- current important URLs are preserved, and the no-redirect decision is documented;
- analytics can answer where leads came from.

## Stage 9 - Full Preview Build

Goal: assemble the future site as one coherent preview before migration.

Tasks:

1. Connect homepage, service pages, process pages, proof, articles, contacts.
2. Review header, footer, mobile navigation, and CTAs.
3. Remove dead preview-only experiments from the approved preview path.
4. Produce screenshot package.
5. Produce final content checklist.

Done criteria:

- the preview can be reviewed as if it were the real site;
- no approved user path ends at a dead page;
- mobile navigation is clean;
- footer includes required legal/contact links.

## Stage 10 - Quality Gate

Goal: prove the redesign is technically safe.

Checks:

```bash
npm run check
npm run test:e2e
npm run lhci
```

Additional audits:

- Playwright desktop, laptop, tablet, mobile screenshots;
- horizontal overflow check;
- form behavior check;
- keyboard navigation check;
- reduced-motion check;
- image weight and lazy-loading review;
- 404 and privacy page check.

Done criteria:

- blocking issues are fixed;
- known non-blocking issues are documented;
- Aleksander approves the final preview package.

## Stage 11 - Migration Plan

Goal: write the exact production move before touching `onixbit.ru`.

Tasks:

1. Choose migration method: replace current routes, staged branch, or controlled deploy.
2. List exact files/routes that will become production.
3. Confirm URLs and the redirect/no-redirect decision.
4. Confirm environment variables and secrets are present outside git.
5. Confirm backup and rollback procedure.
6. Confirm deployment window.
7. Confirm smoke-test checklist.

Artifacts:

- `ONIXBIT_MIGRATION_PLAN.md`
- `ONIXBIT_REDIRECT_PLAN.md`
- final screenshot package
- final test output summary

Done criteria:

- Aleksander explicitly says to proceed with production migration.

## Stage 12 - Publication

Goal: move the approved redesign to production safely.

Steps:

1. Re-run final checks.
2. Create final commit.
3. Push only after explicit approval.
4. Let deployment run.
5. Smoke test production:
   - homepage loads;
   - core service pages load;
   - process page loads;
   - contact/form path works;
   - phone and messenger links work;
   - no obvious console errors;
   - no broken critical assets;
   - no unexpected redirects.
6. If critical failure appears, rollback according to the written rollback plan.

Done criteria:

- `onixbit.ru` serves the approved redesign;
- smoke tests pass;
- Aleksander receives the deployment result.

## Stage 13 - Post-Publication Stabilization

Goal: catch problems early and improve from real use.

First 24-72 hours:

- monitor uptime and form submissions;
- verify analytics events;
- check Search Console / indexing basics when available;
- inspect error logs if configured;
- check mobile and desktop manually again;
- gather Aleksander feedback.

First 2-4 weeks:

- add or improve cases;
- improve articles and internal links;
- refine CTAs from real behavior;
- plan the next process-demo pages;
- improve Lighthouse and conversion metrics if needed.

## Content Needed From Aleksander

The plan can start without all of this, but publication quality improves when these are available:

- real case stories or anonymized project examples;
- certificates and partner proof already approved for public use;
- photos/video if Aleksander wants a more personal trust layer;
- exact Bitrix24 lead destination and form requirements;
- analytics accounts/events preference;
- old URLs that must never break;
- legal/privacy text confirmation.

## Persistent Handoff

Future chats must read files in this order:

1. `PROJECT_STATE.md`
2. `ONIXBIT_SITE_ROADMAP.md`
3. `ONIXBIT_PUBLICATION_PLAN.md`

Then continue from the first unfinished stage. If there is doubt, continue from Stage 2: `/preview-onixbit-home-final`.
