import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useGuildStore } from "../../store/store";

const fetchLootData = async (guild: string | null, cursor: number) => {
  if (!guild) return Promise.reject("No guild selected");
  //returns all loot for selected guild
  const { data } = await axios({ url: `/api/loot/${guild}/${cursor}`, method: "GET" });

  const responseSize = Buffer.byteLength(JSON.stringify(data), "utf8");
  console.log(responseSize);

  return data;
};

const useGrabLoot = () => {
  const { data: session } = useSession();

  const currentGuildID = useGuildStore((state) => state.currentGuildID);

  return useInfiniteQuery(
    ["loot", currentGuildID],
    ({ pageParam = 1 }) => fetchLootData(currentGuildID, pageParam),
    {
      enabled: !!currentGuildID && !!session,
      staleTime: 1000 * 1800,
      keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );
};

export { useGrabLoot, fetchLootData };
