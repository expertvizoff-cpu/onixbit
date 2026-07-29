# Onixbit Site Roadmap

Last updated: 2026-07-05
Status: active development plan

This document is the durable plan for building the next Onixbit website without touching the current working onixbit.ru production site until the redesign is complete and explicitly approved for transfer.

## Non-Negotiable Rules

1. Do not touch or publish over the working onixbit.ru production site during development.
2. Do not push/deploy redesign changes to production automatically, even if older project notes mention auto-publish.
3. Develop in safe preview routes, local branches, Figma, and local output files until the final transfer stage.
4. Logo and brandbook are final v1.1. Do not reopen logo exploration unless Aleksander explicitly says so.
5. The master logo is `output/logos/final/lockup/onixbit-lockup-primary-444x110.svg`.
6. The final brandbook source is `ONIXBIT_BRANDBOOK.md`; the final Figma board is `34 Брендбук Ониксбит / финал` (`152:3`).
7. Every new section must support the core idea: Onixbit connects website, Bitrix24, 1C, EDO, support channels, analytics, and management control into one managed route.

## Development Mode

Use preview and staging work only:

- Figma: explore final layouts and interaction direction.
- Local Next.js preview routes: build and test new pages without replacing production routes too early.
- Screenshots and Playwright: inspect desktop, tablet, and mobile behavior.
- Project docs: keep decisions in this roadmap and `PROJECT_STATE.md`.

Production transfer happens only after:

- Aleksander approves the full redesign;
- routes, forms, SEO, analytics, and responsive behavior pass checks;
- old production URLs and the redirect/no-redirect decision are reviewed;
- a deliberate migration plan is written.

## Strategic Goal

Build a site that feels like the strongest B2B integrator site in the Bitrix24 / 1C-Bitrix / 1C space, not another agency template.

The first 10 seconds must communicate:

```text
Ониксбит соединяет сайт, Битрикс24, 1С, ЭДО и контроль руководителя
в один управляемый маршрут заявки.
```

## Site Architecture

The approved architecture is hybrid:

- light public site for trust, SEO, clarity, services, proof, articles, contacts;
- dark process-demo pages for cinematic interactive business routes;
- every process page links back to a matching service, proof, and contact path.

Source map:

- `ONIXBIT_SITE_ARCHITECTURE.md`
- `ONIXBIT_PUBLICATION_PLAN.md`
- `/preview-onixbit-architecture`
- `/preview-onixbit-system-tour`

## Phase 0 - Locked Foundations

Status: mostly done.

Deliverables:

- final logo package in `output/logos/final/`;
- final brandbook v1.1 in `ONIXBIT_BRANDBOOK.md`;
- final Figma brandbook board `152:3`;
- company requisites PDF/DOCX in `output/requisites/`;
- production-freeze rule in this roadmap and `PROJECT_STATE.md`.

Done when:

- no active work returns to logo exploration;
- every new site task starts from the final brandbook and roadmap.

## Phase 1 - Signature Homepage Concept

Goal: create the new main page concept without replacing production.

Build first in a preview route, for example:

```text
/preview-onixbit-home-final
```

Core blocks:

1. First screen: connected business contour, final logo, strong offer, phone, CTA.
2. Signature interactive route: site/form/chat -> CRM -> manager -> 1C/EDO -> control.
3. Service directions: Bitrix24, 1C-Bitrix websites, 1C work, licenses.
4. Business pains: lost requests, manual copying, unclear responsibility, exchange errors.
5. Proof strip: certificates, cases, articles, partner statuses.
6. Diagnosis/contact block: clear next step, phone, messengers, form.

Quality bar:

- desktop, laptop, tablet, mobile screenshots;
- no horizontal overflow;
- fast first viewport;
- no decorative animation without business meaning;
- final logo appears correctly;
- text is concrete and not generic agency copy.

## Phase 2 - First Dark Process Page

Goal: build the flagship wow section that proves the whole positioning.

Start with:

```text
/processy/marshrut-zayavki
```

Development can begin in a preview route and later be moved.

Scenario:

1. Visitor leaves a request on site/chat/form.
2. CRM deal appears with source, page, UTM/context.
3. Manager/task/robot becomes responsible.
4. 1C or EDO status is checked.
5. Director sees source, responsible person, SLA, status, risk.

Quality bar:

- interaction is understandable without instructions;
- reduced-motion fallback works;
- scene has business meaning, not just effects;
- process page links back to Bitrix24/service/proof/contact routes.

## Phase 3 - Public Service Pages

Goal: rebuild core service pages around the connected-system idea.

Pages:

- `/vnedrenie-bitrix24`
- `/razrabotka-saitov-na-1c-bitrix`
- `/raboty-po-1c-predpriyatie`
- `/tarify-licenziy`

Rules:

- keep existing production pages untouched until migration;
- use preview/staging versions first;
- each service page links to a relevant process demo;
- copy explains process, scope, risks, proof, and next step.

## Phase 4 - Proof System

Goal: raise trust and status.

Needed materials:

- real case stories with before/process/after/result;
- certificate presentation;
- partner statuses;
- screenshots or sanitized diagrams of CRM/processes;
- photos/video of Aleksander or team if available;
- clear company story and project process.

Pages:

- `/cases`
- `/cases/[slug]`
- `/certificates`
- `/o-kompanii`
- `/articles`
- `/articles/[slug]`

Before writing full case pages, create:

- `CASE_TEMPLATE.md`
- `CONTENT_GUIDE.md`
- article/case voice examples.

## Phase 5 - Conversion, SEO, Analytics, and Forms

Goal: make the redesign work as a business tool.

Tasks:

- diagnostic form / consultation CTA;
- Bitrix24 lead path planning;
- phone and messenger tracking;
- schema markup;
- metadata and internal linking;
- privacy/form compliance;
- analytics events;
- Lighthouse and accessibility checks.

No production transfer before this phase is reviewed.

## Phase 6 - Migration To Working Site

Goal: replace or transfer to working onixbit.ru only after the redesign is complete.

Migration checklist:

1. Final visual approval from Aleksander.
2. `npm run check` passes.
3. E2E tests pass for main routes and forms.
4. Desktop/mobile screenshots reviewed.
5. SEO titles/descriptions/schema checked.
6. URL preservation and redirect/no-redirect decision reviewed.
7. Deployment plan written.
8. Backup/rollback plan written.
9. Explicit approval to transfer to production.

## Current Next Step

Start Phase 1:

```text
Create /preview-onixbit-home-final with the final brand and the first interactive request-route scene.
```

Do not edit production-facing routes for this first pass unless Aleksander explicitly changes the rule.

## Persistent Handoff For Future Chats

At the start of every new or compacted chat:

1. Read `PROJECT_STATE.md`.
2. Read this file: `ONIXBIT_SITE_ROADMAP.md`.
3. Read `ONIXBIT_PUBLICATION_PLAN.md`.
4. Confirm the production-freeze rule.
5. Continue from `Current Next Step`.
6. Keep speaking Russian.

If a future instruction conflicts with this roadmap, ask Aleksander before changing production or reopening the logo/brandbook stage.
