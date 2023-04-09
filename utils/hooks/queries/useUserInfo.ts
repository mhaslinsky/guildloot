import { Account, Guild, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useGuildStore } from "../../store/store";

const fetchUserInfo = async () => {
  //returns all guild membership data for the user
  const { data } = await axios({ url: "/api/guildMemberships", method: "GET" });
  return data as
    | (User & {
        guildAdmin: Guild[];
        guildOfficer: Guild[];
        accounts: Account[];
        guildMember: Guild[];
        guildPending: Guild[];
      })
    | null;
};

const useGrabUserInfo = () => {
  const { data: session } = useSession();
  const [setAvailableGuilds] = useGuildStore((state) => [state.setAvailableGuilds]);
  return useQuery(["guildMemberships"], fetchUserInfo, {
    enabled: !!session,
    staleTime: 1000 * 1800,
    onSuccess: (data) => {},
  });
};

export { useGrabUserInfo, fetchUserInfo };
