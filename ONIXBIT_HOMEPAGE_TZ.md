# Onixbit Homepage TZ

Last updated: 2026-07-06

Status: working technical and creative brief for `/preview-onixbit-home-final`.

This document defines the next homepage preview. It must be read before designing or coding the new Onixbit homepage.

## Non-Negotiable Rules

1. Do not touch, replace, publish, or deploy over the working `onixbit.ru` production site.
2. Build first in the safe Next.js preview route: `/preview-onixbit-home-final`.
3. Use the final logo system from `output/logos/final/`. Default: `lockup/primary`; dark process screen: `lockup/inverse-red` or `lockup/inverse-white`.
4. Use the approved Onixbit brand colors. Do not replace the brand with a generic navy/blue enterprise palette.
5. Do not build a template-like agency homepage with repeated same-size cards and standard rows.
6. The page must be centered on the request route, not on a list of services.
7. No invented testimonials, client logos, metrics, guarantees, or case results.
8. Motion must explain cause and effect. Decorative animation is a rejection reason.

## Core Idea

The homepage must show that Onixbit connects website, Bitrix24, 1C, communication channels and management control into one managed route of a request.

The visitor should understand the idea in the first 10-15 seconds without reading long text:

```text
Ониксбит соединяет сайт, Битрикс24, 1С и коммуникации
в управляемый маршрут заявки.
```

The page is not a text explanation of services. It is an interactive B2B process stand where the visitor chooses a business problem and sees how the route changes.

## Visual Solution

Use a light serious public homepage with one dominant dark process screen.

The page should feel like:

- a premium B2B technology integrator;
- a control center for the business route;
- a calm but expensive system demonstration;
- a light trustworthy website with a dark technical stand inside it.

The sections should flow into each other. Avoid a stack of identical rectangular blocks. Use asymmetry, overlaps, changing section heights, route-linked elements and visual continuity from the dark process screen into later sections.

## Brand Colors

Use the brandbook tokens:

| Token | Value | Role |
|---|---:|---|
| `--ob-red` | `#ed1c24` | CTA, active route point, Onixbit energy, risk focus |
| `--ob-red-deep` | `#b80f17` | hover, dark process accents, depth |
| `--ob-yellow` | `#ffd45a` | proof warmth, secondary signal, status highlight |
| `--ob-yellow-deep` | `#f0a911` | amber focus and dark-mode glow |
| `--ob-ink` | `#080808` | primary text |
| `--ob-graphite` | `#242424` | dark surfaces |
| `--ob-muted` | `#5f626a` | secondary text |
| `--ob-soft` | `#f5f5f2` | light page background |
| `--ob-soft-2` | `#ececea` | separators and soft panels |
| `--ob-white` | `#ffffff` | clean surfaces |
| `Signal blue` | `#2f86ff` | restrained CRM/data signal only |
| `Signal green` | `#66e3a2` | restrained success/control signal only |
| `Black cherry` | `#18070a` | dark process depth |
| `Night graphite` | `#09090b` | dark process base |

Important: blue and green are secondary data/status lights. They are not the main brand palette.

## Page Structure

The order is fixed, but the visual treatment should not look like standard blocks.

### 1. Hero And Process Stand

Purpose: communicate the whole company positioning immediately.

Content:

- H1: `Связываем сайт, Битрикс24, 1С и коммуникации в управляемый процесс`
- short support line: `Показываем, где теряется заявка, кто отвечает за следующий шаг и какой статус видит руководитель.`
- primary CTA: `Разобрать мой маршрут`
- secondary CTA: `Получить диагностику`
- phone: `8 800 100-53-03`

Visual:

- final logo in the header;
- light public shell;
- large dark process screen as the main object;
- route: `Источник -> Битрикс24 -> Ответственный -> Задача/SLA -> 1С/обмен -> Контроль`;
- the route screen is visually stronger than the text column.

### 2. Scenario Control Panel

Purpose: replace the usual service list with self-selection.

Scenarios:

- `Заявки теряются`
- `CRM не управляется`
- `Сайт отдельно от продаж`
- `1С и CRM расходятся`
- `Нужен тариф Битрикс24`

Behavior:

- controls are visible as part of the process screen or attached to it;
- selecting a scenario changes route state, active node, status text and risk highlight;
- use buttons or segmented controls, not decorative pills without state;
- each selected scenario must have one clear business result.

### 3. Route Result States

Purpose: show what changes after Onixbit work.

Statuses:

- `Источник виден`
- `Ответственный назначен`
- `Срок контролируется`
- `Статус обмена понятен`

Visual:

- treat these as system statuses, not as ordinary benefit cards;
- they can emerge from the process route as confirmed checkpoints;
- include icon/text, not color alone.

### 4. Directions As System Nodes

Purpose: show services as parts of one contour.

Directions:

- `Битрикс24`
- `Сайты на 1С-Битрикс`
- `Работы по 1С`
- `Лицензии и тарифы`

Design:

- do not create four identical service cards in a row;
- make them feel like route modules or contour zones;
- each direction answers: `какую часть контура усилить?`;
- each links to the relevant future/current service route.

### 5. Proof And Trust Strip

Purpose: reduce buyer risk without fake proof.

Use only confirmed material:

- `14 лет опыта`;
- partner statuses;
- certificates;
- links to cases and articles;
- real logos only after source confirmation.

Design:

- compact, strict and close to the CTA or route explanation;
- no logo dump;
- no fake reviews;
- no decorative certificate carousel that hides the proof.

### 6. First Safe Step

Purpose: productize the next action as a low-risk first step.

Offer name:

```text
Диагностика маршрута заявки
```

What the client gets:

- map of the current route;
- list of loss/risk points;
- first realistic work stage;
- risk and integration notes;
- recommendation: audit, setup, prototype, license calculation, or separate integration specification.

Design:

- this is a continuation of the route, not a table;
- avoid exaggerated guarantees;
- frame it as a clear first step before a larger project.

### 7. Contact And Lead Route

Purpose: make the conversion easy and route-ready.

Include:

- short form;
- primary phone `8 800 100-53-03`;
- direct phone `8 920 272-48-28`;
- messengers;
- privacy/consent link.

Form fields for first preview:

