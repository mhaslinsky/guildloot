import { Account, Guild, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

const fetchUserInfo = async () => {
  //returns all guild membership data for the user
  const { data } = await axios({ url: "/api/guildMemberships", method: "GET" });
  return data as
    | (User & {
        guildAdmin: {
          image: string | null;
          id: string;
          name: string;
          createdAt: Date;
          server: string;
        }[];
        guildOfficer: {
          image: string | null;
          id: string;
          name: string;
          createdAt: Date;
          server: string;
        }[];
        guildMember: {
          image: string | null;
          id: string;
          name: string;
          createdAt: Date;
          server: string;
        }[];
        accounts: Account[];
        guildPending: {
          image: string | null;
          id: string;
          name: string;
          createdAt: Date;
          server: string;
        }[];
      })
    | null;
};

const useGrabUserInfo = () => {
  const { data: session } = useSession();

  return useQuery(["guildMemberships"], fetchUserInfo, {
    enabled: !!session,
    staleTime: 1000 * 1800,
    onSuccess: (data) => {},
  });
};

export { useGrabUserInfo, fetchUserInfo };
