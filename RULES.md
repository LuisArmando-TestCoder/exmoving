# ΣXECUTIONS Design & Architecture Rulebook

MY OBJECTIVE:

EXPAND AND ENHANCE (FOR LOVE OF PHENOMENOLOGY) 

MY PROCESS:

BEST SOFTWARE ARCHITECTS MAKE THE STRONGEST PRODUCTS (BUT TAKE THE MOST TIME) BY BEING PARANOID: VULNERABILITY(+ZERODAYS)/SECURITY/SCALABILITY/EFFICIENCY/MAINTAINABILITY/AVAILABILITY/PERFORMANCE/PORTABILITY/FLEXIBILITY/USABILITY/TRUSTABILITY/REUSABILITY/INTEROPERABILITY/SUSTAINABILITY WISE; WHILST STILL KNOWING THAT THERE ARE MOMENTS TO ENFORCE EACH, AND YOU START BY VALIDATING TARGET AUDIENCES, AND ASKING WHY 5 TIMES CONSECUTIVELY TO OBJECTIVES, TARGETS, CHOICES, KNOWING THAT MOST REVOLVES AROUND CASH FLOW, PAIN EASING, AMOUSMENT, BRAND AND SUSTAINABILITY, AND HOW TO BALANCE ALL PARAMETERS AT ONCE, OR DIFERENTLY AT DIFERENTLY, OR THROUGH PIVOTS.

ASKING WHY CONSECUTIVELY, UNDER WHAT IF KNOWN CONSTRAINTS WEREN'T EXISTENT AND THEN FINDING OUT IF THEM CONSTRAINTS MADE ANY SENSE FROM TH BEGINNING.

ALWAYS ASK YOURSELF WHAT AM I TRYING TO ACHIEVE AND WHY. IS THERE A BETTER WAY?

ULTRA MODERN, ULTRA RESPONSIVE (specially for mobile overflow scenarios), ULTRA ACCESIBLE, ULTRA SCROLL REACTIVE (normal lucide lenis and framer motion only when in view stuff), ULTRA PERFORMANT, MODULAR, NO TAILWIND, ONLY SCSS MODULES, ALL ELEMENTS HAVE CLASSES, ALL CLASSES HAVE COHESIVE STYLES, ALL ELEMENTS HAVE UNIQUE ID BASED ON THEIR COMPONENT PATH AND THEIR INDIVIDUAL NAME. SRR Friendly. Recursively explorer  pertinent imports in referenced files. Check home page components for patterns style(visual or functionally)guide wise. 

DISPOSE OF EACH RULE AS IT COMES MOST CONVENIENT, NOT EVERYTHING AT ONCE IS NECCESARY, REGARDLESS OF EVERYTHING COMING AT YOU, THINK WHY TO FOCUS ON WHAT, CHOOSE, ASK YOURSELF HOW (WHAT DRIVES THE MOST ROI IN THE CURRENT STAGE OF THE GREATER SCHEME).

This guide outlines the mandatory standards for adding or refactoring pages within the ΣXECUTIONS platform. Follow these rules to maintain the "Ultra-Modern Business" aesthetic and technical excellence established in Feb 2026.

---

Rules of Usability

1: Visibility of System Status
2: Match Between the System and the Real World
3: User Control and Freedom
4: Consistency and Standards
5: Error Prevention
6: Recognition Rather than Recall
7: Flexibility and Efficiency of Use
8: Aesthetic and Minimalist Design
9: Documentation for Dummies
---

## Visual & Aesthetic Principles

### Typography & Colors (The "No-White" Rule)
*   **DO NOT** use `white`, `#fff`, or hardcoded `rgba(255,255,255,...)`.
*   **YES PLEASE**: Use `var(--text)` for primary text and high-contrast values.
*   **YES PLEASE**: Use `var(--text-dim)` for subtitles, labels, and secondary details.
*   **YES PLEASE**: Use Brutalist typography (Black/Extra-Bold weights) with `tracking-tighter` and `leading-none` for main headlines.

### Layout & Glassmorphism
*   **YES PLEASE**: Use `backdrop-filter: blur(10px)` with high-transparency backgrounds for cards.
*   **YES PLEASE**: Use subtle borders (`1px solid rgba(255,255,255,0.05)`) to define containers.
*   **YES PLEASE**: Add background glows and radial gradients to section corners for depth.
*   **DO NOT** use sharp, opaque backgrounds for main content cards.

---

## Technical Context (The "Brain" & Data Layer)

### The Intelligence Unit (Core Logic)
Platform logic is abstracted into two main units: `ChatBrain` and `IntelligenceUnit`.
*   **Junior Note**: Do not try to rewrite messaging logic in the page. The `Chatbot` component handles the UI, while the store (`useChatbotStore`) handles the state.
*   **Senior Note**: Every `EmailActionButton` interaction initializes a "Context Session." When a user requests an audit, their browser metadata, path history, and email are injected into the chatbot's system prompt to provide a personalized, high-context consultation.

