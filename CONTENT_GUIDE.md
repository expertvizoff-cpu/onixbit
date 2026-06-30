# Onixbit Content Guide

Last updated: 2026-06-30

This guide defines how Onixbit writes the client knowledge base and future articles. It is the source of truth before creating article data, pages, screenshots, videos, or editorial briefs.

## Editorial Position

The `/articles` section is not a generic blog. It is a client-facing knowledge base for Bitrix24, CRM, automation, sites on 1C-Bitrix, integrations with 1C, licensing, support, and project acceptance.

Chosen model:

- Practical reference without filler.
- Educational series, like a structured playlist.
- Troubleshooting and breakdown articles for common client problems.

Every article must help a real client do one thing, understand one risk, or make one decision. If the article cannot answer "what will the reader do differently after reading this?", do not publish it.

## Author Persona

Primary author concept: `Записки интегратора`.

The knowledge base should feel like a practical book written by an experienced integrator, not like anonymous SEO content. The author persona is Aleksander / Onixbit as a calm practitioner who sits at a working desk, sketches CRM logic, checks implementation risks, and speaks to the reader as a thoughtful colleague.

Use this persona to add weight, memory, and continuity to articles:

- Author block near the top: `Разбирает Александр, Ониксбит`.
- Optional visual: modern integrator's desk, laptop, notebook, CRM/process sketches, warm light, restrained Onixbit red/yellow accents.
- Recurring note block: `Записки интегратора`.
- Short margin-style blocks: `На полях`, `Проверьте первым`, `Где обычно ломается`.
- Real authorship and reviewer fields still matter; the visual persona does not replace human attribution.

Visual rules:

- Prefer semi-realistic editorial portrait or warm documentary illustration over cartoon mascot.
- Use the real founder image as the trust anchor when possible; use generated/editorial visuals only as supporting brand language.
- Do not make the author look like a fantasy professor, stock office worker, or playful mascot.
- Keep the setting practical: desk, notebook, screen, diagrams, system maps, CRM funnel notes.
- Avoid fake screenshots, hallucinated product UI, unrealistic badges, and text-heavy AI images.

Example article block:

```md
### Записки интегратора

Я часто вижу одну и ту же ошибку: компания настраивает стадии сделки, но не фиксирует, что менеджер должен сделать на каждой стадии. В итоге CRM выглядит заполненной, а управляемости не становится больше.
```

## Author Visual Decision 2026-06-30

Chosen primary author image for article work:

- `public/media/author/onixbit-author-selected.webp` - main selected image, based on variant 6 (`onixbit-author-laptop-typing-01`). Use as the default article author portrait.

Reusable supporting variants:

- `public/media/author/onixbit-author-leaned-back.webp` - calm expert pause, useful for management/control articles.
- `public/media/author/onixbit-author-laptop-typing-02.webp` - square laptop-work variant, useful for cards and compact layouts.
- `public/media/author/onixbit-author-avatar-square.webp` - compact avatar candidate.
- `public/media/author/onixbit-author-writing-desk.webp` - author writes at desk, useful for practical instructions.
- `public/media/author/onixbit-author-book.webp` - "author of a practical book" mood for series hubs and deep guides.
- `public/media/author/onixbit-author-hero.webp` - wide hero candidate for article-series pages.
- `public/media/author/onixbit-author-notebook-gaze-01.webp` - good for step-by-step and checklist articles.

Use these as author/editorial visuals, not as fake screenshots of product UI. For product instructions, use real demo-portal screenshots, GIFs, or videos with anonymized data.

## Audience

Primary readers:

- Business owner or director who wants control and predictable scope.
- Head of sales who needs a working CRM, not decorative stages.
- Sales manager who needs to process requests without losing data.
- Marketing specialist who cares about forms, channels, analytics, and lead quality.
- Bitrix24 administrator or responsible employee who configures roles, robots, and access.
- IT or operations lead who worries about integrations, data ownership, and support boundaries.

Assume the reader may be busy, anxious, or already stuck inside a process. Write to reduce friction first; persuasion comes through usefulness.

## Voice And Tone

Onixbit voice:

- Calm expert.
- Practical integrator.
- Business-focused translator of technical systems.
- Honest about limits and responsibility boundaries.

Tone by situation:

