## Prompt

Build a mobile-first web app for an AI-based rural edtech platform.

### Tech Stack (keep it lightweight and fast)

- **Next.js 14 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **ShadCN UI (minimal components only if needed)**
- No backend yet
- No database yet
- No API integrations yet
- Static pages only
- Optimized for low bandwidth and low-end mobile devices

---

## Product Overview (Current Scope Only)

This is an AI-based multilingual, multigrade teaching assistant for rural teachers.

For now:

- We are ONLY building the UI shell.
- No module functionality.
- No AI calls.
- No authentication.
- No database.
- Just navigation and structure.

---

## Core Requirements

### 1️⃣ Mobile First Design

- Design primarily for small screen devices (360px–430px width).
- Clean, large touch-friendly buttons.
- Minimal design.
- Low cognitive load.
- High contrast UI.
- Optimized for rural usage (simple fonts, minimal heavy animations).
- Avoid heavy images.
- Fast loading.
- keep in mind interactions that are mobile first. 

---

### 2️⃣ Home Screen Layout

The home page should contain:

- App Name at top (temporary name: **"ABCD AI"**)
- Short tagline:
“AI Teaching Assistant for Multigrade Classrooms”

Then 5 large buttons:

1. Worksheet Module
2. Content Module
3. Games Module
4. Planner Module
5. Audio Module

Each button:

- Full width
- Rounded corners
- Soft shadow
- Simple icon (lightweight)
- Touchable area large enough
- Clean spacing between buttons

---

### 3️⃣ Routing

Each module should have its own route:

- `/worksheet`
- `/content`
- `/games`
- `/planner`
- `/audio`

Each page should contain:

- Module title
- Short 1-line description
- “Coming Soon” message
- Back to Home button

No other functionality required.

---

### 4️⃣ Future-Proof Structure

Create a scalable folder structure because we will add:

- More tools in future
- AI integrations later
- Database later
- Save/History system later

So structure cleanly like:

```
/app
  /worksheet
  /content
  /games
  /planner
  /audio
/components
```

Keep components modular.

---

### 5️⃣ Design System Basics

- Use Tailwind utility classes
- Use a soft neutral color palette
- Avoid overly modern glossy UI
- Keep it practical and trustworthy
- Use system font stack for performance
- Ensure good spacing and readability

---

### 6️⃣ Code Quality

- Use reusable Button component
- Use layout file properly
- Keep code clean and minimal
- Avoid unnecessary packages
- Keep build lightweight

---

## Important

Do NOT implement:

- AI logic
- Form inputs
- Module logic
- Database
- Authentication

This is only the UI skeleton for Phase 1.

---

When done, ensure:

- Project runs with `npm run dev`
- No TypeScript errors
- No Linting Errros
- Clean mobile UI
- Fast loading