### State Management
*   We use **Zustand** for state. The primary store is `src/store/useChatbotStore.ts`.
*   It tracks interaction history, behavioral summaries (Observer Logic), and modal states.

---

## Infrastructure & Structural Nature

### Service Tree Architecture
The platform is built as a recursive, tree-based service discovery engine. Every page is a node in a hierarchy defined in `src/constants/navigation.ts`.

*   **Tree Routing**: Services are organized under `src/app/services/consultations/...`. Use nested folders to represent the hierarchy (e.g., `automation/chatbot`).
*   **Navigation Registry**: When adding a new service, you **MUST** register it in `src/constants/navigation.ts`. The `ProceduralTemplate` automatically reads this tree to generate breadcrumbs and children explorers.
*   **Nature of Pages**: Pages are not just static layouts; they are "Procedural Interactors." They should feel like an interface to a high-level Intelligence Unit.

### Component Architecture: ProceduralTemplate
The `ProceduralTemplate` is the mandatory root wrapper for all service pages. It is a "Context-Aware" shell that derives its UI from the URL path.

*   **Capabilities**:
    *   **Auto-Header**: Dynamically generates the page title based on the `navigationData` entry matching the current pathname.
    *   **Recursive Discovery**: If a node in `navigation.ts` has `children`, the template automatically renders an **Interactive Explorer** grid at the bottom, allowing users to dive deeper into the service tree.
    *   **Global Props**: It automatically handles Breadcrumbs and the "Value Proposition" section.
*   **Implementation Rules**:
    *   **YES PLEASE**: Adapt your unique page content within the `children` of `ProceduralTemplate`.
    *   **DO NOT** pass titles or metadata manually; ensure the `navigation.ts` is correct, and the template will pull the data.
    *   **DO NOT** change the `ProceduralTemplate` internals to fix page-specific layout issues; use SCSS Modules in your page component instead.
    *   **Constraint**: The template expects to be used within the `src/app/services/consultations/...` path to find its navigation context. If used elsewhere, it will default to a "Not Found" state.
*   **YES PLEASE**: Wrap major content blocks in the `Reveal` component for staggered, direction-aware entry animations.

### Style Implementation: SCSS Standard
We use a **Post-Tailwind SCSS Module** strategy. Pages must be styled with isolated modules to ensure no-leak layouts and high-performance CSS.

*   **Global Variables**: Always anchor your styles to `src/styles/variables.scss`. 
    *   **Colors**: Use `var(--text)`, `var(--text-dim)`, `var(--bg)`, `var(--border)`.
    *   **Gradients**: Leverage `var(--accent-gradient)` for brand highlights.
*   **Mixins**: Use `src/styles/mixins.scss` for:
    *   `@include font-heading`: For brutalist headlines.
    *   `@include font-body`: For clean reading surfaces.
    *   `@include abs-fill`: For decorative background layers.
*   **Isolation**: Use `PageName.module.scss` next to the `page.tsx`.
*   **Modern Sass**:
    *   **Rule**: **NEVER** use `@import`. Always use `@use`.
    *   **Reasoning**: `@use` is the modern standard (as of 2024/2025) that prevents duplication and handles namespacing correctly.
*   **Project Variables**:
    *   **YES PLEASE**: Access project variables via `@use "@/styles/variables.scss" as *`.
    *   **YES PLEASE**: Access mixins via `@use "@/styles/mixins.scss" as *`.
*   **Responsiveness**: 
    *   Prefer **CSS Grid** for main structures.
    *   Use `clamp(min, preferred, max)` for fluid typography and spacing that scales without media-query bloat.
*   **Performance**: Use `backdrop-filter` sparingly; ensure it's coupled with a high-transparency `rgba` background to prevent layout shifts.

---

## Business Owner Focus (Content Guidelines)

### Value-First Elements
Every page must focus on **Economics** and **ROI**, not just features.
*   **YES PLEASE**: Include an **ROI Stats Grid** (e.g., "OpEx Savings: 65%", "Lead Velocity: Instant").
*   **YES PLEASE**: Include a **Technical Audit/Report Section** showing raw metrics (tokens, latency, transaction costs).
*   **YES PLEASE**: Use industry terms that speak to scale (e.g., "Computational Overhead", "Intelligence Economics").

### Interactive CTAs & Reusable UI
*   **EmailActionButton**: The primary lead-capture component.
    *   **Nature**: It's a "Context-Aware" button that expands into an email field and then triggers the Chatbot.
    *   **Standard usage**: Use it for "Audits", "Consultations", or "Deep Dives".
    *   **Styling**: You can pass a `className` and target the `demoContainer` class within your SCSS module to customize its appearance (e.g., matching a high-impact background).