| Situation | Tone |
|---|---|
| Step-by-step instruction | Clear, direct, patient |
| Error or problem | Diagnostic, reassuring, precise |
| Article for owners | Business-like, concise, risk-aware |
| Automation/integration | Careful, technical enough, no false certainty |
| CTA block | Helpful, specific, not pushy |

Use:

- Russian business language.
- Concrete nouns: `лид`, `сделка`, `ответственный`, `робот`, `воронка`, `права`, `CRM-форма`.
- Active voice.
- Short paragraphs.
- One idea per paragraph.
- Direct recommendations when evidence is enough.

Avoid:

- Generic agency hype.
- Empty claims like `цифровая трансформация`, `инновационные решения`, `комплексный подход` without specifics.
- Promises of guaranteed ranking, revenue, conversion, or perfect automation.
- "Just click here" without context.
- Jokes in troubleshooting articles.
- Long intros about why the topic is important.

## Source And Claim Rules

Use sources in this order:

1. Official Bitrix24 help and product pages.
2. Onixbit project experience, cases, certificates, and real screenshots.
3. Official documentation for connected products: 1C-Bitrix, 1C, Wazzup, ChatApp, Scloud.
4. Google Search Central for SEO/schema/search recommendations.
5. High-quality editorial references for style and structure.

Do not invent:

- Client results.
- Credentials.
- Prices.
- Guarantees.
- Internal Bitrix24 behavior that was not verified in the current interface.
- Search Console, ranking, traffic, or AI citation data.

When a claim depends on tariff, role, app version, or interface updates, add a caution:

```md
Интерфейс и доступность функции могут отличаться в зависимости от тарифа, прав пользователя и обновлений Битрикс24.
```

## Inspiration References

Use these as editorial inspiration, not as text to copy:

- GOV.UK writing guidance: task-first, plain language, user need before organization need.
- Mailchimp Content Style Guide: educational content should answer a specific question without distraction; screenshots, videos, and GIFs should make guides easier to scan.
- Atlassian Agile hub: broad topic as a learning system with many linked subtopics.
- Ahrefs guides: clear educational hubs with updated structure, author/reviewer signals, and internal links.
- Intercom articles: practical SaaS insight, examples, and business context.
- Nielsen Norman Group: readers scan pages; use meaningful headings, lists, one idea per paragraph, and facts over promotional language.

Useful URLs:

- https://styleguide.mailchimp.com/writing-educational-content/
- https://styleguide.mailchimp.com/voice-and-tone/
- https://www.atlassian.com/agile
- https://ahrefs.com/seo/seo-basics
- https://www.nngroup.com/articles/how-users-read-on-the-web/
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://developers.google.com/search/docs/appearance/structured-data/video

## Content Types

### 1. Reference Article

Use when the reader needs to complete one task.

Example:

```text
Как создать задачу в Битрикс24 и назначить ответственного
```

Best for:

- Fast user help.
- Support links.
- Client onboarding.

Required structure:

1. What the article helps you do.
2. Who it is for.
3. Required access.
4. Steps.
5. Expected result.
6. Mistakes and checks.
7. FAQ.
8. Related articles.

### 2. Educational Series Lesson

Use when articles form a route, like a playlist.

Example:

```text
Быстрый старт, урок 3: где искать чат, календарь и диск
```

Best for:

- New client onboarding.
- Training after implementation.
- Internal customer playbooks.

Required additions:

- Series name.
- Lesson number.
- Previous article.
- Next article.
- "What to learn before this".
- "What to do next".

### 3. Troubleshooting Breakdown

Use when the reader has a problem and wants a diagnosis.

Example:

```text
Почему менеджер не видит сделку в Битрикс24: 7 мест, которые нужно проверить
```

Best for:

- SEO long-tail.
- Support deflection.
- Sales proof that Onixbit understands real CRM failures.

Required structure:

1. Symptom.
2. Most likely causes.
3. Quick checks.
4. Detailed diagnosis.
5. When to call an integrator.
6. FAQ.

### 4. Manager Control Article

Use when the reader is a director or head of sales.

Example:

```text
Как руководителю проверить, что CRM работает, а не просто заполнена
```

Best for:

- Commercial intent.
- Audit and implementation leads.
- Objection handling.

