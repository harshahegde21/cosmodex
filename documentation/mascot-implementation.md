# Mascot Implementation Guide

This document provides a guide for developers on how to use and interact with the `Mascot` component and its global state using the `useMascotStore` hook.

## Overview

The Mascot is a dynamic, draggable, and animated character implemented in `src/features/mascot/Mascot.tsx`. It features eye-tracking, blink animations, and a teleportation effect when changing positions. Its state (the chat bubble message and its current viewport position) is managed globally via Zustand in `src/hooks/useMascotStore.ts`.

---

## 1. The Global Store (`useMascotStore.ts`)

The store uses `zustand` to provide a simple API for triggering mascot actions from anywhere in the application.

### State Properties

- `message` (`string | null`): The text currently displayed in the Mascot's chat bubble. Set to `null` or an empty string to hide the chat bubble.
- `position` (`MascotPosition`): The target location of the Mascot on the screen.
  - Allowed values in type definition: `'bottom-right' | 'center' | 'top-left'`
  - *(Note: The component's internal layout variants use `'bottom-right'`, `'center'`, and `'offset-right'`.)*

### Actions

- `setMessage(msg: string | null)`: Updates the text in the Mascot's chat bubble.
- `setPosition(pos: MascotPosition)`: Triggers a "teleport" animation, moving the Mascot to the new layout position.

### Usage Example

```tsx
import { useMascotStore } from "@/hooks/useMascotStore";

export function SomeFeatureComponent() {
  const { setMessage, setPosition } = useMascotStore();

  const handleAction = () => {
    setMessage("Great job! You clicked the button.");
    setPosition("center");
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage(null);
      setPosition("bottom-right");
    }, 3000);
  };

  return <button onClick={handleAction}>Click Me</button>;
}
```

---

## 2. The Mascot Component (`Mascot.tsx`)

The `<Mascot />` component should ideally be mounted high up in the component tree (e.g., in your root layout) so it persists across pages and routes. It is fixed to the viewport and sits at a high `z-index` (`z-[9999]`).

### Key Features

1. **Teleportation Animation**:
   Whenever the `position` changes in the Zustand store, a `useEffect` hook triggers a sequence using Framer Motion's `useAnimation`. The Mascot will:
   - Shrink and fade out (Zap Out)
   - Instantly snap to the target layout coordinates
   - Pop back up with a spring effect (Zap In)

2. **Eye Tracking**:
   The Mascot calculates the angle between its center and the user's mouse cursor (`mousemove` event listener). It offsets the pupils (using `leftEyeRef` and `rightEyeRef`) to follow the cursor up to a maximum radius (`maxRadius = 6`).

3. **Idle Snapping**:
   If the mouse hasn't moved for 2 seconds, an idle timer triggers, gracefully easing the pupils back to their default, centered positions.

4. **Draggable**:
   The component utilizes `<motion.div drag />`. Users can manually drag the mascot around the screen. Changing the `position` via the store will reset the mascot's coordinates and override the manual drag offset.

5. **Chat Bubble**:
   A styled dark-theme chat bubble appears when the `message` state is truthy. It features smooth entry and exit transitions (`opacity` and `translate-y`).

### Best Practices

- **Avoid frequent rapid position updates:** Teleportation has a distinct animation. Firing `setPosition` rapidly may cause animation stuttering or overlapping transitions.
- **Position Mismatch Warning:** Currently, the store type allows `'top-left'`, but the `Mascot.tsx` layout variants handle `"bottom-right"`, `"center"`, and `"offset-right"`. Ensure you pass layout names that the component recognizes, or update the component's `layoutVariants` map to align with the type definition.
- **Z-Index:** Ensure no overlay (like a modal backdrop) exceeds `z-[9999]` unless you explicitly want the Mascot hidden behind it.
