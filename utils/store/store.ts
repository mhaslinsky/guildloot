import { create } from "zustand";

interface navBarState {
  isNavBarOpen: boolean;
  toggleNavBar: () => void;
}

interface globalFilterState {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
}

export const useNavBarStore = create<navBarState>((set) => ({
  isNavBarOpen: true,
  toggleNavBar: () => set((state: any) => ({ isNavBarOpen: !state.isNavBarOpen })),
}));

export const useGlobalFilterStore = create<globalFilterState>((set) => ({
  globalFilter: "",
  setGlobalFilter: (filter: string) => set({ globalFilter: filter }),
}));
