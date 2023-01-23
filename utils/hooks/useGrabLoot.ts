import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { RCLootItem } from "../types";

const fetchLootData = async () => {
  const { data } = await axios({ url: "/api/loot", method: "GET" });
  return data as RCLootItem[];
};

const useGrabLoot = () => {
  return useQuery(["loot"], fetchLootData, { staleTime: 1000 * 1800 });
};

export { useGrabLoot, fetchLootData };
