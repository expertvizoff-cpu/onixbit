# Onixbit Redesign Brief

Last updated: 2026-07-04

This file is the durable source of truth for the Onixbit visual redesign direction. Read it before redesigning the homepage, service pages, article pages, animation system, preview route, or any visual concept work.

## Core Intent

The redesign must not be a prettier version of the current text-and-card site. The current preferred architecture is hybrid: keep the main public website mostly light, fast, readable, and trust-building, while using dark cinematic pages for separate business-process demonstrations. The target is a premium B2B technology experience where the visitor can understand Onixbit through visual scenes, motion, and connected systems without losing ordinary navigation, SEO pages, contact access, and service clarity.

The site should make a client feel:

- Onixbit sees the whole business system, not isolated tasks.
- CRM, website, 1C, communication channels, analytics, and support are connected into one managed contour.
- There is a professional expert/team behind the system.
- The experience is modern, light, transparent, technological, and expensive.
- It is worth pressing the contact button to discuss the system.

## Primary Metaphor

Main metaphor: **a premium IT system where everything is connected**.

Internal supporting metaphors:

- **Control center for business**: use for management, analytics, visibility, dashboards, process control, and homepage/business outcomes.
- **Digital architect / assistant**: use contextually, especially on article pages and knowledge-base experiences, where the assistant helps diagnose, explain, and guide.

Do not make the AI assistant the whole brand. It is a contextual character and guide, not the main company identity.

## Audience

Primary visitors:

- owners and directors,
- sales/operations managers,
- IT leads,
- decision-makers choosing a reliable B2B contractor.

They need to understand quickly:

- what Onixbit can do,
- how Onixbit connects systems,
- why the work is serious and competent,
- how the result reduces chaos, manual duplication, and lost control,
- what to do next.

## Hybrid Site Architecture

Recommended direction from 2026-07-04: mix the two approaches instead of forcing one visual style everywhere.

- Main website: light, clean, quick, trustworthy, SEO-friendly. It carries homepage, services, tariffs, cases, certificates, articles, company, contacts, and lead forms.
- Process pages: dark, cinematic, interactive. They explain concrete business scenarios such as request route, website order through CRM and 1C, exchange failure, support request, and executive control.
- Navigation bridge: light pages should offer clear links like `Посмотреть как проходит заявка`; dark process pages should always return to the matching service, case/proof block, and contact form.
- Performance rule: process pages may be more animated, but still no blocking loader before useful content.

Potential URL family: `/processy/marshrut-zayavki`, `/processy/zakaz-sait-1c-crm`, `/processy/sboy-obmena`, `/processy/kontrol-rukovoditelya`. Final slugs can change after SEO review.

## Visual Direction

Tone:

- dark,
- premium,
- cinematic,
- technological,
- glass/holographic,
- confident and expensive,
- with strong wow effect, but not cheap neon.

Preferred visual traits:

- transparent glass panels,
- deep graphite, near-black, and black-cherry backgrounds,
- Onixbit red and yellow/amber as the main dark-mode accent light,
- cyan/blue glow only as a secondary technical signal for data, HUD details, and thin lines,
- restrained purple only when it supports the scene and does not dominate,
- thin glowing lines and light threads,
- 3D depth,
- layered HUD interfaces,
- soft bloom/blur,
- premium shadows,
- people/characters integrated with interface scenes.

Avoid:

- too much text,
- ordinary cards,
- repeated identical blocks,
- flat generic icons as the main visual language,
- white SaaS-style landing,
- cheap acid neon,
- cartoonish style,
- random stock people,
- "AI girl" cliche,
- scientific-literature feeling,
- blocks that only explain features instead of showing context.

## Dark Onixbit Brand Palette

Use Onixbit brand colors in a premium dark mode, not a generic blue sci-fi palette.

- Base: near-black graphite, black cherry, deep red-brown shadows, and restrained warm highlights.
- Primary accents: Onixbit red (`--ob-red`) and yellow/amber (`--ob-yellow`) as meaningful light, CTA, focus, proof, and system-energy accents.
- Technical glow: cyan/blue may remain only as a secondary data/signal light for thin lines, HUD micro-details, and depth cues.
- Balance: the page must feel expensive and dark first; red/yellow should glow from the system instead of flooding the whole layout.
- Avoid: one-note blue sci-fi, acid neon, purple-blue dominance, beige/tan dominance, and ordinary light SaaS.

## People And Characters

Use **expert + client** as the main people direction.

