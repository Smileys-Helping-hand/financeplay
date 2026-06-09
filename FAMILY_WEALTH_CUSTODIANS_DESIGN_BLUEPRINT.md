# Family Wealth Custodians
## Comprehensive UI/UX Redesign & Implementation Blueprint

**Client:** Family Wealth Custodians (Paarl, South Africa)  
**Sector:** Wealth Management, Retirement Planning, Estate Planning  
**Design Philosophy:** Old Money Elegance, Executive Minimalism, Trust-Driven Architecture  
**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Framer Motion  

---

## SECTION 1: VISUAL IDENTITY & DESIGN SYSTEM

### 1.1 Color Palette: "The Heritage Collection"

The color system is built on timeless, trust-evoking tones used by legacy financial institutions, private banks, and luxury services.

#### Primary Colors

| Color Name | Hex Value | Usage | Psychology |
|-----------|-----------|-------|------------|
| **Heritage Navy** | `#1A2332` | Primary brand color, headers, nav | Deep trust, stability, authority |
| **Slate Charcoal** | `#2D3E4F` | Secondary text, subtle backgrounds | Professional, grounded, sophisticated |
| **Cream Ivory** | `#F9F8F5` | Primary background | Clean, accessible, premium feel |
| **Off-White Linen** | `#EFEBE6` | Secondary backgrounds, cards | Warm, inviting, high-end print quality |

#### Accent Colors (Use Sparingly)

| Color Name | Hex Value | Usage | Psychology |
|-----------|-----------|-------|------------|
| **Muted Gold** | `#A89968` | Highlights, borders, premium elements | Wealth, prestige, heritage |
| **Soft Sage** | `#8B9A7D` | Success states, growth messaging | Growth, stability, nature-backed trust |
| **Champagne Beige** | `#D4C4B8` | Subtle accents, dividers | Elegance, refinement, luxury |
| **Slate Blue** | `#5A7A8A` | Links, interactive elements | Trustworthy interactivity |

#### Neutral Grays (Accessibility & Hierarchy)

```
Hierarchy Gray 1 (Text): #1A1A1A (98% opacity of Heritage Navy)
Hierarchy Gray 2 (Secondary Text): #666666
Hierarchy Gray 3 (Subtle): #B0B0B0
Hierarchy Gray 4 (Borders/Dividers): #E0DCD7
Hierarchy Gray 5 (Disabled/Minimal): #F5F3F0
```

#### Color Application Rules