*   **Reveal**: The standard animation wrapper. 
    *   Use it to wrap any component that should animate in on scroll.
    *   Supports `direction` (up, down, left, right) and `delay`.
*   **SplitText**: Use for high-impact titles where letters should animate individually.
*   **NON-GO**: Standard `<button>` or `<a>` tags for primary conversion points.

---

## Animation & Interactivity

### Scroll Reactions
*   **YES PLEASE**: Implement a `useScroll` based progress indicator at the top of long-form pages.
*   **YES PLEASE**: Use `framer-motion` for scroll-reactive state changes (e.g., spring-loaded bars, directional reveals).
*   **YES PLEASE**: Stagger entry animations based on the element's index in a grid.

### Hover States
*   **YES PLEASE**: All cards should have a `whileHover={{ y: -5 }}` or equivalent SCSS transition.
*   **YES PLEASE**: Icons inside cards should scale or shift opacity on hover to indicate interactivity.

---

## Deployment Workflow: Adding a New Service Page

**NEW AUTOMATED WORKFLOW (FOR DUMMIES & CODING MONKEYS):**
We now have a dedicated Deno CLI script that recursively scaffolds the entire routing tree, generates the `page.tsx` with a highly robust, prop-driven `AutomationServicePage` component, creates the SCSS modules, and perfectly registers the entire hierarchy into `navigation.ts`.

**How to use:**
Simply run the npm script with your desired page name and the full path where it should live:
```bash
npm run add-page -- --name="Agentic Newsletter Writer" --path="/services/consultations/automation/newsletter-seo-blogger"
```
*   **What it does**:
    1.  Recursively checks the path (e.g., `/services/consultations/automation/...`).
    2.  If any parent directory does not exist, it creates a `SimplePage` for it and adds it to `navigation.ts` with empty `children`.
    3.  At the target leaf path, it scaffolds a `page.tsx` using the `AutomationServicePage` component (a highly flexible, config-driven procedural template) and an accompanying `.module.scss` file.
    4.  Updates `src/constants/navigation.ts` intelligently, injecting the new nodes precisely where they belong in the deeply nested object.

**Manual Legacy Workflow (If needed):**
1.  **Define Location**: Create the directory structure in `src/app/services/consultations/[category]/[service]`.
2.  **Register in Navigation**: Add the new entry to `navigationData` in `src/constants/navigation.ts`.
3.  **Scaffold Component**: Create `page.tsx` using `ProceduralTemplate` or `AutomationServicePage`.
4.  **Scaffold Styles**: Create `[Name].module.scss` next to your page.
5.  **Inject Metrics**: Populate the page with ROI and Technical Audit data.

---

## Development Hygiene & Reactivity

### Clean Component Philosophy
*   **"Thin" Components**: The `page.tsx` should primarily be a **declarative configuration** of data and layout. Complex logic belongs in hooks or the Store.
*   **Icon Standard**: Use `lucide-react`. Standardize icon sizes (e.g., `32` for features, `20` for metrics).

### Scroll-Progress & Reactivity
*   **Progress Indicators**: Long-form service pages should include a top-fixed progress bar tied to `scrollYProgress` from `framer-motion`.
*   **Spring Motion**: Use spring-loaded physics (`stiffness: 100, damping: 30`) for progress bars to give them a premium, organic feel.
*   **Ref Target**: Always use a `useRef` on the main container as the `target` for `useScroll` to ensure accurate tracking within the `ProceduralTemplate` layout.

### Error Handling & JSX
*   **JSX Escaping**: When using mathematical operators like `<` or `>` in text (e.g., `<2s`), always use curly braces and strings `{"<2s"}` or HTML entities `<` to prevent JSX parsing errors.

## Core Concept Definitions

*   **Intelligence Unit**: The abstraction layer representing the AI agent's "mind."
*   **Observer Logic**: The real-time behavioral analysis engine that summarizes user intent.
*   **Procedural Interactor**: A page designed as a functional interface rather than just a reading surface.
*   **Context Session**: The stateful interaction started by an email submission, preserved via the Chatbot Store.

---

## Success Criteria for New Pages
1.  Correctly registered in the `navigation.ts` tree.
2.  Zero Tailwind classes in the `.tsx` file.
2.  No hardcoded white hex/rgba colors.
3.  Includes a clear "Economics" or "ROI" section.
4.  Primary CTA is an `EmailActionButton`.
5.  Fully responsive via `clamp()` and flex/grid (verified on mobile/desktop).
6.  SCSS uses `@use` and project variables.
