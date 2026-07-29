# Onixbit Brandbook

Last updated: 2026-07-05

Status: final brandbook v1.1.

This is the approved brandbook source for Onixbit. It feeds Figma, preview pages, site redesign, articles, process pages, commercial materials, Bitrix24 portal usage, document templates, and future presentation materials.

## Final Package

Use these artifacts as the current source of truth:

| Artifact | Path / Figma |
|---|---|
| Final Figma brandbook board | `34 Брендбук Ониксбит / финал`, board `152:3` |
| Final Figma logo board | `33 Логотип Ониксбит / финальный пакет`, board `143:3` |
| Presentation PDF | `output/brandbook/onixbit-brandbook-final-figma.pdf` |
| Control screenshot | `output/screenshots/onixbit-brandbook-final-figma.png` |
| Logo assets | `output/logos/final/` |
| Requisites files | `output/requisites/onixbit-requisites-11.pdf` and `.docx` |

Final decision: the logo and brandbook are fixed as v1.1. New production materials should apply this system instead of returning to earlier logo exploration boards.

## Brand Essence

Onixbit is a B2B technology integrator that connects website, Bitrix24, 1C, communication channels, analytics, support, and management control into one working business system.

Human Russian-facing name: Ониксбит.
Technical or English context: Onixbit.
Domain context: onixbit.ru.

## Core Promise

Ониксбит помогает руководителю увидеть и управлять всем маршрутом заявки: от сайта, формы, чата или звонка до CRM, менеджера, роботов, 1С, статуса обмена и контроля риска.

## Positioning Formula

For owners, directors, sales leaders, operations leaders and IT leads who are tired of disconnected systems, Onixbit is a B2B integrator for Bitrix24, 1C-Bitrix, 1C, integrations and support that turns scattered tools into one managed business contour.

## Brand Metaphor

Primary metaphor: connected business operating system.

Supporting metaphors:
- Control center for owners and directors.
- Route map for requests, orders, exchanges and support.
- Digital architect or assistant only in contextual diagnostics and articles, not as the whole brand.

## Audience

Primary:
- owners and directors;
- sales and operations managers;
- IT leads;
- decision-makers choosing a serious B2B contractor.

They need to understand:
- what Onixbit does;
- how CRM, website and 1C connect;
- why the team is competent;
- what risk is reduced;
- what to do next.

## Personality

- calm;
- specific;
- systematic;
- credible;
- technological;
- business-focused;
- visually premium without cheap neon.

## Voice

Use Russian by default. Prefer direct, useful, grounded copy.

Good:
- Заявка проходит весь маршрут: сайт, CRM, менеджер, 1С и контроль.
- Сначала фиксируем процесс, потом настраиваем поля, роботов и обмены.
- Руководитель видит источник, ответственного, срок и статус обмена.

Avoid:
- Инновационные решения для вашего бизнеса.
- Максимально эффективная цифровая трансформация.
- Лучший результат гарантирован.
- AI as the main brand idea.

## Visual System

### Logo System

The final logo package has two approved structures, both built as transparent `444 x 110` SVG/PNG assets in `output/logos/final/`. Figma source board: `33 Логотип Ониксбит / финальный пакет`, node `143:3` (`https://www.figma.com/design/QmWZap5UbNRmBnLtvcshi7/Untitled?node-id=143-3`).

- `lockup` - separate abstract sign plus full wordmark `ОНИКСБИТ`. This is the primary master for the website header, documents, commercial proposals, Bitrix24 upload, and most public materials.
- `mark-as-o` - the abstract sign replaces the first Cyrillic `О`, with the remaining word starting from `НИКСБИТ`. This is a secondary/accent version for compact or more branded placements.

Color modes for both structures:

| Mode | Role | Use |
|---|---|---|
| primary | red sign, dark `ОНИКС`/`НИКС`, deep-red `БИТ` | default on light backgrounds |
| inverse-red | red sign, white `ОНИКС`/`НИКС`, deep-red `БИТ` | dark backgrounds with brand red accent |
| inverse-white | all white | dark/photo backgrounds when maximum contrast is needed |
| mono-dark | all dark | restrained documents and monochrome layouts |

Do not mix `lockup` and `mark-as-o` randomly on the same surface. Use `lockup` as the default identity and `mark-as-o` only as a deliberate alternate.

Superseded: all earlier exploration boards and names such as `26`, `26A`, `ОС`, `ЗН`, `RU-05`, and `BIT-R2` are historical working stages only. They must not be used as the public logo source unless they are already packaged inside `output/logos/final/`.

