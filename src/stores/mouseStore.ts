import { create } from 'zustand';

interface MouseState {
  x: number;
  y: number;
  set: (x: number, y: number) => void;
}

export const useMouseStore = create<MouseState>((set) => ({
  x: 0.5,
  y: 0.5,
  set: (x, y) => set({ x, y }),
}));
