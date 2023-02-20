import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGuildStore } from "../store/store";
import type { RCLootItem } from "../types";

const fetchLootData = async (guild: string | null) => {
  if (!guild) return Promise.reject("No guild selected");
  //returns all loot for selected guild
  const { data } = await axios({ url: `/api/loot/${guild}`, method: "GET" });
  return data as RCLootItem[];
};

const useGrabLoot = () => {
  const currentGuildID = useGuildStore((state) => state.currentGuildID);
  return useQuery(["loot", currentGuildID], () => fetchLootData(currentGuildID), {
    enabled: !!currentGuildID,
    staleTime: 1000 * 1800,
  });
};

export { useGrabLoot, fetchLootData };
