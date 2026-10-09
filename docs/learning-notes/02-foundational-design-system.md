# Plantify — Personal Learning Notes
## Module 02: Foundational Design System & Accessible Interactions

### 1. Architectural Concepts Explained

#### A. CSS Custom Properties (Variables)
* **What they are:** Variables declared with `--name: value;` and retrieved with `var(--name)`.
* **Why use them in `:root`:** The `:root` pseudo-class matches the top-level element (`<html>`). Declaring design tokens here creates a single source of truth for the entire application. If a color or spacing rule changes, updating one property in `variables.css` propagates throughout all components instantly.
* **Why avoid hardcoded values:** Hardcoded hex values across disparate files cause style drift, make theme switching difficult, and complicate accessibility audits.

#### B. Component Props & Composition in React
* **What props are:** Arguments passed into React component functions (e.g. `<Button variant="accent" size="lg">`).
* **Default Props:** By assigning defaults directly in function parameters (`function Button({ variant = 'primary', ...props })`), components stay resilient even if optional props are omitted.
* **Rest Props (`...props`):** Passing `{...props}` to the underlying `<button>` element ensures native HTML attributes (like `onClick`, `type="submit"`, `aria-label`, `disabled`) work transparently without re-declaring them individually.

#### C. CSS Import Order in Vite
* In `src/main.jsx`, we imported the stylesheets in this specific sequence:
  1. `variables.css` (defines tokens first)
  2. `globals.css` (applies tokens to HTML elements, resets, and defines reusable utility classes)
  3. `responsive.css` (applies media queries that override or adapt styles based on viewport width)

#### D. Transitions vs. Transforms
* **Transforms (`transform: translateY(-4px)`, `rotateX(...)`):** Handled directly by the browser's GPU compositor without triggering document re-layout or re-painting. This makes micro-interactions buttery-smooth (60fps/120fps).
* **Transitions (`transition: transform 250ms cubic-bezier(...)`):** Tells the browser how to smoothly interpolate between the default state and the pseudo-class state (`:hover`, `:active`, `:focus-visible`).

#### E. Reduced-Motion Accessibility (`prefers-reduced-motion`)
* **Why it matters:** Users with vestibular motion disorders or sensory sensitivities configure their operating systems to minimize animation.
* **How we handle it:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
  In JavaScript, we also test `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before executing any interactive 3D card tilt calculations.

#### F. Accessible Rating & Non-Color Reliance
* **WCAG Requirement:** Information must not be conveyed by color alone.
* **Our Implementation:** The `<Rating />` component combines:
  1. An accessible ARIA label (`aria-label="Rated 4.8 out of 5 stars across 142 customer reviews"`).
  2. Visual star glyphs (pure SVG, supporting half-stars).
  3. Clear numerical text display (`4.8 / 5`) alongside the stars.

---

### 2. Files Implemented & Modified

| File | Type | Key Responsibility |
| :--- | :--- | :--- |
| `src/styles/variables.css` | Stylesheet | Central design tokens: 8-color botanical palette, type scale, spacing, radii, shadows, easing curves |
| `src/styles/globals.css` | Stylesheet | Modern CSS reset, typography defaults, button/badge/rating classes, `:focus-visible` styles, card lift, pure CSS spinner |
| `src/styles/responsive.css` | Stylesheet | Responsive containers, multi-column grid utilities, and breakpoints (1024px, 768px, 480px) |
| `src/components/Button.jsx` | Component | Reusable accessible button with variants (`primary`, `secondary`, `accent`, `outline`), loading spinner, and active/focus states |
| `src/components/Badge.jsx` | Component | Reusable chips/tags with high-contrast variants (`forest`, `sage`, `amber`, `outline`) |
| `src/components/Rating.jsx` | Component | Screen-reader accessible rating widget rendering SVG stars and visible numeric values |
| `src/main.jsx` | Entry point | Imported the three CSS files in cascade order |
| `src/App.jsx` | Showcase | Interactive showcase demonstrating palette, components, card lift, restrained 3D tilt, and loading states |

---

### 3. Verification & Build Results

#### Production Build (`npm run build`)
* **Command:** `npm run build`
* **Result:**
  ```text
  vite v8.3.4 building client environment for production...
  transforming...
  ✓ 21 modules transformed.
  rendering chunks...
  computing gzip size...
  dist/index.html                   0.81 kB │ gzip:  0.47 kB
  dist/assets/index-DME7Rm6I.css    6.94 kB │ gzip:  2.12 kB
  dist/assets/index-DYSvCorP.js   230.93 kB │ gzip: 71.91 kB
  ✓ built in 595ms
  ```
* **Exit Code:** `0` (Success, 0 errors, 0 warnings).

#### Development Server
* **URL:** `http://localhost:5174/`
* **HTTP Status Code:** `200 OK`