Required structure:

1. What risk the article addresses.
2. What to check in the system.
3. What healthy behavior looks like.
4. Warning signs.
5. What Onixbit can audit or fix.

### 5. Integration Map

Use for site, CRM, 1C, forms, messengers, telephony, and analytics.

Example:

```text
Сайт, Битрикс24 и 1С: какие данные должны переходить между системами
```

Best for:

- Pre-project education.
- Technical sales.
- Reducing scope ambiguity.

Required structure:

1. Systems involved.
2. Source of truth for each data type.
3. Data flow table.
4. Failure points.
5. Test scenarios.
6. Responsibility boundaries.

## Mandatory Article Template

Use this template for every article unless there is a documented reason to deviate.

```md
---
title:
slug:
series:
lesson:
category:
audience:
level:
readingTime:
lastUpdated:
reviewedBy:
primaryIntent:
cta:
sources:
---

# H1

Краткое описание: 1-2 предложения о том, какую задачу решает статья и что получится в итоге.

## Кому подходит

- Роль 1
- Роль 2

## Что нужно до начала

- Доступы
- Права
- Исходные данные
- Ограничения по тарифу, если есть

## Короткий ответ

2-4 предложения. Сначала результат, потом нюанс.

## Пошаговая инструкция

1. Шаг.
2. Шаг.
3. Шаг.

## Что должно получиться

Опишите видимый результат в системе.

## Скриншоты или GIF

Добавьте изображения ключевых шагов. Каждый скриншот должен помогать выполнить действие.

## Частые ошибки

| Проблема | Причина | Что проверить |
|---|---|---|
| | | |

## Когда нужна помощь интегратора

Опишите признаки, что задача вышла за рамки самостоятельной настройки.

## Часто задаваемые вопросы

### Вопрос 1

Ответ.

### Вопрос 2

Ответ.

## Связанные статьи

- [Статья](#)

## Что можно сделать с Ониксбит

Мягкий CTA, связанный с задачей статьи.
```

## Frontmatter Rules

Recommended fields for future article implementation:

| Field | Rule |
|---|---|
| `title` | Human title, not keyword-stuffed |
| `slug` | Latin lowercase, readable, stable |
| `series` | One of the official series |
| `lesson` | Number only when part of a series |
| `category` | Broad category for filters |
| `audience` | Client role: owner, sales, marketing, admin, IT |
| `level` | `start`, `normal`, `advanced` |
| `readingTime` | Estimate after drafting |
| `lastUpdated` | Required |
| `reviewedBy` | Required for technical or high-risk content |
| `primaryIntent` | What the reader wants to do |
| `cta` | Contextual action |
| `sources` | Official docs and internal proof |

## Series Map

Initial knowledge base map:

| Series | Purpose | Example Articles |
|---|---|---|
| Быстрый старт | Help a new user stop feeling lost | Вход и профиль; структура компании; Лента, чат, календарь и диск; уведомления |
| CRM для продаж | Help sales teams process requests and control pipeline | Лиды, сделки, контакты и компании; заявка с сайта; карточка сделки; источники |
| Коммуникации | Connect customer conversations to CRM | Открытые линии; телефония; почта; Wazzup; ChatApp; шаблоны ответов |
| Задачи и проекты | Teach responsibility, deadlines, and project control | Создать задачу; роли в задаче; Канбан; Гант; работа с подрядчиком |
| Автоматизация | Explain robots and safe automation | Автозадачи; письма по статусу; роботы в сделках; как менять сценарий |
| Права и проблемы | Solve access and system issues | Не видно раздел; права CRM; удаленные данные; медленная работа; обновления |
| Интеграции | Explain data flows between systems | CRM-формы; сайт -> CRM; 1С -> Битрикс24; товары, остатки, заказы |
| Руководителю | Help managers inspect whether the system works | Проверка воронки; просрочки; отчеты; признаки поверхностного внедрения |

## Title Patterns

Use clear titles. Prefer a concrete problem or outcome.

Good:

- `Как обработать заявку с сайта в Битрикс24`
- `Почему робот не создал задачу в сделке`
- `Чем лид отличается от сделки, контакта и компании`
- `Как руководителю проверить просроченные задачи в Битрикс24`
- `Сайт, CRM и 1С: где должен быть источник истины`