- name;
- phone or messenger;
- short description of the route/problem;
- optional scenario prefill from the selected scenario.

RevOps requirement:

- pass selected scenario, page URL, UTM/source and CTA location into the lead context when the form is later connected to CRM;
- do not require too many fields upfront;
- define fallback owner and response SLA before production wiring.

## Animation Specification

The animation is a business-process simulation, not decoration.

### Default Route Loop

1. A new request appears at the source node.
2. A pulse moves to Bitrix24.
3. A deal appears in CRM.
4. Responsible person becomes active.
5. Task and SLA appear.
6. 1C/exchange status updates.
7. Management control receives the final status.
8. Status line changes through:

```text
Новая -> Назначена -> В работе -> Синхронизирована -> Под контролем
```

The loop should have readable pauses. It must not be a fast endless neon line.

### Scenario States

`Заявки теряются`:

- highlight the break between source and CRM;
- show a lost signal, then a restored route;
- result: `заявка попадает в CRM с источником и контекстом`.

`CRM не управляется`:

- highlight CRM, responsible and SLA;
- show unmanaged statuses, then assignment and task;
- result: `ответственный и следующий шаг видны`.

`Сайт отдельно от продаж`:

- highlight source, form/page/UTM and CRM deal;
- show how context enters CRM;
- result: `менеджер видит, откуда и с чем пришёл клиент`.

`1С и CRM расходятся`:

- highlight CRM -> 1C exchange;
- show conflict or delay, then clear exchange status;
- result: `статус обмена становится проверяемым`.

`Нужен тариф Битрикс24`:

- highlight Bitrix24 and license/tariff zone;
- show tariff choice as a result of process needs, not a price-only table;
- result: `тариф выбирается под реальную модель работы`.

### Motion Rules

- Use `motion` for React where it improves state transitions.
- Animate transform and opacity first; avoid layout-shifting width/height animation.
- Micro-interactions: 150-300ms.
- Complex scenario state transitions: up to 400ms.
- Prefer one orchestrated route animation over many unrelated effects.
- Provide `prefers-reduced-motion` fallback: static route with selectable states and visible result text.
- Never block useful content behind a loader.

## Copy And Sales Rules

Tone: expert, calm, specific, practical, business-focused.

Use customer language:

- `заявки теряются`;
- `CRM есть, но процесс не управляется`;
- `сайт не связан с продажами`;
- `1С и CRM показывают разное`;
- `руководитель узнаёт о проблеме поздно`;
- `маршрут заявки`;
- `ответственный`;
- `срок`;
- `статус обмена`;
- `контроль руководителя`.

Avoid:

- `инновационные решения`;
- `цифровая трансформация`;
- `лучший результат гарантирован`;
- fake urgency;
- fake scarcity;
- invented ROI.

CTA hierarchy:

- primary: `Разобрать мой маршрут`;
- secondary: `Получить диагностику`;
- tertiary/link: `Посмотреть путь заявки`.

The homepage must serve two buyers:

- ready buyer: can contact immediately;
- researching buyer: can interact with the route and self-identify the problem.

## SEO And GEO Requirements

Preview route rule:

- `/preview-onixbit-home-final` should not be treated as the final public indexable route.
- Final SEO rules apply when approved content moves to `/`.

Final homepage SEO intent:

- brand + B2B integrator intent;
- Bitrix24, 1C-Bitrix, 1C, integrations and CRM route intent;
- answer-engine clarity around `маршрут заявки`, `сайт + CRM + 1С`, `внедрение Битрикс24`.

Final page must include:

- one visible H1;
- unique title and meta description;
- canonical URL;
- Open Graph image;
- descriptive internal links to services, certificates, cases, articles and contact route;
- visible HTML text for the core promise, not only canvas/SVG text;
- no internal SEO notes visible in public copy.

Structured data candidates for final `/`:

- `Organization`;
- `WebSite`;
- `BreadcrumbList` where appropriate;
- `FAQPage` only if real visible FAQ is present;
- service schema only where visible page content supports it.

GEO/citation readiness:

- include short self-contained explanation blocks;
- define `маршрут заявки` plainly;
- keep facts consistent with the brandbook and product marketing context;
- do not create AI-only hacks or unverifiable claims.

## Technical Implementation Rules

Use the existing root Next.js 16 / React 19 / Tailwind 4 project.

Architecture:

- Server Components by default.
- Client Component boundary only around the interactive process stand and form interactivity.
- Keep static copy, metadata and layout server-rendered.
- Do not put `'use client'` at the page root unless there is no narrower option.
- Use composition and data-driven scene definitions instead of boolean-heavy components.

Styling:

- use existing Onixbit CSS tokens and container rhythm;
- keep `--ob-container = 1700px`;
- use section width `min(var(--ob-container), calc(100% - 48px))`;
- preserve mobile/tablet gutter rules;
- avoid raw random hex values inside components when a token exists;
- use lucide-react icons consistently when icons are needed.

Assets:

- use final logo assets only;
- use `next/image` for real raster assets;
- reserve dimensions/aspect ratios to prevent layout shift;
- lazy-load below-fold heavy visuals.

## Accessibility Requirements

- Semantic structure: header, main, section, nav, form.
- One H1.
- Scenario controls are real buttons or tabs with accessible selected state.
- Route status changes use `aria-live="polite"` where useful.
- No information is communicated by color alone: risk/success must also have text/icon.
- All controls work by keyboard.
- Focus indicators are visible.
- Tap targets are at least 44px where practical.
- Form fields have visible labels.
- Reduced-motion mode is fully usable.
- The page must work at 200% zoom without text overlap.

## Performance Requirements

Targets for the preview quality gate:

- no horizontal overflow on 375px, 768px, 1024px, 1366px, 1440px and wide desktop;
- CLS below 0.1 for the route;
- LCP should remain fast enough for a marketing homepage;
- interaction should not feel blocked by animation;
- avoid heavy third-party scripts in the preview;
- animation should use GPU-friendly properties;
- clean up timers, observers and event listeners.

If the process screen becomes canvas/WebGL later:

- keep critical labels and CTAs in accessible DOM;
- provide static fallback;
- test nonblank rendering and responsive framing.

## Analytics And Measurement

