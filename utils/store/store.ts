import { create } from "zustand";

interface navBarState {
  isNavBarOpen: boolean;
  toggleNavBar: () => void;
}

export const useNavBarStore = create<navBarState>((set) => ({
  isNavBarOpen: true,
  toggleNavBar: () => set((state: any) => ({ isNavBarOpen: !state.isNavBarOpen })),
}));
