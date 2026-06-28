# Onixbit Project State

Last updated: 2026-06-28

## Purpose

This file is the durable handoff for Codex chats. If a chat is lost, compacted, or restarted, start the next chat by asking Codex to read this file first.

Recommended first message in a new chat:

```text
Проект Onixbit.
Папка: /home/aleksander/projects/onixbit.
Прочитай PROJECT_STATE.md, затем сам проверь pwd и git status.
Работаем в React/Next из корня репозитория.
Используй onixbit-brand, ui-ux-pro-max, 21st.dev и motion, когда это уместно.
Общайся со мной на русском.
```

## Current Working Folder

Use the repository root:

```bash
/home/aleksander/projects/onixbit
```

Do not use `onixbit-next`; the Next.js app was moved to the repository root.

## Stack

- Next.js 16.2.9
- React 19.2.4
- TypeScript
- Tailwind CSS 4 / PostCSS
- @fontsource Manrope + Montserrat for self-hosted open-source typography
- lucide-react for icons
- motion for React animations
- Playwright + axe for E2E and accessibility checks
- Lighthouse CI for local performance/SEO/accessibility audits
- Sentry-ready monitoring, disabled until `NEXT_PUBLIC_SENTRY_DSN` is configured
- Docker Compose + Caddy for production
- GitHub Actions for CI/deploy to FirstVDS

## Useful Commands

```bash
npm run dev
npm run check
npm run lint
npm run build
npm run browser:deps
npm run test:e2e
npm run test:e2e:built
npm run test:e2e:ui
npm run test:visual:update
npm run lhci
git status -sb
gh auth status -h github.com
```

`npm run check` runs lint, production audit, and build.

## Deployment

Repository remote:

```text
origin git@github.com:expertvizoff-cpu/onixbit.git
```

Main branch:

```text
main
```

Pushing to `main` can trigger GitHub Actions and the FirstVDS deployment workflow.

Deployment docs:

```text
DEPLOY_FIRSTVDS.md
```

## Current Important Commits

- `58c882c` - moved the Next.js app from `onixbit-next` to the repository root and removed old Tilda/VK/archive materials.
- `92b3b9d` - added the `motion` animation library.

## Installed Local Codex Tools/Skills

These are local Codex environment notes, not project dependencies:

- `ui-ux-pro-max` installed at `/home/aleksander/.codex/skills/ui-ux-pro-max`.
- `onixbit-brand` installed at `/home/aleksander/.codex/skills/onixbit-brand`.
- Marketing, sales, SEO/GEO, React, TypeScript, frontend architecture, testing, accessibility, performance, visual-testing, and content skills are installed globally at `/home/aleksander/.codex/skills/`.
- `bitrix-aspro-photoconstructor` is installed globally for future Lifephotoshop/Bitrix/Aspro/photo-constructor work, but it is not an Onixbit project dependency.
- 21st.dev Magic MCP is configured locally in Codex config as `21st_magic`.
- VS Code Russian language pack was installed in the remote VS Code server.
- GitHub CLI `gh` installed at `/home/aleksander/.local/bin/gh`; run `gh auth login` when GitHub API/Actions access is needed.

Do not commit local API keys or Codex config files into this repository.

## Working Rules

- Communicate with the user in Russian unless the user explicitly asks for another language.
- For website/UI work, use the root React/Next project.
- When Aleksander asks for website changes or visual/content edits, apply the changes directly to the site code in the same turn whenever feasible; do not stop at advice, a plan, or a description unless he explicitly asks for discussion only.
- Prefer existing local patterns before adding new abstractions.
- Use `onixbit-brand` for Onixbit-specific brand, copy, SEO, deployment, and handoff decisions.
- Use `ui-ux-pro-max` for UI/UX design, review, animation, layout, typography, color, accessibility, and responsive decisions.
- Use 21st.dev for UI inspiration/components/logos when helpful.
- Use `motion` sparingly for professional B2B motion: subtle reveals, state transitions, hover/tap feedback, and reduced-motion-friendly animations.
- Keep Onixbit business-focused: restrained, clear, credible, and conversion-oriented.
- Public contacts: use `8 800 100-53-03` (`tel:+78001005303`) as the primary website/header phone. Keep `+7 (920) 272-48-28` as the direct/mobile channel in contacts and messengers, not as the main header phone.
- For pricing, licenses, tariffs, certificates, and similar comparison blocks, preserve the desktop composition on common laptop widths (`1181-1440px`) with compact spacing instead of collapsing columns too early. Collapse to 2 columns only below the laptop range and to 1 column on mobile.
- When starting articles or case descriptions, remind Aleksander to create or provide `CONTENT_GUIDE.md`, `CASE_TEMPLATE.md`, and `TYPOGRAPHY_GUIDE.md`/examples so copy has a durable human editorial voice and factual case structure.
- Before finishing substantial work, run `npm run check` unless the change is docs-only or clearly does not affect code.
- Run `npm run test:e2e` after user-visible route, layout, form, or navigation changes.
- Run `npm run lhci` for performance, SEO, accessibility, or production-readiness audits.
- Commit and push only when the user wants the work finalized or deployment should be triggered.
- When Aleksander asks to see changes on the live site, run checks, commit, and push to `main` so the GitHub Actions / FirstVDS deployment can start.

