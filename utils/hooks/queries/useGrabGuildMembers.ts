import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useGuildStore } from "../../store/store";
import type { guildMemberInfo } from "../../../pages/api/guildInfo/[gid]";

const fetchGuildMembers = async (guild: string | null) => {
  if (!guild) return Promise.reject("No guild selected");
  //returns all member info for selected guild
  const { data } = await axios({ url: `/api/guildInfo/${guild}`, method: "GET" });
  return data as guildMemberInfo | null;
};

const useGrabGuildMembers = () => {
  const { data: session, status } = useSession();
  const currentGuildID = useGuildStore((state) => state.currentGuildID);
  return useQuery(["guildMembers", currentGuildID], () => fetchGuildMembers(currentGuildID), {
    enabled: !!currentGuildID && !!session,
    staleTime: 1000 * 1800,
  });
};

export { useGrabGuildMembers, fetchGuildMembers };