- **No pure blacks (#000000)** — Always use Heritage Navy or Slate Charcoal
- **Default background = Cream Ivory** (#F9F8F5) for all primary pages
- **Gold accents:** Limit to 3-5 strategic elements per page (e.g., logo, primary CTA, section headers)
- **Cards & Containers:** Off-White Linen (#EFEBE6) on Cream backgrounds for subtle layering
- **Text on cream:** Always Hierarchy Gray 1 or Heritage Navy; never pure black
- **Link colors:** Slate Blue (#5A7A8A) with Heritage Navy hover state

#### Dark Mode (Minimal Secondary Support)
If dark mode is needed for accessibility or future features:
```
Background: #0F1419 (Deeper Heritage Navy)
Card: #1A2332 (Primary Heritage Navy)
Text: #F9F8F5 (Cream Ivory)
Accents: Muted Gold remains #A89968 (increased opacity slightly)
```

---

### 1.2 Typography: "Established & Refined"

The typography system pairs a modern serif for heritage with a clean geometric sans-serif for clarity.

#### Font Stack

**Headings & Display (Heritage, Authority)**
```
Font: Playfair Display
Weights: 700 (Bold), 600 (Semibold)
Fallback: Georgia, serif
Use Case: Page titles, section headers, hero statements
Psychology: Classic, editorial sophistication—like a century-old newspaper or luxury magazine
```

**Body & UI Text (Clarity, Accessibility)**
```
Font: Inter (or Outfit as alternative)
Weights: 400 (Regular), 500 (Medium), 600 (Semibold)
Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
Use Case: Body copy, navigation, buttons, form labels
Psychology: Modern, highly readable, digital-native but refined
```

#### Typography Sizing & Hierarchy

```
Display / Hero Title
Size: 56px (desktop), 36px (mobile)
Font: Playfair Display, 700
Line-height: 1.2
Margin-bottom: 16px
Color: Heritage Navy (#1A2332)
Letter-spacing: -0.5px

H1 / Page Title
Size: 48px (desktop), 28px (mobile)
Font: Playfair Display, 700
Line-height: 1.15
Color: Heritage Navy

H2 / Section Header
Size: 36px (desktop), 24px (mobile)
Font: Playfair Display, 600
Line-height: 1.2
Color: Heritage Navy
Margin-top: 48px (above content)

H3 / Subsection
Size: 24px (desktop), 20px (mobile)
Font: Inter, 600
Line-height: 1.3
Color: Slate Charcoal (#2D3E4F)

Body Large
Size: 18px
Font: Inter, 400
Line-height: 1.6
Color: Hierarchy Gray 1 (#1A1A1A)
Use: Primary body copy

Body Regular
Size: 16px
Font: Inter, 400
Line-height: 1.6
Color: Hierarchy Gray 1
Use: Standard paragraphs, descriptions

Body Small
Size: 14px
Font: Inter, 400
Line-height: 1.5
Color: Hierarchy Gray 2 (#666666)
Use: Secondary information, captions

Caption / Legal
Size: 12px
Font: Inter, 400
Line-height: 1.4
Color: Hierarchy Gray 3 (#B0B0B0)
Use: Footnotes, legal, disclaimers
```

#### Typography Usage Rules

- **Never use more than 2 different font families in a single view**
- **Serif (Playfair) reserved for headings ONLY**—never body text
- **All interactive text (buttons, links) use Inter weight 500 or 600**
- **Avoid using color for emphasis; use weight instead** (e.g., 500 → 600, not Heritage Navy → Slate Blue)
- **Line-height always ≥ 1.5 for body text** (accessibility + luxury feel)

---

### 1.3 Component Styling: "Refined Minimalism"

#### Buttons

**Primary Button (Main CTA)**
```
Background: Heritage Navy (#1A2332)
Text: Cream Ivory (#F9F8F5), Inter 600
Padding: 16px 32px
Border-radius: 4px (sharp, architectural)
Box-shadow: 0 2px 8px rgba(26, 35, 50, 0.12)
Transition: 200ms ease-out

On Hover:
  - Background: Slate Charcoal (#2D3E4F)
  - Box-shadow: 0 4px 16px rgba(26, 35, 50, 0.16)
  - Transform: none (no scale)

On Active/Clicked:
  - Box-shadow: 0 1px 4px rgba(26, 35, 50, 0.2)
  - Opacity: 0.95
```

**Secondary Button (Alternative Actions)**
```
Background: transparent
Border: 1.5px solid Heritage Navy (#1A2332)
Text: Heritage Navy, Inter 600
Padding: 14px 30px
Border-radius: 4px
Transition: 200ms ease-out

On Hover:
  - Background: rgba(26, 35, 50, 0.05)
  - Border-color: Slate Charcoal (#2D3E4F)

On Active:
  - Background: rgba(26, 35, 50, 0.08)
```

**Tertiary Button (Minimal, Text-Only)**
```
Background: transparent
Text: Slate Blue (#5A7A8A), Inter 600
Padding: 12px 16px
Border-radius: 0 (no rounding)
Border-bottom: 1px solid Slate Blue
Transition: 200ms ease-out

On Hover:
  - Text-color: Heritage Navy
  - Border-color: Heritage Navy
```

**Disabled State (All Buttons)**
```
Opacity: 0.5
Cursor: not-allowed
No hover effects
```

#### Cards & Containers

**Standard Card**
```
Background: Off-White Linen (#EFEBE6)
Border: 1px solid Champagne Beige (#D4C4B8)
Border-radius: 6px
Padding: 32px
Box-shadow: 0 2px 6px rgba(26, 35, 50, 0.05)
Transition: box-shadow 200ms ease-out, transform 200ms ease-out

On Hover (if interactive):
  - Box-shadow: 0 4px 12px rgba(26, 35, 50, 0.08)
  - Transform: translateY(-2px)
```

**Feature/Service Card (with Icon)**
```
Structure:
  - Icon (64x64px, Heritage Navy or Muted Gold)
  - Heading (H3, Playfair 24px)
  - Description (Body Regular)
  - Optional: CTA link (Tertiary button style)

Background: Off-White Linen
Padding: 28px
Border-radius: 6px
Box-shadow: 0 2px 6px rgba(26, 35, 50, 0.05)
Gap between icon & text: 20px
Gap between heading & description: 12px

Icon Treatment:
  - Color: Muted Gold (#A89968) for primary accent cards
  - Color: Slate Blue (#5A7A8A) for secondary cards
  - SVG stroke-width: 1.5px (not too thin, not too thick)
```

**Testimonial / Quote Card**
```
Background: Cream Ivory (same as page)
Border-left: 4px solid Muted Gold (#A89968)
Padding: 24px 24px 24px 28px
Quote-mark: Use elegant serif quote mark (font size 48px, Muted Gold, opacity 0.3)
Text: Inter 400, 18px line-height 1.8
Author: Inter 600 14px, Slate Charcoal, margin-top 16px
Title: Inter 400 12px, Hierarchy Gray 3

No box-shadow. Minimal border. Elegance through typography.
```

#### Form Inputs & Fields

**Input Field (Text, Email, etc.)**
```
Background: #FFFFFF
Border: 1.5px solid Hierarchy Gray 4 (#E0DCD7)
Border-radius: 4px
Padding: 14px 16px
Font: Inter 16px, Hierarchy Gray 1
Transition: border-color 200ms ease-out, box-shadow 200ms ease-out

On Focus:
  - Border-color: Slate Blue (#5A7A8A)
  - Box-shadow: 0 0 0 3px rgba(90, 122, 138, 0.1)
  - Outline: none

On Error:
  - Border-color: #D32F2F (muted red, not bright)
  - Box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1)

Placeholder:
  - Color: Hierarchy Gray 3 (#B0B0B0)
  - Font-style: italic (subtle)
```

**Label**
```
Font: Inter 500 14px
Color: Slate Charcoal (#2D3E4F)
Margin-bottom: 8px
Display: block
```

**Select Dropdown**
```
Same styling as input field
Arrow icon: Custom SVG in Slate Charcoal
Maintain consistent padding/border
```

**Checkbox & Radio**
```
Size: 20x20px
Border: 1.5px solid Hierarchy Gray 4
Border-radius: 3px (checkbox), 50% (radio)
Checked state: Background Heritage Navy, border Heritage Navy
Checkmark/dot: Cream Ivory (#F9F8F5)
Transition: 150ms ease-out
Hover (unchecked): Border Slate Blue

Label positioning: 8px to the right, vertically centered
```

#### Dividers & Separators

**Horizontal Rule**
```
Height: 1px
Color: Hierarchy Gray 4 (#E0DCD7)
Margin: 32px 0 (vertical sections)
No shadow, no gradient
```

**Vertical Divider (in multi-column layouts)**
```
Width: 1px
Height: variable
Color: Hierarchy Gray 4 (#E0DCD7)
Margin: 0 24px (horizontal sections)
```

#### Navigation Elements

**Primary Navigation Bar**
```
Background: Heritage Navy (#1A2332)
Height: 72px
Padding: 0 48px (desktop), 0 24px (mobile)
Display: flex, align-items center, justify-content space-between

Logo:
  - Height: 40px (maintains logo proportions)
  - Color: Cream Ivory (#F9F8F5)

Nav Links:
  - Font: Inter 500 16px
  - Color: Cream Ivory (#F9F8F5)
  - Padding: 8px 16px
  - Border-radius: 3px
  - Transition: 150ms ease-out

On Hover:
  - Background: rgba(255, 248, 245, 0.1)

Active Link:
  - Border-bottom: 2px solid Muted Gold (#A89968)
  - Background: transparent

Mobile Menu (Hamburger):
  - Icon color: Cream Ivory
  - Slide-in from left on mobile
  - Background: Heritage Navy
  - Z-index: 1000
```

**Breadcrumbs**
```
Font: Inter 400 14px
Color: Hierarchy Gray 2 (#666666)
Separator: "/" character in Hierarchy Gray 3
Current page: Hierarchy Gray 1 (bold, not a link)
Links: Slate Blue (#5A7A8A) with underline on hover
```

---

## SECTION 2: ANIMATION & INTERACTION GUIDELINES

### 2.1 Animation Philosophy: "Executive Movement"

All animations must feel intentional, subtle, and purposeful. Think of how wealth management operates—smooth, deliberate, and never rushed.

#### Core Principles

1. **Slow & Steady:** Animations range 300ms–800ms (never under 200ms or over 1200ms)
2. **No Bouncing:** Avoid bounce, elastic, or spring easing—too playful
3. **Entrance, Not Distraction:** Animations guide the user's eye, they don't steal the show
4. **Accessibility:** Respect `prefers-reduced-motion` media query; disable animations if user prefers
5. **Easing Curves:** Use cubic-bezier functions for natural, professional motion

#### Recommended Easing Functions

```typescript
// Executive Entrance (fade + slight upward motion)
const easeInOutCubic = "cubic-bezier(0.645, 0.045, 0.355, 1)";

// Smooth Hover Response (quick, responsive)
const easeOutQuad = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

// Gentle Scroll Reveal (slow, luxurious)
const easeInOutQuart = "cubic-bezier(0.77, 0, 0.175, 1)";

// Fast Interaction Feedback (snappy but not jarring)
const easeOutCubic = "cubic-bezier(0.215, 0.61, 0.355, 1)";
```

---

### 2.2 Page Transitions & Navigation

**Primary Page Navigation (Next.js Next/Link)**

```typescript
// Using Framer Motion for layout transitions
import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20, // Subtle upward position
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "cubic-bezier(0.645, 0.045, 0.355, 1)",
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeInOutQuad",
    },
  },
};

// Apply to main page wrapper
<AnimatePresence mode="wait">
  <motion.div
    key={router.pathname}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {/* Page content */}
  </motion.div>
</AnimatePresence>
```

**Section Reveal (On Page Load)**

```typescript
const sectionVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "cubic-bezier(0.77, 0, 0.175, 1)", // easeInOutQuart
    },
  },
};

<motion.section
  variants={sectionVariants}
  initial="initial"
  whileInView="animate"
  viewport={{ once: true, amount: 0.2 }} // Trigger when 20% visible
>
  {/* Section content */}
</motion.section>
```

---

### 2.3 Scroll-Based Reveals

**Staggered List Animation (e.g., Team, Features, Testimonials)**

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12, // 120ms stagger between items
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOutCubic",
    },
  },
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
>
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {/* Card content */}
    </motion.div>
  ))}
