# Design System: SEO Auditor Pro

## 1. Visual Theme & Atmosphere
A restrained, high-contrast, "Cockpit Dense" interface built for power users, but balanced with "Art Gallery Airy" aesthetics for the landing and marketing pages. The design supports explicit Light and Dark modes. Variance is set to 7 (Offset Asymmetric) to prevent generic grid layouts, and motion is set to 6 (Fluid CSS) with spring-physics giving the app a tactile, responsive feel without being overwhelming.

## 2. Color Palette & Roles
**Light Theme:**
- **Canvas White** (#F8FAFC) — Primary background surface
- **Pure Surface** (#FFFFFF) — Card and container fill
- **Charcoal Ink** (#0F172A) — Primary text, highest contrast
- **Muted Steel** (#64748B) — Secondary text, metadata
- **Whisper Border** (rgba(226,232,240,0.8)) — Structural lines
- **Electric Indigo** (#4F46E5) — Primary Accent (CTAs, focus rings)

**Dark Theme:**
- **Abyss Black** (#020617) — Primary background surface
- **Slate Depth** (#0F172A) — Card and container fill
- **Frost White** (#F8FAFC) — Primary text, highest contrast
- **Dusk Steel** (#94A3B8) — Secondary text, metadata
- **Phantom Border** (rgba(30,41,59,0.8)) — Structural lines
- **Neon Indigo** (#6366F1) — Primary Accent (CTAs, focus rings)

## 3. Typography Rules
- **Display:** Geist (or Inter alternative) — Track-tight, controlled scale. Headings use weight (Semibold/Bold) and high-contrast color for hierarchy, never massive text.
- **Body:** Geist — Relaxed leading (1.6), max 65ch width.
- **Mono:** JetBrains Mono or Geist Mono — For code, metrics, and high-density dashboard numbers.
- **Banned:** Generic serifs (Times, Georgia) are strictly banned. No Inter for display.

## 4. Component Stylings
* **Buttons:** Flat, no outer glow. Tactile push feedback (spring-physics scale down) on active state. Primary uses the Indigo accent, Secondary uses outline/ghost.
* **Cards:** Generously rounded corners (1rem). Diffused, tinted shadows blending into the background. In high-density dashboard views, replace cards with clean border-top dividers.
* **Inputs:** Label above, error below. Focus ring in Indigo accent. No floating labels.
* **Loaders:** Skeletal shimmer matching exact layout dimensions. No generic circular spinners.
* **Empty States:** Composed compositions with muted, high-quality illustrations or typography, showing the user exactly what to do.

## 5. Layout Principles
Grid-first responsive architecture. The Landing Page and Features Page MUST use Asymmetric splits (e.g., text offset from images). Strictly single-column collapse on mobile (< 768px). Contain layouts using max-width constraints (e.g., 1400px centered). Generous internal padding (clamp). No overlapping elements — clean spatial separation. No "3 equal cards horizontally" rows.

## 6. Motion & Interaction
Spring physics for all interactive elements (stiffness: 100, damping: 20). Staggered cascade reveals for list items and dashboard metrics. Perpetual micro-loops (slow pulse/shimmer) on the "Auditing in progress" state. Hardware-accelerated transforms only (opacity, translate).

## 7. Anti-Patterns (Banned)
- No emojis anywhere.
- No pure black (#000000) or pure white text on dark mode.
- No neon/outer glow shadows.
- No 3-column equal grids.
- No centered Hero sections.
- No filler UI text like "Scroll to explore".
- No AI copywriting clichés ("Elevate", "Next-Gen").
