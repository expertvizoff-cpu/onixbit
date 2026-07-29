# Onixbit Reference Sites

Last updated: 2026-07-04

This file keeps the visual reference discussion durable across Codex chats.

## Current Decision

We are no longer treating the choice as only `all light` vs `all dark`. The current strongest direction is a hybrid: the main site stays light, fast, readable, and trust-building; separate business-process pages use the dark cinematic system-tour style. The dark direction is therefore a special demonstration mode, not the whole website shell.

Non-negotiables for the prototype:

- no mandatory loading screen before the first content;
- first text, navigation, and CTA must appear immediately;
- animation must clarify the business system, not decorate it;
- desktop and mobile must both be checked in a real browser;
- if an effect requires heavy assets or a blocking preloader, it is rejected or simplified.

## Signature Idea Found By Aleksander

The scroll-driven effect now has a concrete business purpose: show how Onixbit connects the client systems through real scenarios.

Primary scenario to prototype:

`client request -> website/form/channel -> Bitrix24/CRM deal -> manager/task/robot -> 1C/data exchange -> analytics/control -> support/development`

This should feel like an animated product/process demonstration, not an abstract tech background. It must answer the client question: what does connecting the website, 1C, and Bitrix24 actually give the business?

Potential site feature name: **interactive process tour** / **business system route** / **route of a request**.

Long-term ambitious idea: record or recreate real screens/processes from website, Bitrix24, 1C, and related tools, then use them as authentic material for the animation. This could become the most recognizable and sales-oriented feature of the Onixbit website because it demonstrates actual implementation value instead of only describing services.

Access note: Aleksander may later give Codex guided access/training for these systems. Until privacy/security rules are agreed, do not request secrets in chat and do not use real client data in assets.

## Detailed Interactive System Scenes

The redesign should have two storytelling levels:

1. Macro route: a cinematic scroll-driven journey of a request through the whole connected system.
2. Micro scenes: separate interactive demonstrations of individual system parts and nuances.

Preferred micro-scene pattern:

`foreground action -> background system state changes immediately`

Example:

- Background: a large CRM funnel / Bitrix24 board.
- Foreground: website chat widget or form, positioned in front of the board.
- Visitor types a message or submits a demo request.
- The CRM funnel instantly receives a new lead/deal card.
- The scene then highlights assignment to a manager, task/robot creation, or next integration step.

Use this pattern for each important system part because the macro visualization cannot explain every nuance in enough detail.

Current working prototype:

- Route: `/preview-onixbit-system-tour`
- Purpose: first live prototype of the signature Onixbit system-tour feature.
- Scenario: website chat/form request -> new Bitrix24-style CRM deal -> manager assignment -> robot task -> 1C data exchange -> control/analytics.
- Asset rule: uses self-made HTML/SVG/CSS demo UI, not copied screenshots from Bitrix24 help or partner cases. Public Bitrix24/product pages may be used as feature references, but final visuals should be original or based on sanitized demo materials.
- Second iteration: added a switchable micro-scene lab for four scenarios: chat request, website order, CRM robot/task, and support request. Each scenario follows foreground action -> background system update -> business result. Color is still open and will be refined later.
- Third iteration: added the future-homepage storyboard section: first screen as system, live route of request, micro-scenes, and proof/materials. It records what real/sanitized materials must be collected before the final production design.
- Fourth iteration: added a clickable production-studio block with five future real scenes: incoming request, manager assignment, order and 1C, exchange failure, and executive control. Use it as the practical capture list before replacing mock UI with real/sanitized material.
- Fifth iteration: added a live-cut block for the three strongest first animated fragments: request not lost, order through 1C, and exchange failure before complaint. It is the first more visual montage layer above the production capture list.
- Sixth iteration: added the focused `Заявка с сайта проходит весь маршрут` demo inside live-cut. It is a 5-step interactive request path from Chat to CRM, Manager, 1C, and Control, and should be treated as the strongest candidate for the first polished dark process-demo page.
- Seventh iteration: polished that focus scene with a director strip, live widget event tag, and proof metrics so each step explains client action, system automation, and management control.
- Eighth iteration: added the visible request journey map with five route nodes, animated fill, and moving pulse. It is horizontal on desktop/tablet and vertical on mobile.
- Ninth iteration: added a `гибридная архитектура` block to the prototype. It shows the recommended collaboration: light main website for trust/SEO/conversion, dark process pages for immersive business-process demos, and a navigation bridge from service pages to process demos and back to forms/proof. This is now the preferred overall site direction.
- Architecture prototype: `/preview-onixbit-architecture` now turns that decision into a full clickable sitemap with page roles, blocks, CTA paths, navigation groups, style modes, and implementation phases. Durable source: `ONIXBIT_SITE_ARCHITECTURE.md`.