</motion.div>
```

**Parallax Scroll (Subtle, Understated)**

```typescript
// For hero images or background elements
<motion.div
  style={{
    y: useMotionTemplate`${useScroll().scrollY}`,
  }}
>
  {/* Parallax content */}
</motion.div>

// Or simpler with inline style:
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, 150]);

<motion.img style={{ y }} src="hero.jpg" alt="Hero" />
```

---

### 2.4 Hover & Interactive States

**Button Hover Animation**

```typescript
// Primary button
<motion.button
  whileHover={{
    backgroundColor: "#2D3E4F", // Slate Charcoal
    boxShadow: "0 4px 16px rgba(26, 35, 50, 0.16)",
    transition: { duration: 0.2 },
  }}
  whileTap={{
    boxShadow: "0 1px 4px rgba(26, 35, 50, 0.2)",
    transition: { duration: 0.1 },
  }}
>
  Explore Wealth Planning
</motion.button>
```

**Card Hover Elevation**

```typescript
<motion.div
  whileHover={{
    y: -8,
    boxShadow: "0 4px 12px rgba(26, 35, 50, 0.08)",
    transition: { duration: 0.3 },
  }}
>
  {/* Card content */}
</motion.div>
```

**Link Underline Animation**

```typescript
const linkVariants = {
  hidden: { scaleX: 0, originX: "left" },
  visible: { scaleX: 1 },
};

<motion.a href="/services">
  Our Services
  <motion.span
    className="underline"
    initial={{ scaleX: 0 }}
    whileHover={{ scaleX: 1 }}
    transition={{ duration: 0.3 }}
  />
</motion.a>
```

---

### 2.5 Form Interaction Animations

**Input Focus Highlight**

```typescript
<motion.input
  initial={{ boxShadow: "0 0 0 0 rgba(90, 122, 138, 0)" }}
  whileFocus={{
    boxShadow: "0 0 0 3px rgba(90, 122, 138, 0.1)",
    transition: { duration: 0.2 },
  }}
/>
```

**Form Error Message Reveal**

```typescript
const errorVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3 },
  },
};

{hasError && (
  <motion.div
    variants={errorVariants}
    initial="hidden"
    animate="visible"
    className="text-red-600 text-sm mt-2"
  >
    This field is required.
  </motion.div>
)}
```

---

### 2.6 Modal & Overlay Animations

**Modal Entrance (Smooth, Professional)**

```typescript
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOutCubic",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        className="fixed inset-0 bg-black/30"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />
      <motion.div
        className="modal-content"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Modal content */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

### 2.7 Loading States & Skeleton Screens

**Elegant Loading Skeleton**

```typescript
// Use a subtle shimmer, not spinning spinners
const skeletonVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2, repeat: Infinity },
  },
};

<motion.div
  className="bg-gray-300 rounded h-12 w-full"
  variants={skeletonVariants}
  animate="animate"
/>
```

**Success State Transition**

```typescript
// When form submits successfully
const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

{submitted && (
  <motion.div
    variants={checkmarkVariants}
    initial="hidden"
    animate="visible"
    className="text-center"
  >
    <CheckIcon className="w-16 h-16 text-green-600 mx-auto" />
    <p className="mt-4">Your request has been received.</p>
  </motion.div>
)}
```

---

### 2.8 Mobile & Accessibility Considerations

**Respect User Preferences**

```typescript
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animationConfig = prefersReducedMotion
  ? { duration: 0 } // Instant, no animation
  : { duration: 0.6, ease: "easeInOutCubic" };

<motion.div animate={{ opacity: 1 }} transition={animationConfig}>
  {/* Content */}
</motion.div>
```

**Touch Gestures (Optional, Advanced)**

```typescript
// For swipe navigation between sections (mobile)
<motion.div
  drag="x"
  dragElastic={0.2}
  onDragEnd={(event, info) => {
    if (info.offset.x > 100) {
      // Swiped right
      navigatePrevious();
    } else if (info.offset.x < -100) {
      // Swiped left
      navigateNext();
    }
  }}
>
  {/* Swipeable content */}
</motion.div>
```

---

## SECTION 3: STRATEGIC USER FLOW & UX ARCHITECTURE

### 3.1 Sitemap & Information Architecture

```
Family Wealth Custodians Website Sitemap

Homepage /
├── Hero Section
├── Why Choose Us
├── Core Services (linked)
└── CTA: Book Exploration Call

About /about
├── Our Story
├── Leadership Team
├── Credentials & Affiliations
├── Our Philosophy
└── CTA: Schedule a Consultation

Services /services
├── Service Overview (Hero)
├── Estate Planning
│   ├── Details & features
│   └── CTA: Learn More
├── Retirement Planning
│   ├── Personalized Strategies
│   └── CTA: Get Started
├── Investment Management
│   ├── Portfolio Strategies
│   └── CTA: Discuss Your Goals
├── Tax Optimization
│   └── CTA: Explore
├── Wealth Preservation
│   └── CTA: Contact Us
└── CTA: Book a Strategy Session

Insights & Resources /insights
├── Blog / Articles
│   ├── Market Perspectives
│   ├── Retirement Planning Tips
│   ├── Tax Planning Guides
│   └── Estate Planning Strategies
├── Webinars / Videos
├── Downloadable Guides
└── Case Studies (Anonymized)

The Team /team
├── Leadership Bios
├── Advisors & Specialists
├── Photos + Credentials
└── CTA: Connect with an Advisor

Contact /contact
├── Contact Form (leads to booking)
├── Phone Number
├── Office Address (Paarl, South Africa)
└── Social Links

Booking / Exploration Call /book-call
├── Calendar Integration (Calendly / Cal.com)
├── Form: Name, Email, Phone, Topic
├── Confirmation Page
└── Follow-up Email

Privacy & Legal
├── Privacy Policy
├── Terms of Service
└── Disclaimer

Client Portal (Secondary, if applicable)
└── Login / Document Access
```