Possible roles:

- real or semi-real Onixbit expert,
- client/business owner looking at the system,
- technology consultant / architect,
- support/operator for CRM and communication scenarios,
- AI/digital assistant mainly in articles and guided diagnostics.

Characters should feel professional and credible. They can be stylized, cinematic, and technologically enhanced, but should not feel like generic stock images.

## Motion Requirement

Scroll-driven animation is mandatory for the final visual direction.

The site should include scenes where scrolling changes the picture itself, not only fades cards in. Cards/panels with information should fly in, change, connect, and be replaced as the user scrolls.

Expected motion patterns:

- sticky cinematic visual stage,
- cards/panels flying in and out with scroll,
- glowing lines connecting systems like neural threads,
- data flows moving between objects,
- scene state changes as the text changes,
- elements rearranging to show a process step,
- hover/tap feedback as secondary polish,
- reduced-motion fallback.

Core example process:

`client request -> website/form/channel -> Bitrix24/CRM -> tasks/robots -> 1C/data exchange -> analytics/control -> support/development`


Signature feature idea from 2026-07-03:

Use the scroll-driven cinematic section to demonstrate real Onixbit implementation scenarios, not abstract decoration. The strongest first scenario is: a client request appears on the website/form/channel, becomes a Bitrix24 CRM deal, creates manager/tasks/robots, exchanges data with 1C, and turns into analytics/control/support. This should become a clear answer to the client question: what does connecting site, Bitrix24, and 1C actually give the business?

The ambition is to use authentic process material from real systems later: website/admin screens, Bitrix24, 1C, exchanges, manager workflow, and support. Use demo/sanitized data only. Do not request passwords or real client data in chat.

This must be shown visually through changing scenes, not as a static list.


Detailed interactive scenes:

The final concept should combine a macro route with smaller interactive demonstrations of individual system parts. Pattern: foreground action changes background system state immediately. Example: a website chat widget or form sits in the foreground while a large Bitrix24 CRM funnel is visible in the background; when the visitor types or submits a demo message, a new lead/deal card appears in the funnel, then the scene highlights manager assignment, task/robot creation, or the next integration step.

These micro scenes are necessary because the full cinematic route cannot explain all business nuances by itself.

Prototype implementation note from 2026-07-03:

A first live prototype exists at `/preview-onixbit-system-tour`. It demonstrates the micro-scene pattern with a website chat widget in the foreground and a Bitrix24-style CRM board in the background. The demo request creates a new CRM card, then highlights manager assignment, robot task, 1C data exchange, and control/analytics. It intentionally uses self-made demo UI instead of copied third-party screenshots; later real/sanitized system materials can replace parts of the mock scene.

Second prototype iteration: the route now also contains a "лаборатория микросцен" block with switchable scenarios: chat request, website order, CRM robot/task, and support request. This is the working structure for future detailed sections: foreground action on the left, immediate system reaction on the right, and a business-result statement below. Color is intentionally not final yet; the current priority is mechanics, clarity, and scenario coverage.

Third prototype iteration: added a "сценарий будущей главной" section. It turns the effect into a page plan: first screen as a connected system, live request route, micro-scenes for specific system parts, and proof/materials. The section also records what to collect next for a production version: sanitized real scenarios, screen states from Bitrix24/1C/site/support, audience-specific copy, and proof blocks.

Fourth prototype iteration: added a clickable "режиссура реальных материалов" production-studio block. It defines five concrete production scenes for the future animated site: incoming request, manager assignment, order and 1C, exchange failure, and executive control. Each scene stores the human action, system reaction, business outcome, materials to capture or model, and proof message. This is the bridge from mock animation to real/sanitized Onixbit process material.

Fifth prototype iteration: added a "первые сцены оживляем" live-cut block. It starts turning the strongest production ideas into living fragments: request not lost, order through 1C, and exchange failure before complaint. Each fragment shows foreground action, route nodes, immediate system reactions, short metrics, and a proof statement. This is the first step from planning toward a cinematic product-demo sequence.

Sixth prototype iteration: added a focused "Заявка с сайта проходит весь маршрут" scene inside the live-cut area. It turns the request-not-lost idea into a 5-step interactive path: Chat -> CRM -> Manager -> 1C -> Control. The scene has a stepper, next-step control, website foreground panel, system mini-board, updates, and outcome statement. This is the current best candidate for the first polished dark process-demo page before collecting real/sanitized materials.