Track for decisions, not vanity.

Planned events:

| Event | Properties |
|---|---|
| `cta_clicked` | `location`, `button_text`, `scenario` |
| `scenario_selected` | `scenario`, `previous_scenario` |
| `process_step_viewed` | `step`, `scenario` |
| `phone_clicked` | `phone_type`, `location` |
| `messenger_clicked` | `messenger`, `location` |
| `form_started` | `form_type`, `scenario` |
| `form_submitted` | `form_type`, `scenario` |

Rules:

- no PII in analytics event properties;
- preserve UTM/source context for form submission;
- later connect form context to Bitrix24 lead/deal fields.

## Playwright And QA Gate

Before showing the result as ready for review:

1. Run project checks appropriate to code changes, normally `npm run check`.
2. Run route-specific browser inspection.
3. Capture screenshots for:
   - desktop/wide;
   - 1366 laptop;
   - 1024;
   - 768 tablet;
   - 375 mobile.
4. Check:
   - no horizontal overflow;
   - final logo visible and not distorted;
   - dark process screen is the main visual focus;
   - scenario switching changes route state;
   - reduced-motion mode is usable;
   - keyboard can select scenarios and reach CTA/form;
   - text does not overlap;
   - status/risk is not color-only;
   - form labels and focus states work;
   - no production route was changed.
5. Use Playwright screenshots and ARIA snapshots where useful.
6. For final production migration later, add Lighthouse/technical SEO checks.


## Production Completeness Addendum

This addendum turns the homepage from a strong concept into a production-ready page plan. The preview can be built safely on `/preview-onixbit-home-final`, but the quality target is the real future homepage, not a decorative example.

### No Placeholder Rule

The page must not contain unfinished public-facing placeholders:

- no `lorem`, `пример`, fake company names, fake client logos, invented reviews, invented case metrics, invented guarantees or invented ROI;
- no generic "Наши преимущества" blocks that do not add buyer confidence;
- no hidden internal notes in visible page copy;
- no demo-only form behavior presented as a working production form;
- every visible proof claim must have a source in the repo or direct Aleksander confirmation.

If a fact is useful but not confirmed yet, keep it in an internal TODO list and do not show it as public copy.

### Final Content Inventory

Before the page is marked ready, every row must be final, sourced, or deliberately excluded.

| Content item | Required source | Build status rule | Fallback if source is missing |
|---|---|---|---|
| Hero H1 and subheadline | `.agents/product-marketing.md`, Aleksander approval | Can ship after copy review | Use the current approved process-route positioning |
| Primary and secondary CTA labels | CRO/copy review, Aleksander approval | Can ship after click path is clear | Use `Разобрать мой маршрут` and `Получить диагностику` |
| `14 лет опыта` | Aleksander confirmation or source document | Can ship only as confirmed fact | Remove metric and use certificate/process proof |
| Partner statuses | Certificate/status files, screenshots, or official partner profiles | Use exact names only | Show `Партнёрские компетенции` without unsupported brand badges |
| Certificates | Real files/URLs from certificates section | Use real thumbnails/links only | Link to `/certificates` without decorative carousel |
| Client logos | Confirmed permission/source | Optional; not required for first version | Do not show logos |
| Case snippets | Real case facts, scope, result, permission | Optional; use only confirmed facts | Link to articles/process pages instead |
| Service routes | `ONIXBIT_SITE_ROADMAP.md`, approved URL inventory | Must link to real or planned routes | If route is not implemented, keep link disabled only in preview |
| Diagnostics deliverables | Product marketing context and Aleksander approval | Must be concrete and modest | Use the safe four deliverables already defined |
| Contact details | `PROJECT_STATE.md` public contacts | Must be final | Primary `8 800 100-53-03`, direct `8 920 272-48-28` |
| Privacy/consent text | Existing `/privacy` or approved legal text | Required before production form | In preview, show link and mark integration as pending |
| OG image | Final logo + homepage visual | Required before production `/` | Use a generated static preview from the hero process screen |

### Proof Source Table

Trust blocks must be treated as evidence, not decoration.

| Public proof | Allowed wording | Source requirement | Notes |
|---|---|---|---|
| Experience | `14 лет опыта в разработке и интеграциях` | Aleksander confirmation or company history source | Do not expand into unsupported project counts |
| Bitrix24 status | Exact confirmed status name | Certificate, screenshot, or official partner page | Avoid badge imitation if source is absent |
| 1C-Битрикс status | Exact confirmed status name | Certificate, screenshot, or official partner page | Use logo only if usage is allowed |
| Scloud status | Exact confirmed status name | Certificate, screenshot, or official page | Keep compact |
| Certificates | `Сертификаты и компетенции` | Existing certificate assets/URLs | Prefer real file links over carousel theater |
| Cases | Short factual fragments | Case source and permission | No named clients without approval |
| Reviews | Only attributed real reviews | Review source and permission | Otherwise do not use reviews at all |

### Hero Timeline

The first 10 seconds must explain the business idea visually.

| Time | What the visitor sees | Business meaning |
|---:|---|---|
| `0s` | Light page shell, final logo, H1, CTA, dark process screen already visible | Onixbit is serious and process-focused |
| `1-2s` | A request appears at source: form/chat/call/site | Work starts from a real client touchpoint |
| `2-4s` | Signal moves to Bitrix24; CRM deal/status appears | Request becomes manageable data |
| `4-6s` | Responsible person, task and SLA become active | There is an owner and next step |
| `6-8s` | 1C/exchange and control nodes update | Data and status are checked across systems |
| `8-10s` | Result statuses and CTA become visually stronger | The visitor sees the outcome and next action |

First click expectation:

- selecting a scenario immediately changes the route;
- selected scenario is remembered for the CTA/form context;
- the CTA text and microcopy reflect the selected problem where useful.

### Wow Result Addendum

The homepage must have an art-directed memory hook. The visitor should remember one concrete transformation:

```text
заявка перестала быть хаосом в разных окнах
и стала управляемым маршрутом с ответственным, сроком, обменом и контролем.
```

This is the main wow moment. It must be visible in the first screen and repeated in a richer form later on the page.

#### Signature Wow Moment

The signature scene:

