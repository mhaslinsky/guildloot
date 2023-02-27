import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useGuildStore } from "../store/store";
import { Guild } from "@prisma/client";

const fetchGuildMembers = async (guild: string | null) => {
  if (!guild) return Promise.reject("No guild selected");
  //returns all member info for selected guild
  const { data } = await axios({ url: `/api/guildInfo/${guild}`, method: "GET" });
  return data as
    | (Guild & {
        Admin: {
          id: string;
          name: string;
          image: string | null;
          lastSignedIn: Date | null;
        };
        officers: {
          id: string;
          name: string;
          image: string | null;
          lastSignedIn: Date | null;
        }[];
        members: {
          id: string;
          name: string;
          image: string | null;
          lastSignedIn: Date | null;
        }[];
        pending: {
          id: string;
          name: string;
          image: string | null;
          lastSignedIn: Date | null;
        }[];
      })
    | null;
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