---

### 3.2 Homepage Narrative Flow

The homepage is the critical conversion engine. Its job is to move a high-net-worth individual or family from "landing" to "booking an exploration call."

#### Hero Section (Anchor Confidence)

```
Layout: Full viewport (100vh)
Background: Cream Ivory (#F9F8F5)
Optional subtle texture or gradient overlay (5-10% opacity)

Structure:
┌─────────────────────────────────────────────────────┐
│                                                       │
│ Left Column (60%, copy + CTA)          Right Column │
│                                        (40%, image)  │
│ ┌─────────────────┐                   ┌────────────┐│
│ │ Headline:       │                   │            ││
│ │ "Generational  │                   │   [Image]  ││
│ │ Wealth,        │                   │   Multi-   ││
│ │ Personal Care" │                   │   generational
│ │                 │                   │   family   ││
│ │ Subheadline:   │                   │   scenes]  ││
│ │ "Expert estate │                   │            ││
│ │ planning,      │                   │            ││
│ │ retirement     │                   │            ││
│ │ strategies &   │                   └────────────┘│
│ │ wealth         │                                  │
│ │ preservation   │                                  │
│ │ for families   │                                  │
│ │ across South   │                                  │
│ │ Africa"        │                                  │
│ │                 │                                  │
│ │ Body text:     │                                  │
│ │ "At Family     │                                  │
│ │ Wealth         │                                  │
│ │ Custodians...  │                                  │
│ │                 │                                  │
│ │ [Primary CTA]  │                                  │
│ │ Book Your      │                                  │
│ │ Exploration    │                                  │
│ │ Call           │                                  │
│ │ [Secondary]    │                                  │
│ │ Learn More     │                                  │
│ └─────────────────┘                                 │
│                                                       │
└─────────────────────────────────────────────────────┘
```

**Copywriting Guidance:**

- **Headline:** Position emotional trust first: "Generational Wealth, Personal Care"
- **Subheadline:** Speak to their pain: "Expert strategies for estate planning, retirement, and multi-generational wealth preservation"
- **Body Text (1-2 sentences):** "At Family Wealth Custodians, we understand that your family's financial legacy is more than numbers—it's a reflection of your values and vision. Our advisors specialize in bespoke wealth management, tax-efficient strategies, and estate planning that protect what matters most."
- **CTA Text:** "Book Your Exploration Call" (not "Get Started," which is too generic for this market)

**Visual Details:**
- Right-side image should feature a multi-generational family (parents, adult children, grandchildren) in a warm, sophisticated setting
- Image treatment: Soft-focus at edges, slight vignette, warm color grade
- Animation: Image fades in with slight upward translate on page load (300-400ms delay)
- No hero video (too casual for this market)

---

#### Trust Anchors Section (Social Proof)

```
Layout: 3-column card grid, or horizontal timeline
Background: Cream Ivory (#F9F8F5)
Padding: 80px 48px (desktop)

Structure:
┌──────────────────────────────────────────────────────┐
│              Trust Anchors (Section H2)               │
│                                                       │
│ Subheading: "Why families choose us"                 │
│                                                       │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│ │  [Icon]     │  │  [Icon]     │  │  [Icon]     │   │
│ │             │  │             │  │             │   │
│ │ 25+ Years   │  │ $2.3B+      │  │ ISO 27001   │   │
│ │ Experience  │  │ Assets Under│  │ Certified   │   │
│ │             │  │ Management  │  │ Security &  │   │
│ │ Trusted by  │  │             │  │ Compliance  │   │
│ │ 150+ HNW    │  │ Median AUM: │  │             │   │
│ │ families    │  │ $5M+        │  │ Your data   │   │
│ │             │  │             │  │ is our      │   │
│ │             │  │             │  │ top         │   │
│ │             │  │             │  │ priority    │   │
│ └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Key Stats (make them real, or don't include them):**
- Years in business
- Total assets under management (AUM)
- Number of families served
- Compliance certifications (FAIS, FSB, FSCA, ISO 27001)

**Visual Treatment:**
- Cards styled as feature cards (section 1.3)
- Icons use Muted Gold (#A89968) for prestige
- Stagger animation: cards appear one-by-one as section scrolls into view
- No percentages or growth charts—too salesy

---

#### Core Challenges Section (Problem Recognition)

```
Layout: Two-column (text left, visual right) alternating

Section Title: "The Wealth Management Challenges Families Face"
Subheading: "You've worked hard to build your wealth. 
Now it's time to protect it."

Challenge 1:
┌───────────────────────────────────────────────────────┐
│ Left: Text + Icon                 Right: Illustration │
│                                                         │
│ ┌──────────────┐                 ┌──────────────────┐ │
│ │ [Icon:       │                 │  [Illustration:  │ │
│ │  Multi-gen   │                 │   complex tax    │ │
│ │  complexity] │                 │   layers, maze]  │ │
│ │              │                 │                  │ │
│ │ Tax Inefficiency               └──────────────────┘ │
│ │              │                                      │
│ │ "Most families │                                    │
│ │ lose 30–40%   │                                    │
│ │ of wealth to  │                                    │
│ │ taxes,        │                                    │
│ │ inefficient   │                                    │
│ │ planning,     │                                    │
│ │ and           │                                    │
│ │ misaligned    │                                    │
│ │ strategies."  │                                    │
│ └──────────────┘                                      │
└───────────────────────────────────────────────────────┘

