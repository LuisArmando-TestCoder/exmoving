# ΣXECUTIONS Design & Architecture Rulebook

This guide outlines the mandatory standards for adding or refactoring pages within the ΣXECUTIONS platform. Follow these rules to maintain the "Ultra-Modern Business" aesthetic and technical excellence established in Feb 2026.

---

## 1. Visual & Aesthetic Principles

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

## 2. Technical Context (The "Brain" & Data Layer)

### The Intelligence Unit (Core Logic)
Platform logic is abstracted into two main units: `ChatBrain` and `IntelligenceUnit`.
*   **Junior Note**: Do not try to rewrite messaging logic in the page. The `Chatbot` component handles the UI, while the store (`useChatbotStore`) handles the state.
*   **Senior Note**: Every `EmailActionButton` interaction initializes a "Context Session." When a user requests an audit, their browser metadata, path history, and email are injected into the chatbot's system prompt to provide a personalized, high-context consultation.

### State Management
*   We use **Zustand** for state. The primary store is `src/store/useChatbotStore.ts`.
*   It tracks interaction history, behavioral summaries (Observer Logic), and modal states.

---

## 3. Infrastructure & Structural Nature

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

## 3. Business Owner Focus (Content Guidelines)

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

## 4. Animation & Interactivity

### Scroll Reactions
*   **YES PLEASE**: Implement a `useScroll` based progress indicator at the top of long-form pages.
*   **YES PLEASE**: Use `framer-motion` for scroll-reactive state changes (e.g., spring-loaded bars, directional reveals).
*   **YES PLEASE**: Stagger entry animations based on the element's index in a grid.

### Hover States
*   **YES PLEASE**: All cards should have a `whileHover={{ y: -5 }}` or equivalent SCSS transition.
*   **YES PLEASE**: Icons inside cards should scale or shift opacity on hover to indicate interactivity.

---

## 6. Deployment Workflow: Adding a New Service Page

1.  **Define Location**: Create the directory structure in `src/app/services/consultations/[category]/[service]`.
2.  **Register in Navigation**: Add the new entry to `navigationData` in `src/constants/navigation.ts`.
    ```typescript
    { name: "My New Service", path: "/services/consultations/category/service", children: [...] }
    ```
3.  **Scaffold Component**: Create `page.tsx` using `ProceduralTemplate`.
4.  **Scaffold Styles**: Create `[Name].module.scss` next to your page.
5.  **Inject Metrics**: Populate the page with ROI and Technical Audit data.

---

## 7. Development Hygiene & Reactivity

### Clean Component Philosophy
*   **"Thin" Components**: The `page.tsx` should primarily be a **declarative configuration** of data and layout. Complex logic belongs in hooks or the Store.
*   **Icon Standard**: Use `lucide-react`. Standardize icon sizes (e.g., `32` for features, `20` for metrics).

### Scroll-Progress & Reactivity
*   **Progress Indicators**: Long-form service pages should include a top-fixed progress bar tied to `scrollYProgress` from `framer-motion`.
*   **Spring Motion**: Use spring-loaded physics (`stiffness: 100, damping: 30`) for progress bars to give them a premium, organic feel.
*   **Ref Target**: Always use a `useRef` on the main container as the `target` for `useScroll` to ensure accurate tracking within the `ProceduralTemplate` layout.

### Error Handling & JSX
*   **JSX Escaping**: When using mathematical operators like `<` or `>` in text (e.g., `<2s`), always use curly braces and strings `{"<2s"}` or HTML entities `<` to prevent JSX parsing errors.

---

## 8. Operational "Non-Gos" (Common Pitfalls)

*   **Avoid Inline Framer Motion**: Do not clutter the `page.tsx` with complex `animate` props. Prefer using the `Reveal` component or SCSS `@keyframes` for performance.
*   **The "Context" Rule**: Never add a CTA that doesn't capture email. We are a lead-generation machine; every click must lead to a data entry point or an interaction with the Unit.
*   **Hardcoded Numbers**: Never use hardcoded ROI percentages in the middle of a text block. Use stats grids to make them scannable.
*   **No Tailwind**: Using Tailwind classes in new service pages is a non-go. It breaks the brutalist-modern SCSS customization established for the consultancies.

---

## 10. Core Concept Definitions

*   **Intelligence Unit**: The abstraction layer representing the AI agent's "mind."
*   **Observer Logic**: The real-time behavioral analysis engine that summarizes user intent.
*   **Procedural Interactor**: A page designed as a functional interface rather than just a reading surface.
*   **Context Session**: The stateful interaction started by an email submission, preserved via the Chatbot Store.

---

## 11. Success Criteria for New Pages
1.  Correctly registered in the `navigation.ts` tree.
2.  Zero Tailwind classes in the `.tsx` file.
2.  No hardcoded white hex/rgba colors.
3.  Includes a clear "Economics" or "ROI" section.
4.  Primary CTA is an `EmailActionButton`.
5.  Fully responsive via `clamp()` and flex/grid (verified on mobile/desktop).
6.  SCSS uses `@use` and project variables.