## Restart/Handoff Routine

If a session is interrupted without `/wrap`, the next Codex chat should restore context automatically:

1. Read `PROJECT_STATE.md`.
2. Run `pwd`.
3. Run `git status -sb`.
4. Continue from the newest user request without asking the user to repeat these commands.
5. Speak Russian by default.

Before ending a substantial task, update this file if any of these changed:

- project structure
- dependencies
- deployment workflow
- active tools/skills
- important decisions
- last known next steps

Then run:

```bash
git status -sb
```

If code changed, run:

```bash
npm run check
```

## Current State

- Project root is clean React/Next.
- `onixbit-next` no longer exists.
- Old Tilda/preview/VK/archive materials were removed.
- `motion` is installed and ready.
- Playwright and axe are configured in `tests/` for smoke, overflow, health, and accessibility checks. `npm run browser:deps` prepares local Chromium libraries without sudo. `npm run test:e2e` builds first; `npm run test:e2e:built` expects an existing build.
- GitHub Actions CI and FirstVDS deploy checks build first, then run E2E tests against the built app.
- Lighthouse CI is configured in `lighthouserc.cjs` and runs manually with `npm run lhci`; it uses the same no-sudo local browser dependency wrapper.
- Sentry-ready files and `/api/health` exist; monitoring stays disabled until `NEXT_PUBLIC_SENTRY_DSN` is configured.
- Typography now uses self-hosted open-source Manrope for body text and Montserrat for headings, buttons, and accent UI.
- GitHub CLI `gh` is installed but not authenticated yet.
- Homepage budget animation refinements live in `src/app/home-budget-20260627.css`, imported after `globals.css` to force a fresh CSS chunk for cache-busting.
- `next.config.ts` sets `Cache-Control: public, max-age=0, must-revalidate` for `/_next/static/chunks/:path*` so CSS/JS chunk updates are revalidated instead of being stuck behind immutable browser cache during visual edits.
- 2026-06-28 session: completed a full-site audit/polish pass across the homepage, `/o-kompanii`, service pages, cases, articles, certificates, tariffs, contacts, privacy, sitemap, and global layout.
- Main changes from the full-site pass: stronger homepage positioning and quick service routes, more client-facing process copy, a first-call outcomes block on `/o-kompanii`, canonical/OpenGraph metadata on public pages, refined sitemap priorities/frequencies, mobile CTA compaction, and readable H1 text spacing for assistive tech.
- The temporary GetReview-like video widget is no longer mounted or imported in `src/app/layout.tsx` because the public external test video is not production-ready and the widget competed with mobile hero CTAs. Untracked files `src/components/VideoTrustWidget.tsx` and `src/app/video-trust-widget.css` may remain locally but should not ship unless replaced with an owned Onixbit video.
- Checks passed after the full-site pass: `npm run check`, `npm run lint`, `npm run build`, and `npm run test:e2e:built` with 26 passed. `next build` still prints the known custom Cache-Control warning for `/_next/static/chunks/:path*`.
- Playwright desktop/mobile screenshots for all public routes were regenerated in `output/playwright/audit-{desktop,mobile}-*.png`; route geometry checks reported no horizontal overflow.
- Local preview for the final build was started at `http://127.0.0.1:3100`.
- 2026-06-28 follow-up session: assembled and polished the three service pages `/vnedrenie-bitrix24`, `/razrabotka-saitov-na-1c-bitrix`, and `/raboty-po-1c-predpriyatie` with stronger decision, outcome, risk, and diagnostic CTA blocks.
- Same follow-up removed homepage hero quick-route buttons and decorative `01/02/03`-style counters from JSX/TSX surfaces, converted process markers to icons, restyled `/o-kompanii` proof teasers to match the homepage proof strip, and replaced the about-page route iframe with an interactive Yandex Maps API map. The map now uses coordinate-bound city placemarks, has no office-to-office route, and disables mouse-wheel zoom.
- Checks passed after the follow-up: `npm run check`, `npm run test:e2e:built` with 26 passed, and a custom Playwright DOM/runtime check confirming the homepage cleanup, service page blocks, about proof strip, route removal, and Yandex city labels. `npm run lhci` completed and wrote reports; `/contacts` still has a Lighthouse best-practices warning around third-party cookies/source maps/DevTools issues from the map stack plus moderate performance metrics. `next build` still prints the known custom Cache-Control warning for `/_next/static/chunks/:path*`.
- 2026-06-28 correction pass after user feedback: rebuilt the three service pages so they no longer share the same repeated block structure. `/vnedrenie-bitrix24` now uses a CRM command-center/workflow/automation composition, `/razrabotka-saitov-na-1c-bitrix` uses a browser blueprint/site architecture/release board composition, and `/raboty-po-1c-predpriyatie` uses an integration hub/responsibility boundary/exchange monitor composition. Checks passed: `npm run lint`, `npm run build`, `npm run check`, `npm run test:e2e:built` with 26 passed, and custom Playwright desktop/mobile DOM + screenshot checks for the three service routes with zero horizontal overflow.
- Current untracked local files are expected and should not be shipped unless intentionally revived: `CODEX_SETUP_RU.md`, `output/`, `src/components/VideoTrustWidget.tsx`, and `src/app/video-trust-widget.css`.