Challenge 2: [Repeat pattern, flipped]
Challenge 3: [Repeat pattern]
Challenge 4: [Repeat pattern, flipped]
```

**Challenge Topics to Address:**
1. **Tax Inefficiency:** "How do we minimize our tax burden while staying compliant?"
2. **Estate Planning Gaps:** "Will our family's wealth be divided as we intend?"
3. **Market Volatility:** "How do we sleep at night knowing markets fluctuate?"
4. **Succession Planning:** "Who manages the wealth when we're gone?"

**Copywriting Tone:**
- Acknowledge the complexity honestly
- No alarmism—maintain dignity
- Pivot to "we understand, and we have solutions"

**Visual Treatment:**
- Icons: Slate Blue (#5A7A8A), 48x48px, clean line art
- Illustrations: Subtle, muted color palette (greens, blues, warm taupes)
- Animation: Icons and text fade in as section scrolls into view

---

#### Solutions Section (How We Help)

```
Section Title: "Our Integrated Wealth Management Approach"
Subheading: "Comprehensive strategies designed for families like yours"

Service Cards (4-6 cards, grid or carousel):
┌─────────────────────────────────┐
│ [Icon: Playfair serif D]        │
│                                 │
│ Estate Planning                 │
│                                 │
│ "Structured succession plans    │
│ that preserve your family's     │
│ legacy and minimize taxes."     │
│                                 │
│ → Learn More (tertiary link)   │
└─────────────────────────────────┘

[Repeat for Retirement Planning, Investment Management, Tax Optimization, Wealth Preservation]
```

**Service Card Copywriting:**
- Each card has 1 icon, 1 heading, 1 sentence of copy, 1 tertiary link
- Avoid jargon—speak to outcomes, not mechanisms
- "Succession Planning" not "Multi-generational wealth transfer strategy"

**Visual Treatment:**
- Cards use Off-White Linen (#EFEBE6) background
- Icons in Muted Gold for primary services, Slate Blue for secondary
- Stagger animation as page scrolls
- On desktop, display as grid (2 columns); on mobile, single column or scrollable carousel

---

#### Testimonials Section (Trust Deepening)

```
Section Title: "Trusted by Families Across South Africa"
Subheading: "Real clients, real results"

