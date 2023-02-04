import { create } from "zustand";

interface navBarState {
  isNavBarOpen: boolean;
  toggleNavBar: () => void;
}

export const useNavBarStore = create<navBarState>((set) => ({
  isNavBarOpen: true,
  toggleNavBar: () => set((state: any) => ({ isNavBarOpen: !state.isNavBarOpen })),
}));

interface globalFilterState {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
}

export const useGlobalFilterStore = create<globalFilterState>((set) => ({
  globalFilter: "",
  setGlobalFilter: (filter: string) => set({ globalFilter: filter }),
}));

interface autoCompleteState {
  autoCompleteData: any;
  setAutoCompleteData: (data: any) => void;
}

export const useAutoCompleteDataStore = create<autoCompleteState>((set) => ({
  autoCompleteData: [],
  setAutoCompleteData: (data: any) => set({ autoCompleteData: data }),
}));

interface currentGuildState {
  currentGuild: string | null;
  setCurrentGuild: (guild: string | null) => void;
}

export const useCurrentGuildStore = create<currentGuildState>((set) => ({
  currentGuild: null,
  setCurrentGuild: (guild: string | null) => set({ currentGuild: guild }),
}));
