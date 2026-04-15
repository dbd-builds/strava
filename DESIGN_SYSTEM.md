# Dashboard Design System
> Extracted from the Strava Priorities Dashboard. Use this document to replicate the visual design in a new project. No functionality is included — layout, color, typography, spacing, and components only.

---

## 1. Fonts

Two fonts. Load both from Google Fonts.

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">
```

| Role | Font | Weights Used |
|---|---|---|
| Display / headings / large numbers | Fraunces (serif) | 400, 600, 700 |
| Body / labels / UI text | DM Sans (sans-serif) | 400, 500, 600, 700 |

**Usage rule:** Fraunces for anything that needs to feel weighty or editorial (page titles, stat numbers, card headings, modal titles). DM Sans for everything else.

---

## 2. Color Tokens

### 2a. Background Layers

```
Page background:       #080C18   ← very dark navy, used on <body> and page wrapper
Header background:     linear-gradient(180deg, #0e1428 0%, #080C18 100%)
Card background:       linear-gradient(145deg, #111827, #0d1224)
Input / form fields:   #1a2035
Scrollbar thumb:       #1e2640
Modal overlay:         rgba(0,0,0,.78) + backdrop-filter: blur(4px)
Modal panel:           #111827
```

### 2b. ⚠️ Brand Color — "Strava Orange" → REPLACE WITH YOUR COLOR

Every instance below is hardcoded to `#FC4C02` (Strava orange). **These are the exact lines to change in your new project.** Search for `#FC4C02` and `rgba(252,76,2` to catch all of them.

| Location | Current Value | What It Controls |
|---|---|---|
| Logo badge background | `#FC4C02` | The small square icon in the top-left header |
| Logo badge text | `color: white` | Keep white regardless of brand color |
| Title accent gradient | `linear-gradient(135deg, #FF6B35, #FC4C02)` | The "· 2026" text in the page title |
| Title main gradient end | `#FFD4B8` | The warm fade at the end of "David's Top 5" — change to a light tint of your brand color |
| Overall Progress stat | `color: #FC4C02` | The large percentage number in the header stats row |
| Active tab button | `background: #FC4C02` | The selected navigation tab |
| Active tab (disabled/loading) | `rgba(252,76,2,.35)` | Faded state of primary button while loading |
| "Complete" status badge | `color: #FC4C02` / `bg: rgba(252,76,2,.14)` | The "Complete" status pill on priority cards |
| Generate Update button | `background: #FC4C02` | Primary CTA button |
| Generate Update loading border | `rgba(252,76,2,.18)` | Border around the generating state panel |
| Generate Update loading bg | `rgba(252,76,2,.04)` | Background of the generating state panel |
| Generate Update loading icon | `color: #FC4C02` | The animated icon while generating |
| Priority 1 card accent | `color: #FC4C02` in `INIT_PRIORITIES` | **Content-specific** — the color of your first priority card only. Change independently if desired. |

**Quick find:** In your codebase, search for:
- `#FC4C02` — 9 hardcoded hits
- `rgba(252,76,2` — 4 hits (the same orange at reduced opacity)
- `#FF6B35` — 1 hit (lighter orange used in the title gradient)
- `#FFD4B8` — 1 hit (very light orange tint in the title gradient)

### 2c. Supporting Accent Colors (Priority Card Colors)

These are the five category colors assigned to priority cards. Replace with your own categories as needed — they are purely content-level, not UI chrome.

```
Priority 1:  #FC4C02   ← same as brand color in this app; can be different in yours
Priority 2:  #F59E0B   (amber)
Priority 3:  #10B981   (green)
Priority 4:  #8B5CF6   (purple)
Priority 5:  #06B6D4   (cyan)
```

### 2d. Status Colors (keep or adjust to taste)

```
On Track:   color #10B981  /  bg rgba(16,185,129,.14)
At Risk:    color #F59E0B  /  bg rgba(245,158,11,.14)
Behind:     color #EF4444  /  bg rgba(239,68,68,.14)
Complete:   color #FC4C02  /  bg rgba(252,76,2,.14)   ← ⚠️ change with brand color
```

### 2e. 1:1 Section Colors (ABP)

```
Accomplished:  color #C0444F  /  bg rgba(192,68,79,.13)  /  light rgba(192,68,79,.07)
Blocks:        color #B5943C  /  bg rgba(181,148,60,.13)  /  light rgba(181,148,60,.07)
Priorities:    color #6B9E3F  /  bg rgba(107,158,63,.13)  /  light rgba(107,158,63,.07)
```

### 2f. Text Colors

```
Primary text:        white / #FFFFFF
Secondary text:      rgba(255,255,255,.8)
Muted text:          rgba(255,255,255,.45) – rgba(255,255,255,.38)
Very muted / labels: rgba(255,255,255,.32) – rgba(255,255,255,.22)
Faintest hints:      rgba(255,255,255,.15) – rgba(255,255,255,.07)
Danger / delete:     #EF4444
```

---

## 3. Typography Scale

| Size | Weight | Font | Used For |
|---|---|---|---|
| 28px | 700 | Fraunces | Page title (h1) |
| 24px | 700 | Fraunces | Header stat numbers |
| 22px | 600 | Fraunces | Section headings |
| 22px | 700 | Fraunces | Metric value in cards |
| 17px | 700 | Fraunces | Modal title, section headers |
| 15px | 400 | DM Sans | Empty state body text |
| 14.5px | 400 | DM Sans | Narrative / long-form text |
| 14px | 400–600 | DM Sans | Card body, form labels |
| 13.5px | 400 | DM Sans | Card title text, inputs |
| 13px | 400–700 | DM Sans | Tab labels, buttons, descriptions |
| 12px | 400–700 | DM Sans | Secondary labels |
| 11px | 700 | DM Sans | ALL CAPS labels, badges, micro text |
| 10px | 700 | DM Sans | Quarter tags (Q1/Q2), tiny labels |

**Letter spacing rules:**
- ALL CAPS labels: `letter-spacing: .08em – .12em`
- Page title: `letter-spacing: -.02em` (tight)
- Badges: `letter-spacing: .07em`

---

## 4. Spacing & Layout

```
Page padding:           24px 32px (top/sides in header), 28px 32px (content area)
Card padding:           20px 22px
Modal padding:          30px
Section padding (1:1):  22px 26px
Card border-radius:     16px
Modal border-radius:    20px
Input border-radius:    8px
Button border-radius:   8–10px
Badge border-radius:    20px (pill)
Small button radius:    5–6px
Tab border-radius:      8px 8px 0 0 (top only)
Card grid gap:          18px
Card min-width:         320px (auto-fill grid)
```

---

## 5. Component Styles

### Header / Nav Bar
```
background: linear-gradient(180deg, #0e1428 0%, #080C18 100%)
border-bottom: 1px solid rgba(255,255,255,.07)
padding: 24px 32px 0
```

Logo badge:
```
width: 28px, height: 28px
background: #FC4C02   ← ⚠️ REPLACE
border-radius: 6px
font: 13px/700 Fraunces, color: white
```

Page title (h1):
```
font: 28px/700 Fraunces, letter-spacing: -.02em
"Main text" gradient: linear-gradient(135deg, #FFFFFF 40%, #FFD4B8 100%)  ← ⚠️ change #FFD4B8
"Accent span" gradient: linear-gradient(135deg, #FF6B35, #FC4C02)         ← ⚠️ REPLACE both
Applied via: background-clip: text; -webkit-text-fill-color: transparent
```

Subtitle:
```
font-size: 13px, color: rgba(255,255,255,.38), margin-top: 4px
```

### Stat Numbers (header row)
```
Value:  font 24px/700 Fraunces, line-height: 1
Label:  font 11px/400 DM Sans, ALL CAPS, letter-spacing: .08em,
        color: rgba(255,255,255,.32), margin-top: 2px
```

### Tab Navigation
```
Inactive: background rgba(255,255,255,.06), color rgba(255,255,255,.45)
Active:   background #FC4C02, color white   ← ⚠️ REPLACE background
Hover:    background rgba(255,255,255,.09)
padding: 9px 20px, font: 13px/500, border-radius: 8px 8px 0 0
transition: all .2s
```

### Priority Cards
```
background: linear-gradient(145deg, #111827, #0d1224)
border-radius: 16px
border: 1px solid rgba(255,255,255,.07)
box-shadow (collapsed): 0 2px 12px rgba(0,0,0,.3)
box-shadow (expanded):  0 0 0 1px {cardColor}35, 0 8px 32px rgba(0,0,0,.4)
transition: box-shadow .25s

Top accent bar: height 3px, background: {cardColor}

Card entrance animation: fadeUp .4s ease, staggered by .05s per card
```

Card number badge:
```
width: 34px, height: 34px, border-radius: 9px
background: {cardColor}1a  (10% opacity tint)
font: 13px/700 Fraunces, color: {cardColor}
```

Card label:
```
font: 11px/700 DM Sans, color: {cardColor}
letter-spacing: .09em, text-transform: uppercase
```

### Status Badge
```
font: 11px/700 DM Sans, letter-spacing: .07em, text-transform: uppercase
padding: 3px 9px, border-radius: 20px
color + background: per STATUS_CFG (see section 2d)
```

### Progress Bar
```
Track:  height 4px, background rgba(255,255,255,.08), border-radius 2px
Fill:   background {cardColor}, border-radius 2px
        transition: width 1s cubic-bezier(.4,0,.2,1)
```

### Circular Metric Gauge
```
SVG circle size: 52×52, radius 18, stroke-width 4
Track stroke:  rgba(255,255,255,.08)
Fill stroke:   {cardColor}, stroke-linecap: round
               transition: stroke-dasharray 1s cubic-bezier(.4,0,.2,1)
Center text:   12px/700 DM Sans, color: {cardColor}
Metric value:  22px/700 Fraunces, color: white
Metric label:  11px DM Sans, color: rgba(255,255,255,.38), margin-top 3px
```

### Milestone Row
```
padding: 8px 6px, border-radius: 7px
hover: background rgba(255,255,255,.03)
transition: background .15s, cursor: pointer

Checkbox (undone): 16×16px, border-radius 4px, border 1.5px solid rgba(255,255,255,.2)
Checkbox (done):   background {cardColor}, no border, shows ✓ at 9px white
Text (undone):     13px rgba(255,255,255,.75)
Text (done):       13px rgba(255,255,255,.3), text-decoration: line-through
Quarter tag:       10px/700, color {cardColor}, bg {cardColor}18, padding 2px 7px, radius 4px
```

### Edit / Action Buttons
```
Edit button:
  background: rgba(255,255,255,.07)
  color: rgba(255,255,255,.5)
  padding: 4px 11px, border-radius: 6px, font: 12px
  hover: background rgba(255,255,255,.12)

Primary CTA (Save / Add):
  background: {cardColor} or #FC4C02   ← ⚠️ for generic CTAs
  color: white, font: 14px/700, padding: 12px, border-radius: 10px

Secondary (Cancel):
  background: rgba(255,255,255,.07)
  color: rgba(255,255,255,.5)
  font: 14px, padding: 12px, border-radius: 10px

Delete (×) button:
  background: rgba(239,68,68,.15), color: #EF4444
  width/height: 24–26px, border-radius: 5–6px, font-size: 14–15px
  opacity: 0 by default, opacity: 1 on parent hover
```

### Form Inputs / Selects / Textareas
```
background: #1a2035
border: 1px solid rgba(255,255,255,.1)
color: white
padding: 9px 13px
border-radius: 8px
font: 13.5px DM Sans
outline: none
width: 100%

Select option background: #1a2035
Font override: textarea, input, select { font-family: 'DM Sans', sans-serif }
```

Form label style:
```
display: block
font: 11px/700 DM Sans
color: rgba(255,255,255,.4)
text-transform: uppercase
letter-spacing: .09em
margin-bottom: 7px
```

### Modal
```
Overlay: position fixed, inset 0
         background rgba(0,0,0,.78)
         backdrop-filter: blur(4px)
         z-index: 1000
         animation: fadeUp .2s ease

Panel:
  background: #111827
  border-radius: 20px
  border: 1px solid rgba(255,255,255,.1)
  max-width: 540px, max-height: 90vh
  padding: 30px
  box-shadow: 0 24px 72px rgba(0,0,0,.65)
  overflow-y: auto
```

### Generate Update Button
```
Normal:     background #FC4C02, color white   ← ⚠️ REPLACE background
Loading:    background rgba(252,76,2,.35)      ← ⚠️ REPLACE (same color at 35% opacity)
padding: 11px 24px, border-radius: 10px, font: 13.5px/700
transition: all .2s

Loading panel:
  border: 1px solid rgba(252,76,2,.18)         ← ⚠️ REPLACE
  background: rgba(252,76,2,.04)               ← ⚠️ REPLACE
  icon color: #FC4C02                          ← ⚠️ REPLACE
  animation: glow 1.4s ease infinite
```

### Download Button (ghost)
```
background: rgba(255,255,255,.07)
border: 1px solid rgba(255,255,255,.12)
color: rgba(255,255,255,.6)
padding: 8px 16px, border-radius: 8px, font: 12px/600
hover: background rgba(255,255,255,.12)
```

### ABP Section Cards (1:1 view)
```
background: linear-gradient(145deg, #111827, #0d1224)
border-radius: 16px
border: 1px solid rgba(255,255,255,.07)
Top accent bar: height 3px, background: {abpColor}
Inner padding: 22px 26px

Entry card:
  background: {abpColor light}
  border: 1px solid {abpColor}30
  border-radius: 10px
  padding: 14–16px
  animation: fadeUp .3s ease
```

---

## 6. Animations

```css
/* Card / section entrance */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Spinner / pulse for loading states */
@keyframes glow {
  0%, 100% { opacity: 1; }
  50%       { opacity: .4; }
}
```

Stagger for priority cards:
```
card 1: animation-delay .05s
card 2: animation-delay .1s
card 3: animation-delay .15s
card 4: animation-delay .2s
card 5: animation-delay .25s
```

Transition defaults used throughout:
```
Color / bg changes:  transition: all .2s  or  background .15s
Box shadow:          transition: box-shadow .25s
Progress bar fill:   transition: width 1s cubic-bezier(.4,0,.2,1)
Gauge arc:           transition: stroke-dasharray 1s cubic-bezier(.4,0,.2,1)
Opacity reveals:     transition: opacity .15s
```

---

## 7. Scrollbar

```css
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: #1e2640; border-radius: 2px; }
```

---

## 8. Quick Brand Color Swap Checklist

When adapting this design for a new brand color, find and replace every item below. Use your IDE's find-all across the entire project.

**Search terms → what to replace with:**

| Find | Replace With | Notes |
|---|---|---|
| `#FC4C02` | `{YOUR_BRAND_COLOR}` | Primary brand — 9 instances |
| `rgba(252,76,2,.35)` | `{YOUR_BRAND_COLOR}` at 35% opacity | Button loading state |
| `rgba(252,76,2,.18)` | `{YOUR_BRAND_COLOR}` at 18% opacity | Panel border |
| `rgba(252,76,2,.14)` | `{YOUR_BRAND_COLOR}` at 14% opacity | "Complete" badge bg |
| `rgba(252,76,2,.04)` | `{YOUR_BRAND_COLOR}` at 4% opacity | Panel background |
| `#FF6B35` | Lighter tint of your brand color | Used in title gradient only |
| `#FFD4B8` | Very light tint of your brand color | Used in title gradient only |

**How to calculate opacity variants:**  
If your brand color is a hex like `#2563EB` (blue), convert to RGB (`37,99,235`) and write:
- 35% → `rgba(37,99,235,.35)`
- 18% → `rgba(37,99,235,.18)`
- 14% → `rgba(37,99,235,.14)`
- 4%  → `rgba(37,99,235,.04)`

For the gradient tints (`#FF6B35`, `#FFD4B8`), pick a lighter/more saturated variant of your brand color for the gradient start, and a very pale tint for the end.

---

## 9. Global Resets

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #080C18; }
```