Weak:

- `Все о Битрикс24`
- `Автоматизация бизнеса в современных условиях`
- `Инновационные возможности CRM`
- `Повышаем эффективность продаж`

## Lead Paragraph Rules

The first screen must answer:

- What is this article about?
- Who is it for?
- What result will the reader get?
- Is this a simple instruction, diagnosis, or manager-level guide?

Good intro:

```md
Эта инструкция поможет менеджеру принять заявку с сайта, проверить источник, создать контакт и довести обращение до сделки. Подходит для компаний, где формы уже подключены к Битрикс24, но заявки теряются между менеджерами.
```

Weak intro:

```md
Битрикс24 является современной платформой для автоматизации бизнеса и повышения эффективности процессов продаж.
```

## Step Rules

Each step must:

- Start with a verb.
- Mention the exact section or button label when known.
- Describe what the reader should see after the action.
- Avoid more than one main action per step.
- Include a screenshot when the interface may be unclear.

Example:

```md
1. Откройте раздел **CRM** и перейдите в нужную воронку.
2. Найдите новую заявку по имени клиента, телефону или источнику.
3. Проверьте поле **Ответственный**. Если оно пустое или назначено неверно, выберите менеджера.
```

## Media Rules

Screenshots:

- Use real Onixbit-controlled demo data only.
- Remove personal data, phone numbers, emails, tokens, internal client names, and commercial details.
- Crop tightly around the action.
- Add a short caption: what the screenshot proves or where to look.
- Use `next/image` when implemented on site.
- Add useful alt text.
- Do not publish screenshots with outdated interface labels without a note.

GIFs:

- Use only for short UI motion: up to 8-12 seconds.
- Do not use GIF for complex processes with many steps.
- Keep file weight low.
- Provide text steps next to the GIF.

Video:

- Add for processes with many branches, permissions, or diagnostics.
- Preferred length: 2-5 minutes for one task.
- Add title, description, thumbnail, upload date, duration, and key moments for future `VideoObject` schema.
- Add a text version under the video.

## FAQ Rules

Every article must include 2-3 real questions. FAQ should not repeat the main article.

Good FAQ types:

- Tariff or rights limitation.
- What to do if the button is missing.
- Whether the setting affects existing data.
- When to contact Onixbit.

Avoid:

- Fake SEO questions.
- Questions with obvious answers.
- Sales pitch disguised as FAQ.

## CTA Rules

CTA must match the article intent.

| Article Intent | CTA |
|---|---|
| Simple task | `Нужна настройка под вашу команду? Разберём процесс и покажем, что лучше автоматизировать.` |
| Troubleshooting | `Если причина не нашлась, Ониксбит может провести диагностику CRM и прав доступа.` |
| Manager article | `Покажем, где CRM теряет контроль, заявки или ответственность.` |
| Integration | `Соберём карту обмена между сайтом, Битрикс24 и 1С до разработки.` |
| Licensing | `Подберём тариф под пользователей, роботов, отчёты и каналы коммуникаций.` |

CTA should be helpful, not loud. Avoid `Оставьте заявку прямо сейчас` as the default.

## SEO And GEO Rules

Every article needs:

- One clear H1.
- Unique meta title and description.
- Stable canonical URL.
- Direct answer block near the top when useful.
- Descriptive H2/H3 hierarchy.
- Internal links to series, related articles, service pages, cases, certificates, and contacts.
- External links only where they add evidence.
- Author or reviewer signal.
- Publication and update dates.
- `Article` or `BlogPosting` schema when implemented.
- `BreadcrumbList` schema when implemented.
- `FAQPage` schema only when FAQ is visible and useful.
- `VideoObject` schema when video is a main article asset.

Do not write for search volume alone. The order is:

1. Client usefulness.
2. Onixbit expertise.
3. Search and AI discoverability.
4. Conversion.

## Internal Linking Rules

Each article should link to:

- Its series hub.
- Previous/next lesson when applicable.
- 2-4 related knowledge base articles.
- Relevant service page:
  - `/vnedrenie-bitrix24`
  - `/razrabotka-saitov-na-1c-bitrix`
  - `/raboty-po-1c-predpriyatie`
  - `/tarify-licenziy`