## Reference Shortlist To Review With Aleksander

### Primary B2B/Product References

- Linear — https://linear.app/
  - Study for: premium product-system composition, dense but clean UI fragments, calm motion, serious SaaS tone.
  - Risk: too product-tool-like if copied directly.

- Attio — https://attio.com/
  - Study for: CRM/category relevance, dark/light product polish, database/interface storytelling.
  - Risk: Onixbit must not look like a CRM product instead of an integrator.

- Vercel — https://vercel.com/
  - Study for: developer-grade trust, dark technical atmosphere, restrained motion, navigation clarity.
  - Risk: too developer/platform oriented for business owners.

- Raycast — https://www.raycast.com/
  - Study for: sharp UI details, command-center feeling, compact premium product presentation.
  - Risk: may feel too app-utility-like if overused.

- Retool — https://retool.com/
  - Study for: workflows, internal tools, business process and system-building language.
  - Risk: more practical than cinematic; useful mainly for structure.

### Motion And Visual System References

- Stripe — https://stripe.com/
  - Status: rejected by Aleksander as a visual reference; perceived as chaotic.
  - Use only as a weak structural reference if needed, not as a visual/motion direction.

- Framer — https://www.framer.com/
  - Study for: motion taste, visual transitions, site-builder/product storytelling.
  - Risk: can become too designer-tool-like and less B2B-contractor.

- Spline — https://spline.design/
  - Study for: 3D object presence and interactive scene ideas.
  - Risk: heavy 3D may force loading/performance compromises; use carefully.

- Clay — https://www.clay.com/
  - Study for: revenue-system framing, animated product flows, strong modern SaaS energy.
  - Risk: could become too startup/marketing-heavy.

### Cinematic Enterprise Mood References

- Palantir — https://www.palantir.com/
  - Study for: serious enterprise tone, dark/cinematic authority, systems language.
  - Risk: too severe/defense-like for Onixbit.

- Anduril — https://www.anduril.com/
  - Study for: cinematic first-screen confidence and high-tech atmosphere.
  - Risk: not directly transferable; likely too heavy and too dramatic.


### Aleksander Added References

- Twinbru — https://www.twinbru.com/
  - User note: likes how the ribbon ties together while scrolling and how the user passes through an arch into the house/world.
  - Study for: a physical/visual object that transforms during scroll and pulls the visitor into the experience.
  - Onixbit translation: glowing route/thread carries a request from site to CRM to 1C, with the visitor entering the connected system instead of just reading blocks.

- Species in Pieces — http://www.species-in-pieces.com/
  - User note: music plays; sounds happen on hover or button interaction.
  - Study for: emotional micro-interactions, audio feedback, and memorable interactive craft.
  - Onixbit translation: optional muted-by-default UI sounds only if they feel professional and never annoy; possible subtle click/data-transfer sounds in a demo mode, not on the whole site by default.

- KKL Luzern 3D Experience — https://business.kkl-luzern.ch/en/experience
  - User note: during scroll, animation demonstrates the product. This is the strongest match for Onixbit.
  - Study for: guided scroll tour, product/process demonstration, staged visual explanation.
  - Onixbit translation: several guided scenarios showing real business flows, for example a request comes from the website, passes through 1C/data exchange, and becomes a Bitrix24 CRM deal assigned to a manager.
  - This reference is currently the main proof that scroll animation has a business reason, not just decorative ambition.

## Next Review Process

1. Aleksander sends his own references.
2. Codex opens both lists in a browser and records what to copy, avoid, and simplify.
3. Codex creates a reference matrix: style, motion, navigation, copy clarity, loading risk, Onixbit fit.
4. Only after that, build a small live prototype: first screen, menu, one scroll-driven scene, mobile version.