1. A request appears from website/form/chat/call.
2. It briefly looks fragile: source, CRM, person, 1C and control are visually separated.
3. Onixbit route turns on: red/yellow signal connects the nodes.
4. A CRM deal appears with source/context.
5. Responsible person and SLA become visible.
6. 1C/exchange status becomes checkable.
7. The final management screen appears with four statuses:
   - `Источник виден`;
   - `Ответственный назначен`;
   - `Срок контролируется`;
   - `Обмен проверяется`.

This must feel like a business system becoming controlled, not like a game animation.

#### Before And After Drama

Add a strong contrast layer, either inside the process stand or as the next visual section.

`Before` state:

- requests live in forms, messengers, calls and spreadsheets;
- CRM has cards but no clear next step;
- manager responsibility is unclear;
- 1C and CRM statuses disagree;
- the director learns about the problem too late.

`After` state:

- every request has a source and context;
- responsible person and next action are visible;
- SLA or deadline is tracked;
- exchange status is checkable;
- director sees risk before it becomes a complaint.

Do not show this as a plain comparison table. Make it feel like the same route switching from broken to controlled.

#### Real Or Sanitized Work Screens

The wow effect should come from realistic work interfaces, not abstract icons.

Use self-made or sanitized mock screens that resemble business reality without copying private client data:

- website form/chat/order panel;
- Bitrix24-like CRM board or deal card;
- manager task/SLA panel;
- 1C/exchange status panel;
- director control panel.

Rules:

- no real passwords, tokens, personal data or client secrets;
- no screenshots from private systems unless sanitized and approved;
- no third-party UI copying that creates legal or brand confusion;
- labels must be readable and business-like;
- use realistic statuses, short field names and Russian business language.

#### Persona Reading Layer

The same route must answer different buyer questions without making separate long persona blocks.

| Persona | What they must understand from the route |
|---|---|
| Owner/director | `Я вижу источник, ответственного, срок, риск и статус обмена.` |
| Sales lead | `CRM не просто заполнена: менеджер получает следующий шаг.` |
| IT lead | `Есть карта обменов, зоны ответственности и проверяемый статус ошибки.` |
| Marketer | `Сайт передаёт страницу, источник, UTM и контекст в CRM.` |
| License buyer | `Тариф выбирается под процесс, а не как абстрактная цена.` |

The interface can show this through short role-specific captions near active route states. Keep them brief.

#### Objection Handling By Route

Do not add a generic FAQ wall near the top. Handle key objections through route behavior and short copy.

| Objection | Homepage response |
|---|---|
| `У нас уже есть Битрикс24` | Show audit of funnel, rights, robots, reports, sources and loss points. |
| `Нам нужен просто сайт` | Show how website context enters CRM and later 1C/control. |
| `Мы боимся большого проекта` | Show diagnosis as a bounded first step before full implementation. |
| `У нас сложная 1С` | Show exchange status and risk notes without promising instant 1C miracles. |
| `Нужен только тариф` | Show tariff choice after process needs are known. |

#### Diagnosis As Product

The diagnostic offer must feel tangible. Show a mini artifact, not just a CTA.

Visualize the output as a compact diagnostic pack:

- `Карта маршрута заявки`;
- `Точки потерь и ручной работы`;
- `Первый этап внедрения`;
- `Риски CRM/1C/сайта`;
- `Рекомендация: аудит, настройка, прототип, лицензии или ТЗ на интеграцию`.

This can look like a generated map/report preview inside the final CTA block. It must not promise a full free project specification.

#### Trust Through Process

Trust should be shown not only through certificates.

Add compact process-trust signals where relevant:

- work starts with scenario and access boundaries;
- sensitive access and data are handled carefully;
- changes are staged and checked before production use;
- responsibilities and next steps are documented;
- integration risks are named instead of hidden.

This should sound calm and operational. Do not turn it into a legal/security manifesto.

#### Art Direction Quality Bar

Before Aleksander review, the first screen must pass an art-direction check:

- at `1440px`, it looks like a premium B2B technology company, not a SaaS template;
- at `390px`, the route remains understandable and not cramped;
- the dark process screen is the remembered object of the page;
- the animation explains cause and effect within 10 seconds;
- red/yellow Onixbit accents feel intentional and not alarmist;
- blue/green technical signals stay secondary;
- no element feels childish, mascot-like, game-like or toy-like;
- no section looks like a default row of agency cards;
- the screenshot can stand alone in a presentation and still communicate the idea.

#### Hero Copy Selection Set

Before coding final copy, compare at least three H1 options and choose one.

Candidate direction A:

```text
Связываем сайт, Битрикс24, 1С и коммуникации в управляемый процесс
```

Candidate direction B:

```text
Наводим порядок в маршруте заявки: от сайта и Битрикс24 до 1С и контроля руководителя
```

Candidate direction C:

```text
Показываем, где теряется заявка, и собираем сайт, CRM и 1С в один маршрут
```

Selection rule:

- if the page needs maximum status, use A;
- if the page needs stronger customer pain, use B;
- if the animation directly shows loss and restoration, use C.

CTA copy can also be tested:

- `Разобрать мой маршрут`;
- `Получить диагностику маршрута`;
- `Показать, где теряются заявки`.

Avoid `Оставить заявку` as the primary hero CTA.

### Skill Coverage And Missing Expertises

The homepage must be created through explicit expert lenses, not through a generic "make it beautiful" prompt. Each skill or approach must produce a concrete artifact or check.

