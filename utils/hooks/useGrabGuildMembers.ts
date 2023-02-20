import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGuildStore } from "../store/store";
import type { Guild, RCLootItem, User } from "../types";

const fetchGuildMembers = async (guild: string | null) => {
  if (!guild) return Promise.reject("No guild selected");
  //returns all loot for selected guild
  const { data } = await axios({ url: `/api/guildInfo/${guild}`, method: "GET" });
  return data as Guild;
};

const useGrabGuildMembers = () => {
  const currentGuildID = useGuildStore((state) => state.currentGuildID);
  return useQuery(["guildMembers", currentGuildID], () => fetchGuildMembers(currentGuildID), {
    enabled: !!currentGuildID,
    staleTime: 1000 * 1800,
  });
};

export { useGrabGuildMembers, fetchGuildMembers };
