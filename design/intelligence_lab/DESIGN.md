---
name: Intelligence Lab
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c9c6c5'
  secondary: '#24619d'
  on-secondary: '#ffffff'
  secondary-container: '#87bcfe'
  on-secondary-container: '#004b84'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#291800'
  on-tertiary-container: '#b37800'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#d2e4ff'
  secondary-fixed-dim: '#a1c9ff'
  on-secondary-fixed: '#001c37'
  on-secondary-fixed-variant: '#004880'
  tertiary-fixed: '#ffddb2'
  tertiary-fixed-dim: '#ffb94c'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#624000'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  code-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system is engineered to evoke a "lab" aesthetic—one defined by intellectual rigor, high-efficiency throughput, and technical precision. It draws inspiration from the visual language of advanced research environments, where clarity of thought is mirrored by the clarity of the interface.

The brand personality is authoritative yet invisible, acting as a high-performance conduit for information. The visual style is a blend of **Minimalism** and **Modern Corporate**, utilizing a monochrome foundation to strip away cognitive noise. By emphasizing generous whitespace and sharp architectural lines, the system ensures that the user's focus remains entirely on the intelligence being distributed. It feels premium, sterile, and intentional.

## Colors

The palette is strictly monochrome to maintain a high-contrast, professional atmosphere. 

- **Primary & Neutral:** The core interaction revolves around `#0E0E0E` (Deep Black) and `#FFFFFF` (Pure White). This 100% contrast ratio ensures maximum legibility and a stark, modern feel.
- **Functional Accents:** While the aesthetic is monochrome, `#004E89` (Deep Blue) is utilized strictly for interactive utilities and primary action states to provide clear signposting. `#FFB129` is reserved for cautionary data states or system alerts.
- **Grayscale Tiering:** Intermediate grays are used exclusively for structural elements (borders and secondary text) to prevent the UI from feeling flat while avoiding the introduction of unnecessary hue.

## Typography

This design system employs **Geist** for its technical precision and developer-centric clarity. The typeface provides a "monospaced feel" within a proportional sans-serif structure, reinforcing the lab aesthetic.

- **Scale:** A tight typographic scale is used to emphasize hierarchy. Large "Display" sizes are used sparingly for major section headers.
- **Weights:** Medium (500) and Semi-Bold (600) weights are used for semantic labeling and headings. Regular (400) is the standard for all body content to ensure an airy, readable texture.
- **Formatting:** Data-heavy labels and system metadata should utilize the smaller label sizes with slight tracking (letter-spacing) increases to mimic technical documentation.

## Layout & Spacing

The layout philosophy is based on a **Fixed Grid** for desktop and a **Fluid System** for mobile, prioritizing structured alignment.

- **The Grid:** A 12-column grid system is used for desktop (1280px max-width). Columns are separated by 24px gutters.
- **Whitespace:** Generous vertical rhythm is maintained using the `xxl` (64px) unit between major sections to prevent information density from overwhelming the user.
- **Rhythm:** An 8px baseline grid dictates the placement of all elements. Components should internalize padding in multiples of 8 (e.g., 16px or 24px) to ensure mathematical harmony across the platform.

## Elevation & Depth

This design system rejects traditional shadows in favor of **Low-Contrast Outlines** and **Tonal Layers**.

- **Structure:** Depth is communicated through 1px solid borders (`#E5E5E5`). This creates a blueprint-like appearance that feels stable and engineered.
- **Layering:** Surfaces are differentiated by shifting background colors between `#FFFFFF` and `#F7F7F7`. Floating elements (like dropdowns or modals) should use a stark 1px black border or a very fine, zero-blur "ink" shadow to separate them from the canvas without introducing soft gradients.
- **Z-Index:** Hierarchy is strictly linear. Higher-level surfaces do not "glow"; they simply occupy a clean, outlined container atop the base layer.

## Shapes

The shape language is defined by **Sharp Corners (0px)**. 

To reinforce the premium "lab" aesthetic and technical efficiency, all containers, buttons, and input fields utilize 90-degree angles. This geometric rigidity suggests precision and removes the "consumer-grade" softness found in more casual applications. The only exception to this rule is for status pips or specific iconography where circular forms are required for universal recognition.

## Components

- **Buttons:** Primary buttons are solid `#0E0E0E` with `#FFFFFF` text. Secondary buttons utilize a 1px border of `#0E0E0E` with no fill. All buttons must have sharp corners and use `label-md` typography.
- **Inputs:** Text fields are defined by a 1px `#E5E5E5` bottom border or full perimeter outline. Focus states switch the border color to `#0E0E0E` instantly with no transition blur.
- **Chips/Badges:** Small, rectangular containers with a `#F7F7F7` fill and `code-sm` typography. Used for tags or data categories.
- **Cards:** White backgrounds with 1px `#E5E5E5` borders. No shadows. Content within cards should follow the 24px internal padding rule.
- **Lists:** Data rows separated by 1px horizontal rules. Hover states should utilize a subtle `#F7F7F7` background shift.
- **Intelligence Specific:** Use "Monospace Data Blocks" for displaying raw AI outputs or distribution metrics, wrapped in a subtle gray border to signify a "result container."