| Skill / approach | Use in implementation | Required output |
|---|---|---|
| `onixbit-brand` | Brand voice, final logo, contacts, production-freeze, no fake proof | Brand compliance check before review |
| UI/UX + `common-ui-design` + `ui-ux-pro-max` | First-screen composition, premium visual rhythm, route-led layout, responsive behavior | Art-direction decision for hero and mobile |
| CRO + copywriting + product marketing | CTA logic, customer pains, objections, diagnostic offer, buyer language | Selected H1/CTA pair and objection-to-route map |
| Marketing psychology + offers | Low-risk first step, ethical urgency, perceived value of diagnosis | Diagnostic value equation and trust cues |
| SEO/GEO + `frontend-seo` + `schema` | Metadata, crawlable copy, AI-citable facts, canonical/noindex rules, structured data | Final SEO/GEO checklist and JSON-LD plan based only on visible facts |
| React + Next.js + TypeScript + Tailwind | Component structure, route data model, client/server boundaries, design tokens | Component plan and typed scenario config |
| Accessibility + performance + visual testing + Playwright | Keyboard use, reduced motion, responsive screenshots, Core Web Vitals, non-overlap checks | Verification package for desktop/mobile/reduced-motion |
| Analytics | Useful events without personal data | Event plan for scenario selection, CTA and form states |
| Security best practices | Safe form boundary, environment variables, no secrets in client code, no PII in logs/events | Integration safety notes before CRM wiring |
| `figma-generate-design` | Pre-code Figma/storyboard screen built section by section with design-system search, variables, styles and screenshots | Approved hero storyboard or Figma board before complex implementation |
| `figma-implement-design` | Figma-to-Next implementation workflow with design context, screenshot reference, asset handling and parity validation | 1:1 implementation checklist when coding from the approved Figma frame |
| `playwright-interactive` | Persistent browser QA, explicit QA inventory, functional + visual claims, viewport-fit checks and exploratory pass | Review evidence package stronger than one-off screenshots |

Installed skill update, 2026-07-05:

- newly installed: `figma-generate-design`, `figma-implement-design`, `playwright-interactive`;
- Codex may need a restart to auto-discover them as active skills;
- until restart, their `SKILL.md` files can still be read manually and their workflow must be followed in this project.

#### What Was Still Missing

The previous versions of this TЗ had the right concept, but missed several gates that separate a strong idea from a production-grade wow page:

- motion storyboard: 6-8 frames with timings for the first 10 seconds before coding the animation;
- realistic mock-data dictionary: exact Russian labels, statuses and field names for CRM, 1C, SLA and control panels;
- art-direction preflight: layout hierarchy, dark process-screen proportions, glass/edge treatment, typography scale and mobile transformation;
- conversion decision map: what every major section makes the visitor believe, understand or do next;
- visible SEO/GEO answer blocks: short crawlable definitions for `маршрут заявки`, `диагностика маршрута`, `Битрикс24 + сайт + 1С`, without turning the page into an article;
- implementation decomposition: scenario data, route renderer, controls, lead form, analytics and SEO must not become one monolithic component;
- risk and integration boundary: preview behavior, production webhook/server action, privacy, access handling and fallback owner must be named;
- review evidence package: screenshots, interaction notes, accessibility/reduced-motion checks and performance budgets.

#### What Skills Cannot Replace

No local skill can replace these inputs:

- real proof assets: certificates, partner status names, cases, article URLs, sanitized screenshots;
- Aleksander's approval of the final H1, CTA, signature wow moment and level of boldness;
- real Bitrix24/CRM integration settings, which must be configured securely and never pasted into public chat;
- a legal/privacy review if production lead capture is connected;
- a dedicated Figma/storyboard approval pass if the first screen becomes visually risky or too complex.

A separate pure motion/storyboard skill was not available in the checked installable list. The practical replacement is the installed `figma-generate-design` + `figma-implement-design` pair: first create or update a Figma/storyboard board for the first 10 seconds, then implement from the approved frame with parity checks.

#### Pre-Implementation Gate

Before writing the homepage code, resolve these decisions:

- choose the H1/CTA pair and the signature wow moment;
- define the 6-8 frame hero motion storyboard;
- if the first screen is visually risky, make a Figma/storyboard pass with `figma-generate-design` before code;
- approve the realistic mock-data dictionary for route UI;
- choose renderer direction: DOM/SVG first, Canvas/WebGL only if there is a clear benefit;
- decide form mode: preview simulation, email fallback, or production-ready server action/webhook;
- define the review artifacts: desktop screenshot, mobile screenshot, reduced-motion screenshot, Playwright checks, visual QA inventory and SEO/a11y notes.

#### Stage Gates Before Code

The homepage workflow must move through explicit gates. Do not skip straight from this TЗ to code when the hero depends on precise visual choreography.

| Gate | Status meaning | Required artifacts | Stop condition |
|---|---|---|---|
| `P0 / storyboard-ready` | The first 10 seconds are understandable before Figma/code | skill-output matrix, 6-8 storyboard frames, H1/CTA recommendation, mock-data dictionary, mobile transformation note, rejection criteria | No Figma production board or code until this is approved or explicitly waived |
| `P1 / figma-ready` | The visual direction can be reviewed as a design artifact | named Figma frames, desktop/mobile hero, scenario states, reduced-motion frame, section screenshots, source/tokens note | No Next.js implementation until the frame or storyboard direction is approved |
| `P2 / code-ready` | The design can be implemented safely | component decomposition, typed scenario config, form/security contract, analytics plan, SEO/noindex plan, QA inventory | No production-facing route changes |
| `P3 / production-ready` | The preview can later move to `/` after migration approval | final copy, sourced proof, working or approved fallback form, metadata/schema, screenshots, tests, migration notes | No deployment without explicit Aleksander approval |

Gate rule: a skipped gate must be recorded as an explicit decision, not silently bypassed.

#### Storyboard Artifact Requirements

The first-10-second storyboard is a required artifact before complex hero implementation.

Each frame must specify:

| Field | Requirement |
|---|---|
| frame number | 6-8 frames total, not one vague timeline |
| timestamp | exact range inside `0-10s` |
| visible screen state | what appears in the light shell and dark process screen |
| active node | source, CRM, owner, SLA, exchange, control, or license |
| visible copy | exact Russian text visible in the frame |
| business meaning | what the buyer understands at that moment |
| motion cue | what changes, using cause-and-effect language |
| reduced-motion equivalent | static state that communicates the same meaning |
| mobile adaptation | how the frame becomes vertical/stepped at small width |
| rejection reason | what would make this frame fail review |

Storyboard acceptance:

- the route is understandable from screenshots alone;
- the `Before` state visibly feels fragmented, but not childish;
- the `After` state visibly shows source, responsible person, срок, exchange/control status;
- the CTA becomes more relevant after the route resolves;
- the sequence does not depend on reading a long paragraph.

#### Realistic Mock-Data Dictionary

