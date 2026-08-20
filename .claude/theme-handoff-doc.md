# Roost Branding Refresh — Implementation Handoff

## Overview

Three distinct branding directions have been approved for the Roost Lounge website redesign. Users will be able to switch between all three themes via a theme selector in the top navigation (similar to light/dark/system mode toggles).

---

## Theme Options

### 1a – Bold Teal + Gold

**Aesthetic:** Modern, premium, upscale lounge positioning

**Color Tokens:**

```
Primary:       #004d5c (Deep Teal)
Accent:        #d4a574 (Gold)
Background:    #f9f6f0 (Warm Cream)
Text Primary:  #1a1a1a (Near Black)
Text Secondary: #666666
Borders:       #e0d5c7 (Warm Gray)
```

**Typography:**

- H1/H2: `Playfair Display`, weight 700
- Body: `Inter`, weights 400–600

**Component Patterns:**

- Primary CTA: Gold background, white text, 8px border-radius
- Secondary button: Transparent, teal border (2px), teal text
- Cards: Cream background (#f9f6f0), subtle border
- Dividers: Warm gray (#e0d5c7)

---

### 1b – Rainbow Gradients + Teal

**Aesthetic:** Celebratory, inclusive, refined energy

**Color Tokens:**

```
Primary:       #004d5c (Deep Teal)
Gradient CTA:  linear-gradient(135deg, #FF1493 0%, #FFD700 50%, #1E90FF 100%)
Secondary Accent: #d4a574 (Warm Gold)
Background:    #ffffff (Clean White)
Text Primary:  #004d5c (Teal)
Text Secondary: #666666
```

**Typography:**

- H1/H2: `Playfair Display`, weight 700
- Body: `Inter`, weights 400–600

**Component Patterns:**

- Primary CTA: Gradient background (pink → gold → blue), white text, 8px radius, subtle shadow (0 2px 8px rgba(255,20,147,0.2))
- Secondary CTA: Gold solid background
- Tertiary button: Transparent, teal border (2px)
- Cards: White background, gold border (2px) for featured cards
- Dividers: Gold accents where needed

---

### 2a – Jewel Tones + Warmth

**Aesthetic:** Rich, luxe, sophisticated with personality

**Color Tokens:**

```
Primary Dark:  #2d3d5f (Deep Navy)
Primary Alt:   #6b4c9a (Rich Purple)
Secondary:     #004d5c (Deep Teal)
Gold Accent:   #d4a574 (Warm Gold)
Rose Accent:   #c97fa0 (Rose)
Background:    #f9f6f0 (Warm Cream)
Text Primary:  #2d3d5f (Navy)
Text Secondary: #666666
```

**Typography:**

- H1/H2: `Playfair Display`, weight 700
- Body: `Inter`, weights 400–600

**Component Patterns:**

- Primary CTA: Purple background (#6b4c9a), white text, 8px radius
- Secondary button: Transparent, navy border (2px), navy text
- Featured cards: Warm cream background, rose left border (4px)
- Highlight cards: White background, gold border (2px)
- Dividers: Navy or rose accents

---

## Theme Switcher Implementation

**Location:** Top-right of navigation (or integrated into existing settings/account menu)

**Behavior:**

- Display as a dropdown menu or icon-based toggle (three options: 1a, 1b, 2a)
- Label options clearly: "Bold + Gold", "Rainbow Gradients", "Jewel Tones"
- Save user selection to `localStorage` with key `roost-theme`
- Default to theme `1a` if no preference is stored
- Apply theme via CSS variables (recommended) or class-based styling (e.g., `[data-theme="1a"]` selector on root element)

**Example localStorage behavior:**

```javascript
// On page load
const savedTheme = localStorage.getItem("roost-theme") || "1a";
document.documentElement.setAttribute("data-theme", savedTheme);

// On theme selection
function setTheme(themeId) {
  localStorage.setItem("roost-theme", themeId);
  document.documentElement.setAttribute("data-theme", themeId);
  // Optionally: trigger re-render or CSS variable updates
}
```

---

## CSS Variable Structure (Recommended Approach)

Define theme variables in a root style or theme CSS file, then switch them via `[data-theme]` selector:

```css
:root[data-theme="1a"] {
  --color-primary: #004d5c;
  --color-accent: #d4a574;
  --color-bg: #f9f6f0;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-border: #e0d5c7;
  --font-display: "Playfair Display", serif;
  --font-body: "Inter", sans-serif;
}

:root[data-theme="1b"] {
  --color-primary: #004d5c;
  --color-gradient: linear-gradient(
    135deg,
    #ff1493 0%,
    #ffd700 50%,
    #1e90ff 100%
  );
  --color-accent: #d4a574;
  --color-bg: #ffffff;
  --color-text-primary: #004d5c;
  --color-text-secondary: #666666;
  --font-display: "Playfair Display", serif;
  --font-body: "Inter", sans-serif;
}

:root[data-theme="2a"] {
  --color-primary: #2d3d5f;
  --color-primary-alt: #6b4c9a;
  --color-secondary: #004d5c;
  --color-accent-gold: #d4a574;
  --color-accent-rose: #c97fa0;
  --color-bg: #f9f6f0;
  --color-text-primary: #2d3d5f;
  --color-text-secondary: #666666;
  --font-display: "Playfair Display", serif;
  --font-body: "Inter", sans-serif;
}
```

Then apply via utilities:

```css
button.cta {
  background-color: var(--color-accent);
}
h1,
h2 {
  font-family: var(--font-display);
}
```

---

## Tailwind Config Integration (if applicable)

```javascript
module.exports = {
  theme: {
    colors: {
      // Add theme-specific colors to extend
      roost: {
        teal: "#004d5c",
        gold: "#d4a574",
        navy: "#2d3d5f",
        purple: "#6b4c9a",
        rose: "#c97fa0",
        cream: "#f9f6f0",
      },
    },
    fontFamily: {
      display: ["Playfair Display", "serif"],
      body: ["Inter", "sans-serif"],
    },
  },
  // Use @apply or arbitrary selectors for theme-specific overrides
};
```

---

## Font Imports

Add to `<head>` or CSS:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

---

## Next Steps

1. **Set up theme infrastructure** — CSS variables + `[data-theme]` attribute or Tailwind config integration
2. **Build theme switcher component** — Dropdown/toggle in top nav with localStorage persistence
3. **Audit all components** — Update button styles, card backgrounds, text colors, borders to use theme tokens
4. **Test across all three themes** — Verify contrast, readability, and brand coherence on each theme
5. **User testing** — Validate that users can easily find and use the theme switcher

---

## Questions for Claude Code

- Do you prefer CSS variables or Tailwind-based theming?
- Should the theme switcher appear in the main nav or in a settings menu?
- Should theme preference persist across browser sessions? (Recommend: yes, via localStorage)
- Any other components that need custom theme handling (gradients, animations, etc.)?
