# Onixbit Codex Handoff

Last updated: 2026-06-17

## Purpose

This file is the persistent handoff for new Codex chats. When the user says `/resume`, read this file first, then read:

1. `onixbit-home-redesign-brief.md`
2. `onixbit-tilda-pages-map.md`
3. `onixbit-tilda-insert-links.md`
4. `onixbit-launch-checklist.md`

Do not rely on memory from previous chats.

## Current Project

Detailed home-page redesign brief: `onixbit-home-redesign-brief.md`.

We are building a Tilda site for Onixbit about Bitrix24 implementation, integrations, tariffs, cases, and contacts.

Temporary live domain:

- `https://million-operable-fish.tilda.ws/`

Do not assume the site is on `onixbit.su`; that domain currently may point to another Bitrix environment. The temporary Tilda domain is the working site unless the user says otherwise.

## Working Agreement

- The user wants real page/block generation first, not premature QA.
- Run live/browser checks only after pages are assembled or when the user explicitly asks to check.
- Do not spend the turn on repeated Playwright checks while the content/structure is still known to be incomplete.
- If a session is near the end or the user says `wrap`, update this file with:
  - what changed,
  - what is still pending,
  - exact next action,
  - any live URL or Tilda publication state.
- In a new chat, continue from this file without asking the user to restate the plan.

## Agreed Page Structure

Global Tilda pages:

- Header page: `onixbit-tilda-header.html`
- Footer page:
  1. `onixbit-tilda-contacts-footer.html`
  2. `onixbit-tilda-privacy-modal.html`

Do not duplicate header/footer/privacy blocks on ordinary pages.

Shared files:

- `onixbit-tilda-site-styles.css`
- logo URL already used in HTML: `https://onixbit.su/upload/onixbitru/logo/logo_jumtp.png`

Ordinary pages:

- `/`
  1. `onixbit-tilda-hero-home.html`
  2. `onixbit-tilda-problems.html`
  3. `onixbit-tilda-audience.html`
  4. `onixbit-tilda-services-home.html`
  5. `onixbit-tilda-process-home.html`
  6. `onixbit-tilda-tariffs-home.html`
  7. `onixbit-tilda-trust-home.html`
  8. `onixbit-tilda-cases.html`

- `/vnedrenie-bitrix24`
  1. `onixbit-tilda-hero-implementation.html`
  2. `onixbit-tilda-implementation-scope.html`
  3. `onixbit-tilda-problems.html`
  4. `onixbit-tilda-process.html`
  5. `onixbit-tilda-why.html`
  6. `onixbit-tilda-trust.html`
  7. `onixbit-tilda-cases.html`
  8. `onixbit-tilda-faq.html`

- `/integratsii-bitrix24`
  1. `onixbit-tilda-hero-integrations.html`
  2. `onixbit-tilda-integrations.html`
  3. `onixbit-tilda-integration-scenarios.html`
  4. `onixbit-tilda-platforms.html`
  5. `onixbit-tilda-services.html`
  6. `onixbit-tilda-process.html`
  7. `onixbit-tilda-certificates.html`
  8. `onixbit-tilda-faq.html`

- `/tarify-bitrix24`
  1. `onixbit-tilda-hero-tariffs.html`
  2. `onixbit-tilda-tariffs.html`
  3. `onixbit-tilda-tariff-decision.html`
  4. `onixbit-tilda-price-line.html`
  5. `onixbit-tilda-faq.html`

- `/cases`
  1. `onixbit-tilda-hero-cases.html`
  2. `onixbit-tilda-cases-method.html`
  3. `onixbit-tilda-cases.html`
  4. `onixbit-tilda-audience.html`
  5. `onixbit-tilda-trust.html`
  6. `onixbit-tilda-certificates.html`

- `/contacts`
  1. `onixbit-tilda-hero-contacts.html`
  2. `onixbit-tilda-contact-start.html`
  3. `onixbit-tilda-requisites.html`

## Current State

## 2026-06-17 Header Menu Restored To Page Map

The header menu was corrected to match the actual multipage structure instead of the temporary product-menu wording.

Applied files:

- `onixbit-tilda-header.html`: desktop and mobile menu now use `Внедрение`, `Интеграции`, `Тарифы`, `Кейсы`, `Контакты` with links to the corresponding pages.
- `onixbit-tilda-insert-links.md`: header description updated to the same menu.

Verification:

- `npx playwright test onixbit-pages-smoke.spec.js`: 12 passed.

## 2026-06-17 Restored Onixbit Brand Palette

The user asked to roll back to the palette from the provided brand collection: bright red, black, white, accent yellow, neutral gray, metallic/robot visual language and Montserrat-like bold typography.

Applied files:

- `onixbit-tilda-site-styles.css`: removed the final `28. Bitrix24 inspired product UI refresh` layer, so the active final visual layer is again `26. Onixbit brand refresh: red / black / white system`.
- `onixbit-tilda-insert-links.md`: updated the current concept note to the Onixbit brand collection.

Scope note:

- This rollback changes the active visual palette/style layer. It does not remove page-specific hero blocks, `obx-product-tabs`, or the current multipage content structure unless the user asks for a deeper content/structure rollback.

Verification:

- `npx playwright test onixbit-pages-smoke.spec.js`: 12 passed after updating the smoke selector from the old `.obx-problems__scan-row` to the current `.obx-problems__pain-card`.

## 2026-06-17 Superseded Bitrix24-Style Product Concept

This temporary direction replaced the previous red/black designer concept with a Bitrix24.ru-inspired product UI concept. It is now superseded by the restored Onixbit brand palette. The temporary direction was:

- bright SaaS palette: light blue/white backgrounds, cyan-blue product accents, lime-green CTA buttons, dark blue text;
- product-style structure: short H1s, feature tabs in every hero, menu by product logic (`Возможности`, `Решения`, `Цены`, `Внедрение`, `Кейсы`);
- content logic follows Bitrix24.ru patterns: product capabilities, solutions by industry, marketplace/API integrations, partner-based implementation, business stories, FAQ;
- do not copy Bitrix24 assets or code; use the meaning, layout logic, CTA hierarchy, font scale and interaction patterns.

Applied files:

- `onixbit-tilda-site-styles.css`: previously had final section `28. Bitrix24 inspired product UI refresh`; this section has now been removed;
- all mapped hero blocks now include `obx-product-tabs`;
- all mapped content blocks were text/concept refreshed toward product capabilities, solutions, integrations, prices, partner proof and business stories;
- `onixbit-tilda-insert-links.md` regenerated with the current upload order and block names.

