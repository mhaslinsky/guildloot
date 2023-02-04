import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCurrentGuildStore } from "../store/store";
import type { RCLootItem } from "../types";

const fetchLootData = async (guild: string | null) => {
  if (!guild) return Promise.reject("No guild selected");
  const { data } = await axios({ url: "/api/loot", method: "GET", data: { guild } });
  return data as RCLootItem[];
};

const useGrabLoot = () => {
  const currentGuild = useCurrentGuildStore((state) => state.currentGuild);
  return useQuery(["loot", currentGuild], () => fetchLootData(currentGuild), { staleTime: 1000 * 1800 });
};

export { useGrabLoot, fetchLootData };
