import { Guild } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGuildStore } from "../store/store";

const fetchGuilds = async () => {
  //returns all guilds for guild directory page
  const { data } = await axios({ url: `/api/guilds/`, method: "GET" });
  return data as Guild[];
};

const useGrabGuilds = () => {
  return useQuery(["guilds"], fetchGuilds, {
    staleTime: 1000 * 1800,
  });
};

export { useGrabGuilds, fetchGuilds };