Verification:

- full mapped-block HTML/JS validation: OK;
- Playwright local smoke previews for home, implementation, integrations, tariffs, cases and contacts on desktop and mobile: fixed header, expected H1, 5 product tabs, zero horizontal overflow.

## 2026-06-17 Previous Red/Black Brand Refresh From Designer Screenshots

The user provided designer screenshots for the unified Onixbit style across the site and VK:

- palette: black, white, bright red, accent yellow, neutral gray;
- typography direction: Montserrat-like bold geometric headings;
- visual language: clean white/gray space, strong red brand shapes, black panels, metallic/robot/3D imagery where it supports trust/tech positioning;
- UX direction: fewer words, no traffic leakage to external resources, more proof assets on-site, clear CTA intent by business type.

Applied local site changes:

- `onixbit-tilda-site-styles.css` now has a final brand layer: `26. Onixbit brand refresh: red / black / white system`.
- `onixbit-tilda-hero-home.html`: shortened H1 to `Битрикс24 под процессы бизнеса`, removed the 1-2-3 proof strip from first screen.
- `onixbit-tilda-problems.html`: replaced the heavy diagnostic table with 4 pain cards using `<details>` spoilers; removed CTA from this block.
- `onixbit-tilda-audience.html`: added 4 separate business-type CTA buttons/forms via `data-obx-lead-title`.
- `onixbit-tilda-services-home.html`: removed the extra CTA from the system-map block.
- `onixbit-tilda-tariffs-home.html`: brought tariff/pricing guidance on-site and removed external Bitrix24 traffic leakage.
- `onixbit-tilda-trust-home.html`: restored logo/proof emphasis and added certificate previews with modal opening.
- `onixbit-tilda-cases.html`: shortened case text and made results more explicit.
- `onixbit-tilda-contacts-footer.html`: removed explanatory phone/email text so the form is visually primary.

Verification run:

- Local HTML/script balance check passed for the changed home/footer blocks.
- Playwright check of `/tmp/onixbit-brand-preview.html` passed on desktop `1440x1100` and mobile `390x1200`: no horizontal overflow, fixed header present, hero proof strip absent, 4 diagnostic cards, 4 audience buttons, 3 certificate buttons, certificate modal opens, no external tariff links.

Additional full-site pass:

- Applied the brand refresh to all mapped pages and blocks via shared CSS and block-level edits.
- Removed `obx-hero__proofs` from active internal hero HTML files, not only via CSS.
- `onixbit-tilda-trust.html` now includes a logo/partner proof row and an on-site certificate link.
- `onixbit-tilda-tariffs.html` and `onixbit-tilda-price-line.html`: removed external Bitrix24 navigation CTAs; tariff actions now keep users on-site via contact forms or local comparison anchors.
- Full mapped-block validation passed: header, footer, privacy, all home blocks, all internal page blocks have balanced `div`/`section`/`details`; scripts compile; no old hero proof strips, `Создать бесплатно`, `Официальные тарифы`, or external Bitrix24 CTA links remain.


The old shared `onixbit-tilda-hero-v2.html` was replaced by page-specific hero blocks:

- `onixbit-tilda-hero-home.html`
- `onixbit-tilda-hero-implementation.html`
- `onixbit-tilda-hero-integrations.html`
- `onixbit-tilda-hero-tariffs.html`
- `onixbit-tilda-hero-cases.html`
- `onixbit-tilda-hero-contacts.html`

The user previously changed/published some updated blocks in Tilda. In the latest turn, the user asked where to insert the new internal-page blocks; answer was given with clickable file links and exact page placement.

Launch support files:

Added internal-page commercial blocks:

- `onixbit-tilda-implementation-scope.html` — composition of the implementation project.
- `onixbit-tilda-integration-scenarios.html` — integration data-flow scenarios.
- `onixbit-tilda-tariff-decision.html` — tariff selection criteria.
- `onixbit-tilda-cases-method.html` — case analysis method.
- `onixbit-tilda-contact-start.html` — first-contact instructions and next steps.

- `onixbit-tilda-insert-links.md` now includes human-readable block names next to clickable file links.
- `onixbit-launch-checklist.md` contains the launch-first checklist.

Latest insertion guidance given to the user:

- `/vnedrenie-bitrix24`: insert `onixbit-tilda-implementation-scope.html` after `onixbit-tilda-hero-implementation.html`, before `onixbit-tilda-problems.html`.
- `/integratsii-bitrix24`: insert `onixbit-tilda-integration-scenarios.html` after `onixbit-tilda-integrations.html`, before `onixbit-tilda-platforms.html`.
- `/tarify-bitrix24`: insert `onixbit-tilda-tariff-decision.html` after `onixbit-tilda-tariffs.html`, before `onixbit-tilda-price-line.html`.
- `/cases`: insert `onixbit-tilda-cases-method.html` after `onixbit-tilda-hero-cases.html`, before `onixbit-tilda-cases.html`.
- `/contacts`: insert `onixbit-tilda-contact-start.html` after `onixbit-tilda-hero-contacts.html`, before `onixbit-tilda-requisites.html`.
- Update Tilda custom CSS from `onixbit-tilda-site-styles.css` after adding these blocks.

Known earlier Tilda issue:

- A stray Tilda placeholder block showed `Html code will be here` in the global footer area. It should be removed from the global footer page if still present.

## 2026-06-17 GitHub Setup Complete

The user asked to connect the project to GitHub.

Local git state:
- `lifephoto` is now a local git repo initialized on `main`.
- `.gitignore` was created to keep `node_modules`, Playwright/test output, large temporary Bitrix24 captures, screenshots, and superseded hero blocks out of the repo.
- First commit exists: `032a345 Initial Onixbit Tilda site`.
- `user.name` is `expertvizoff-cpu`.
- `user.email` is `expert.vizoff@gmail.com`.
- GitHub CLI (`gh`) is not installed.
- GitHub remote is configured:
  - `origin git@github.com:expertvizoff-cpu/onixbit.git`
- Local `main` tracks `origin/main`; latest checked state was clean and not ahead/behind.

For future changes:
1. edit files;
2. run focused validation where useful;
3. commit with a clear message;
4. push to `origin main`.

## Next Action

