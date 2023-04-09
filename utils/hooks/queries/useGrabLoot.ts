import { lootItem } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useGuildStore } from "../../store/store";

const fetchLootData = async (guild: string | null) => {
  if (!guild) return Promise.reject("No guild selected");
  //returns all loot for selected guild
  const { data } = await axios({ url: `/api/loot/${guild}`, method: "GET" });
  return data as lootItem[];
};

const useGrabLoot = () => {
  const { data: session } = useSession();
  const currentGuildID = useGuildStore((state) => state.currentGuildID);
  return useQuery(["loot", currentGuildID], () => fetchLootData(currentGuildID), {
    enabled: !!currentGuildID && !!session,
    staleTime: 1000 * 1800,
  });
};

export { useGrabLoot, fetchLootData };
