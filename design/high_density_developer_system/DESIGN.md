---
name: High-Density Developer System
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fd'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1ec'
  on-surface: '#1a1b22'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f1effa'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#a43a3a'
  on-tertiary: '#ffffff'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1ec'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin: 24px
  max-width: 1280px
---

## Brand & Style

This design system is engineered for developers and API architects who value speed, precision, and information density. It balances the austere minimalism of modern AI labs with the functional utility of specialized middleware platforms.

The style is **Modern Corporate Minimalism** with **Glassmorphism** accents. It prioritizes clarity through a monochromatic base, using vibrant emerald highlights strictly for functional indicators and primary actions. The visual language conveys reliability and high performance through sharp geometry, subtle grid-based alignment, and high-contrast text hierarchies. 

Emotional keywords: *Precise, Performant, Technical, Institutional, Focused.*

## Colors

The palette is anchored by a high-contrast monochrome foundation to ensure maximum readability for code and data.

- **Primary Action:** Emerald Green (#10B981) is used exclusively for "Success" states, active toggles, and primary CTA buttons.
- **Surface Strategy:** We use a multi-layered white/gray scale to create depth without relying on heavy shadows. 
    - `Surface-Bright` for highlighted sections or cards.
    - `Surface-Dim` for page backgrounds or recessed sidebar areas.
- **Borders:** Use `#E4E4E7` for structural containment. Borders should be 1px wide to maintain a "hairline" technical aesthetic.

## Typography

The system utilizes **Geist** for its sans-serif needs, providing a balanced, technical feel that remains legible at high densities. 

- **Density:** Favor `body-sm` (13px) for data tables, sidebars, and secondary metadata to maximize information on screen.
- **Code:** Use **JetBrains Mono** for all code blocks, API endpoints, and terminal outputs. Syntax highlighting should be vibrant against a `Deep Black` (#0E0E0E) background to provide high-contrast focus areas.
- **Hierarchy:** Use font weight rather than large size jumps to distinguish hierarchy in dense interfaces.

## Layout & Spacing

This design system uses a **12-column fixed grid** for marketing and landing pages, but shifts to a **fluid layout with pinned sidebars** for dashboard and editor views.

- **Rhythm:** An 8px linear scale (with a 4px half-step for micro-adjustments) ensures consistent alignment. 
- **Density:** For developer-facing interfaces, use compact padding (`sm` or `md`) to minimize scrolling. 
- **Grid Backgrounds:** Use a subtle 24px grid pattern in the background of hero sections or empty states to reinforce the "technical canvas" metaphor. 
- **Breakpoints:**
    - Desktop: 1280px+ (Full 12 columns)
    - Tablet: 768px - 1279px (8 columns, margins reduce to 16px)
    - Mobile: Below 768px (4 columns, margins 12px, vertical stacking).

## Elevation & Depth

Depth is primarily established through **tonal layering** and **glassmorphism** rather than traditional drop shadows.

1.  **Surfaces:** Navigation bars and secondary menus use a glassmorphism effect—`background: rgba(255, 255, 255, 0.7)` with a `backdrop-filter: blur(12px)`.
2.  **Shadows:** When used, shadows must be "Airy." Use a multi-stop shadow approach: `0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)`.
3.  **Active States:** An "alive" feel is achieved by applying a subtle `1px` inner-border glow to active cards or focused input fields using the primary emerald color at 20% opacity.

## Shapes

The shape language is controlled and systematic. A standard **8px (radius-md)** corner radius is applied to buttons, cards, and input fields to soften the high-contrast aesthetic.

- **Micro-components:** Use `radius-sm` (4px) for checkboxes, tags, and tooltips.
- **Structural Containers:** Use `radius-lg` (12px) for large section containers or modals to distinguish them from standard components.

## Components

- **Buttons:**
    - *Primary:* Solid #10B981 with white text. High-contrast hover (slight darken).
    - *Secondary:* White background with #E4E4E7 border and #0E0E0E text.
    - *Ghost:* No background or border, text-only until hover (Surface-Dim background).
- **Terminal Blocks:** Must use #0E0E0E background with 8px rounded corners. Include a "Copy" button in the top-right corner that appears on hover.
- **Status Indicators:** Use a "pulsing" dot animation for active/live connections. The dot should be 8px in diameter with a 4px soft glow in the primary emerald color.
- **Input Fields:** 1px solid border (#E4E4E7). On focus, the border transitions to #10B981 with a subtle 2px emerald outer glow.
- **Cards:** Use `Surface-Bright` for the card background with a `1px` border. Hovering on a card should result in a slight Y-axis lift (-2px) and a transition of the border color to a slightly darker neutral.
- **Navigation:** Top navigation should be sticky with a glassmorphism blur effect to allow content to peek through while scrolling.