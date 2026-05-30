# CosmoDex Frontend Auth Guide

This guide is designed for the Frontend Development team to understand how to implement the UI for the authentication system, adhering strictly to the Code of Conduct (Vertical Slicing, Logic Handoff).

## Overview

The authentication system utilizes Supabase for identity management and Prisma for syncing to our own database schema. The backend team has already implemented the core logic and provided **"ugly" unstyled functional components**. 

Your job is to take these components and apply the **2.5D Sci-Fi/Fantasy design system** using Tailwind CSS and Framer Motion.

---

## 1. OAuth Implementation (Google & GitHub)

### The Component
File: `src/features/auth/components/OAuthLogin.tsx`

This Client Component is incredibly simple. It exposes buttons that trigger the `handleLogin('provider')` function.
- It uses the Supabase browser client to initiate an OAuth redirect.
- Upon successful login at the provider, the user is redirected to our API route (`/api/auth/callback`) which handles the Prisma synchronization automatically and then redirects to the application.

### UI Skinning Guidelines
- Import `<OAuthLogin />` into your pages where needed.
- Strip away the standard `<button>` tags inside the component and replace them with our custom `<Button>` components from the Sci-Fi UI library.
- Make sure to keep the `onClick={() => handleLogin('google')}` events intact.
- Add micro-animations (Framer Motion) on hover to make the buttons feel alive.

---

## 2. Manual Sign Up Implementation

### The Component
File: `src/features/auth/components/ManualSignupForm.tsx`

This Client Component manages the state for manual registration and features a **Dynamic Visual Card** that updates as the user types.

### State & Logic Flow
The component tracks:
- `email`, `username`, `password`
- `gender`: Used strictly to assign a pre-made avatar upon registration (`male`, `female`, `other`).

When the form submits, it packages these states into a `FormData` object and calls the **Server Action**: `signUpUser(formData)`.

### The Server Action
File: `src/features/auth/actions/manual-auth.ts`
- **What it does:** Calls `supabase.auth.signUp()`, selects a predefined avatar URL (`/avatars/default-[gender].png`), and creates the `users` record in our Prisma database with the `student` role.
- **You do NOT need to modify this file.** Just know it handles the heavy lifting securely.

### UI Skinning Guidelines for the Dynamic Card
- **The Split Layout:** The component is currently split into a Left Side (Dynamic Card) and a Right Side (Signup Form).
- **The Visual Card:** Transform the "ugly" left div into a glossy, glassmorphism "ID Card" or "Holo-Badge" using Framer Motion. 
- As the user types their username and email in the right form, the text in the Holographic Badge should update in real-time.
- **The Avatar Preview:** Depending on the `gender` state, display one of our predefined avatars dynamically. Make sure the transition between avatars is smooth.
- **Form Inputs:** Replace standard HTML inputs with our Sci-Fi themed glowing input fields.

> [!WARNING]
> **Preserve the Functionality:** When styling, do NOT alter the `onSubmit={handleSubmit}` logic or the `value={var}` bindings on the inputs. Your job is purely aesthetic enhancement around the existing React state.

---

## 3. Logout Implementation

### The Component
File: `src/features/auth/components/LogoutButton.tsx`

### Usage
- Simply import `<LogoutButton />` anywhere you need a logout mechanism (e.g., the NavBar or Profile Dropdown).
- It calls `supabase.auth.signOut()` and immediately triggers a `router.refresh()` to update the UI state.
- Skin the button with a subtle "holographic red/warning" style.
