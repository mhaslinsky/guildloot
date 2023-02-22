import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

const fetchUserInfo = async () => {
  //returns all guild membership data for the user
  const { data } = await axios({ url: "/api/guildMemberships", method: "GET" });
  return data;
};

const useGrabUserInfo = () => {
  const { data: session } = useSession();
  return useQuery(["guildMemberships"], fetchUserInfo, { enabled: !!session, staleTime: 1000 * 1800 });
};

export { useGrabUserInfo, fetchUserInfo };
