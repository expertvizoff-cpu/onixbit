# Onixbit Site Work Paused

Last updated: 2026-07-06

Status: paused by Aleksander. Do not continue website redesign/new homepage work until a new explicit request.

## User Decision

Aleksander stopped the current direction after reviewing the experimental `/preview-onixbit-home-final` work.

Key conclusion:

- The full new animated homepage direction is not the right next step now.
- The safer future direction is to improve the existing site separately by blocks and pages.
- Treat `/preview-onixbit-home-final` as an experimental draft, not an approved direction.
- Do not publish, deploy, migrate, or replace production `/`.

## Production Rule

The production freeze remains active:

- Do not touch working `onixbit.ru`.
- Do not change production `/`.
- Do not push/deploy redesign changes.
- Do not connect production CRM secrets, Bitrix24 webhooks, tokens, or real client data.

## Current Experimental Artifacts

### Storyboard/Figma

- Local P0 storyboard package: `ONIXBIT_HOMEPAGE_P0_STORYBOARD.md`
- Figma file key: `QmWZap5UbNRmBnLtvcshi7`
- Figma page: `35 Home P0 Storyboard / 2026-07-06`
- Main page node: `161:2`
- Key frames created during P0:
  - `Home / 00 Skill Matrix` — `161:3`
  - `Home / 01 Storyboard 0-10s / Desktop 1440` — `161:35`
  - `Home / 02 Storyboard 0-10s / Mobile 390` — `161:270`
  - `Home / 03 Hero Process Stand / Desktop` — `161:452`
  - `Home / 04 Hero Process Stand / Mobile` — `161:500`
  - `Home / 05 Scenario States` — `161:538`
  - `Home / 06 Reduced Motion` — `161:572`
  - `Home / 07 Diagnosis Pack` — `161:611`
  - `Home / 08 Review Notes` — `161:630`

### Preview Route

Experimental route:

```text
/preview-onixbit-home-final
```

Current route entry:

```text
src/app/preview-onixbit-home-final/page.tsx
```

The route currently renders the latest experimental cinematic variant:

```text
src/app/preview-onixbit-home-final/HomeFinalCinema.tsx
src/app/preview-onixbit-home-final/HomeFinalCinemaInteractive.tsx
src/app/preview-onixbit-home-final/home-final-cinema.module.css
```

Older experimental iterations remain in the same folder:

```text
src/app/preview-onixbit-home-final/HomeFinalPreview.tsx
src/app/preview-onixbit-home-final/HomeFinalInteractive.tsx
src/app/preview-onixbit-home-final/home-final.module.css
src/app/preview-onixbit-home-final/HomeFinalExperience.tsx
src/app/preview-onixbit-home-final/HomeFinalExperienceInteractive.tsx
src/app/preview-onixbit-home-final/home-final-experience.module.css
src/app/preview-onixbit-home-final/data.ts
```

Do not continue polishing these without Aleksander explicitly asking to resume the preview experiment.

### Shared Preview Safety Changes

Added:

```text
src/components/previewRoutes.ts
```

It hides global production chrome/scripts on preview routes, including `/preview-onixbit-home-final`.

Shared components touched for preview safety:

```text
src/components/Header.tsx
src/components/Footer.tsx
src/components/MobileDock.tsx
src/components/PrivacyConsent.tsx
src/components/ScrollTopButton.tsx
src/components/BitrixForms.tsx
src/components/YandexMetrika.tsx
```

Purpose: avoid production header/footer/dock/cookie banner/Bitrix popup/Yandex Metrika on the safe preview route.

### Assets Copied For Preview

```text
public/brand/onixbit-lockup-primary-444x110.svg
public/brand/onixbit-lockup-inverse-white-444x110.svg
```

These were copied from `output/logos/final/lockup/`.

### QA Artifacts

Screenshots:

```text
output/playwright/onixbit-home-final/
```

Temporary QA scripts:

```text
.work/onixbit-home-final-qa.mjs
.work/onixbit-animation-proof.mjs
```

Last known checks before pause:

- `npm run lint` — passed.
- `npm run build` — passed.
- `npm audit --omit=dev` — passed, `0 vulnerabilities`.
- Playwright route QA — passed.
- Animation proof script showed moving packet coordinates and scroll-state change.

These checks only validate the experimental route technically; they do not mean the design direction is approved.

## Server State

The preview server on port `3121` was stopped after the pause request.

If someone needs to view the last experimental preview again, rebuild and start manually:

```bash
npm run build
node scripts/start-standalone.mjs --hostname 0.0.0.0 --port 3121
```

Do not leave it running unless it is actively needed.

## Recommended Future Direction

When website work resumes, do not start from another full animated homepage attempt.

Recommended next approach:

1. Audit the existing production-equivalent local homepage by blocks.
2. Improve one block at a time in safe preview or local branch.
3. Keep the current production URL structure and production freeze.
4. Start with practical blocks:
   - current hero;
   - service/direction block;
   - proof/certificates;
   - contact/lead section;
   - individual service pages.
5. Use small visual enhancements and copy/CRO improvements before trying large animation again.

## Resume Checklist

In a future chat, before doing anything:

1. Read `PROJECT_STATE.md`.
2. Read `ONIXBIT_SITE_WORK_PAUSED_2026-07-06.md`.
3. Read `ONIXBIT_SITE_ROADMAP.md`.
4. Read `ONIXBIT_PUBLICATION_PLAN.md`.
5. Run `pwd`.
6. Run `git status -sb`.
7. Confirm whether Aleksander wants:
   - cleanup/archive of `/preview-onixbit-home-final`;
   - block-by-block work on the existing site;
   - page-specific work;
   - no site work.

Do not delete experimental files or revert shared changes without explicit approval.
