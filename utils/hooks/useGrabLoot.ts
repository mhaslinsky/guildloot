import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchLootData = async () => {
  const { data } = await axios({ url: "/api/loost", method: "GET" });
  return data;
};

const useGrabLoot = () => {
  return useQuery(["loot"], fetchLootData, { staleTime: 1000 * 1800 });
};

export { useGrabLoot, fetchLootData };
