# Onixbit Homepage P0 Storyboard

Date: 2026-07-06
Scope: safe P0 storyboard for the first 10 seconds of the homepage. No production route, deployment, sitemap, CRM, webhook, or secret changes.

Stage gate: stop here until storyboard approval or explicit permission to implement `/preview-onixbit-home-final`.

## Figma Package

File key: `QmWZap5UbNRmBnLtvcshi7`
Page: `35 Home P0 Storyboard / 2026-07-06` (`161:2`)

Created frames:

| Frame | Node ID |
| --- | --- |
| Home / 00 Skill Matrix | `161:3` |
| Home / 01 Storyboard 0-10s / Desktop 1440 | `161:35` |
| Home / 02 Storyboard 0-10s / Mobile 390 | `161:270` |
| Home / 03 Hero Process Stand / Desktop | `161:452` |
| Home / 04 Hero Process Stand / Mobile | `161:500` |
| Home / 05 Scenario States | `161:538` |
| Home / 06 Reduced Motion | `161:572` |
| Home / 07 Diagnosis Pack | `161:611` |
| Home / 08 Review Notes | `161:630` |

Important nodes:

| Node | ID |
| --- | --- |
| Desktop final logo SVG | `162:2` |
| Mobile final logo SVG | `162:7` |
| Header CTA | `161:456` |
| Primary CTA | `161:460` |
| Secondary CTA | `161:462` |
| Mobile primary CTA | `161:506` |

Figma inspection found local Onixbit tokens/styles:

- Variable collection: `Onixbit / Brand Tokens`, 35 variables.
- Paint styles include `Onixbit / Red`, `Onixbit / Red deep`, `Onixbit / Light surface`, `Onixbit / Process surface`, `Onixbit / Text ink`, `Onixbit / Line`.
- Text styles include `Onixbit / Display / Hero`, `Onixbit / Body / Lead`, `Onixbit / HUD / Caption`.
- No local components/component sets were available, so P0 uses storyboard primitives rather than a generic external UI kit.

Screenshot check:

- Metadata verified on page `161:2`.
- `get_screenshot` verified desktop hero `161:452` at 1440x960 and mobile hero `161:500` at 390x1280.
- Initial desktop screenshot revealed H1/subcopy overlap; spacing was fixed in Figma.
- Final inline checks: desktop hero has no H1/CTA overlap; mobile hero is vertically readable and status pills stay inside the process stand.

## Skill Matrix

| Skill / approach | Concrete artifact, decision, or check |
| --- | --- |
| onixbit-brand | Production freeze, final logo asset, brand tokens, tone, no fake proof, no secrets. |
| ui-ux-pro-max | Adopted only the relevant "real-time operations" pattern; rejected its generic dark/blue styling in favor of Onixbit brand. |
| common-ui-design | Light public shell with a dark process stand as the signature first-screen object. |
| common-accessibility | Scenario controls must be real buttons/tabs, keyboardable, 44px targets, aria-live status, reduced-motion equivalent. |
| common-web-visual-testing | Future QA inventory: desktop/mobile/reduced-motion/keyboard/no-overflow and screenshot viewports. |
| copywriting | Exact hero language based on buyer pain, not generic agency claims. |
| CRO | Primary CTA and scenario selector appear before any long explanation; CTA follows the demonstrated route. |
| product-marketing | Buyer language: заявки теряются, CRM есть, но процесс не управляется, сайт отдельно от продаж, 1С и CRM расходятся. |
| marketing-psychology | Ethical contrast: before state -> visible route -> controlled next step; no fake urgency or fake proof. |
| offers | Diagnosis framed as a bounded first product, not a vague consultation or free full implementation spec. |
| SEO/GEO + frontend-seo | Hero text must be real crawlable HTML in preview/future implementation; preview stays noindex and out of sitemap. |
| schema | Future schema only for visible, true entities/content; no fake FAQ/reviews/cases. |
| analytics | Event plan uses controlled values and no PII: `hero_scenario_select`, `process_step_view`, `diagnosis_cta_click`. |
| security-best-practices | Preview simulation by default; no Bitrix webhook/token, portal URL, real CRM IDs, or PII in code/docs/analytics. |
| React + Next.js | Future implementation: Server Components by default, client boundary only around interactive process stand/form. |
| TypeScript | Data-driven typed scenario config and runtime validation at boundaries if/when form mode is approved. |
| Tailwind | Use brand CSS variables/tokens, not random raw hex; motion via transform/opacity. |
| frontend architecture | Split content config, server route, process stand client island, form mode, analytics, and SEO metadata. |
| Figma | Created named storyboard package and verified metadata/screenshots. |
| figma-use / figma-generate-design / figma-implement-design | `figma-use` and generate-design guidance applied for Figma creation; implement-design is reserved for post-approval design-to-code. |
| playwright / visual testing | Future QA plan defined; not run yet because no preview route implementation is approved. |
| 21st.dev | Not used; existing brand/TZ and Figma tokens were sufficient, and external UI references risk generic styling. |