Seventh prototype iteration: polished the same focus scene toward a sales-ready product demo. Every step now has three director-level explanations: what the client did, what the systems automated, and what control became visible. The widget also shows a live event tag, and the bottom proof strip gives short checkable evidence for the active step. This version is still mock UI, but the explanation layer is closer to what a real client should understand without technical guidance.

Eighth prototype iteration: added a visible request journey map to the focus scene. The route now has five active nodes, an animated progress fill, and a pulse moving from Chat to CRM to Manager to 1C to Control; it is horizontal on desktop/tablet and vertical on mobile. This makes the main selling point more concrete: the request has one traceable route across systems instead of disappearing between windows.

Ninth prototype iteration: added a hybrid architecture block. It visualizes the new strategic answer: the main website remains light for trust, SEO, service clarity, forms, and fast navigation; dark cinematic pages become a separate demonstration layer for business-process breakdowns. The prototype now shows the bridge: light site -> dark process demo -> service/proof/form return.

Site architecture prototype: `/preview-onixbit-architecture` and `ONIXBIT_SITE_ARCHITECTURE.md` now define the full future sitemap, page blocks, header/footer navigation, internal linking, light/dark visual modes, and implementation order. Use this as the next planning source before turning the preview structure into production pages.

## Homepage First Screen

The current first-viewport direction follows the hybrid decision:

- mostly light, fast, readable, and trust-building main website shell;
- immediate signal that Onixbit connects Bitrix24, 1C-Bitrix, 1C, sites, communications, analytics, and support;
- clear CTA to contact Onixbit plus a secondary CTA into a dark process demo, for example `Посмотреть путь заявки`;
- enough visual system metaphor to feel modern, but not a heavy all-dark cinematic hero that hides ordinary navigation;
- no blocking loader before the first content.

The dark premium/glass connected-system visual belongs primarily to process-demo pages and embedded demo sections, not to every public page by default.

## Page-Level Direction

Homepage:

- main cinematic business-system story,
- premium connected-system metaphor,
- fewer text sections,
- more visual explanation,
- service entry points through animated scenes.

Service pages:

- each service must get its own visual language and animation scenario,
- no identical repeated structure between services,
- use contextual system scenes:
  - Bitrix24: CRM command center, requests, deals, tasks, robots, communications.
  - 1C-Bitrix: website/storefront, catalog, forms, orders, content, conversion route.
  - 1C: data exchange, statuses, prices, balances, documents, control, errors.

Articles:

- assistant metaphor is especially appropriate here,
- articles can feel like guided diagnostics,
- an assistant can help highlight mistakes, routes, checklists, and next steps.

Certificates/proof:

- proof should be shown as a competence ecosystem, not a dry document register.

## Reference Memory

The user supplied references from Pinterest and screenshots. The exact Pinterest pages may require login/JavaScript, but the visual memory to retain is:

- "Your life needs an operating system" dashboard poster: glass OS dashboard, many transparent panels, large headline, productivity system.
- Digital face/eye HUD: human face with blue/cyan interface overlays and connected mini-panels.
- Super app phone: transparent phone, floating app/service cards, glass UI, blue glow.
- Neon acrylic badge: premium object, transparent card, purple/blue glow, physical 3D lighting.
- Organize/focus/achieve assistant: dark premium background, person, glowing envelope cards, warm light trails.
- AI call assistant: person + small assistant character, dark tech background, blue glow, service benefits.
- Neon infographics: dark panels, cyan/purple glowing frames, connected labels, keyboard/flow visual.
- UI vs UX phone: central device with glowing connector lines to labels.
- Human/circuit profile: person plus circuit overlays, soft blue/orange glow.
- Glass component kit: transparent buttons, glass inputs, soft refraction and highlights.

All are considered close to the desired direction. Do not discard any without user confirmation.

## Current Temporary Preview

A full temporary demo route now exists for the broader redesign concept:

`/preview-onixbit-site`

Purpose: a safe multi-page demo site while the production site is under moderation. It has its own preview header, footer, cookie banner, homepage, service pages, tariffs, cases, certificates, articles, about page, contacts, and privacy page.

Included demo routes:

- `/preview-onixbit-site`
- `/preview-onixbit-site/vnedrenie-bitrix24`
- `/preview-onixbit-site/razrabotka-saitov-na-1c-bitrix`
- `/preview-onixbit-site/raboty-po-1c-predpriyatie`
- `/preview-onixbit-site/tarify-licenziy`
- `/preview-onixbit-site/cases`
- `/preview-onixbit-site/certificates`
- `/preview-onixbit-site/articles`
- `/preview-onixbit-site/o-kompanii`
- `/preview-onixbit-site/contacts`
- `/preview-onixbit-site/privacy`