The brand has two coordinated modes.

### Light Public Mode

Use for homepage, services, proof, articles, company, contacts and forms.

Traits:
- warm light background;
- graphite text;
- red as action and semantic focus;
- amber as secondary warmth and proof;
- teal/blue only as restrained system signal;
- compact B2B sections;
- fast scan paths;
- visible phone and CTA.

### Dark Process Mode

Use for process-demo pages.

Traits:
- graphite, black cherry, near-black surfaces;
- red and amber as Onixbit energy;
- cyan only for thin data signals;
- glass panels and HUD details;
- sticky scenes and changing system states;
- no mandatory loader before useful content.

## Colors

Core tokens from the current site:

| Token | Value | Role |
|---|---:|---|
| --ob-red | #ed1c24 | primary action, focus, risk, Onixbit energy |
| --ob-red-deep | #b80f17 | dark red depth, hover, process accents |
| --ob-yellow | #ffd45a | warmth, proof, secondary action |
| --ob-yellow-deep | #f0a911 | amber focus and dark-mode glow |
| --ob-ink | #080808 | primary text |
| --ob-graphite | #242424 | secondary dark surface |
| --ob-muted | #5f626a | secondary text |
| --ob-soft | #f5f5f2 | light page background |
| --ob-soft-2 | #ececea | light separators and panels |
| --ob-white | #ffffff | clean surfaces |

Extended signal colors:

| Name | Value | Role |
|---|---:|---|
| Signal blue | #2f86ff | CRM/data signal, restrained |
| Signal green | #66e3a2 | success/control signal, restrained |
| Black cherry | #18070a | dark process depth |
| Night graphite | #09090b | dark process base |

## Typography

Current production pairing:
- Display: Montserrat.
- Body: Manrope.

Rules:
- Use Montserrat for H1, H2, buttons, labels and strong UI accents.
- Use Manrope for body text, explanations, UI copy and cards.
- Keep letter spacing at 0 for normal text.
- Do not scale font size directly with viewport width.
- Balance hero headlines, but never let text overlap.

## Layout And Width

Production web width follows the live onixbit.ru rhythm, not the 1440px Figma artboard.

- Desktop container: --ob-container = 1700px.
- Section width: min(var(--ob-container), calc(100% - 48px)).
- Header width: min(var(--ob-container), calc(100% - 40px)).
- Tablet/mobile gutters follow existing project breakpoints.
- Figma frames may use 1440px for design review, but production adapts to the live container system.

## UI Components

Core components:
- header and service navigation;
- primary CTA;
- secondary CTA into process demos;
- service cards;
- proof strips;
- diagnostic cards;
- process route nodes;
- dark HUD panels;
- article diagnostic blocks;
- compact forms.

Rules:
- Use lucide-react for icons in code.
- Keep border radius modest, usually 8px in brandbook and process UI.
- Use cards for repeated items, tools and framed demos only.
- Do not nest cards.
- Do not make the whole public site dark.

## Motion

Motion must explain cause and effect.

Good:
- request appears on website, then CRM deal appears;
- manager task becomes active;
- 1C status updates;
- control risk becomes visible;
- hover/tap feedback on controls.

Avoid:
- decorative motion without meaning;
- slow intro loaders;
- heavy animation hiding content;
- many unrelated effects on one screen.

Respect prefers-reduced-motion.

## Content Architecture

Main public site:
- home;
- services;
- tariffs and licenses;
- cases;
- certificates;
- articles;
- about;
- contacts;
- privacy.

Process demos:
- request route;
- order through site + CRM + 1C;
- exchange failure;
- support from channels;
- executive control.

Every process page must return to the matching service, proof and contact route.

## Figma Brandbook Pages

Current final Figma source:

- `34 Брендбук Ониксбит / финал` - short final operating board with approved rules only.
- `33 Логотип Ониксбит / финальный пакет` - final logo assets and export frames.
- `10 Brandbook` - older large working brandbook frames; keep for history and deeper context, but do not treat archived frames as the final public handoff.

Recommended future production pages, if the brandbook is expanded into a full client deck:

- cover and brand essence;
- logo system and clear space;
- color and typography;
- layout and grid;
- components and UI modes;
- voice and copy;
- motion and process language;
- document, Bitrix24, KP and website examples.

## Current Preview Page

Internal web preview:

/preview-onixbit-brandbook

This page is for Aleksander and future Codex/Figma work. It should remain noindex and should not replace production pages without explicit approval.

Note: the preview page may remain a working interactive interpretation. The final static handoff is the Figma board and PDF listed in `Final Package`.
