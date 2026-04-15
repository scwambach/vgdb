# Agent Rules

<!-- BEGIN:nextjs-agent-rules -->

## ⚠️ Next.js — Read Before Writing Any Code

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. **Before writing any Next.js code**, read the relevant guide in `node_modules/next/dist/docs/`. Heed all deprecation notices. Do not rely on what you know from training.

<!-- END:nextjs-agent-rules -->

---

## React Component Structure

When creating React components, follow these rules strictly.

---

### File Structure

Every component lives in its own folder named after the component. The markup file is always `index.tsx`, the logic file is always `Logic.ts`, and the test file is always `index.test.tsx`. Only create a CSS file if genuinely needed.

    ComponentName/
      index.tsx               ← always required
      Logic.ts                ← always required
      index.test.tsx          ← always required
      ComponentName.css       ← only if custom styles are needed (see below)

---

### File Rules

#### `index.tsx` — Always Required

- Write this file first, always.
- Contains only JSX markup and the component definition.
- All logic, state, derived values, and event handlers live in `Logic.ts` — not here.
- Import everything behavioural from `Logic.ts`.
- Import from `ComponentName.css` only if that file is needed.

#### `Logic.ts` — Always Required

- Write this file second, always.
- Contains all component logic: state, event handlers, derived values, data transformations, custom hooks, and any calculations.
- Nothing behavioural should live in `index.tsx` — if it's logic, it goes here.

#### `index.test.tsx` — Always Required

- Write this file third, always.
- Use React Testing Library. Never use Enzyme.
- Always include at minimum: a smoke test (renders without crashing), a snapshot test, one test per meaningful user interaction or conditional render, and direct tests of any functions exported from `Logic.ts`.
- Do not create a separate `Logic.test.ts` — test logic here.
- Tests must not depend on implementation details (class names, internal state). Test behaviour and output only.
- Any time the component's logic or markup changes, update `index.test.tsx` in the same edit. Never leave tests that no longer reflect actual behaviour.
- After writing or updating any test file, run the tests and confirm they pass before finishing.
- After modifying any file, run the linter on that file and fix all errors before finishing.

#### `ComponentName.css` — Only When Necessary

- Write this file last, only if custom styles are genuinely needed.
- Before writing this file, check whether the required styles already exist in `globals.css`. If they do, use those classes in `index.tsx` and skip this file entirely.
- Only include styles specific to this component not already covered by `globals.css`. Never duplicate styles from `globals.css`.

---

### File Creation Order

Always follow this order:

1. `index.tsx`
2. `Logic.ts`
3. `index.test.tsx`
4. `ComponentName.css` (if needed)

---

### Examples

Component with custom styles:

    UserDashboard/
      index.tsx
      Logic.ts
      index.test.tsx
      UserDashboard.css

Simple component — no custom styles:

    Badge/
      index.tsx
      Logic.ts
      index.test.tsx

---

## CSS Variables

Always use CSS custom properties (variables) from `globals.css` for any value that is part of the design system. Never hardcode colours, font sizes, spacing, radii, shadows, transitions, or z-indices — look for the appropriate variable first.

If a value is needed that does not have a variable yet:

- **Add a new variable to `globals.css`** if the value is reusable — meaning it is likely to appear in more than one place, or it represents a consistent design decision (e.g. a brand colour, a spacing scale step, a border radius).
- **Write it as a literal value** if it is genuinely one-off and too specific to ever reuse (e.g. a magic number for a single layout hack, a pixel offset for a specific animation).

When in doubt, make it a variable. It is much easier to remove an unused variable later than to hunt down hardcoded values scattered across files.

### What should always be a variable

- Colours (brand, background, text, border, state colours like error/success)
- Typography (font families, font sizes, font weights, line heights)
- Spacing (padding, margin, gap — stick to a consistent scale)
- Border radii
- Box shadows
- Transitions and durations
- Z-index layers

### What should stay as a literal value

- A one-off pixel nudge that only applies to a single element in a single component
- A percentage or calc() specific to one layout that would never generalise
- Values tied to a third-party component's internal requirements

### Adding new variables

- Add them to the `:root` block in `globals.css`, not inline or in a component CSS file.
- Name them descriptively and consistently with the existing naming pattern (e.g. if existing variables use `--color-*`, follow that pattern — do not introduce `--clr-*`).
- Never add a variable for something so specific it encodes the component name (e.g. `--hero-banner-title-color` is too specific — `--color-heading-primary` is reusable).

---