Primary next step is the Tilda production step:
- replace site custom CSS with `onixbit-tilda-site-styles.css`;
- replace global header with `onixbit-tilda-header.html`;
- replace global footer blocks with `onixbit-tilda-contacts-footer.html` and `onixbit-tilda-privacy-modal.html`;
- replace all ordinary-page content blocks according to `onixbit-tilda-insert-links.md`;
- do not upload old `onixbit-tilda-hero.html` or `onixbit-tilda-hero-v2.html`.

After the user publishes Tilda pages and shares the live URL, run one focused live audit before launch:
- page order matches `onixbit-tilda-insert-links.md`;
- site uses Bitrix24-style palette and header;
- each page has the expected new H1 and hero product tabs;
- no duplicate header/footer/privacy blocks;
- no `Html code will be here`;
- no horizontal overflow on mobile/desktop;
- menu, lead form trigger, FAQ, tariff interactions, integration/platform interactions, certificate modal, cookie/privacy work.

## Resume Protocol

On `/resume`:

1. Read this file.
2. Read the three map/checklist files.
3. Ask no broad recap questions.
4. Continue with the "Next Action" above unless the newest user message changes direction.

On `wrap`:

1. Update this file.
2. Include exact next action.
3. Mention any files changed during the session.
4. Keep it short enough to be useful in the next chat.


## Added User Working Rules From Chat History

Additional workflow rules added before wrap:

- When the user needs to copy code into Tilda manually, provide clickable file links in the chat, in exact insertion order. The user can only conveniently open/copy files from links in the chat.
- When giving clickable files for Tilda insertion, always write the human-readable block name next to each file link.
- Keep structure files for Codex, but always translate them into user-facing clickable file lists when it is time to upload/copy blocks into Tilda.
- Tilda API note: official Tilda API is mainly for retrieving/exporting project/page data and syncing published content to an external server. It supports GET JSON requests, requires Business Plan API keys, has a 150 requests/hour limit, and exposes methods like project list, page list, page HTML/full page/export. It does not appear to provide official block-editing/publishing endpoints for replacing T123 HTML blocks in the Tilda editor.
- Therefore, Tilda API can help with reading/verifying/exporting/backup and automated live checks, but likely cannot safely replace manual block editing inside Tilda. If the user provides API keys, use them only via local environment/config files and do not print secrets back.
- Possible automation path later: use Tilda API to map page IDs and verify published HTML; continue manual insertion for blocks unless a safe official editing method is confirmed.


These rules were explicitly added by the user before wrapping the chat:

- Always communicate with the user in Russian.
- Work as a UX/UI designer and frontend builder, not only as a coder.
- Give advice when a better solution exists; do not silently follow a weaker approach if there is a clearly stronger one.
- If tools, dependencies, test libraries, browsers, or other local requirements are missing, install or request approval to install them right away instead of stopping the work.
- If a site image is needed and must be uploaded by the user, create/provide the image asset and ask the user to upload it; after the user returns the URL, insert that URL into the code.
- If an image is needed for the work itself, generate/draw it when appropriate.
- If knowledge is missing, search the internet, learn from strong/top IT company websites, and bring the best applicable ideas back into the site.
- The user does not want premature QA loops. Generate/refine the actual page blocks first; run live/browser checks only when the structure/content is assembled or when explicitly requested.

## Multipage Strategy Background

The project started as a one-page landing page. As it grew, the user asked to turn it into a multipage site.

Main strategy:

- Make the home page lighter.
- Move full/detailed information to internal pages.
- The home page should answer five questions:
  1. Who are you and what do you implement?
  2. Which companies benefit most?
  3. Which problems do you solve?
  4. How does implementation work?
  5. Why should a visitor leave a request specifically to Onixbit?
- Everything else should go to internal pages.

## Home Page Redesign Brief From Earlier Chat

Current block decisions:

- Header: multipage navigation.
- Hero: keep, but lighten and focus on Bitrix24 implementation.
- Audience: keep and shorten.
- Services: turn into a short map of directions; detailed content goes to internal pages.
- Problems: replace with a diagnostic block.
- Implementation stages: keep but shorten; details go to `/vnedrenie-bitrix24`.
- Integrations: shorten on home; full version goes to `/integratsii-bitrix24`.
- Why Onixbit and Trust: merge into one compact trust block.
- Certificates: shorten on home; full gallery can become `/certificates` later.
- Partners/technology contour: move out or keep only a small part of the scheme.
- Project examples: keep as teaser; full cases go to `/cases`.
- FAQ: move out or keep at most three questions on home.
- Licenses/tariffs: keep as a strong teaser; full tariff selector goes to `/tarify-bitrix24`.
- Full tariff line: internal tariff page.
- Final CTA: replace with a short form.
- Requisites: move to `/contacts`.
- Contacts/footer: keep compact on home.
- Policy/cookies: keep technical; policy may later become a separate page.

Desired home page rhythm:

1. hero
2. diagnostic table
3. company segments
4. system scheme
5. timeline
6. tariff teaser
7. trust block
8. project scenarios
9. short form

UX rule:

- Do not put more than two consecutive card-grid blocks on the home page.
- Alternate mechanics: hero, diagnostic table, segments, scheme, timeline, tariff teaser, trust block, scenarios, form.
- The visual system should stay consistent, but each section should feel different in interaction and scanning.

Planned home page content:

- H1: `Внедрение Битрикс24 под реальные процессы компании`
- Subtitle: `Проектируем CRM, задачи, интеграции, права доступа и отчёты так, чтобы руководители видели работу, деньги и ответственных.`
- CTAs: `Обсудить внедрение`, `Разобрать текущую CRM`
- Diagnostic block title: `Когда Битрикс24 нужен не как CRM, а как система управления`
- Diagnostic rows:
  - `Заявки приходят из разных каналов → теряются ответственные → собираем источники в CRM`
  - `Филиалы работают по-разному → нет единой картины → вводим роли, права и регламенты`
  - `Сделки зависят от памяти менеджера → просрочки и хаос → настраиваем этапы, задачи, роботов`
  - `Руководитель собирает отчёты вручную → решения запаздывают → строим контрольные отчёты`
- Audience segments:
  - `Производство`
  - `Строительство и проектные компании`
  - `Компании с филиалами`
  - `B2B-продажи с длинной сделкой`
- System scheme center: `Битрикс24`
- System scheme nodes: `CRM`, `Задачи`, `1С`, `Телефония`, `Сайт`, `Документы`, `Отчёты`, `Права доступа`
- Implementation stages:
  - `Аудит процессов`
  - `Проектирование будущей CRM`
  - `Настройка Битрикс24`
  - `Интеграции и автоматизация`
  - `Запуск, обучение и сопровождение`