- `/contacts` or lead form only when the reader is likely ready for help.

Anchor text must describe the destination:

Good:

```md
посмотрите инструкцию по правам доступа в CRM
```

Weak:

```md
нажмите сюда
```

## Quality Gate Before Publishing

Before publishing, check:

- The article solves one clear task.
- The first screen gives enough context.
- Steps can be followed without guessing.
- Screenshots have no private data.
- Screenshots or video match the current interface.
- FAQ questions are real.
- CTA matches the article.
- No unverifiable claims.
- No internal notes, SEO briefs, or draft comments remain visible.
- H1, title, description, slug, and internal links are ready.
- Schema fields can be generated from article data.
- Mobile reading remains comfortable.

## Creative Formats To Reuse

Use creativity in structure, not in vague metaphors.

### Diagnostic Map

For problem articles.

```md
# Почему заявка с сайта не появилась в Битрикс24

## Сначала проверьте 4 места

| Где проверять | Что может быть не так | Кто отвечает |
|---|---|---|
| CRM-форма | Не подключена к нужной воронке | Администратор CRM |
| Права | Менеджер не видит лиды | Администратор |
| Сайт | Форма отправляет данные не туда | Разработчик сайта |
| Роботы | Заявка создана, но не назначена | Интегратор |
```

### Lesson Card

For educational series.

```md
# Быстрый старт, урок 1: вход, профиль и первые настройки

В этом уроке пользователь входит в Битрикс24, проверяет профиль, уведомления и рабочие контакты. После урока ему понятно, где искать основные разделы и к кому обращаться, если доступов не хватает.
```

### Manager Checklist

For owners and heads.

```md
# Как проверить, что CRM не разваливается после внедрения

## Быстрая проверка руководителя

- Есть ли новые заявки без ответственного?
- Есть ли сделки без следующего действия?
- Есть ли просроченные задачи по активным сделкам?
- Есть ли каналы, которые не попадают в CRM?
```

### Boundary Article

For integrations and 1C.

```md
# Кто отвечает за ошибку обмена между сайтом, Битрикс24 и 1С

## Граница ответственности

| Зона | Пример проблемы | Кто должен смотреть первым |
|---|---|---|
| Сайт | Заказ не отправился | Разработчик сайта |
| CRM | Сделка создана без ответственного | Интегратор Битрикс24 |
| 1С | Остатки не обновились | Специалист 1С |
```

## First Batch Recommendation

Start with these 12 articles:

1. `Быстрый старт: вход, профиль и первые настройки в Битрикс24`
2. `Карта Битрикс24: где искать ленту, чат, календарь, диск, задачи и CRM`
3. `Лиды, сделки, контакты и компании: чем они отличаются в Битрикс24`
4. `Как обработать заявку с сайта в Битрикс24`
5. `Как создать задачу, назначить ответственного и проконтролировать срок`
6. `Канбан в задачах Битрикс24: когда он помогает, а когда мешает`
7. `Роботы в CRM: как создать задачу при смене стадии сделки`
8. `Почему менеджер не видит сделку или раздел в Битрикс24`
9. `Открытые линии: как не потерять обращение из чата или мессенджера`
10. `Скрипты и шаблоны ответов: как ускорить обработку частых вопросов`
11. `Сайт, Битрикс24 и 1С: какие данные должны переходить между системами`
12. `Как руководителю понять, что Битрикс24 внедрен поверхностно`

These articles cover onboarding, daily work, troubleshooting, management control, and commercial intent.

## Short Editorial Checklist

Use this before drafting:

```md
- [ ] Article type selected.
- [ ] Reader role selected.
- [ ] One task or one problem only.
- [ ] Official sources collected.
- [ ] Required screenshots/video planned.
- [ ] CTA selected.
- [ ] Related articles selected.
- [ ] Claims and limits checked.
```

Use this after drafting:

```md
- [ ] The article starts with the result.
- [ ] Steps are numbered and testable.
- [ ] Paragraphs are short.
- [ ] No hype or generic agency language.
- [ ] FAQ adds real clarification.
- [ ] Media has captions and alt text.
- [ ] Sources are listed.
- [ ] Internal links are useful.
- [ ] CTA is contextual.
- [ ] Metadata and schema fields are ready.
```
