# CosmoDex Developer Code of Conduct & Architecture Guidelines

## 1. Introduction and Purpose

This document serves as the authoritative standard for all development work within the CosmoDex project. To maintain a highly scalable, maintainable, and cohesive Next.js codebase, all developers across both the Frontend and Backend teams must adhere strictly to the rules outlined below. Pull Requests (PRs) that violate these standards will not be merged.

We operate on a **Feature-Driven Development (Vertical Slicing)** model. Developers are responsible for complete vertical slices of functionality rather than isolated horizontal layers.

---

## 2. The Feature Pipeline (Pre-Development Rules)

Before writing any code for a newly assigned feature, developers must complete the following pipeline and obtain approval from the Technical Lead.

1. **Define the Data Schema:** Outline the necessary Supabase Postgres tables and columns required for the feature. **This requires explicit approval from the Backend Lead.**
2. **Define the Interface:** Establish the exact TypeScript types for the data passed between the backend logic and the frontend components.
3. **The Logic Handoff:** Backend developers will build the core logic and a completely unstyled, functional ("ugly") UI component to prove data flow.
4. **The UI Skinning:** Frontend developers will take ownership of the functional component and apply the designated 2.5D Sci-Fi/Fantasy design system using Tailwind CSS and Framer Motion.

---

## 3. STRICT MANDATE: Server Actions over API Routes

To leverage the full capabilities of the Next.js App Router and minimize network overhead, the use of internal API routes (`/app/api/...`) is heavily restricted.

- **Rule:** You **MUST** use Next.js Server Actions for all internal database reads, writes, and mutations (e.g., interacting with Supabase or Upstash Redis).
- **Exception:** API routes (`/api/...`) are strictly reserved for external system integrations (e.g., Judge0 callbacks, external webhooks, or third-party service authentications).

### Example: Proper Server Action Usage

**DO NOT** create `app/api/users/update/route.ts`.

**DO** create a Server Action in `features/user/actions/update-user.ts`:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserProfile(userId: string, data: UserProfile) {
  const supabase = createClient()
  const { error } = await supabase.from('user_profiles').update(data).eq('id', userId)

  if (error) throw new Error('Failed to update profile')

  revalidatePath('/profile')
}
```

---

## 4. Naming Conventions

Consistency in nomenclature is non-negotiable. Adhere to the following casing rules across the entire codebase.

| Asset Type | Casing Rule | Example |
| --- | --- | --- |
| **Folders / Directories** | `kebab-case` | `/features/battle-arena`, `/components/ui` |
| **React Components** | `PascalCase` | `HealthBar.tsx`, `CodeEditor.tsx` |
| **TypeScript Types/Interfaces** | `PascalCase` | `UserProfile`, `MatchState` |
| **Functions / Hooks / Actions** | `camelCase` | `calculateScore()`, `useTimer()`, `updateUser()` |
| **Database Tables / Columns** | `snake_case` | `user_profiles`, `match_history`, `is_active` |
| **Constants (Global)** | `UPPER_SNAKE_CASE` | `MAX_MATCH_DURATION = 600` |

---

## 5. Folder Structure (Feature-Based Architecture)

Do not group files by their technical type (e.g., placing all hooks in a global `/hooks` folder). Group files by the **feature** they belong to.

```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, & External APIs ONLY)
│   ├── (auth)/login/page.tsx
│   ├── api/judge0-webhook/route.ts   <-- External webhook only
│   └── arena/[id]/page.tsx
├── components/           # Global, reusable UI components (Buttons, Modals)
│   ├── ui/Button.tsx
│   └── ui/Modal.tsx
├── features/             # The core of your vertical slices
│   ├── auth/
│   │   ├── actions/login.ts          <-- Server actions live here
│   │   ├── components/LoginForm.tsx
│   │   └── types.ts
│   └── battle-arena/
│       ├── actions/save-draft.ts
│       ├── components/Timer.tsx
│       └── utils/score-calculator.ts
└── lib/                  # Third-party configurations
    ├── supabase/
    └── upstash/
```

---

## 6. Component Architecture (Logic vs. Presentation)

Backend logic and frontend presentation must remain decoupled.

- **Logic Abstraction:** Components should not contain raw database queries or complex state management directly within the render block.
- **Implementation:** Backend developers must abstract logic into Server Actions or Custom Hooks.
- **Handoff:** When Frontend developers receive a functional component, they must preserve the hooks and Server Action calls exactly as provided, wrapping only the output in the necessary design components.

**By following these guidelines, we ensure CosmoDex remains robust, scalable, and a pleasure to build.**