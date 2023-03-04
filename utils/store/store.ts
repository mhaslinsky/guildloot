import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { Guild } from "@prisma/client";

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
  currentGuildID: string | null;
  currentGuildName: string | null;
  availableGuilds: Guild[];
  pageSpecificAvailableGuilds: Guild[];
  setCurrentGuildID: (guild: string | null) => void;
  setCurrentGuildName: (guildName: string | null) => void;
  setAvailableGuilds: (guilds: Guild[]) => void;
  setPageSpecificAvailableGuilds: (guilds: Guild[]) => void;
}

export const useGuildStore = create<guildState>((set) => ({
  currentGuildID: null,
  currentGuildName: null,
  availableGuilds: [],
  pageSpecificAvailableGuilds: [],
  setCurrentGuildID: (guild: string | null) => set({ currentGuildID: guild }),
  setCurrentGuildName: (guildName: string | null) => set({ currentGuildName: guildName }),
  setAvailableGuilds: (guilds: Guild[]) => set({ availableGuilds: guilds }),
  setPageSpecificAvailableGuilds: (guilds: Guild[]) => set({ pageSpecificAvailableGuilds: guilds }),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("GuildStore", useGuildStore);
  mountStoreDevtool("AutoComplete", useAutoCompleteDataStore);
}

interface guildModalStoreState {
  createGuildModalOpen: boolean;
  setCreateGuildModalOpen: (open: boolean) => void;
  toggleCreateGuildModal: () => void;
}

export const guildModalStore = create<guildModalStoreState>((set) => ({
  createGuildModalOpen: false,
  setCreateGuildModalOpen: (open: boolean) => set({ createGuildModalOpen: open }),
  toggleCreateGuildModal: () => set((state: any) => ({ createGuildModalOpen: !state.createGuildModalOpen })),
}));