## Recommended Hero Copy

Recommended H1 for P0 storyboard:

`Показываем, где теряется заявка, и собираем сайт, CRM и 1С в один маршрут`

Reason: the first 10 seconds explicitly show loss/risk and restoration into a controlled route. This is stronger than a neutral integration claim.

Fallback H1 from the TZ for a calmer, more status-led tone:

`Связываем сайт, Битрикс24, 1С и коммуникации в управляемый процесс`

Subcopy:

`Источник, ответственный, срок, обмен и контроль руководителя становятся видны в одной цепочке.`

Primary CTA:

`Разобрать мой маршрут`

Secondary CTA:

`Получить диагностику маршрута`

Avoid:

- `Оставить заявку`
- `Бесплатная консультация`
- any CTA that implies production CRM submission before explicit form-mode approval.

## Active Interface Nodes

Core route:

`Источник -> Битрикс24 -> Ответственный -> Задача/SLA -> 1С/обмен -> Контроль`

Interactive nodes:

- Scenario selector: `Заявки теряются`, `CRM не управляется`, `Сайт отдельно от продаж`, `1С и CRM расходятся`, `Нужен тариф Битрикс24`.
- Process nodes: source, CRM, responsible, SLA, exchange, director control.
- Status panel: source visible, responsible assigned, deadline controlled, exchange checked.
- CTA group: primary diagnosis entry, secondary diagnosis route.
- Mobile menu/phone affordance, without production form action.

## Storyboard: First 10 Seconds

| Frame | Time | Active nodes | Business meaning | Motion cue | Reduced-motion equivalent |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.0-1.0s | Light shell, logo, H1, CTA, dark stand idle | Onixbit is about a managed request route, not a pile of services. | Dark process stand is already visible; a soft line accent establishes system context. | Static stand with "before" state and visible route labels. |
| 2 | 1.0-2.0s | Source | The request has a concrete entry point: site form, channel, page, topic. | Request card appears from `Источник`. | Source node is selected and the request card is already open. |
| 3 | 2.0-3.4s | Source + Bitrix24 | A lost request becomes a CRM deal with context. | A visible break/risk becomes a connected line; CRM deal/status appears. | Source and CRM nodes are highlighted; risk copy remains visible. |
| 4 | 3.4-5.0s | Responsible | Responsibility stops living in manager memory. | Responsible node lights up; task panel pins the next step. | Task panel is expanded without movement. |
| 5 | 5.0-6.8s | SLA + 1C/exchange | The route now has a deadline and a checkable exchange status, not a magic integration promise. | SLA fills, then exchange node activates. | Static deadline and exchange status chips are shown. |
| 6 | 6.8-8.4s | Control | The director sees risk before it becomes a missed request. | Final statuses collect into a control panel. | All final statuses are visible at once. |
| 7 | 8.4-10.0s | Diagnosis CTA | Diagnosis becomes the logical next step after seeing the route. | CTA receives emphasis; diagnosis contents appear beside it. | CTA and diagnosis pack are static, no autoplay or forced scroll. |

## Mobile Adaptation

- Do not shrink desktop into 390px.
- Use a vertical route: source, CRM, responsible, SLA, exchange, control.
- H1, subcopy, and primary CTA come before the process stand.
- Scenario controls wrap into one or two columns with real button semantics.
- The active node opens a compact detail/status card below the selected point.
- No horizontal scroll for the route.
- Status labels may reduce in count inside mini storyboard cards, but the hero process stand must show the full route and final statuses.
- Footer hint of the next section remains visible after the first screen.

