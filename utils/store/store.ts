import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import type { ColorScheme, DefaultMantineColor } from "@mantine/core";
import { ColumnFiltersState, ColumnFilter } from "@tanstack/react-table";

interface GuildVT {
  value: string;
  label: string;
  role: string;
  id: string;
  name: string;
  server: string;
  image: string | null;
  adminId: string;
}

interface navBarState {
  isNavBarOpen: boolean;
  setNavBar: (open: boolean) => void;
  toggleNavBar: () => void;
}

export const useNavBarStore = create<navBarState>((set) => ({
  isNavBarOpen: true,
  setNavBar: (open: boolean) => set({ isNavBarOpen: open }),
  toggleNavBar: () => set((state: any) => ({ isNavBarOpen: !state.isNavBarOpen })),
}));

// interface autoCompleteState {
//   autoCompleteData: any;
//   setAutoCompleteData: (data: any) => void;
// }

// export const useAutoCompleteDataStore = create<autoCompleteState>((set) => ({
//   autoCompleteData: [],
//   setAutoCompleteData: (data: any) => set({ autoCompleteData: data }),
// }));

interface guildState {
  currentGuildID: string | null;
  currentGuildName: string | null;
  availableGuilds: GuildVT[];
  roleinCurrentGuild: "admin" | "officer" | "member" | string | null;
  setCurrentGuildID: (guild: string | null) => void;
  setCurrentGuildName: (guildName: string | null) => void;
  setAvailableGuilds: (guilds: GuildVT[]) => void;
}

export const useGuildStore = create<guildState>((set, get) => ({
  currentGuildID: null,
  currentGuildName: null,
  roleinCurrentGuild: null,
  setCurrentGuildID: (guild: string | null) => set({ currentGuildID: guild }),
  setCurrentGuildName: (guildName: string | null) => set({ currentGuildName: guildName }),
  setAvailableGuilds: (guilds: GuildVT[]) => set({ availableGuilds: guilds }),
  availableGuilds: [],
}));

useGuildStore.subscribe((state) => {
  state.roleinCurrentGuild =
    state.availableGuilds.find((guild) => guild.id === state.currentGuildID)?.role || null;
});

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

interface themeStoreState {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
  primaryColor: DefaultMantineColor;
  setPrimaryColor: (color: DefaultMantineColor) => void;
}

export const useThemeStore = create<themeStoreState>((set) => ({
  colorScheme: "dark",
  setColorScheme: (scheme: ColorScheme) => set({ colorScheme: scheme }),
  toggleColorScheme: () => set((state: any) => ({ colorScheme: state.colorScheme === "dark" ? "light" : "dark" })),
  primaryColor: "red",
  setPrimaryColor: (color: DefaultMantineColor) => set({ primaryColor: color }),
}));

interface numTablesState {
  numTables: number;
  incrementNumTables: () => void;
  decrementNumTables: () => void;
}

export const useNumTablesStore = create<numTablesState>((set) => ({
  numTables: 1,
  incrementNumTables: () => set((state: any) => ({ numTables: state.numTables + 1 })),
  decrementNumTables: () => set((state: any) => ({ numTables: state.numTables - 1 })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("GuildStore", useGuildStore);
  mountStoreDevtool("NumTables", useNumTablesStore);
}