Testimonial Layout (3 cards, alternating direction):
┌─────────────────────────────────────────────┐
│  Left Quote                 Right Signature  │
│                                             │
│ "Family Wealth Custodians       Margaret V. │
│  restructured our entire estate  Johannesburg
│  plan. Within 18 months, we             │
│  reduced our tax liability by     Founder, V─ │
│  $380k annually while improving   Holdings    │
│  our family's financial           ★★★★★     │
│  alignment. Beyond impressive     (5 stars)   │
│  numbers, they truly care about   │
│  our family's legacy."                     │
│                                             │
│  [Gold accent border-left]                 │
└─────────────────────────────────────────────┘
```

**Testimonial Sourcing (Authenticity is Critical):**
- Use real client names and locations (first name + last initial, city)
- Include a specific quantifiable result (tax savings, AUM growth) BUT obscure precise amounts slightly ("reduced by ~$380k annually")
- Always include star rating (5 stars)
- Quote length: 2-3 sentences max
- Avoid generic platitudes ("great service," "highly recommended")

**Visual Treatment:**
- Testimonial card: Cream Ivory background, gold left border (4px)
- Quote mark: Playfair serif, 48px, Muted Gold (#A89968), opacity 0.3
- Typography: Body Large (18px), line-height 1.8
- Author: Name (Inter 600 14px) + location (Inter 400 12px gray) + stars
- Animation: Fade and slight upward translate as section scrolls into view
- Display 3 on desktop, carousel on mobile

---

#### Final CTA Section (Conversion Moment)

```
Layout: Centered, full-width dark hero section
Background: Heritage Navy (#1A2332)
Text: Cream Ivory (#F9F8F5)
Height: 40vh

Content:
┌───────────────────────────────────────────────────────┐
│                                                        │
│              Ready to Secure Your Family's         │
│                      Financial Future?                │
│                                                        │
│ Subheading: "Schedule a free, confidential           │
│ exploration call with one of our advisors."          │
│                                                        │
│        [Primary CTA Button]                           │
│        Book Your Exploration Call                     │
│                                                        │
│        [or secondary link]                            │
│        View Our Service Menu                          │
│                                                        │
│                                                        │
└───────────────────────────────────────────────────────┘
```

**Animation:**
- Section fades in from bottom as user scrolls
- CTA button has subtle pulse or glow effect (optional, use sparingly)

**Color Contrast:**
- Primary CTA on Heritage Navy: Cream Ivory background, no border
- This is high contrast and accessible (WCAG AA+)

---

### 3.3 Exploration Call Booking Flow

This is the most critical UX sequence. The goal: minimize friction while capturing necessary information.

#### Step 1: CTA Click → Modal/Page Transition

When user clicks "Book Your Exploration Call," they land on `/book-call` or a modal overlay.

```
Modal should display:
┌─────────────────────────────────────────────────┐
│  [X] Close                                      │
│                                                 │
│  Schedule Your Exploration Call                │
│                                                 │
│  "Let's discuss your family's wealth           │
│  management goals. This is a complimentary,    │
│  confidential 30-minute conversation."         │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │ Step 1 of 2: Tell Us About Yourself      │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  [Form fields will go here]                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Step 2: Information Form

**Form Fields (Multi-step, progressive disclosure):**

```
Step 1: Contact Information
─────────────────────────────

Label: "Your Details"

[Input] Full Name *
[Input] Email Address *
[Input] Phone Number *
[Select] Country / Region *
  → Options: South Africa (default), Botswana, Namibia, etc.
  → Allows advisors to understand jurisdiction/tax implications

[Checkbox] I'm interested in discussing:
  ☐ Estate Planning
  ☐ Retirement Planning
  ☐ Investment Strategy
  ☐ Tax Optimization
  ☐ Wealth Preservation
  ☐ Other (specify)

[Textarea] What's your primary wealth goal?
Placeholder: "e.g., secure generational wealth, plan for retirement, optimize tax liability..."

[Button] Next → Step 2
[Link] Cancel / Back to Home
```

**Form Styling:**
- All inputs: Off-White background, Heritage Navy border on focus
- Labels: Slate Charcoal, Inter 500 14px, required asterisk in Muted Gold
- Helper text below fields: Gray 3, 12px italic
- "Next" button: Primary button style

---

#### Step 3: Calendar Selection (Step 2 of 2)

```
Step 2: Choose Your Time

Label: "Find a Time That Works"

Subtext: "Our advisors are available for 30-minute exploration calls.
Typically scheduled within 3–7 business days."

[Calendar Integration: Calendly / Cal.com]
- Display next 30 days
- Gray out past dates / fully booked times
- Allow selection of preferred times (morning, afternoon, evening)
- Time slots: 9am, 10am, 11am, 2pm, 3pm, 4pm, 5pm (SAST)

Selected Time Display:
"You've selected Thursday, June 12, 2025 at 10:00 AM SAST
Advisor: [Name]
Duration: 30 minutes"

[Confirm & Schedule] Button (Primary)
[Back to Step 1] Link (Tertiary)
```

**Integration Recommendation:**
- Use **Cal.com** or **Calendly Pro** (integrates with Zoom, sends automated emails, sync to advisor calendar)
- Embed directly in modal (no redirect to external site if possible)
- Display only available slots (coordinator manages availability in backend)

---

#### Step 4: Confirmation Page

```
Layout: Centered, full-screen celebration
Background: Cream Ivory
Animation: Icon fades in, text staggered below

┌─────────────────────────────────────────────────┐
│                                                  │
│              ✓ All Set!                         │
│                                                  │
│ Your exploration call is confirmed.             │
│                                                  │
│ Details:                                        │
│ Date: Thursday, June 12, 2025                  │
│ Time: 10:00 AM SAST                            │
│ Advisor: Margaret Williams                      │
│ Duration: 30 minutes (Zoom)                     │
│                                                  │
│ "A confirmation email has been sent to         │
│ [user@email.com]. You'll receive a Zoom        │
│ link 24 hours before the call. In the         │
│ meantime, feel free to explore our            │
│ resources or review our service menu."         │
│                                                  │
│ [Add to Calendar] [Dismiss] [Back to Home]   │
│                                                  │
│                                                  │
│ Next Steps (Optional Info Panel):              │
│                                                  │
│ • Before your call, consider reviewing:        │
│   - Your net worth and asset breakdown         │
│   - Current insurance/estate planning docs     │
│   - Retirement savings account info            │
│                                                  │
│ • Not ready? Download our guide:               │
│   [→ "Estate Planning Checklist" PDF]         │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Email Follow-Up (Transactional Email):**
```
Subject: "Your Exploration Call Is Confirmed — Margaret Williams"

Body:
Hi [First Name],

Thank you for scheduling your exploration call with Family Wealth Custodians. We're excited to discuss your family's wealth management goals.

**Call Details:**
Date: Thursday, June 12, 2025
Time: 10:00 AM SAST
Duration: 30 minutes
Advisor: Margaret Williams
Platform: Zoom (link will be sent 24 hours before)

**What to Expect:**
This is an informal conversation designed to understand your situation and goals. Bring any questions—there's no sales pitch, only genuine advice.

**Preparation Tip:**
If you'd like to make the most of our time, jot down:
- Your primary wealth concern
- Key family circumstances (e.g., multi-generational planning)
- Any existing advisory relationships

Looking forward to meeting you.

Warm regards,
The Family Wealth Custodians Team

P.S. Not sure what to prepare? Download our free "Estate Planning Checklist" →
```

---

### 3.4 Secondary UX Flows

#### Blog / Insights Page

```
Purpose: Establish thought leadership, improve SEO, nurture prospects

Layout: Hero + grid of article cards

Hero:
Title: "Insights & Resources"
Subheading: "Market perspectives, planning strategies, and wealth insights 
tailored for South African families."

Filters: [All] [Tax Planning] [Retirement] [Estate Planning] [Investing]
Search: [Search articles...]

Article Card:
┌──────────────────────────────────┐
│ [Thumbnail Image]                │
│ Category Badge: "Tax Planning"   │
│                                  │
│ Article Title (Playfair 24px)   │
│                                  │
│ Excerpt (Inter 400 16px)         │
│                                  │
│ By [Author Name]                │
│ June 9, 2025 · 8 min read       │
│                                  │
│ [Read Article →] (tertiary link)│
└──────────────────────────────────┘

On Click: Navigate to /insights/[article-slug]
  - Full article layout (single column, max-width 800px)
  - Related articles sidebar
  - CTA at bottom: "Ready to discuss your strategy? Book a call."
```

#### Services Detail Pages

```
Example: /services/estate-planning

Hero:
Title: "Estate Planning"
Subheading: "Structured succession plans that honor your legacy."
Background Image: Sophisticated home / family assets

Sections:
1. The Challenge
   "Many families leave their estates to chance, resulting in..."
   
2. Our Approach
   - Cards or timeline showing estate planning steps
   - Who's involved (attorneys, accountants, advisors)
   
3. Key Benefits
   - Staggered list: minimize taxes, preserve assets, family harmony, etc.
   
4. How It Works
   - Timeline: Step 1 (Assessment) → Step 2 (Strategy) → Step 3 (Implementation) → Step 4 (Monitoring)
   
5. Testimonials (relevant to estate planning)

6. Next Steps CTA
   "Ready to secure your family's legacy?"
   [Book an Exploration Call]
   [Download: Estate Planning Checklist]
```

---

## SECTION 4: TECHNICAL IMPLEMENTATION & TAILWIND CSS GUIDANCE

### 4.1 Tailwind CSS Configuration

**Color Palette Integration into `tailwind.config.js`:**

```javascript
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Heritage Collection
        "heritage-navy": "#1A2332",
        "slate-charcoal": "#2D3E4F",
        "cream-ivory": "#F9F8F5",
        "off-white-linen": "#EFEBE6",
        
        // Accents
        "muted-gold": "#A89968",
        "soft-sage": "#8B9A7D",
        "champagne-beige": "#D4C4B8",
        "slate-blue": "#5A7A8A",
        
        // Grays
        "hierarchy-1": "#1A1A1A",
        "hierarchy-2": "#666666",
        "hierarchy-3": "#B0B0B0",
        "hierarchy-4": "#E0DCD7",
        "hierarchy-5": "#F5F3F0",
      },
      fontFamily: {
        // Headings
        playfair: ["Playfair Display", "Georgia", "serif"],
        // Body
        inter: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        // Display
        "display": ["56px", { lineHeight: "1.2", letterSpacing: "-0.5px" }],
        // H1
        "h1": ["48px", { lineHeight: "1.15" }],
        // H2
        "h2": ["36px", { lineHeight: "1.2" }],
        // H3
        "h3": ["24px", { lineHeight: "1.3" }],
        // Body Large
        "body-lg": ["18px", { lineHeight: "1.6" }],
        // Body Regular
        "body": ["16px", { lineHeight: "1.6" }],
        // Body Small
        "body-sm": ["14px", { lineHeight: "1.5" }],
        // Caption
        "caption": ["12px", { lineHeight: "1.4" }],
      },
      boxShadow: {
        "elevation-1": "0 2px 6px rgba(26, 35, 50, 0.05)",
        "elevation-2": "0 4px 12px rgba(26, 35, 50, 0.08)",
        "elevation-3": "0 8px 24px rgba(26, 35, 50, 0.12)",
      },
      spacing: {
        // Use default Tailwind 4px spacing
        // Key sections: 48px (common margin), 32px (padding), 80px (section gap)
      },
    },
  },
  plugins: [
    // Optional: custom utilities
    require("@tailwindcss/forms"), // For better form styling
  ],
};
```

---

### 4.2 Component Examples with Tailwind Classes

#### Primary Button

```jsx
// Button.jsx
export const PrimaryButton = ({ children, ...props }) => (
  <motion.button
    className="px-8 py-4 bg-heritage-navy text-cream-ivory font-inter font-semibold rounded text-base
               shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200"
    whileHover={{ backgroundColor: "#2D3E4F" }}
    whileTap={{ boxShadow: "0 1px 4px rgba(26, 35, 50, 0.2)" }}
    {...props}
  >
    {children}
  </motion.button>
);
```

#### Card Component

```jsx
// Card.jsx
export const Card = ({ children, className = "" }) => (
  <motion.div
    className={`bg-off-white-linen border border-champagne-beige rounded-md p-8 
                 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 
                 ${className}`}
    whileHover={{ y: -8 }}
  >
    {children}
  </motion.div>
);