- Tariff teaser:
  - `Бесплатный старт`
  - `Облачные тарифы`
  - `Коробочная версия`
  - CTA: `Подобрать тариф`
- Trust block:
  - `Золотой партнёр Битрикс24`
  - `Компетенции CRM / бизнес-процессы / 1С / коробка`
  - `Работаем с проектами, где важны процессы, права, интеграции и отчёты`
  - CTA: `Посмотреть сертификаты`
- Scenario teasers:
  - `Производство: заявки, расчёты, документы`
  - `Строительство: объекты, задачи, подрядчики`
  - `Филиалы: права, регламенты, отчёты`
- Short form title: `Расскажите, что нужно привести в порядок в Битрикс24`
- Short form fields:
  - `Имя`
  - `Телефон`
  - `Компания`
  - `Что нужно сделать?`
- Hidden form metadata:
  - page URL
  - UTM
  - source form
  - request type: `main_short`

## Earlier Implementation History

A first local pass of home-page redesign had already been made in earlier chats. On 2026-06-15 this resume pass added the missing home tariff teaser and updated the home insertion map/tests:

- `onixbit-tilda-tariffs-home.html`: new short tariff/licence teaser for the home page.
- `onixbit-tilda-site-styles.css`: appended styles for `.obx-home-tariffs`.
- `onixbit-tilda-pages-map.md`, `onixbit-tilda-insert-links.md`, `onixbit-tilda-upload-checklist.md`: home order now includes `tariffs-home` between `process-home` and `trust-home`.
- `onixbit-home-first-pass.spec.js`, `onixbit-pages-smoke.spec.js`, `onixbit-current-audit.spec.js`: updated expected home structure.
- Local verification: `npx playwright test onixbit-home-first-pass.spec.js onixbit-pages-smoke.spec.js --reporter=line` passed, 14/14.
- `onixbit-tilda-seo-settings.md`: prepared exact Tilda page SEO settings after live audit showed missing/short title, description, and OG image on internal pages.

Earlier local pass:

- `onixbit-tilda-header.html`: header moved from anchor navigation to multipage navigation.
- `onixbit-tilda-hero-v2.html`: hero was focused on Bitrix24 implementation under real company processes. Later this was superseded by page-specific hero files.
- `onixbit-tilda-problems.html`: overloaded card grid was replaced by the diagnostic format Symptom / What breaks / What we do in Bitrix24.
- `onixbit-tilda-audience.html`: audience block was shortened to four segments: manufacturing, construction/project companies, branches, B2B long-cycle sales.
- `onixbit-tilda-site-styles.css`: CSS was added for the diagnostic block and compact segment grid.
- Focused tests existed for first home blocks and tariffs/price-line, but do not prioritize running tests until the user asks or the page structure is assembled.

Next logical generation step from earlier history is complete for Services/Process/Tariffs/Trust home layers. Remaining production work should focus on Tilda transfer, final visual polish after insertion, or live review when the user requests it.


## Manual Transfer Format

The user chose manual transfer to Tilda. When providing files for copying into Tilda, always format each item as:

1. [filename.html](/absolute/path/filename.html) — human-readable block name

Example:

1. [onixbit-tilda-hero-home.html](/home/aleksander/projects/lifephoto/onixbit-tilda-hero-home.html) — первый экран главной
2. [onixbit-tilda-problems.html](/home/aleksander/projects/lifephoto/onixbit-tilda-problems.html) — диагностический блок проблем

Do not give only filenames when the user needs to copy code. The user opens files from clickable chat links.


## Visual Style Requirement

User requirement added before wrap:

- Blocks must share one visual language but use different mechanics and compositions.
- Blocks must not be bulky.
- Blocks should be easy to understand, beautiful, and interesting.
- The user's favorite existing blocks are:
  - `onixbit-tilda-certificates.html` — certificates/gallery trust block.
  - `onixbit-tilda-tariffs.html` — interactive tariff selection block.
- Keep the tariff selector block available and do not confuse it with `onixbit-tilda-price-line.html`, which is the full tariff line/grid.

Additional style preference:

- The user likes some blocks to be interactive, not all static.
- Every block should have a deliberate background treatment, similar in care to the tariffs block, but not boring or generic.
- Backgrounds should be styled according to the meaning of the block: diagnostic/process/system/trust/cases/tariffs should each have its own visual atmosphere while staying in the same design system.
- Parallax or subtle motion can be added when it supports the section idea and does not make the page heavy or distracting.
- Avoid making all blocks the same card grid. Use varied mechanics: interactive selectors, diagnostic rows, diagrams, timelines, trust/certificate previews, scenario cards, forms.


## Things Not To Miss

Advisor checklist added before wrap:

- Conversion path: each page needs a clear next action, not just nice blocks. CTAs should lead to contact/form/brief, and the CTA text should match the page intent.
- Forms: decide where real Bitrix24 forms/widgets will be embedded, what fields are required, hidden UTM/page/source fields, and what request type is sent. Main short form request type: `main_short`.
- Legal/compliance: privacy policy, cookie notice, consent wording, separate advertising consent if newsletters/marketing messages are planned. Use existing files `onixbit-form-consent-texts.md` and `onixbit-rkn-notification-steps.md`.
- SEO: unique title/description/H1 for every page; avoid duplicate hero wording; internal links between relevant pages; prepare OG image and favicon.
- Analytics: Yandex Metrica / goals / form-submit events / messenger clicks / phone/mail clicks / tariff selector interactions.
- Performance: avoid heavy animations everywhere; use subtle parallax only where meaningful; keep images optimized and uploaded properly.
- Mobile: design mobile as first-class, not as collapsed desktop. Watch long Russian words, button wrapping, horizontal overflow, fixed headers, modal sizes.
- Trust: certificates and partner status should be easy to open/check; don't bury them too far.
- Content density: home page should stay light; detailed explanations belong on internal pages.
- Visual rhythm: every block should have its own meaningful background and mechanic, but all blocks must share one design language.
- Navigation: header/footer links must match real page URLs; don't include CRM/1C/certificates pages in nav until those pages actually exist, unless creating them next.
- Tilda manual transfer: always provide clickable file links with human-readable block names for the user to copy.


## Live Audit 2026-06-15

User explicitly asked to check the important launch requirements now. Audit target: `https://million-operable-fish.tilda.ws/`.

