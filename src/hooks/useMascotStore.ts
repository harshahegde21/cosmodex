import { create } from 'zustand';

type MascotPosition = 'bottom-right' | 'center' | 'top-left';

interface MascotState {
  message: string | null;
  position: MascotPosition;
  setMessage: (msg: string | null) => void;
  setPosition: (pos: MascotPosition) => void;
}

export const useMascotStore = create<MascotState>((set) => ({
  message: null,
  position: 'bottom-right', // Default position
  setMessage: (msg) => set({ message: msg }),
  setPosition: (pos) => set({ position: pos }),
}));