// Usage:
<Card>
  <div className="flex items-start gap-5 mb-5">
    <Icon className="w-16 h-16 text-muted-gold flex-shrink-0" />
  </div>
  <h3 className="text-h3 text-heritage-navy font-playfair font-semibold mb-3">
    Estate Planning
  </h3>
  <p className="text-body text-hierarchy-1 mb-4">
    Structured succession plans that preserve your family's legacy and minimize taxes.
  </p>
  <Link href="/services/estate-planning" className="text-slate-blue font-inter font-semibold hover:text-heritage-navy transition-colors">
    Learn More →
  </Link>
</Card>
```

#### Form Input

```jsx
// FormInput.jsx
import { motion } from "framer-motion";

export const FormInput = ({ label, error, ...props }) => (
  <motion.div className="mb-6">
    {label && (
      <label className="block text-hierarchy-1 font-inter font-medium text-body-sm mb-2">
        {label}
        {props.required && <span className="text-muted-gold">*</span>}
      </label>
    )}
    <motion.input
      className={`w-full px-4 py-3 bg-white border-2 border-hierarchy-4 rounded text-base font-inter
                   focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10
                   transition-all duration-200 placeholder-hierarchy-3 placeholder-italic
                   ${error ? "border-red-500 ring-4 ring-red-500/10" : ""}`}
      initial={{ boxShadow: "0 0 0 0 rgba(90, 122, 138, 0)" }}
      whileFocus={{ boxShadow: "0 0 0 3px rgba(90, 122, 138, 0.1)" }}
      {...props}
    />
    {error && (
      <motion.p
        className="mt-2 text-red-600 text-body-sm"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);
```

#### Navigation Bar

```jsx
// Navigation.jsx
import { motion } from "framer-motion";

export const Navigation = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-heritage-navy z-50 shadow-elevation-2">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo className="h-10 text-cream-ivory" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {["About", "Services", "Insights", "Team", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="px-4 py-2 text-cream-ivory font-inter font-medium rounded text-base
                           hover:bg-white/10 transition-colors duration-150 border-b-2 border-transparent"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-4">
            <PrimaryButton className="hidden lg:inline-block">Book a Call</PrimaryButton>
            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden text-cream-ivory"
              whileTap={{ scale: 0.95 }}
            >
              <MenuIcon />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              className="md:hidden bg-heritage-navy border-t border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Mobile nav items */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
```

#### Hero Section

```jsx
// HeroSection.jsx
import { motion } from "framer-motion";

export const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "cubic-bezier(0.645, 0.045, 0.355, 1)" },
    },
  };

  return (
    <section className="min-h-screen bg-cream-ivory flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        <motion.div
          className="lg:col-span-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-display font-playfair font-bold text-heritage-navy mb-6">
            Generational Wealth, Personal Care
          </motion.h1>

          <motion.p variants={itemVariants} className="text-body-lg text-hierarchy-1 mb-8 max-w-lg">
            Expert estate planning, retirement strategies, and wealth preservation for families across South Africa.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <PrimaryButton>Book Your Exploration Call</PrimaryButton>
            <SecondaryButton>Learn More</SecondaryButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <img
            src="/hero-family.jpg"
            alt="Multi-generational family"
            className="rounded-md shadow-elevation-3 w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};
```

---

### 4.3 Layout Patterns

#### Full-Width Hero Section with Overlay

```jsx
<section className="relative h-screen bg-cream-ivory overflow-hidden">
  {/* Background image with subtle overlay */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-10"
    style={{ backgroundImage: "url(/background.jpg)" }}
  />
  
  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
    <div className="space-y-8">
      <h1 className="text-display text-heritage-navy font-playfair">
        Headline Here
      </h1>
      <p className="text-body-lg text-hierarchy-1 max-w-2xl">
        Subheadline / descriptive text
      </p>
      <PrimaryButton>Call to Action</PrimaryButton>
    </div>
  </div>
</section>
```

#### Three-Column Card Grid

```jsx
<section className="bg-cream-ivory py-20 px-6 lg:px-12">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-h2 font-playfair text-heritage-navy mb-4 text-center">
      Section Title
    </h2>
    <p className="text-body text-hierarchy-1 text-center max-w-2xl mx-auto mb-16">
      Descriptive subtext
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card>
            {/* Card content */}
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

#### Alternating Text + Image Sections

```jsx
{sections.map((section, i) => (
  <section
    key={i}
    className={`py-20 px-6 lg:px-12 ${i % 2 === 0 ? "bg-cream-ivory" : "bg-off-white-linen"}`}
  >
    <div className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
      i % 2 === 1 ? "lg:grid-cols-2 lg:[&>*:nth-child(1)]:order-2" : ""
    }`}>
      <div>
        <h2 className="text-h2 font-playfair text-heritage-navy mb-6">
          {section.title}
        </h2>
        <p className="text-body-lg text-hierarchy-1 mb-8 leading-relaxed">
          {section.description}
        </p>
        <TertiaryButton href={section.link}>Learn More →</TertiaryButton>
      </div>
      <img
        src={section.image}
        alt={section.title}
        className="rounded-md shadow-elevation-2 h-auto"
      />
    </div>
  </section>
))}
```

---

### 4.4 Page Structure Template

```jsx
// app/page.jsx (Homepage example)
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustAnchors } from "@/components/sections/TrustAnchors";
import { Challenges } from "@/components/sections/Challenges";
import { Solutions } from "@/components/sections/Solutions";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Family Wealth Custodians - Wealth Management & Estate Planning",
  description: "Expert retirement planning, estate management, and wealth preservation for South African families.",
};

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <TrustAnchors />
        <Challenges />
        <Solutions />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