Commands/files used:

- `onixbit-current-audit.spec.js` generated `onixbit-current-audit-report.json`.
- `onixbit-tilda-live-smoke.spec.js` checked live interactions.

Main results:

- HTTP status is 200 for all six pages.
- Desktop/mobile horizontal overflow is 0 on audited pages.
- Header/footer/privacy are present once.
- `Html code will be here` placeholder is gone.
- Home, implementation, tariffs, contacts passed live smoke.
- Tariff selector block exists on `/tarify-bitrix24`.
- Missing on live `/integratsii-bitrix24`: `onixbit-tilda-integrations.html` / selector `.obx-integrations__node` is absent.
- Missing on live `/cases`: `onixbit-tilda-cases.html` / selector `.obx-cases__case` is absent.
- No real HTML/Bitrix24 forms are present; current CTAs lead to contacts/mail/messengers. Need forms later.
- No Yandex Metrica / Google Analytics found; only Tilda stats/dataLayer. Need analytics later.
- Internal pages mostly have weak/empty SEO metadata: short titles, empty meta descriptions, missing OG image. Need Tilda page settings.
- Tilda label/copyright is visible. Decide whether this is acceptable for current tariff/stage.
- Local fix made in `onixbit-tilda-certificates.html`: hidden modal image no longer has empty `src=""`; closeModal now removes src. Re-upload certificates block where used to avoid technical broken image noise.

Immediate manual transfer files to fix live structure:

1. [onixbit-tilda-integrations.html](/home/aleksander/projects/lifephoto/onixbit-tilda-integrations.html) — главный блок схемы интеграций для страницы интеграций
2. [onixbit-tilda-cases.html](/home/aleksander/projects/lifephoto/onixbit-tilda-cases.html) — блок сценариев/кейсов для страницы кейсов
3. [onixbit-tilda-certificates.html](/home/aleksander/projects/lifephoto/onixbit-tilda-certificates.html) — обновлённый блок сертификатов без пустого src в модалке

Next after manual transfer: run one focused live smoke again.


## Wrap 2026-06-15

Session wrapped after user command `/wrap`.

Important user preferences now fixed:

- Communicate in Russian.
- Work as UX/UI designer + frontend builder.
- Manual Tilda transfer remains the workflow.
- When giving blocks for transfer, always use clickable file links followed by a dash and human-readable block name.
- Blocks must share one style but use varied mechanics/compositions.
- Every block should have a meaningful styled background, not a plain boring section.
- User likes interactive blocks and subtle parallax where it supports meaning.
- User especially likes:
  - `onixbit-tilda-certificates.html` — certificates/trust block,
  - `onixbit-tilda-tariffs.html` — interactive tariff selector.
- Do not run unnecessary QA loops before real generation/rework is done.

Current live/audit state:

- Working temporary site: `https://million-operable-fish.tilda.ws/`.
- Audit and smoke were run because user explicitly requested checking the must-have items.
- All six pages returned HTTP 200.
- Header/footer/privacy present once.
- `Html code will be here` placeholder is gone.
- No desktop/mobile horizontal overflow found in audit.
- Tariff selector block exists and works on `/tarify-bitrix24`.
- Missing on live `/integratsii-bitrix24`: `onixbit-tilda-integrations.html` / `.obx-integrations__node` absent.
- Missing on live `/cases`: `onixbit-tilda-cases.html` / `.obx-cases__case` absent.
- Internal page SEO is incomplete: short titles, empty descriptions, missing OG image on most inner pages.
- No real HTML/Bitrix24 forms yet; CTAs go to contacts/mail/messengers.
- No Yandex Metrica / Google Analytics detected; only Tilda stats/dataLayer.
- Tilda label/copyright visible.

Files changed during this session:

- `onixbit-codex-handoff.md` — expanded with working rules, visual preferences, manual transfer format, audit results.
- `onixbit-home-redesign-brief.md` — created as separate home-page redesign brief/TZ.
- `onixbit-current-audit.spec.js` — created live audit script.
- `onixbit-current-audit-report.json` — generated audit report.
- `onixbit-tilda-certificates.html` — fixed hidden modal image: removed empty `src=""`, closeModal now removes src.

Immediate next action in new chat:

1. Read this handoff first, then `onixbit-home-redesign-brief.md`, then map/checklist files.
2. Ask no broad recap questions.
3. Give the user the manual transfer list below, because these are the current live structure gaps:
   1. [onixbit-tilda-integrations.html](/home/aleksander/projects/lifephoto/onixbit-tilda-integrations.html) — главный блок схемы интеграций для страницы интеграций
   2. [onixbit-tilda-cases.html](/home/aleksander/projects/lifephoto/onixbit-tilda-cases.html) — блок сценариев/кейсов для страницы кейсов
   3. [onixbit-tilda-certificates.html](/home/aleksander/projects/lifephoto/onixbit-tilda-certificates.html) — обновлённый блок сертификатов без пустого src в модалке
4. After user says these were transferred, run one focused live smoke, not repeated QA loops.
5. Then continue production work from the brief: home page next layer — system map instead of services, lighter process block, compact trust block.

## Session Update 2026-06-15: Home Compact Blocks

Completed the primary production step from the previous handoff:

- Added short home-only system map: `onixbit-tilda-services-home.html`.
- Added short home-only implementation timeline: `onixbit-tilda-process-home.html`.
- Added compact home-only trust block: `onixbit-tilda-trust-home.html`.
- Appended styles for these blocks to `onixbit-tilda-site-styles.css` section 25.
- Updated the home page insertion order in `onixbit-tilda-pages-map.md` and `onixbit-tilda-insert-links.md`.
- Updated local/live/audit Playwright specs for the new home structure.

Local verification:

- `npx playwright test onixbit-home-first-pass.spec.js onixbit-pages-smoke.spec.js --reporter=line`
- Result: 14 passed.

Current home insertion order:

1. `onixbit-tilda-hero-home.html`
2. `onixbit-tilda-problems.html`
3. `onixbit-tilda-audience.html`
4. `onixbit-tilda-services-home.html`
5. `onixbit-tilda-process-home.html`
6. `onixbit-tilda-trust-home.html`
7. `onixbit-tilda-cases.html`

Next action:

- Give the user clickable links for copying the updated CSS and the new home page blocks into Tilda.
- After the user publishes the updated home page, run live smoke/audit checks against `https://million-operable-fish.tilda.ws/`.

## User Rule: Bitrix24 Forms

