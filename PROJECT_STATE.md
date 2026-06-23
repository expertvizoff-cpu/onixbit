# Onixbit Project State

Last updated: 2026-06-23

## Purpose

This file is the durable handoff for Codex chats. If a chat is lost, compacted, or restarted, start the next chat by asking Codex to read this file first.

Recommended first message in a new chat:

```text
Проект Onixbit.
Папка: /home/aleksander/projects/onixbit.
Прочитай PROJECT_STATE.md, затем сам проверь pwd и git status.
Работаем в React/Next из корня репозитория.
Используй ui-ux-pro-max, 21st.dev и motion, когда это уместно.
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
- lucide-react for icons
- motion for React animations
- Docker Compose + Caddy for production
- GitHub Actions for CI/deploy to FirstVDS

## Useful Commands

```bash
npm run dev
npm run check
npm run lint
npm run build
git status -sb
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
- 21st.dev Magic MCP is configured locally in Codex config as `21st_magic`.
- VS Code Russian language pack was installed in the remote VS Code server.

Do not commit local API keys or Codex config files into this repository.

## Working Rules

- Communicate with the user in Russian unless the user explicitly asks for another language.
- For website/UI work, use the root React/Next project.
- Prefer existing local patterns before adding new abstractions.
- Use `ui-ux-pro-max` for UI/UX design, review, animation, layout, typography, color, accessibility, and responsive decisions.
- Use 21st.dev for UI inspiration/components/logos when helpful.
- Use `motion` sparingly for professional B2B motion: subtle reveals, state transitions, hover/tap feedback, and reduced-motion-friendly animations.
- Keep Onixbit business-focused: restrained, clear, credible, and conversion-oriented.
- Before finishing substantial work, run `npm run check` unless the change is docs-only or clearly does not affect code.
- Commit and push only when the user wants the work finalized or deployment should be triggered.

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
- No current unfinished implementation task is recorded here.