## Realistic Mock Data Dictionary

Allowed source data:

- `Источник: форма на сайте`
- `Канал: сайт + мессенджер`
- `Страница: /vnedrenie-bitrix24`
- `Тема: диагностика маршрута заявки`
- `UTM: сохранены`

Allowed CRM/deal data:

- `Сделка: диагностика CRM и сайта`
- `Стадия: новая`
- `Источник виден`
- `Контекст передан`

Allowed responsibility/SLA data:

- `Ответственный назначен`
- `Следующий шаг: связаться с клиентом`
- `Задача создана`
- `Ответить до 15:30`
- `Срок контролируется`
- `Просрочка: риск`
- `Следующее действие сегодня`

Allowed exchange/control data:

- `Статус обмена: проверяется`
- `Расхождение найдено`
- `Сверка выполнена`
- `Нужна карта обмена`
- `Риск: нет ответственного`
- `Статус: под контролем`

Allowed license data:

- `Тариф подбирается по процессу`
- `Пользователи: отдел продаж`
- `Нужны CRM, роботы, отчеты`
- `Проверить ограничения тарифа`

Forbidden data:

- real names, phones, emails, portal URLs, deal IDs, client names;
- real CRM comments, tokens, webhook paths, passwords;
- private screenshots;
- `demo`, `test`, `example`;
- invented company names, fake reviews, fake cases, fake proof.

## Section Decision Map

| Section | Decision |
| --- | --- |
| Hero process stand | Keep. This is the signature first-screen moment. |
| Pain-to-route scenarios | Keep immediately after hero to let users recognize their situation. |
| Diagnosis pack | Keep as the first offer after the route logic is understood. |
| Process/services sections | Keep below; map each service to a route node rather than generic cards. |
| Proof | Use only confirmed proof such as experience/partner status if validated. No fake cases. |
| FAQ/schema | Add only if questions are visible on the page and factually supported. |
| Form | Preview simulation by default; email fallback/server action only after explicit approval. |
| Analytics | Plan event names now; wire only in preview implementation after approval. |

## Diagnosis Offer Boundaries

Offer name:

`Диагностика маршрута заявки`

Includes:

- route map from source to CRM, responsible, SLA, 1C/exchange, and control;
- loss/risk points;
- first realistic implementation stage;
- risk/integration/license notes;
- recommendation: audit, setup, prototype, license calculation, or technical task for integration.

Does not include without separate approval:

- production CRM access;
- Bitrix webhook/token;
- real portal URL;
- publication or production route changes;
- full free technical specification;
- promise of instant 1C/CRM synchronization.

Default form mode for preview:

`preview simulation`

Possible later modes only after explicit approval:

- email fallback;
- server action with runtime validation, rate/spam limits, origin checks where relevant, and no client-side secrets.

## Rejection Criteria

Reject the storyboard or implementation if:

1. The first 10 seconds do not make the route readable: source -> Bitrix24 -> responsible -> SLA -> 1C/exchange -> control.
2. The hero feels like a generic agency/services landing page.
3. The dark process stand is decorative rather than explanatory.
4. Motion is ornamental, endless, too fast, or required for comprehension.
5. Mobile is a shrunken desktop layout or requires horizontal scrolling.
6. Text overlaps, buttons resize on hover/focus, or content becomes unreadable at 375/390px.
7. Scenario controls are not real buttons/tabs or are not keyboardable.
8. There is no reduced-motion equivalent.
9. Fake proof, fake cases, PII, private screenshots, tokens, webhook paths, or real CRM data appear anywhere.
10. The CTA behaves like a production CRM submit before form mode approval.
11. Preview route is indexable or appears in sitemap.
12. Random raw hex values replace Onixbit tokens/styles.

## Next Gate

Do not implement `/preview-onixbit-home-final` until this P0 storyboard is approved or explicitly waived.

After approval:

1. Read relevant local Next.js docs in `node_modules/next/dist/docs/`.
2. Implement preview route only, no production `/` changes.
3. Keep Server Components by default and isolate the interactive process stand/form as the only client boundary.
4. Use typed scenario config and brand tokens.
5. Mark preview as noindex and exclude from sitemap.
6. Run project checks and Playwright visual/accessibility coverage.