## SEO & Meta Tags

- Every page must export a `generateMetadata` function. Never leave a page without a title and description.
- Titles must be descriptive and unique per page. Never use the site name alone as a page title (e.g. `"Acme"` is wrong — `"Pricing | Acme"` is correct).
- The `description` must be a plain sentence between 120–160 characters. Never leave it empty, never copy the title into it.
- Always include `openGraph` and `twitter` metadata on marketing pages. At minimum: `title`, `description`, `images`, and `url`.
- OG images must have explicit `width` and `height`. The standard size is 1200×630.
- Use the canonical `alternates.canonical` field on every page to prevent duplicate content issues.
- Never put SEO-critical text (headings, body copy) inside a component that renders client-side only — it will not be indexed.
- Use only one `<h1>` per page. It must contain the primary keyword for that page, not a generic phrase like "Welcome" or "Home".
- Structured data (`JSON-LD`) should be added to landing pages via a `<script type="application/ld+json">` tag in the page component. Use `WebPage`, `Organization`, or `Product` schema types as appropriate.

---

## Accessibility (a11y)

Accessibility is not optional and is not a final check — it is a requirement at the point of building every component. Apply the following rules while writing `index.tsx`, not after.

- Every `<img>` and `next/image` must have an `alt` attribute. Decorative images use `alt=""`. Never omit it.
- Every interactive element (`<button>`, `<a>`, custom controls) must have a visible or screen-reader-accessible label. Never use an icon-only button without an `aria-label`.
- Never use a `<div>` or `<span>` with an `onClick` handler where a `<button>` or `<a>` is the correct element.
- Use semantic HTML: `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`. Do not wrap everything in `<div>`.
- Every `<form>` input must have an associated `<label>`. Never rely on `placeholder` text as a label.
- Colour contrast must meet WCAG AA minimum: 4.5:1 for body text, 3:1 for large text and UI components.
- Focus styles must be visible. Never write `outline: none` or `outline: 0` without providing an equivalent custom focus indicator.
- Modals and drawers must trap focus while open and restore focus to the trigger element when closed.
- Use `aria-live` regions for dynamic content (errors, success messages, loading states) so screen readers announce updates.
- Use `aria-describedby` to associate error messages with their input.
- Before marking any component task complete, run through this checklist:
  - [ ] All images have `alt`
  - [ ] All interactive elements have accessible labels
  - [ ] Semantic HTML used throughout
  - [ ] No `onClick` on non-interactive elements
  - [ ] Focus styles intact
  - [ ] Contrast checked
  - [ ] Dynamic content uses `aria-live`

---

## Performance & Core Web Vitals

- Never import a library client-side if it is only needed for data fetching or transformation — keep it server-side.
- Use `next/image` for all images. Never use a plain `<img>` tag for content images. Always set `priority` on the largest above-the-fold image (the LCP element).
- Never use `useEffect` to fetch data that could be fetched in a Server Component.
- Avoid large client-side JavaScript bundles on marketing pages. If a component does not need interactivity, make it a Server Component.
- Use `next/font` for all fonts. Never load fonts via a `<link>` tag in the layout or via a third-party URL — this causes layout shift and an extra render-blocking request.
- Avoid layout shift (CLS): always provide explicit `width` and `height` (or `aspect-ratio`) on images, video embeds, and any element whose size is determined by async content.
- Lazy-load heavy below-the-fold components with `next/dynamic` and `{ ssr: false }` only when the component genuinely cannot be server-rendered.
- Never use `export const dynamic = 'force-dynamic'` on a page unless it truly requires per-request rendering. Prefer static generation with revalidation.

---

## Forms & Validation

- Use `react-hook-form` for all forms. Never manage form state with individual `useState` calls per field.
- Always validate on both client and server. Client validation is for UX; server validation is for security. Never rely on client-side validation alone.
- Use `zod` for schema validation and share the same schema between client and server. Never write separate validation logic in two places.
- Always handle and display server errors returned from form actions. Never silently swallow errors or show a generic "Something went wrong" without logging the actual error.
- Disable the submit button while a form is submitting. Never allow double-submission.
- Show inline field-level errors directly beneath each input, not in a single block at the top of the form.
- Never clear a form on a validation error — preserve the user's input.
- Use `aria-describedby` to associate error messages with their input so screen readers announce them.
- For Server Actions, always use `useFormState` (or `useActionState` in React 19+) to handle responses. Never use raw `fetch` calls to submit form data when a Server Action is appropriate.