Important: this is still a demo shell and content/motion foundation, not an approved final design. It should be iterated visually with the user before any production replacement. Production pages should not be changed or published from this route unless Aleksander explicitly approves.

The older `/preview-onixbit-os` route remains only a playground and should not be treated as approved.

Current public tunnel used during discussion:

`https://bdca7794f09543.lhr.life/preview-onixbit-site`

The tunnel is temporary and only works while the local server and localhost.run tunnel are running.

Checks passed for `/preview-onixbit-site`: `npm run lint`, `npm run build`, and Playwright audits. The homepage now has a sticky scroll-story section where `data-scene` changes through scenes 0, 1, 2, 3, and 4 while scrolling; desktop and mobile audits reported zero horizontal overflow. Screenshots were saved in `output/preview-onixbit-site/scroll-story/`.

## External Sites To Review

Use these as behavior references, not as copy targets:

- Apple Vision Pro: premium spatial interfaces, people plus floating app windows, product scrollytelling — `https://www.apple.com/apple-vision-pro/`
- Apple iPad Pro: product storytelling, visual states, highlights and app/workflow scenes — `https://www.apple.com/ipad-pro/`
- Cuberto: bold agency-level motion and interactive presentation — `https://cuberto.com/`
- Active Theory: high-end interactive WebGL/JavaScript experiences — `https://activetheory.net/`
- CreativeBloq parallax/scrollytelling examples: useful for pattern language and guardrails — `https://www.creativebloq.com/web-design/parallax-scrolling-1131762`

Closest behavior to the user's request: **Apple Vision Pro/iPad Pro style scrollytelling + dark holographic Pinterest visual language + Onixbit business-system content**.

## Remaining Interview Rounds

Do not skip these. If chat compacts or restarts, continue from here.

Completed:

1. Broad taste and emotional direction.
2. Main metaphor, character direction, wow level, first-screen direction, and visual anti-patterns.

Still needed:

3. Scene inventory:
   - exact homepage scroll scenes,
   - what changes in each scene,
   - where characters appear,
   - where neural/glowing connections appear.
4. Content compression:
   - what text can be removed,
   - what must remain for trust,
   - what proof blocks are mandatory.
5. Implementation plan:
   - preview route sequence,
   - assets needed,
   - animation engine choices,
   - performance limits,
   - mobile fallback.

## Open Questions For Next Round

Ask these next unless the user already answers them:

1. Which homepage sections are mandatory, and which can be replaced by visual scenes?
2. Should the first screen show a real Onixbit expert, a stylized expert/client pair, or a generated cinematic composite?
3. Should the scroll story be one long sticky scene or several smaller cinematic scenes?
4. Which service should get the strongest animated block first: Bitrix24, 1C, 1C-Bитрикс, or the overall homepage?
5. How much real proof must be visible before the first CTA: certificates, cases, partner statuses, phone/contact, process?

## Working Promise

The redesign is possible, including scroll-driven animation. It must be built as a deliberate visual system, not as isolated decorative effects. The preview route is only a playground until the design brief and scene plan are stable.

## Correction From User Feedback On 2026-07-01

The first `/preview-onixbit-os` concept was rejected as the wrong direction.

What was wrong:

- It looked like another ordinary page, not a cinematic site experience.
- The layout still felt narrow and section-based.
- Scroll did not feel like the described animation; the page just moved down and some blocks changed.
- It felt like a pile of unrelated UI pieces.
- Aleksander's photos were incorrectly used as both expert and client.

Correct interpretation:

- The key behavior is **fullscreen pinned scrollytelling**.
- During the main experience, the viewport should stay visually fixed while scroll drives the animation timeline.
- The scene should move like a video or camera flight: objects, systems, connections, HUD layers, depth, and light flows move across the full screen.
- Text should be secondary HUD/caption, not a sequence of normal website blocks.
- Do not use Aleksander's photos as generic characters; use stylized/generated/appropriate expert-client visuals only after the character direction is agreed.
- Before polishing design, prove the motion mechanic first with a minimal fullscreen prototype.

A replacement temporary prototype was created as `motion prototype 02` on `/preview-onixbit-os`: fullscreen sticky stage, scroll-controlled camera/world transforms, moving system nodes, glowing solid threads, and no personal photos. It is still only a mechanics check, not an approved final visual design.

