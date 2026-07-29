# Onixbit Site Architecture

Last updated: 2026-07-04

This document is the working map for the next Onixbit redesign stage. It follows the current hybrid decision:

- main public site is light, readable, fast, SEO-friendly, trust-building;
- business-process pages are dark, cinematic, interactive, and scenario-based;
- every dark process page must return the visitor to the relevant service, proof, and contact path;
- no mandatory loading screen before useful content.

Working prototype route:

```text
/preview-onixbit-architecture
```

Related process prototype:

```text
/preview-onixbit-system-tour
```

## Core Principle

The site should not be a list of services. It should show that Onixbit connects website, Bitrix24, 1C, communication channels, analytics, support, and management control into one business system.

The main navigation must answer three visitor questions:

1. What can Onixbit do for my company?
2. How does the connected process actually work?
3. Why can I trust this team and what should I do next?

## Sitemap

```text
Homepage (/)
├── Services
│   ├── Внедрение Битрикс24 (/vnedrenie-bitrix24)
│   ├── Сайты на 1С-Битрикс (/razrabotka-saitov-na-1c-bitrix)
│   ├── Работы по 1С (/raboty-po-1c-predpriyatie)
│   └── Тарифы и лицензии (/tarify-licenziy)
├── Process Demos
│   ├── Процессы (/processy)
│   ├── Маршрут заявки (/processy/marshrut-zayavki)
│   ├── Заказ сайт + CRM + 1С (/processy/zakaz-sait-1c-crm)
│   ├── Сбой обмена (/processy/sboy-obmena)
│   ├── Поддержка из каналов (/processy/podderzhka-iz-kanalov)
│   └── Контроль руководителя (/processy/kontrol-rukovoditelya)
├── Proof
│   ├── Кейсы (/cases)
│   │   └── Страница кейса (/cases/[slug])
│   ├── Сертификаты (/certificates)
│   ├── База знаний (/articles)
│   │   └── Статья (/articles/[slug])
│   └── О компании (/o-kompanii)
├── Контакты (/contacts)
└── Политика конфиденциальности (/privacy)
```

## URL Map

| Page | URL | Mode | Priority | Main role |
|---|---|---|---|---|
| Главная | `/` | light | A | Explain the whole connected-system idea and route users to services, process demo, proof, and contact. |
| Внедрение Битрикс24 | `/vnedrenie-bitrix24` | light | A | Sell CRM implementation as managed sales/control process. |
| Сайты на 1С-Битрикс | `/razrabotka-saitov-na-1c-bitrix` | light | A | Show website as part of sales and system integration. |
| Работы по 1С | `/raboty-po-1c-predpriyatie` | light | A | Explain 1C value through data exchange, documents, statuses, and control. |
| Тарифы и лицензии | `/tarify-licenziy` | light | B | Help choose licenses, plans, and consultation path. |
| Процессы | `/processy` | dark | A | Hub for dark business-process demonstrations. |
| Маршрут заявки | `/processy/marshrut-zayavki` | dark | A | Signature scene: request goes from site/chat to CRM, manager, 1C, and control. |
| Заказ сайт + CRM + 1С | `/processy/zakaz-sait-1c-crm` | dark | A | Show order data passing through site, CRM, and 1C without manual copying. |
| Сбой обмена | `/processy/sboy-obmena` | dark | B | Show mature monitoring and responsibility before client complaint. |
| Поддержка из каналов | `/processy/podderzhka-iz-kanalov` | dark | B | Show how chats and messengers become tasks and controlled history. |
| Контроль руководителя | `/processy/kontrol-rukovoditelya` | dark | B | Show executive visibility: source, responsible person, SLA, order status, exchange risks. |
| Кейсы | `/cases` | light | A | Prove competence through real business problems and outcomes. |
| Страница кейса | `/cases/[slug]` | light | B | Detail one project: problem, limitations, solution, process after, result. |
| Сертификаты | `/certificates` | light | B | Present competence ecosystem, not a dry registry. |
| База знаний | `/articles` | light | A | SEO and trust hub for CRM, website, 1C, exchanges, and control topics. |
| Статья | `/articles/[slug]` | light | B | Explain one problem deeply and route to diagnosis/service. |
| О компании | `/o-kompanii` | light | B | Reduce contractor risk and show team approach. |
| Контакты | `/contacts` | light | A | Convert ready visitors: phone, messengers, form, map, first-call expectations. |
| Privacy | `/privacy` | system | C | Legal trust and form compliance. |