```

---

### 4.5 Responsive Design Strategy

**Mobile-First Breakpoints:**

```javascript
// tailwind.config.js breakpoints
breakpoints: {
  sm: "640px",   // Tablet
  md: "768px",   // Tablet (larger)
  lg: "1024px",  // Desktop
  xl: "1280px",  // Desktop (larger)
  "2xl": "1536px", // Ultra-wide
}
```

**Mobile Typography Scaling:**

```jsx
// Instead of duplicating in JSX, use Tailwind responsive prefixes
<h1 className="text-4xl sm:text-5xl lg:text-6xl">
  Responsive Heading
</h1>

// Or use custom config:
fontSize: {
  "h2": ["24px", { "@screen sm": "28px", "@screen lg": "36px" }],
}
```

**Mobile Navigation:**
- Stack all nav items vertically on mobile
- Use slide-in menu from left (not hamburger dropdown)
- CTA button visible but smaller on mobile
- Padding: 16px mobile, 24px tablet, 48px desktop

---

### 4.6 Performance & Accessibility Guidelines

**Image Optimization:**

```jsx
import Image from "next/image";

<Image
  src="/hero-family.jpg"
  alt="Multi-generational family planning wealth legacy"
  width={600}
  height={400}
  priority // For hero images
  quality={85}
  className="rounded-md"
/>
```

**Accessibility Checklist:**
- [ ] All images have descriptive alt text
- [ ] Color contrast ratios ≥ 4.5:1 (WCAG AA)
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Focus states visible on all interactive elements
- [ ] Form labels properly associated (`<label htmlFor="input-id">`)
- [ ] Semantic HTML: `<nav>`, `<section>`, `<article>`, `<footer>`
- [ ] Animations respect `prefers-reduced-motion`

```jsx
// Respect motion preferences
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
>
```

**Core Web Vitals Targets:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Use Next.js Image component, lazy loading, and dynamic imports

---

## SECTION 5: QUICK-START IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
1. **Design System Setup**
   - [ ] Create `tailwind.config.js` with color + typography extensions
   - [ ] Build reusable component library: Button, Card, Input, Navigation
   - [ ] Establish Framer Motion animation presets

2. **Page Scaffolding**
   - [ ] Create Next.js app structure
   - [ ] Set up layout.jsx with Navigation + Footer
   - [ ] Create `/app` directory structure

### Phase 2: Core Pages (Week 3-4)
1. **Homepage**
   - [ ] Hero Section
   - [ ] Trust Anchors
   - [ ] Challenges Section
   - [ ] Solutions Section
   - [ ] Testimonials
   - [ ] Final CTA

2. **Services Pages**
   - [ ] /services (overview)
   - [ ] /services/[service] (detail pages)

### Phase 3: Conversion (Week 5)
1. **Booking Flow**
   - [ ] /book-call page + modal
   - [ ] Form validation
   - [ ] Calendar integration (Cal.com / Calendly)
   - [ ] Confirmation page + email

### Phase 4: Polish (Week 6)
1. **SEO & Performance**
   - [ ] Add meta tags, Open Graph
   - [ ] Optimize images
   - [ ] Set up Google Analytics
2. **QA & Launch**
   - [ ] Cross-browser testing
   - [ ] Mobile responsiveness testing
   - [ ] Accessibility audit

---

## SECTION 6: BRAND VOICE & COPYWRITING GUIDELINES

### Tone Pillars

| Pillar | Description | Example |
|--------|-------------|---------|
| **Professional** | Expert, credible, authoritative | "Our advisors specialize in..." not "We're super good at..." |
| **Empathetic** | Understands family complexity | "We know wealth planning can feel overwhelming..." |
| **Accessible** | Clear without dumbing down | Explain concepts plainly; avoid jargon |
| **Warm** | Personal, not corporate stiff | "Let's discuss your family's vision" not "Submit your requirements" |

### Copywriting Rules

✅ **DO:**
- Use active voice: "We create wealth strategies" not "Strategies are created"
- Focus on outcomes: "Minimize taxes while growing generational wealth"
- Use specifics: "30-minute exploration call" not "quick chat"
- Address emotions: "Peace of mind," "family harmony," "legacy"

❌ **DON'T:**
- Use jargon: Avoid "portfolio optimization," "fiduciary duty" unless essential (then explain)
- Make promises: No "guaranteed returns" or unrealistic claims
- Be salesy: No urgency language, no "limited time"
- Use superlatives: No "best," "world-class," "unbeatable"

### Sample Microcopy

```
Button Labels:
"Book Your Exploration Call" (not "Get Started" or "Contact Us")
"Learn More About Estate Planning"
"Download Our Free Guide"

Form Placeholders:
"e.g., Secure my family's legacy for three generations"
"e.g., March 2026"

Error Messages:
"Please enter a valid email address so we can follow up with your confirmation."
(not just "Invalid email")

Success Messages:
"Perfect! We'll send you a confirmation link within 1 hour."
(not just "Submitted")

Microcopy above CTA:
"No obligation. This is a complimentary, confidential conversation."
```

---

## FINAL CHECKLIST: BEFORE LAUNCH

- [ ] **Color Palette:** All Tailwind classes mapped, no pure blacks or neons
- [ ] **Typography:** Playfair for headings only, Inter for body, proper sizing hierarchy
- [ ] **Buttons:** Primary, Secondary, Tertiary styles implemented; all hover/focus states
- [ ] **Forms:** Input, select, checkbox styles; proper focus rings; error states
- [ ] **Cards:** Feature cards, testimonials, service cards with correct spacing/shadows
- [ ] **Navigation:** Responsive, logo visible, nav links highlighted, mobile menu
- [ ] **Animations:** Page transitions, scroll reveals, button hovers all smooth and purposeful
- [ ] **Booking Flow:** Form validation, calendar integration, confirmation email
- [ ] **Mobile Responsiveness:** Tested on iPhone, iPad, Android phones
- [ ] **Accessibility:** WCAG AA contrast, keyboard nav, alt text, semantic HTML
- [ ] **Performance:** Images optimized, LCP < 2.5s, no layout shift
- [ ] **Copywriting:** Tone consistent, no jargon, warm + professional
- [ ] **Social Proof:** Testimonials genuine, credentials visible, trust signals clear
- [ ] **Analytics:** Google Analytics, event tracking on CTA clicks, form submissions

---

## CONCLUSION

This design system transforms your brand from "modern tech" to "established wealth advisor." Every color, font, animation, and interaction has been chosen to communicate trust, stability, and professionalism.

The key differentiator: **subtlety**. No neon, no bounce, no ego. Just clean, elegant design that makes high-net-worth individuals feel understood and confident.

**Next Step:** Hand this document to your development team, start building components, and launch an exploration call booking flow. This is your conversion engine—everything else is context.

Good luck with Family Wealth Custodians. 🌟