Before Figma or code, define a small dictionary of sanitized interface labels. It must sound like a real B2B workflow but contain no real client data.

Recommended starter dictionary:

| UI zone | Allowed labels and example values |
|---|---|
| request source | `Источник: форма на сайте`, `Канал: сайт + мессенджер`, `Страница: /vnedrenie-bitrix24`, `Тема: диагностика маршрута заявки` |
| CRM deal | `Сделка: диагностика CRM и сайта`, `Стадия: новая`, `Источник виден`, `Контекст передан`, `UTM: сохранены` |
| responsible person | `Ответственный назначен`, `Следующий шаг: связаться с клиентом`, `Задача создана`, `Комментарий менеджера: уточнить 1С и каналы` |
| SLA | `Ответить до 15:30`, `Срок контролируется`, `Просрочка: риск`, `Следующее действие сегодня` |
| 1C/exchange | `Статус обмена: проверяется`, `Расхождение найдено`, `Сверка выполнена`, `Нужна карта обмена` |
| director control | `Риск: нет ответственного`, `Источник: сайт`, `Срок: сегодня`, `Обмен: проверяется`, `Статус: под контролем` |
| license/tariff | `Тариф подбирается по процессу`, `Пользователи: отдел продаж`, `Нужны CRM, роботы, отчеты`, `Проверить ограничения тарифа` |

Forbidden in mock data:

- real names, phone numbers, emails, portal URLs, deal IDs, client names, comments from real CRM, tokens, webhook paths, passwords, screenshots from private systems;
- labels like `demo`, `test`, `example`, `lorem`, or obvious fake company names in public-facing UI;
- third-party UI copies that can be mistaken for exact Bitrix24 or 1C screenshots.

If a real screenshot is ever used, it must be sanitized and approved before it appears in Figma or code.

#### Section Decision Map

Every major section must make the visitor believe, understand, or do one specific thing.

| Section | Visitor should understand | Objection reduced | Next action |
|---|---|---|---|
| Hero and process stand | Onixbit sees the whole route, not one isolated tool | `Это очередная студия или интегратор по шаблону` | choose scenario or click primary CTA |
| Scenario controls | My problem has a recognizable route state | `У нас особый случай` | select the closest problem |
| Route result states | The route has source, owner, срок, exchange and control | `CRM уже есть, но пользы мало` | compare broken vs controlled route |
| Directions as nodes | Services are parts of one system | `Нам нужен только сайт/тариф/1С` | open relevant service route |
| Proof and trust | Claims have evidence or are deliberately modest | `Можно ли им доверять` | inspect certificates/articles/cases |
| Diagnosis as product | The first step is bounded and tangible | `Мы боимся большого проекта` | request route diagnosis |
| Contact and lead route | Sending a request has a clear next step and fallback | `Форма уйдет в пустоту` | submit form, call, or use messenger |

If a section does not advance one row of this map, remove or merge it.

#### Diagnosis Offer Boundaries

`Диагностика маршрута заявки` must be presented as a tangible first product, not as a vague consultation.

Include:

- route map from source to CRM, responsible person, SLA, 1C/exchange and control;
- loss/risk points and manual work points;
- first realistic work stage;
- risks and access boundaries;
- recommendation type: audit, setup, prototype, license calculation or separate integration specification.

Do not promise:

- a full free technical specification for all integrations;
- guaranteed ROI, guaranteed sales growth, or exact implementation price before discovery;
- instant correction of complex 1C methodology;
- production CRM changes without access, backup and approval.

Define before production:

- expected response SLA after form submission;
- owner or fallback owner for incoming diagnosis requests;
- whether diagnosis is free, paid, or first-call based;
- what artifact Aleksander can actually send after the first conversation.

#### Figma Review Package

If the storyboard moves into Figma, use a predictable frame set so review does not become a scavenger hunt.

Recommended frame names:

- `Home / 00 Skill Matrix`;
- `Home / 01 Storyboard 0-10s / Desktop 1440`;
- `Home / 02 Storyboard 0-10s / Mobile 390`;
- `Home / 03 Hero Process Stand / Desktop`;
- `Home / 04 Hero Process Stand / Mobile`;
- `Home / 05 Scenario States`;
- `Home / 06 Reduced Motion`;
- `Home / 07 Diagnosis Pack`;
- `Home / 08 Review Notes`.

Figma requirements:

- inspect existing file/components/tokens before creating new frames;
- use final logo and brandbook colors;
- keep `1440px` as review artboard only, not as production width;
- validate section screenshots, not only a full-page zoomed screenshot;
- check for clipped text, placeholder text, overlap, wrong logo mode and off-brand blue/green dominance;
- record whether design-system components, variables and styles were reused or manually drawn.

#### Implementation Decomposition Contract

The future implementation must not become one large hero component.

Required separation:

| Concern | Expected home |
|---|---|
| scenario data | typed config object or data module |
| route node model | reusable route-node definitions |
| visual renderer | process stand component |
| scenario controls | focused interactive client component |
| form state | form component or server action boundary |
| analytics mapping | event helper or constants, no PII |
| SEO metadata/schema | server-rendered route metadata or SEO builder |
| copy/proof data | sourced constants, not scattered JSX strings |

Client-side state should cover only interaction state. Static copy, metadata and proof data stay server-rendered where possible.

#### Performance And Interaction Budgets

The preview may be visually ambitious, but it must not become heavy or janky.

Budgets and review thresholds:

- first viewport must render useful content without a loader;
- process screen dimensions and media aspect ratios must be reserved to prevent route CLS above `0.1`;
- route animation uses transform and opacity first;
- user input feedback should be visible within about `100ms`;
- micro-interactions stay around `150-300ms`, scenario transitions around `400ms` unless explicitly justified;
- above-fold raster or video assets must be reviewed if they make the first viewport noticeably heavy; compress or split before coding;
- no autoplay video in the hero unless reduced-motion, pause/offscreen behavior and file weight are reviewed;
- below-fold media and heavy scenes are lazy-loaded;
- canvas/WebGL is not used unless DOM/SVG cannot communicate the route and Aleksander approves the tradeoff;
- timers, observers and animation loops must pause or clean up when not visible.

#### Analytics Decision Contract

Analytics events must answer business questions, not decorate the codebase.