## Header Navigation

Primary header items:

```text
Услуги | Процессы | Кейсы | База знаний | О компании | Контакты | CTA: Обсудить задачу
```

Rules:

- keep 4-6 visible navigation items on desktop;
- use a simple services dropdown only if needed;
- `Процессы` is not a generic blog section, it is a visual demonstration hub;
- service pages should show a contextual secondary CTA, for example `Посмотреть путь заявки`;
- logo returns to `/`;
- primary phone stays visible where the layout allows: `8 800 100-53-03`.

## Footer Navigation

Footer groups:

| Group | Links |
|---|---|
| Услуги | Битрикс24, 1С-Битрикс, 1С, лицензии |
| Процессы | Маршрут заявки, заказ сайт + CRM + 1С, сбой обмена, контроль руководителя |
| Доверие | Кейсы, сертификаты, статьи, о компании |
| Контакт | Телефон, форма диагностики, мессенджеры, политика |

## Page Block Plan

### Главная `/`

1. First screen: connected business contour, short value proposition, phone, main CTA, link to process demo.
2. Directions: Bitrix24, 1C-Bitrix websites, 1C work.
3. Short route visualization: request goes through site, CRM, manager, 1C, control.
4. Business pains: lost requests, manual copying, unclear responsibility, exchange errors.
5. Proof strip: cases, certificates, articles, partner statuses.
6. Diagnosis form and direct contacts.

### `/vnedrenie-bitrix24`

1. Service hero: CRM as controlled work, not just fields.
2. CRM command center scene: leads, deals, tasks, robots, SLA.
3. Scenarios: request from website, messenger request, manager task, robot.
4. Scope: funnels, rights, robots, tasks, integrations, reports.
5. Risks of surface implementation.
6. Links to request-route demo, CRM articles, cases, contact.

### `/razrabotka-saitov-na-1c-bitrix`

1. Service hero: website as part of sales and CRM/1C route.
2. Blueprint: page structure, forms, catalog, orders, statuses.
3. Website to CRM: source, page, item, comment, UTM.
4. Website to 1C: prices, stock, statuses, documents, exchange errors.
5. UX and SEO: landing pages, speed, navigation, conversion.
6. Link to order-through-site-CRM-1C process demo.

### `/raboty-po-1c-predpriyatie`

1. Service hero: 1C as reliable source of accounting and operational data.
2. Integration hub: prices, stock, documents, statuses.
3. Responsibility boundaries: what belongs to 1C, website, CRM.
4. Exchange monitor: errors, delays, retry, notifications.
5. Work types: refinement, exchange, rights, reports, support.
6. Link to exchange-failure process demo.

### `/tarify-licenziy`

1. License selection hero.
2. Segments: Bitrix24, 1C-Bitrix, Scloud/1C, support.
3. Comparison by business situation, not only price.
4. Reminder that a license does not replace process setup.
5. FAQ for payment, renewal, upgrade, migration.
6. Selection form and referral links after Aleksander provides exact URLs.

### `/processy`

1. Dark hub hero with immediate content, no blocking preloader.
2. Process catalog: request, order, exchange failure, support, executive control.
3. Each card: human action, system reaction, business result.
4. Service mapping: which service page each scenario supports.
5. Privacy/safety note: mock or sanitized data only.
6. CTA back to services and contact form.

### `/processy/marshrut-zayavki`

1. First visible state: request exists immediately.
2. Sticky scene: Chat -> CRM -> Manager -> 1C -> Control.
3. Micro action: send message, create deal, assign task, update exchange status.
4. Director explanation: client action, system automation, visible control.
5. Proof strip: source, SLA, responsible person, order/exchange status.
6. Return to Bitrix24 service, cases, contact.

### `/processy/zakaz-sait-1c-crm`

1. Client selects service, license, or product on website.
2. Website sends order content, price, source, client data into CRM.
3. 1C checks price, stock/status, document, account data.
4. Status returns to deal and manager gets next step.
5. Risks of manual copying and data mismatch.
6. Return to website service, 1C work, contact.

### `/processy/sboy-obmena`