## Responsive And Performance Direction

Consider screen sizes and device power from the start of every visual scene. Do not design one heavy desktop animation and only shrink it with CSS.

Use one conceptual story with different staging per device:

- Large desktop / 4K: full cinematic scroll-film, richer depth, more HUD layers, more connection lines, and fuller 3D/glow effects.
- Common laptops (`1366-1440px`): same story, but fewer simultaneous glow layers, fewer particles, tighter composition, and controlled blur.
- Small laptops / netbooks: simplified scene density, fewer background layers, fewer live filters, larger readable objects, and reduced particle count.
- Tablets: touch-first composition, larger objects, fewer micro-HUD details, fewer hover-only states, pinned scenes only where they stay smooth.
- Smartphones: separate mobile staging, not a shrunken desktop scene; one main object/process per viewport, short cinematic steps, visible CTA, minimal filters.
- Reduced-motion / low-power mode: keep meaning and sequence, but remove camera flight, particles, heavy blur, and continuous motion.

Performance rules for final implementation:

- Avoid updating React state on every scroll frame; use CSS variables, motion values, or a dedicated render layer for frame-level movement.
- Prefer `transform` and `opacity` for DOM motion.
- Move many glowing lines/particles into one canvas/WebGL layer where practical.
- Limit `backdrop-filter`, large `blur`, `drop-shadow`, `mix-blend-mode`, and full-screen translucent layers.
- Turn off invisible scenes and non-participating objects.
- Test at minimum: 4K/desktop, 1440 laptop, 1366 laptop, small netbook width, iPad/tablet, iPhone/Android mobile, and `prefers-reduced-motion`.

This responsive/performance direction is mandatory before approving any final visual concept.


## Dark Process Demo Storyboard V1

This storyboard is now treated as a dark process-demo direction, not the default homepage direction. It is useful for separate pages in the future `/processy/...` family, especially the request-route demo.

Core idea: the visitor sees not a set of services, but one managed business system assembled around the client request. The camera moves through the system while short HUD captions explain the business meaning.

### Scene 00 - Onixbit As System Architect

Goal: immediately explain who Onixbit is and why the site exists.

Visual: dark premium control room. In the center: Onixbit core / expert-architect, not a generic AI mascot. Around it: faint glass objects for Bitrix24, 1C-Bitrix site, 1C, communication channels, analytics, support.

Motion: first scroll brings the system out of darkness. Thin red/amber light wakes up in the core, cyan appears only as tiny data signal. Objects do not fall in as cards; they arrange around the core like a business operating system.

Caption: CRM, сайт и 1С в одной рабочей системе.

CTA: Обсудить систему. Secondary path: Смотреть направления.

Responsive staging: desktop shows full system orbit; laptop reduces depth layers; tablet shows central core plus 3 nearest systems; mobile shows core plus one short connected route and fixed CTA.

### Scene 01 - Client Signal Enters The System

Goal: show the pain without long text: requests arrive from many channels and can get lost.

Visual: a client signal appears as glowing messages/calls/forms around the left or foreground edge. Channels: website form, phone, messenger, email.

Motion: signals move toward a single intake point. Some weak signals fade into shadow to hint at lost requests; Onixbit route catches and normalizes them.

Caption: Заявки не должны жить в разных каналах.

Business meaning: one intake route, responsible person, deadline, visible history.

Responsive staging: desktop can show several channels; mobile shows only 2-3 signals and one clear route to CRM.

### Scene 02 - Website And 1C-Bitrix As The Client Route

Goal: make website development understandable as part of sales, not decoration.

Visual: glass browser/storefront plane. Sections light up: landing page, catalog, product/order, form, analytics tag. 1C-Bitrix is shown as a real site/storefront object, not just a label.

Motion: camera moves through the site plane. A request carries context: page, product, form fields, source. This context flows into CRM.

Caption: Сайт передаёт смысл заявки, а не просто сообщение.

Business meaning: structure, forms, catalog, order, SEO base, CRM handoff.

Responsive staging: desktop shows browser plane and floating context cards; tablet keeps browser plus 2 context chips; mobile uses one phone/browser object with a single glowing path to CRM.

### Scene 03 - Bitrix24 Becomes The Work Route

Goal: show Bitrix24 as a CRM command center, not just software setup.

Visual: CRM board / pipeline / task console. Deal, responsible person, task, robot, communication history and deadline appear as connected HUD elements.