| Business question | Event support | Decision enabled |
|---|---|---|
| Which pain is most recognizable? | `scenario_selected` with `scenario`, `previous_scenario` | which service/process route to emphasize |
| Which CTA creates intent? | `cta_clicked` with `location`, `button_text`, `scenario` | hero vs diagnosis vs contact CTA priority |
| Does the process demo get explored? | `process_step_viewed` with `step`, `scenario` | whether the route is understandable or too complex |
| Which contact channel works? | `phone_clicked`, `messenger_clicked`, `form_started`, `form_submitted` | phone/form/messenger placement |
| Which scenario reaches the form? | form events with `scenario`, `form_type` | route-specific follow-up and CRM fields |

Rules:

- event names use lowercase snake_case;
- use controlled values for `location`, `scenario`, `step`, `form_type`;
- do not send names, phones, comments, emails or messenger handles into analytics;
- UTM/source/referrer are preserved for lead context, not exposed as public proof;
- consent behavior must match the existing privacy/cookie pattern before production.

#### Security And Form Contract

Before production lead capture, the form plan must define:

- server-side endpoint, server action, webhook proxy or approved manual fallback;
- `.env.example` placeholders only, no real webhook URLs or tokens in docs/code/chat;
- input validation and length limits for name, phone/messenger and comment;
- basic spam/rate-limit approach or external anti-spam plan;
- clear success state: what happens next and expected response window;
- clear error state: fallback phone and messenger path;
- logging rules that avoid storing unnecessary PII;
- privacy consent version or link captured with the lead context when available;
- fallback owner and response SLA if Bitrix24 integration is down.

Preview-only behavior must be visibly treated as preview behavior and must not pretend to be a production CRM submission.


### Interaction State Model

The process stand should be data-driven, not hardcoded as scattered animation.

Required UI states:

- `idle` - initial loaded state before the first route loop;
- `autoRoute` - default animated route cycle;
- `scenarioSelected` - user picked a business problem;
- `riskHighlighted` - broken/weak node is visible with text and icon;
- `routeRestored` - corrected route and result are shown;
- `diagnosisReady` - CTA/form context is prepared from scenario;
- `formOpened` - lead form is visible or focused;
- `submitted` - successful send state;
- `error` - send/validation error state;
- `reducedMotion` - static but fully understandable route.

Scenario config should be one typed/data object per scenario:

```ts
type HomepageScenario = {
  id: string;
  title: string;
  problem: string;
  riskNode: "source" | "crm" | "owner" | "sla" | "exchange" | "control" | "license";
  activeNodes: string[];
  result: string;
  routeStatus: string;
  formPrefill: string;
};
```

The visible page should render from this config so animation, copy, analytics and form context stay consistent.

### Mobile Scenario

Mobile must not be a shrunken desktop diagram.

Mobile priority order:

1. Logo, H1, primary CTA and phone remain visible quickly.
2. Route becomes a vertical or stepped process with large touch targets.
3. The active node and selected scenario are shown above supporting text.
4. Scenario selector stays easy to tap.
5. Proof and first safe step follow without crowding the first viewport.
6. Form/contact block has clear labels and tap targets.

Mobile rules:

- avoid horizontal route diagrams on small screens;
- each route node must be readable at `375px`;
- scenario controls must be operable by thumb and keyboard;
- sticky CTA is allowed only if it does not hide content or form fields;
- no text should be scaled by viewport width;
- status/risk text must remain visible, not only animated.

### Lead Form And Bitrix24 Handoff

For production, the form cannot be fake. The preview may simulate submission only if it is clearly not production-published.

Production connection to choose before launch:

- Bitrix24 webhook through a server-side endpoint;
- Bitrix24 REST app/server action;
- CRM/email fallback with explicit owner and SLA;
- temporary manual contact route only if Aleksander approves it.

Required visible fields:

- name;
- phone or messenger;
- scenario/problem;
- short comment.

Required hidden context:

- page URL;
- CTA location;
- selected scenario;
- UTM/source;
- referrer;
- timestamp;
- privacy consent version if available.

Behavior requirements:

- success state explains what happens next;
- error state gives a fallback phone/messenger;
- validation is clear and not aggressive;
- no PII is sent into analytics events;
- secrets/webhooks are never stored in visible code, docs, commits or chat;
- use `.env` placeholders for integration settings.

### Final SEO Package

Preview route:

- `/preview-onixbit-home-final` must be `noindex` or excluded from final public indexing.

Final `/` candidate metadata:

```text
Title:
Ониксбит - Битрикс24, 1С-Битрикс и 1С в одном маршруте заявки

Description:
Связываем сайт, Битрикс24, 1С, коммуникации и контроль руководителя в управляемый процесс. Разберите маршрут заявки и точки потерь.

OG title:
Ониксбит - управляемый маршрут заявки от сайта до CRM и 1С

OG description:
Показываем, где теряются заявки, ответственные, сроки и статусы обмена. Начните с диагностики маршрута.
```

Final internal link targets:

- `/vnedrenie-bitrix24`;
- `/razrabotka-saitov-na-1c-bitrix`;
- `/raboty-po-1c-predpriyatie`;
- `/tarify-licenziy`;
- `/certificates`;
- `/articles`;
- `/contacts`;
- future process page: `/processy/marshrut-zayavki` or an approved equivalent.

Final structured data:

- `Organization` with real contacts and sameAs links only when confirmed;
- `WebSite`;
- `BreadcrumbList` if the framework pattern uses it;
- `FAQPage` only if a real visible FAQ section exists;
- no schema fields that are not visible or supported by page content.

Technical SEO requirements:

- canonical URL is absolute and points to final `/` after migration;
- sitemap includes only approved public URLs;
- preview routes stay out of the production sitemap;
- OG image is `1200 x 630` or another approved social size;
- final public text contains real crawlable explanation, not only animated SVG/canvas.

### Editorial QA

Before review, read the homepage as a buyer, not as a developer.

Remove or rewrite:

- internal technical labels that a client would not say;
- repeated nouns like `контур`, `маршрут`, `система` where they become noise;
- long paragraphs that merely describe what the animation already shows;
- unsupported superlatives;
- CTA labels that feel like generic form submission.

Keep:

