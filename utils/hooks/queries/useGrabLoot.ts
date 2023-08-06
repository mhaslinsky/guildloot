import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useGuildStore } from "../../store/store";

const fetchLootData = async (guild: string | null, cursor: number) => {
  if (!guild) return Promise.reject("No guild selected");
  //returns all loot for selected guild
  const { data } = await axios({ url: `/api/loot/${guild}/${cursor}`, method: "GET" });
  return data;
};

const useGrabLoot = () => {
  const { data: session } = useSession();

  const currentGuildID = useGuildStore((state) => state.currentGuildID);

  return useInfiniteQuery(
    ["loot", currentGuildID],
    //pageParam updated internally by tanstack query after initial run by getNextPageParam
    ({ pageParam = 1 }) => fetchLootData(currentGuildID, pageParam),
    {
      enabled: !!currentGuildID && !!session,
      staleTime: 1000 * 1800,
      keepPreviousData: true,
      //cursor is either returned as the next pageParam(page) or undefined if on last page from BE
      getNextPageParam: (cursor) => cursor.nextPage,
      onSuccess: (data) => {},
    }
  );
};

export { useGrabLoot, fetchLootData };
