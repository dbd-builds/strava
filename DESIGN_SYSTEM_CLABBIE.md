# Clabbie Design System
> Built on top of DESIGN_SYSTEM.md. This file specifies every override needed to adapt that design for Clabbie — enterprise-grade, dark-theme, familiar to users of Rippling, Linear, or Workday's modern interfaces. Read DESIGN_SYSTEM.md first for base component structure; this file tells you what to change and why.

---

## Vision

The finished product feels like a tool a VP of People would trust on day one.

- **Dark navy base** with a subtle blue-purple atmospheric glow (like the Clabbie login page — not a gaming app, more like Linear or Vercel's dashboard)
- **Clabbie green** (`#22C55E`) appears exactly where you need the user to act: CTAs, active tabs, progress fills, the logo badge. Everywhere else is restrained.
- **Inter** for all body/UI text — the de facto standard for enterprise SaaS (Rippling, Notion, Linear all use it). Immediately legible and familiar.
- **Fraunces** stays on titles and large stat numbers only — this is the one design decision that gives Clabbie personality without sacrificing credibility.
- Cards have **clean slate elevation** — subtle borders, no loud gradients, defined by shadow and layering rather than color.
- Tabs use a **bottom-border active state** instead of a filled pill — this reads as "software dashboard" rather than "marketing website."
- The overall signal: *structured, intelligent, built for people who run teams* — not playful, not corporate-bland, but confident.

---

## 1. Fonts — Changes from Base

**Replace DM Sans with Inter.** Keep Fraunces exactly as-is for display/heading roles.

```html
<!-- Remove the DM Sans + Fraunces Google Fonts link and replace with: -->
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Role | Font | Why |
|---|---|---|
| Display / titles / large stat numbers | Fraunces (serif) | Retained — gives Clabbie editorial character |
| All body, labels, UI, buttons, inputs | **Inter** (sans-serif) | Standard enterprise SaaS font. Immediately familiar. |

**In CSS, replace every instance of `'DM Sans'` with `'Inter'`:**
```css
/* Before */
textarea, input, select { font-family: 'DM Sans', sans-serif; }
/* After */
textarea, input, select { font-family: 'Inter', sans-serif; }
```

---

## 2. Color Tokens — Full Clabbie Override

### 2a. Backgrounds

Replace the base dark palette with Clabbie's deeper navy and atmospheric glow.

```
Page background:       #0B0F1A   (deeper than base — more Clabbie login, less midnight)
Body CSS:              body { background: #0B0F1A; }

Atmospheric glow:      Add a radial gradient to the page wrapper:
                       background: radial-gradient(ellipse 80% 50% at 50% -10%,
                                   rgba(99,102,241,.12) 0%, transparent 70%), #0B0F1A;
                       This produces the blue-purple depth seen on the Clabbie login.

Header background:     linear-gradient(180deg, #0D1225 0%, #0B0F1A 100%)
Card background:       #111827                (flat, no gradient — cleaner at enterprise scale)
Card background alt:   #141B2D                (slightly elevated cards, e.g. modal panels)
Input / form fields:   #1A2035
Modal panel:           #141B2D
Scrollbar thumb:       #1E2640
```

### 2b. ⚠️ Primary Brand Color — Strava Orange → Clabbie Green

**Clabbie primary: `#22C55E`**

Extracted from: the "Get Started →" CTA button and the "C" logo badge in the screenshot.

Replace every instance of Strava orange with the values below.

| Find (Strava) | Replace With (Clabbie) | Notes |
|---|---|---|
| `#FC4C02` | `#22C55E` | Primary green — 9 instances |
| `rgba(252,76,2,.35)` | `rgba(34,197,94,.35)` | Button loading / disabled state |
| `rgba(252,76,2,.18)` | `rgba(34,197,94,.18)` | Panel border accent |
| `rgba(252,76,2,.14)` | `rgba(34,197,94,.14)` | "Complete" badge bg / subtle tint |
| `rgba(252,76,2,.04)` | `rgba(34,197,94,.04)` | Panel background wash |
| `#FF6B35` | `#4ADE80` | Lighter green for gradient start |
| `#FFD4B8` | `#D1FAE5` | Very light green tint for title gradient end |

**How the title gradient changes:**
```
Before: linear-gradient(135deg, #FFFFFF 40%, #FFD4B8 100%)   ← warm peach
After:  linear-gradient(135deg, #FFFFFF 40%, #D1FAE5 100%)   ← cool mint

Before (accent span): linear-gradient(135deg, #FF6B35, #FC4C02)
After  (accent span): linear-gradient(135deg, #4ADE80, #22C55E)
```

### 2c. Supporting Accent Colors

These are **unchanged** from the base. They remain as priority card accent colors and work well against the Clabbie dark navy. No action needed.

```
Priority 2:  #F59E0B   (amber)
Priority 3:  #10B981   (green — coincidentally close to Clabbie primary; fine)
Priority 4:  #8B5CF6   (purple — also appears on Clabbie "Welcome Back" card)
Priority 5:  #06B6D4   (cyan)
```

For Priority 1, since Strava orange is being replaced, use Clabbie green `#22C55E` or swap to another accent from your own content taxonomy.

### 2d. Status Colors — One Change

The "Complete" status used `#FC4C02`. Update to Clabbie green:

```
On Track:   color #10B981  /  bg rgba(16,185,129,.14)    — unchanged
At Risk:    color #F59E0B  /  bg rgba(245,158,11,.14)     — unchanged
Behind:     color #EF4444  /  bg rgba(239,68,68,.14)      — unchanged
Complete:   color #22C55E  /  bg rgba(34,197,94,.14)      ← UPDATED
```

### 2e. Secondary Accent (Enterprise Layer)

The Clabbie screenshot shows **purple/violet** (`#7C3AED`) used on the "Welcome Back" icon card. Add this as an optional secondary accent for informational or AI-powered features:

```
Secondary accent:  #7C3AED
Tints:             rgba(124,58,237,.18)  /  rgba(124,58,237,.08)
```

### 2f. Text Colors — Unchanged

All text colors carry over from the base design system exactly. No changes needed.

---

## 3. Typography Scale — No Changes

All font sizes, weights, and letter-spacing values from DESIGN_SYSTEM.md carry over unchanged. The only difference is the font-family: **Inter replaces DM Sans everywhere**.

One refinement for enterprise feel: tighten the base line-height slightly.

```css
/* Add to your global styles */
body { line-height: 1.5; }
```

---

## 4. Tab Navigation — Style Change

The base design uses a **filled orange tab** for the active state. For enterprise feel, replace with a **bottom-border underline style** — this is how Rippling, Notion, and Linear handle tabs.

```
Base (replace):
  Active tab:   background #FC4C02, color white, rounded top corners

Clabbie enterprise (use instead):
  All tabs:     background transparent, border none
  Active tab:   border-bottom: 2px solid #22C55E
                color: white
                background: rgba(34,197,94,.06)   (very subtle green wash)
  Inactive tab: color rgba(255,255,255,.45)
  Hover:        background rgba(255,255,255,.05), color rgba(255,255,255,.75)
  Border-radius: 6px (all corners, reduced from 8px top-only)
  Transition:   border-color .15s, color .15s, background .15s
```

This single change dramatically shifts the feel from "app" to "enterprise platform."

---

## 5. Card Elevation — Refinement

Replace card gradients with flat backgrounds and stronger borders for a cleaner, more structured enterprise look.

```
Before:  background: linear-gradient(145deg, #111827, #0d1224)
After:   background: #111827
         border: 1px solid rgba(255,255,255,.09)   (slightly more visible than base .07)
         box-shadow (default): 0 1px 3px rgba(0,0,0,.4), 0 1px 2px rgba(0,0,0,.3)
         box-shadow (focused/expanded): 0 0 0 1px {cardColor}30,
                                        0 4px 24px rgba(0,0,0,.35)
```

This removes the "dark gaming gradient" aesthetic and replaces it with the flat-with-shadow elevation system used by Linear, Vercel, and Rippling.

---

## 6. Buttons — Refinement

### Primary CTA (green)
```
background: #22C55E
color: #0B0F1A          ← dark text on green (better contrast than white)
font-weight: 600
border-radius: 8px
padding: 10px 20px
transition: background .15s, box-shadow .15s

hover:
  background: #16A34A   (one shade darker)
  box-shadow: 0 0 0 3px rgba(34,197,94,.25)   (green focus ring)
```

### Ghost / Secondary
```
background: rgba(255,255,255,.06)
border: 1px solid rgba(255,255,255,.12)
color: rgba(255,255,255,.75)
border-radius: 8px

hover:
  background: rgba(255,255,255,.1)
  border-color: rgba(255,255,255,.2)
```

### Danger / Delete
No change from base — `#EF4444` on `rgba(239,68,68,.15)` is correct and universal.

---

## 7. Logo Badge
```
background: #22C55E   ← Clabbie green (matches the "C" badge in screenshot)
color: #0B0F1A        ← dark text, not white
font-family: 'Inter', sans-serif
font-weight: 700
```

---

## 8. Progress & Gauge Fills

For any priority using Clabbie green as its card color, the progress bar fill and gauge arc stroke will automatically use `#22C55E`. No changes needed to the component logic — just ensure the color token is updated in `INIT_PRIORITIES` for the relevant priority.

---

## 9. Animations — Refinement

Keep all animations from the base but dial them back slightly for enterprise professionalism:

```
Base fadeUp:         translateY(10px), .4s
Clabbie enterprise:  translateY(6px), .3s   ← shorter travel, faster

Card stagger:        Reduce from .05s increments to .04s increments

Transition defaults:
  Color/bg: .15s ease    (unchanged)
  Box shadow: .2s ease   (unchanged)
  Progress: 1s cubic-bezier(.4,0,.2,1)  (unchanged — this feels premium, keep it)
```

---

## 10. Global CSS Additions

Add the atmospheric background glow and Inter font override to your global stylesheet:

```css
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #0B0F1A;
  font-family: 'Inter', sans-serif;
}

/* Atmospheric glow — matches Clabbie login page depth */
.page-wrapper {
  min-height: 100vh;
  background: radial-gradient(
    ellipse 80% 50% at 50% -10%,
    rgba(99,102,241,.12) 0%,
    transparent 70%
  ), #0B0F1A;
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: #1E2640; border-radius: 2px; }

/* Inputs */
textarea, input, select { font-family: 'Inter', sans-serif; }
select option { background: #1A2035; }
```

---

## 11. Complete Brand Swap Checklist for Cursor

Give Cursor these exact find-and-replace instructions alongside the base DESIGN_SYSTEM.md:

```
1.  'DM Sans'            →  'Inter'
2.  #FC4C02              →  #22C55E
3.  rgba(252,76,2,.35)   →  rgba(34,197,94,.35)
4.  rgba(252,76,2,.18)   →  rgba(34,197,94,.18)
5.  rgba(252,76,2,.14)   →  rgba(34,197,94,.14)
6.  rgba(252,76,2,.04)   →  rgba(34,197,94,.04)
7.  #FF6B35              →  #4ADE80
8.  #FFD4B8              →  #D1FAE5
9.  #080C18              →  #0B0F1A
10. linear-gradient(145deg,#111827,#0d1224)  →  #111827  (flatten card bg)
11. Active tab: background #FC4C02           →  border-bottom: 2px solid #22C55E +
                                                background: rgba(34,197,94,.06)
```

---

## 12. What It Will Look Like

**Header:** Deep `#0B0F1A` background with a barely-visible indigo-purple atmospheric glow at the top. The Clabbie "C" badge glows soft green. The title uses the white-to-mint gradient. Stat numbers in Fraunces — same weight, now anchored in a slightly cooler palette.

**Navigation tabs:** No filled pill. A clean green underline on the active tab with a whisper of green background wash. The inactive tabs are muted and step forward on hover. Feels like Linear's tab bar or Rippling's sub-navigation.

**Priority cards:** Flat `#111827` surface with a `1px rgba(255,255,255,.09)` border. The top 3px accent bar is the only bold color per card. On hover/expand, a subtle shadow ring appears in the card's color. Clean. Structured. Nothing distracts from the content.

**Progress bars & gauges:** The same animated fills from the base — the 1-second cubic-bezier easing is retained because it still feels premium in an enterprise context.

**Status badges:** Tight pill labels — green, amber, red, green-for-complete. Readable at a glance. Nothing Strava-specific remains.

**Modals:** `#141B2D` panel, no gradient. Green primary action button with dark text. Cancel in ghost style. Feels like a system dialog from a product you've used before.

**Overall impression:** A VP of People opens this dashboard and immediately thinks *"this is a real tool."* It has the visual confidence of Rippling without the sterility of Workday. The Fraunces headings and the Clabbie green are the two personality markers — everything else defers to function.