If a page/block needs a lead form, do not treat a custom static HTML form as the final production form. Tell the user where the form is needed and that it should be inserted from Bitrix24. Use placeholders or CTA blocks only until the Bitrix24 form embed is available.

## Session Update 2026-06-15: Final CTA Form Slot


- Reworked final CTA into a block with a right-side Bitrix24 form slot.
- Kept the three mini outcome cards below the CTA so existing page rhythm and tests remain stable.
- Added CSS section 26 to `onixbit-tilda-site-styles.css` for the form slot.

Local verification:

- `npx playwright test onixbit-home-first-pass.spec.js onixbit-pages-smoke.spec.js --reporter=line`
- Result: 14 passed.

User needs to update in Tilda:

- `onixbit-tilda-site-styles.css`

Important: final production form should be inserted from Bitrix24 into the form slot.

## Session Update 2026-06-15: Bitrix24 Form Embedded


- `data-b24-form="inline/24/73tsgu"`
- Loader: `https://cdn-ru.bitrix24.ru/b28559462/crm/form/loader_24.js`

Removed the visible placeholder/note from the final CTA. The form now lives inside `.obx-final__form-slot[data-obx-b24-form-slot]`.

Local verification:

- `npx playwright test onixbit-home-first-pass.spec.js onixbit-pages-smoke.spec.js --reporter=line`
- Result: 14 passed.

User needs to update in Tilda:



## Session Update 2026-06-16: Native Bitrix24 Popup CTA

User provided the native Bitrix24 click-popup embed:

- `data-b24-form="click/24/73tsgu"`
- Loader: `https://cdn-ru.bitrix24.ru/b28559462/crm/form/loader_24.js`

Changed:

- `onixbit-tilda-contacts-footer.html`
  - kept existing inline contact form `inline/24/73tsgu`;
  - removed the custom `.obx-lead-modal` HTML wrapper;
  - added one hidden `.obx-b24-popup-trigger` button containing the native Bitrix24 click embed;
  - changed CTA click handling so every `[data-obx-lead-open]` triggers the native Bitrix24 popup, while original hrefs stay as fallback if the trigger is absent.
- `onixbit-tilda-site-styles.css`
  - removed custom popup modal styles;
  - added hidden trigger CSS for `.obx-b24-popup-trigger`;
  - kept the clean header-logo rules that hide the tagline and tighten brand width.

Local verification:

- Searched for old modal refs; no `obx-lead-modal`, `obx-lead-modal-open`, or `data-obx-lead-modal` remain.
- Confirmed remaining popup references are only the hidden native trigger and its JS click bridge.
- No live/browser QA was run yet; update/publish Tilda first.

Immediate next action:

1. Update Tilda with:
   - `onixbit-tilda-contacts-footer.html` - global footer, contacts, and Bitrix24 forms.
   - `onixbit-tilda-site-styles.css` - shared site CSS.
2. Publish pages.
3. Run focused live QA: CTA opens native Bitrix24 popup, inline contact form still renders, menu/footer/privacy/cookie still work, and there is no horizontal overflow.


## Session Update 2026-06-16: Pending Bitrix24 Tariffs Redesign

User wants to continue in this thread and redesign the `Тарифы Битрикс24` block in the Onixbit style, using another website as a structural/design reference.

Current state:

- No new code changes were made after the native Bitrix24 popup CTA work.
- User has not yet provided the reference screenshot/link/HTML for the tariffs block.
- Relevant local files likely to edit next:
  - `onixbit-tilda-tariffs.html` or page-specific tariffs block if the main home block is being replaced.
  - `onixbit-tilda-tariffs-home.html` if this is the home-page tariffs variant.
  - `onixbit-tilda-site-styles.css` for shared styles.

Next action:

1. Ask user for the reference: screenshot, link, or copied structure from the other site.
2. Clarify whether to use official Bitrix24 current prices or user-provided prices. If current prices are needed, browse official Bitrix24 pricing before writing copy.
3. Build the tariffs block in Onixbit visual language, not a direct clone.
4. Keep CTA buttons wired to existing `[data-obx-lead-open]` so they open the native Bitrix24 popup via the footer bridge.


## Session Update 2026-06-16: Bitrix24 Tariffs Calculator Implemented

User asked to rebuild the Bitrix24 tariffs block using official Bitrix24 prices/content and the Kiselev page as an interaction/design reference.

References used:

- Official cloud prices: https://www.bitrix24.ru/prices/
- Official box/self-hosted prices: https://www.bitrix24.ru/prices/self-hosted.php
- Interaction reference: https://kiselevgroup.com/bitrix-korobka/

Changed files:

- `onixbit-tilda-tariffs.html`
  - Replaced the old tariffs block with an interactive calculator.
  - Added cloud/box segmented switch.
  - Added cloud period selector: `1 месяц` and `12 месяцев -30%`.
  - Added cloud cards: Базовый, Стандартный, Профессиональный, Энтерпрайз.
  - Added Enterprise users dropdown: 250, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000.
  - Added box mode cards: Интернет-магазин + CRM, Корпоративный портал, Энтерпрайз.
  - Added box user dropdowns for Корпоративный портал and Энтерпрайз.
  - Kept CTAs wired through `data-obx-lead-open` for the native Bitrix24 popup bridge.
  - Added note that prices were checked on 16 June 2026.
- `onixbit-tilda-site-styles.css`
  - Appended section `44. Тарифы: официальный калькулятор облака и коробки`.
  - Added calculator shell, controls, cards, prices, dropdowns, result panel, and responsive styles.
- `onixbit-tariffs-visual.spec.js`
  - Updated Playwright visual/spec checks for the new calculator.
  - Tests desktop, tablet, and mobile.
  - Verifies period recalculation, Enterprise user recalculation, and box user recalculation.

Official prices captured on 2026-06-16:

- Cloud yearly sale per month:
  - Базовый: `1 743 ₽/мес`, old `2 490 ₽/мес`.
  - Стандартный: `4 893 ₽/мес`, old `6 990 ₽/мес`.
  - Профессиональный: `9 793 ₽/мес`, old `13 990 ₽/мес`.
  - Энтерпрайз from 250 users: `23 793 ₽/мес`, old `33 990 ₽/мес`.
