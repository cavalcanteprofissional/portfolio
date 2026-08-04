import { create } from 'zustand';

interface BootStore {
  booted: boolean;
  setBooted: (booted: boolean) => void;
}

export const useBootStore = create<BootStore>((set) => ({
  booted: sessionStorage.getItem('booted') === 'true',
  setBooted: (booted) => set({ booted }),
}));
