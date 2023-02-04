import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

const fetchUserInfo = async () => {
  const { data } = await axios({ url: "/api/guild", method: "GET" });
  return data;
};

const useGrabUserInfo = () => {
  const { data: session } = useSession();
  return useQuery(["userInfo"], fetchUserInfo, { enabled: !!session, staleTime: 1000 * 1800 });
};

export { useGrabUserInfo, fetchUserInfo };