- Cloud monthly Enterprise values:
  - 250: `33 990 ₽/мес`; 500: `59 990 ₽/мес`; 1000: `99 990 ₽/мес`; 2000: `199 990 ₽/мес`; 3000: `299 990 ₽/мес`; 4000: `399 990 ₽/мес`; 5000: `499 990 ₽/мес`; 6000: `599 990 ₽/мес`; 7000: `699 990 ₽/мес`; 8000: `799 990 ₽/мес`; 9000: `899 990 ₽/мес`; 10000: `999 990 ₽/мес`.
- Box annual:
  - Интернет-магазин + CRM, 12 users: `109 000 ₽/год`.
  - Корпоративный портал: 50 `159 000 ₽/год`, 100 `229 000 ₽/год`, 250 `349 000 ₽/год`, 500 `599 000 ₽/год`.
  - Энтерпрайз: 1000 `1 299 000 ₽/год`, 2000 `2 198 000 ₽/год`, 3000 `3 097 000 ₽/год`, 4000 `3 996 000 ₽/год`, 5000 `4 895 000 ₽/год`, 6000 `5 794 000 ₽/год`, 7000 `6 693 000 ₽/год`, 8000 `7 592 000 ₽/год`, 9000 `8 491 000 ₽/год`, 10000 `9 390 000 ₽/год`.

Verification completed:

- `node --check /tmp/onixbit-tariffs-inline.js` passed.
- `node --check onixbit-tariffs-visual.spec.js` passed.
- `LD_LIBRARY_PATH=/tmp/pwlibs/root/usr/lib/x86_64-linux-gnu npx playwright test onixbit-tariffs-visual.spec.js` passed: 3 tests passed.
- Screenshots generated in `test-results/`: `onixbit-tariffs-desktop.png`, `onixbit-tariffs-tablet.png`, `onixbit-tariffs-mobile.png`.

Environment notes:

- `apply_patch` failed with `bwrap: loopback: Failed RTM_NEWADDR: Operation not permitted`; edits were completed via local file-write fallback.
- `git status --short` cannot run here because `/home/aleksander/projects/lifephoto` is not currently a git repository.

Immediate next action:

1. Review `test-results/onixbit-tariffs-desktop.png`, `test-results/onixbit-tariffs-tablet.png`, and `test-results/onixbit-tariffs-mobile.png` if visual tuning is needed.
2. Transfer to Tilda: `onixbit-tilda-tariffs.html` and `onixbit-tilda-site-styles.css`.
3. Publish and run live QA for cloud/box switch, cloud period switch, Enterprise dropdown recalculation, box dropdown recalculation, and CTA popup through the existing Bitrix24 native trigger.


## Session Update 2026-06-16: Tariffs Block Rollback and Page Block Map

Correction after user feedback: the redesigned official Bitrix24 calculator was applied to the wrong block.

Restored/changed now:

- `onixbit-tilda-tariffs.html`
  - Reverted from the official price calculator back to the previous tariff navigator structure.
  - Restored `.obx-tariffs__edition` cloud/box columns, `.obx-tariffs__matrix`, `.obx-tariffs__decision`, `.obx-tariffs__scenario-title`, and Enterprise dropdown interactions expected by existing smoke tests.
- `onixbit-tilda-site-styles.css`
  - Removed appended section `44. Тарифы: официальный калькулятор облака и коробки`.
  - Older tariff navigator styles remain in the file and are active again.
- `onixbit-tariffs-visual.spec.js`
  - Reverted expectations to the old tariff navigator instead of the official calculator.

Tariffs page block order in local page assembly:

1. `onixbit-tilda-hero-tariffs.html` - hero for the tariffs page.
2. `onixbit-tilda-tariffs.html` - restored interactive tariff navigator; this was the mistakenly changed block.
3. `onixbit-tilda-tariff-decision.html` - criteria/how-to-choose tariff block.
4. `onixbit-tilda-price-line.html` - full Bitrix24 tariff line/grid; likely candidate for the official Bitrix price/Kiselev-style redesign if the user chooses it.
5. `onixbit-tilda-faq.html` - FAQ block.
6. Global footer/forms from `onixbit-tilda-contacts-footer.html` and privacy/cookie from `onixbit-tilda-privacy-modal.html`.

Verification after rollback:

- `node --check onixbit-tariffs-visual.spec.js` passed.
- Inline script syntax check for `onixbit-tilda-tariffs.html` passed.
- `LD_LIBRARY_PATH=/tmp/pwlibs/root/usr/lib/x86_64-linux-gnu npx playwright test onixbit-tariffs-visual.spec.js --reporter=line` passed: 3 tests passed.
- `LD_LIBRARY_PATH=/tmp/pwlibs/root/usr/lib/x86_64-linux-gnu npx playwright test onixbit-pages-smoke.spec.js --grep "Тарифы" --reporter=line` passed: 2 tests passed.

Immediate next action:

- Ask user which page block to redesign. Recommended candidate based on their request is probably `onixbit-tilda-price-line.html`, because it is the actual tariff line/grid with 9 cards.


## Session Update 2026-06-16: Price-Line Block Redesign Completed

User confirmed the correct target block is `onixbit-tilda-price-line.html`.

Changed now:

- `onixbit-tilda-price-line.html`
  - Rebuilt as the official Bitrix24 tariff line calculator.
  - Added cloud/box switch.
  - Added cloud license period switch: 1 month / 12 months -30%.
  - Added cloud Enterprise users dropdown: 250 through 10000 users.
  - Added box cards: Интернет-магазин + CRM, Корпоративный портал, Энтерпрайз.
  - Added box user dropdowns for Корпоративный портал and Энтерпрайз.
  - Prices update from the official Bitrix24 values captured on 2026-06-16.
- `onixbit-tilda-site-styles.css`
  - Appended section `44. Тарифная линейка: официальный калькулятор облака и коробки` for the redesigned price-line block.
- `onixbit-price-line-visual.spec.js`
  - Updated to test the new controls and recalculation behavior across desktop/tablet/mobile.
- `onixbit-pages-smoke.spec.js` and `onixbit-tilda-live-smoke.spec.js`
  - Updated expected `.obx-price-line__card` count from 9 to 8.

Verification completed:

- `node --check onixbit-price-line-visual.spec.js` passed.
- Inline script syntax check for `onixbit-tilda-price-line.html` passed.
- `LD_LIBRARY_PATH=/tmp/pwlibs/root/usr/lib/x86_64-linux-gnu npx playwright test onixbit-price-line-visual.spec.js --reporter=line` passed: 3 tests passed.
- `LD_LIBRARY_PATH=/tmp/pwlibs/root/usr/lib/x86_64-linux-gnu npx playwright test onixbit-pages-smoke.spec.js --grep "Тарифы" --reporter=line` passed: 2 tests passed.

