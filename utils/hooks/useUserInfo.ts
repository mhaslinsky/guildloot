import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserInfo = async () => {
  const { data } = await axios({ url: "/api/guild", method: "GET" });
  return data;
};

const useGrabUserInfo = () => {
  return useQuery(["userInfo"], fetchUserInfo, { staleTime: 1000 * 1800 });
};

export { useGrabUserInfo, fetchUserInfo };