Motion: request lands in a deal. The deal receives owner, stage, next task, automation, and control marker. Lines connect CRM to communication and website.

Caption: CRM превращает обращение в управляемую работу.

Business meaning: funnels, roles, rights, robots, tasks, communication, reports.

Responsive staging: desktop shows full CRM command board; laptop simplifies automation layers; mobile shows one deal card transforming through three states: заявка -> задача -> контроль.

### Scene 04 - 1C And Data Exchange

Goal: clearly show data flows without manual duplication. This is the scene closest to the glowing line references.

Visual: 1C core at the center of this scene. 1C-Bitrix storefront and Bitrix24 CRM sit on opposite sides. Thin glowing lines connect them through 1C. Labels are minimal: заказы, остатки, цены, статусы.

Motion: lower flows: 1C-Битрикс -> 1C and 1C -> Битрикс24. Upper flows: Битрикс24 -> 1C and 1C -> 1C-Битрикс. Particles are soft, blurred, and sparse. Lines are about 1px, solid glowing, not dotted.

Caption: Данные проходят по правилам, без ручного дубляжа.

Business meaning: source of truth, exchange rules, orders, prices, balances, statuses, errors.

Responsive staging: desktop shows bidirectional network; laptop reduces line count; tablet shows three large objects; mobile shows one exchange at a time with step indicators.

### Scene 05 - Management Control

Goal: show why business owner/director cares: visibility and fewer blind spots.

Visual: executive control HUD. Metrics are not fake money claims; they are process signals: зависшие сделки, просрочки, каналы заявок, ошибки обмена, нагрузка, этапы.

Motion: camera pulls back. CRM, site, 1C and communications become one controllable dashboard. Red warning nodes cool down into amber/greenish control markers.

Caption: Руководитель видит систему целиком, а не набор сервисов.

Business meaning: control, diagnostics, responsibility boundaries, reports, support.

Responsive staging: desktop shows layered dashboard; mobile uses 3 large diagnostics: заявки, данные, контроль.

### Scene 06 - Proof And Trust

Goal: convert wow into confidence.

Visual: certificate/partner orbit around the system: Bitrix24, 1C-Битрикс, ASPRO, Wazzup, ChatApp, Scloud. Cases appear as honest scenario cards, not fake logos.

Motion: proof nodes snap into a calmer grid/constellation. This is where the film starts turning into a more readable website zone.

Caption: Компетенции можно проверить до старта работ.

Business meaning: 14 years, official statuses, certificates, partner ecosystem, cases format.

Responsive staging: desktop uses orbit-to-board transition; mobile uses a compact proof rail and links to certificates/cases.

### Scene 07 - Contact Decision

Goal: make the next action obvious and low-friction.

Visual: the whole system stabilizes. The core route remains glowing behind a clean contact panel.

Motion: camera stops. CTA panel comes forward; background motion slows heavily.

Caption: Разберём вашу связку и предложим ближайший практичный шаг.

CTA: Обсудить проект / Получить экспресс-аудит.

Business meaning: first step is diagnosis, not buying a vague package.

Responsive staging: on mobile CTA is always available after the first scene and repeated at the end.

## Homepage Content Compression Map

Keep in the film:

- Hero positioning: CRM, site, 1C as one working system.
- Pain section: transform into scenes 01 and 04.
- System solution: transform into scenes 02-05.
- Directions: appear as system objects and service entry points, not repeated cards.
- Trust/certificates: scene 06 and a calmer post-film proof area.
- Lead form: scene 07 and fixed/light CTA.

Move after the film into compact proof sections:

- Detailed tariffs and licenses.
- Full certificates section link.
- Cases preview.
- Articles/diagnostics preview.
- FAQ.

Remove or compress heavily:

- Repeated ordinary service cards.
- Long explanatory paragraphs inside the cinematic part.
- Duplicate benefit cards that say the same thing as the scenes.
- Decorative UI elements without clear business meaning.

## Preview 03 Implementation Direction

Preview 03 should prove the first real scene system, not final full site.

Build one optimized homepage film shell with:

- timeline data separated from rendering,
- scroll progress stored outside React state for frame-level movement,
- one canvas/WebGL or optimized visual layer for lines/particles,
- DOM only for readable HUD, CTA, labels, and accessibility,
- responsive scene variants from the start,
- reduced-motion fallback,
- performance tests before visual polish.

First implementation target: scenes 00-04 only. If those work smoothly and feel right, extend to proof and CTA scenes.