Important correction:

- `onixbit-tilda-tariffs.html` remains restored to the previous tariff navigator and is not the redesigned official price-line block.

## Session Update 2026-06-16: Price-Line Cloud Cards Refinement

User requested refinements to the redesigned `onixbit-tilda-price-line.html` block.

Changed now:

- `onixbit-tilda-price-line.html`
  - Moved the free Bitrix24 tariff out of the main cloud grid and into the lower standalone block position.
  - Main cloud grid now contains only paid tariffs: Базовый, Стандартный, Профессиональный, Энтерпрайз.
  - Added fixed user rows for paid cloud tariffs: 5 / 50 / 100 users, aligned with the Enterprise user dropdown row.
  - Replaced cloud feature lists with the official Bitrix24 feature names and icon states captured from the Bitrix24 price page.
  - Changed paid tariff CTA text to `Запросить счёт` and kept `data-obx-lead-open` hooks for later Bitrix24 floating form script wiring.
- `onixbit-tilda-site-styles.css`
  - Added override styles for the new 4-column cloud layout.
  - Added fixed user-row styling, equal description alignment, free tariff bottom card layout, and feature icons for check/plus/lock.
  - Added animated moving hover border on tariff feature rows.
  - Removed the old featured-card vertical lift in the price-line block so user rows align exactly.
- `onixbit-price-line-visual.spec.js`
  - Added checks for the moved free tariff, fixed user rows, official first feature item, free-panel hiding in box mode, and desktop row alignment for cloud user rows/descriptions.

Verification completed:

- `node --check onixbit-price-line-visual.spec.js` passed.
- Inline script syntax check for `onixbit-tilda-price-line.html` passed.
- `LD_LIBRARY_PATH=/tmp/pwlibs/root/usr/lib/x86_64-linux-gnu npx playwright test onixbit-price-line-visual.spec.js --reporter=line` passed: 3 tests passed.
- `LD_LIBRARY_PATH=/tmp/pwlibs/root/usr/lib/x86_64-linux-gnu npx playwright test onixbit-pages-smoke.spec.js --grep "Тарифы" --reporter=line` passed: 2 tests passed.


## Session Update 2026-06-16: Price-Line Support Row Alignment Fix

User reported that on live page `https://million-operable-fish.tilda.ws/tarify-bitrix24` the `Поддержка` row in the first paid cloud tariff visually sat between `Поддержка` and `Администрирование` in other tariffs.

Live check performed on the Tilda page before the fix:

- `Поддержка` top coordinates matched across all cloud cards, but the first tariff row height was `96px` while the other `Поддержка` rows were `45px`.
- Cause: `.obx-price-line__features--bottom` reserved `min-height: 120px`; with only one service row in the first card, CSS grid stretched that single row and its content was vertically centered.

Changed now:

- `onixbit-tilda-site-styles.css`
  - In the final cloud `.obx-price-line__features--bottom` rule, added `display: grid`, `align-content: start`, `justify-content: stretch`, and `grid-auto-rows: minmax(34px, auto)`.
  - This keeps the service rows pinned to the top of the reserved bottom area, so `Поддержка` aligns visually across all cloud tariff cards.
- `onixbit-price-line-visual.spec.js`
  - Added regression checks for bottom list `align-content`, support-row heights, and support/admin row alignment.

Verification completed:

- `node --check onixbit-price-line-visual.spec.js` passed.
- `LD_LIBRARY_PATH=/tmp/pwlibs/root/usr/lib/x86_64-linux-gnu npx playwright test onixbit-price-line-visual.spec.js` passed: 3 tests passed on desktop/tablet/mobile.

Important pending action:

- The fix is local until the user updates Tilda custom CSS from `onixbit-tilda-site-styles.css` and publishes the site.
- After publication, run one focused live re-check of `https://million-operable-fish.tilda.ws/tarify-bitrix24` measuring `Поддержка` row height/top; expected: all `Поддержка` rows same top and row height around `45px`, not `96px` in the first card.

Environment notes:

- `apply_patch` failed again with `bwrap: loopback: Failed RTM_NEWADDR: Operation not permitted`; the CSS/test edits were made via the local `perl -0pi` fallback.
- `/home/aleksander/projects/lifephoto` is not a git repository, so `git status --short` is not useful here.

## Corporate Visual Direction Update - Corrected

Added on 2026-06-17 after user instruction.

- Always use the palette from the user's reference block named Дорогой технологичный as the Onixbit corporate color direction.
- Corporate palette:
  - Primary: #111827
  - Background: #F3F4F6
  - Accent: #00A6A6
  - Text: #111827
  - Muted: #6B7280
- Site pages should use one shared page background, not separate block backgrounds: a fixed gradient/parallax-feeling background across the whole page.
- Blocks should sit on transparent or glass-like surfaces over that shared background.
- Desktop grid should be wider, closer to onixbit.ru: use about 1440px max content width instead of the previous narrow 1180px default where possible.
- The global top menu should behave as a floating sticky header on scroll.
- Current implementation lives as a corporate override layer at the end of onixbit-tilda-site-styles.css; scroll state JS lives in onixbit-tilda-header.html.

## Session Update 2026-06-17: Corporate Palette Live Contrast Fix

User reported on the live Tilda site that after switching to the Дорогой технологичный palette, not all colors changed and some block text became hard to read.

Changed now:

- onixbit-tilda-site-styles.css
  - Added a final Corporate palette contrast fix after live review layer at the end of the file.
  - Fixed the self-referential card surface issue by introducing stable surface variables and explicitly restoring glass-card backgrounds.
  - Restored dark glass panels for blocks that intentionally use white text, especially obx-home-trust__panel, obx-final__box, and obx-footer.
  - Replaced remaining key red accents in buttons, markers, timeline/progress elements and price-line indicators with #00A6A6 / #087F7F.

Verification completed:

- Live page was checked with Playwright computed styles before the fix; main issue was white text on transparent/light background in home trust and footer.
- Local fixed CSS was injected into the live page with Playwright; affected cards/panels showed correct backgrounds and contrast.
- Smoke tests passed: 14 tests passed for onixbit-home-first-pass.spec.js and onixbit-pages-smoke.spec.js.

Pending action:

- User must update Tilda custom CSS from onixbit-tilda-site-styles.css and publish pages again.
