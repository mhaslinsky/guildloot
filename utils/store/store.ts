import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

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

interface guildState {
  currentGuild: string | null;
  availableGuilds: string[];
  setCurrentGuild: (guild: string | null) => void;
  setAvailableGuilds: (guilds: string[]) => void;
}

export const useGuildStore = create<guildState>((set) => ({
  currentGuild: null,
  availableGuilds: [],
  setCurrentGuild: (guild: string | null) => set({ currentGuild: guild }),
  setAvailableGuilds: (guilds: string[]) => set({ availableGuilds: guilds }),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("GuildStore", useGuildStore);
  mountStoreDevtool("AutoComplete", useAutoCompleteDataStore);
}
