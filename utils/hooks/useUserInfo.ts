import { Guild, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useGuildStore } from "../store/store";

const fetchUserInfo = async () => {
  //returns all guild membership data for the user
  const { data } = await axios({ url: "/api/guildMemberships", method: "GET" });
  return data as
    | (User & {
        guildAdmin: Guild[];
        guildMember: Guild[];
        guildOfficer: Guild[];
      })
    | null;
};

const useGrabUserInfo = () => {
  const { data: session } = useSession();
  const [setAvailableGuilds] = useGuildStore((state) => [state.setAvailableGuilds]);
  return useQuery(["guildMemberships"], fetchUserInfo, {
    enabled: !!session,
    staleTime: 1000 * 1800,
    onSuccess: (data) => {
      // if (!data) return;
      // const guilds = data.guildAdmin
      //   .map((guild) => ({ ...guild, role: "admin" }))
      //   .concat(data.guildOfficer.map((guild) => ({ ...guild, role: "officer" })))
      //   .concat(data.guildMember.map((guild) => ({ ...guild, role: "member" })));
      // const guildsWithValues = guilds.map((guild: any) => {
      //   return {
      //     role: guild.role,
      //     value: guild.id,
      //     label: guild.name,
      //     image: guild.image,
      //     name: guild.name,
      //     adminId: guild.adminId,
      //     server: guild.server,
      //     id: guild.id,
      //   };
      // });
      // console.log(guildsWithValues);
      // setAvailableGuilds(guildsWithValues);
    },
  });
};

export { useGrabUserInfo, fetchUserInfo };