- short sections with one idea each;
- business language from real customer pains;
- visible next step after every major argument;
- calm confidence instead of hype.

### Aleksander Confirmation Checklist

Before production migration, Aleksander must confirm:

- skill coverage and missing-input decisions are resolved;
- whether to make a Figma/storyboard approval pass before code or go directly to preview implementation;
- whether the newly installed Figma/Playwright skills are active after Codex restart or must be followed manually from disk;
- selected signature wow moment;
- selected H1 and CTA pair;
- final hero H1/subheadline;
- approved mock-data dictionary for CRM, 1C, SLA and control panels;
- whether `14 лет опыта` is confirmed and can be public;
- exact partner status names and certificate sources;
- whether realistic/sanitized interface mockups can be used and what data must be avoided;
- whether to show client logos or keep the first version without them;
- which real cases/articles can be linked from the homepage;
- final CTA labels;
- form destination: Bitrix24 webhook, REST app, email fallback, or manual first version;
- privacy/consent wording;
- allowed messenger links;
- final service URL names if any planned route changes.

### Production-Ready Definition

The homepage is production-ready only when all of these are true:

- skill coverage, missing inputs and pre-implementation gate are resolved;
- new installed-skill workflow is either used or explicitly waived for this preview;
- final copy is written and reviewed;
- proof claims have sources or are removed;
- final logo and brand colors are used without temporary assets;
- links point to real approved routes or intentionally staged pages;
- lead form has working production behavior or an explicitly approved fallback;
- success, error, validation and reduced-motion states exist;
- SEO metadata, canonical, OG image, sitemap/robots behavior and structured data are ready for final `/`;
- analytics events are useful and contain no PII;
- accessibility, responsive and Playwright checks pass;
- no production route has been changed before Aleksander approves migration.

### Priority Acceptance Levels

Use these levels to decide whether the preview can move forward.

`P0 blockers`:

- production-freeze is violated;
- final logo/brand colors are not used;
- first 10 seconds have no storyboard or frame plan;
- no realistic mock-data dictionary exists;
- hero route is not understandable on mobile;
- scenario controls are not keyboard/touch usable;
- reduced-motion state is missing;
- fake proof, fake client data or private data appears;
- preview route can be indexed as if it were final.

`P1 review blockers`:

- Figma/storyboard gate was skipped without explicit decision;
- dark process screen is not the main remembered object;
- diagnosis does not feel like a tangible first product;
- analytics events lack controlled properties or leak PII risk;
- form destination/fallback is unclear;
- SEO/GEO answer blocks are not visible in HTML;
- Playwright or visual QA package lacks desktop and mobile evidence.

`P2 polish issues`:

- section transitions are not distinctive enough;
- proof strip can be made more compact;
- microcopy can be sharper;
- secondary process links can be improved;
- additional cases/articles can strengthen trust later.

### Migration Boundary

This TЗ is for the safe preview route first. The working `onixbit.ru` production site stays untouched until the final migration stage from `ONIXBIT_PUBLICATION_PLAN.md`.

When migration is approved later:

- preserve the 18 approved current URLs;
- check final sitemap/robots/canonical behavior;
- make backup/rollback notes before switching traffic;
- run post-launch health checks before considering publication finished.

## Anti-Patterns To Reject

- One-tone blue SaaS page.
- Purple/blue AI-style gradient domination.
- Ordinary agency sections: hero, row of cards, row of cards, form.
- Cards inside cards.
- Decorative orbs/blobs.
- Long paragraphs that explain what the animation should show.
- Icons as the main visual system instead of the route.
- Animation that distracts from form or CTA.
- Fake metrics or invented customer proof.
- Placeholder proof, placeholder cases or "temporary" fake reviews.
- Public form with unclear destination or fake production behavior.
- Hidden critical content inside canvas/SVG only.
- Abstract icon diagram with no realistic business interface.
- Hero animation that looks like entertainment instead of control.
- Diagnosis CTA that feels like a vague consultation rather than a tangible first product.
- Starting code without a motion storyboard or frame plan.
- Mock CRM/1C screens with random demo labels that do not sound like real business.
- Treating the skill list as a slogan instead of mapping each skill to an output or check.
- Skipping Figma/storyboard work when the first screen depends on precise visual choreography.
- Calling a page visually checked without a QA inventory, desktop/mobile screenshots and at least one post-interaction state.

## Acceptance Criteria

The preview is acceptable only if:

- skill coverage is mapped to concrete outputs before implementation;
- installed missing skills are accounted for in the workflow, even if Codex needs restart to auto-discover them;
- the first 10 seconds have a storyboard or frame plan;
- Figma/storyboard pass is completed or explicitly waived before complex hero implementation;
- realistic mock data is defined for CRM, 1C, SLA and control UI;
- implementation separates scenario data, visual renderer, controls, form, analytics and SEO concerns;
- it has one clear signature wow moment that shows chaos becoming a controlled route;
- Aleksander can understand the concept by looking at the first screen and interacting with scenarios;
- the page feels like Onixbit, not a generic IT template;
- firm colors and final logo are used correctly;
- the dark process screen explains the request route;
- a before/after or broken/controlled contrast is visible without a plain comparison table;
- realistic or sanitized business interfaces make the route feel serious;
- key objections are answered by the route, not only by text;
- diagnosis is shown as a tangible first product;
- the page keeps trust, SEO, conversion and contact access;
- the mobile version is a real adapted route, not a shrunken desktop scene;
- accessibility and reduced-motion are not afterthoughts;
- performance and Playwright checks do not reveal obvious layout or interaction problems;
- final content inventory is resolved or the unresolved rows are explicitly marked as production blockers;
- proof claims have sources or are removed from visible copy;
- form behavior, analytics context and Bitrix24 handoff are specified before production use;
- final SEO package is ready for migration from preview to `/`;
- no placeholders or fake public-facing claims remain.

## Related Sources

- `PROJECT_STATE.md`
- `ONIXBIT_BRANDBOOK.md`
- `ONIXBIT_SITE_ROADMAP.md`
- `ONIXBIT_PUBLICATION_PLAN.md`
- `ONIXBIT_REDESIGN_BRIEF.md`
- `.agents/product-marketing.md`
