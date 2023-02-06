import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGuildStore } from "../store/store";
import type { RCLootItem } from "../types";

const fetchLootData = async (guild: string | null) => {
  if (!guild) return Promise.reject("No guild selected");
  const { data } = await axios({ url: `/api/loot/${guild}`, method: "GET" });
  return data as RCLootItem[];
};

const useGrabLoot = () => {
  const currentGuild = useGuildStore((state) => state.currentGuild);
  return useQuery(["loot", currentGuild], () => fetchLootData(currentGuild), {
    enabled: !!currentGuild,
    staleTime: 1000 * 1800,
  });
};

export { useGrabLoot, fetchLootData };