1. Exchange error or delay appears.
2. Scene identifies the problem zone: site, 1C, CRM, channel.
3. Task is created for responsible specialist.
4. Director sees business impact before client complaint.
5. Prevention plan: logging, notification, SLA, retry.
6. Return to 1C work, support, contact.

### `/processy/podderzhka-iz-kanalov`

1. Request arrives from WhatsApp, Telegram, form, chat, or email.
2. CRM connects request with client and history.
3. Responsible person gets task and response deadline.
4. Manager sees queue, overdue requests, repeat contacts.
5. Partner context: Wazzup, ChatApp, Bitrix24.
6. Return to Bitrix24 service, certificates, contact.

### `/processy/kontrol-rukovoditelya`

1. Director opens management panel.
2. Metrics: request source, responsible person, SLA, order status, exchange errors.
3. Drill-down from metric to deal, task, or exchange event.
4. Clear division: what is automated, what remains human, what is controlled.
5. Implementation roadmap: diagnosis, setup, reports, support.
6. Return to services, cases, contact.

### Proof And Support Pages

- `/cases`: filters by CRM/site/1C/integration/support, cards with problem/process/result, links to process demos.
- `/cases/[slug]`: before/after process story, implemented solution, repeatable lesson, CTA.
- `/certificates`: competence ecosystem with Bitrix24, 1C-Bitrix, Aspro, Concept, Wazzup, ChatApp, Scloud.
- `/articles`: series hub for CRM, website requests, 1C, exchanges, executive control.
- `/articles/[slug]`: problem, checklist, mistakes, normal system state, FAQ, service CTA.
- `/o-kompanii`: team, principles, competencies, project process, map, CTA.
- `/contacts`: phone, messengers, form, map, first conversation expectations.
- `/privacy`: legal text linked from forms and footer.

## Internal Linking Plan

High-value links:

- `/` -> `/processy/marshrut-zayavki`, key services, cases, contacts.
- `/vnedrenie-bitrix24` -> `/processy/marshrut-zayavki`, CRM articles, cases, contacts.
- `/razrabotka-saitov-na-1c-bitrix` -> `/processy/zakaz-sait-1c-crm`, cases, articles.
- `/raboty-po-1c-predpriyatie` -> `/processy/sboy-obmena`, `/processy/zakaz-sait-1c-crm`, cases.
- dark process pages -> matching service page, proof page, contacts.
- articles -> relevant service and process demo, not only generic contact form.
- cases -> relevant service, process demo, contact.

No important page should be orphaned. Every process page needs at least one link from a service page and one link back to a service page.

## Visual System

### Light Mode

Use for homepage, services, proof, articles, company, contacts:

- warm light background;
- graphite text;
- Onixbit red for primary action and semantic focus;
- amber for secondary warmth and proof;
- teal/blue only as restrained system signal;
- compact B2B sections, strong headings, short forms, clear scan paths.

### Dark Process Mode

Use for process demos:

- near-black graphite and black-cherry surfaces;
- red/amber as main Onixbit energy;
- cyan only for data-flow signal, not as dominant palette;
- sticky scenes, route lines, state changes, foreground action -> background system response;
- reduced-motion fallback;
- no mandatory preloader.

### Shared Rules

- Manrope for body, Montserrat/display font for headings and buttons.
- Lucide icons for interface icons.
- Border radius around 8px unless an existing component requires otherwise.
- Cards only for repeated items, tools, modals, or clearly framed content.
- Do not use decorative orbs or generic stock-like visuals.
- Mobile text and URLs must wrap without horizontal overflow.

## Implementation Order

1. Approve this architecture and the interactive preview.
2. Build the light public shell: homepage, service navigation, CTA bridge into process pages.
3. Build first dark process page: `/processy/marshrut-zayavki`.
4. Collect or recreate sanitized materials from demo Bitrix24, site, and 1C flows.
5. Build remaining process pages.
6. Add SEO, analytics, forms, accessibility, performance checks, and publication workflow.

## Current Decision

Start from the architecture prototype, then make the first real production candidate around the strongest story:

```text
request -> website/chat/form -> Bitrix24 CRM -> manager/task/robot -> 1C exchange -> executive control
```

This scenario is the clearest sales explanation of what Onixbit gives when it connects website, CRM, and 1C.
