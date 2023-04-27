import { useMutation } from "@tanstack/react-query";
import { useGuildStore } from "../../store/store";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { ExclamationMark } from "tabler-icons-react";
import { queryClient } from "../../queryClient";
import { RCLootItem } from "../../types";
import router from "next/router";

type logLootArgs = {
  lootData: string | undefined;
  addon: "RCLootCouncil" | "Gargul" | string | null;
  raidSize?: 10 | 25;
};

const splitArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const logGuildLoot = async (
  lootData: string | RCLootItem | RCLootItem[] | undefined,
  addon: "RCLootCouncil" | "Gargul" | string | null,
  currentGuild: string | null,
  raidSize?: 10 | 25
) => {
  let arrayChunks;

  if (!(addon == "RCLootCouncil" || addon == "Gargul"))
    return Promise.reject({ message: "Please select a valid loot tracker" });
  if (!lootData) return Promise.reject({ message: "Please enter some loot" });
  if (!currentGuild) return Promise.reject({ message: "Please select a guild" });
  if (addon == "Gargul" && !raidSize) return Promise.reject({ message: "Please select a raid size" });

  if (addon == "RCLootCouncil") {
    let loot: RCLootItem | RCLootItem[] = JSON.parse(lootData as string);
    if (Array.isArray(loot)) {
      lootData = loot.map((item) => {
        const { date, time } = item;
        return {
          ...item,
          date,
          time,
          dateTime: new Date(new Date(`${date} ${time}`).toISOString()),
        };
      });
      if (lootData.length > 150) {
        arrayChunks = splitArray(lootData, 150);
      }
    } else {
      const { date, time } = loot;
      lootData = {
        ...loot,
        date,
        time,
        dateTime: new Date(new Date(`${date} ${time}`).toISOString()),
      };
    }
  }
  //to facilitate splitting large size loot uploads, to get around vercel 10s lambda timeout
  //split into chunks of 150 items, and upload each chunk separately, then reassemble responses from BE
  if (arrayChunks) {
    const postPromises = arrayChunks.map(async (chunk) => {
      try {
        const { data } = await axios.post("/api/loot/post", {
          lootData: chunk,
          addon,
          currentGuild,
          raidSize,
        });
        return data;
      } catch (e) {
        return e;
      }
    });

    const allBadItems = (await Promise.all(postPromises))
      .map((response) => {
        if (response.response && response.response.data !== undefined) {
          return response.response.data.badItems;
        } else if (response.badItems !== undefined) {
          return response.badItems;
        } else {
          return null;
        }
      })
      .flat()
      .filter(Boolean);

    console.log(allBadItems);

    const statusCode =
      allBadItems.length == (lootData as RCLootItem[]).length ? 500 : allBadItems.length > 0 ? 207 : 200;

    const message = allBadItems.length > 0 ? "Some items were not logged" : "Loot logged successfully";

    return { message, badItems: allBadItems, code: statusCode };
  }
  const { data } = await axios.post("/api/loot/post", {
    lootData,
    addon,
    currentGuild,
    raidSize,
  });
  return data;
};

export function useLogLoot() {
  const [currentGuildID] = useGuildStore((state) => [state.currentGuildID]);
  const mutation = useMutation({
    mutationFn: (args: logLootArgs) => logGuildLoot(args.lootData, args.addon, currentGuildID, args.raidSize),
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.log(error);
        showNotification({
          title: "Error",
          message: error.response?.data.message,
          color: "red",
          icon: <ExclamationMark />,
        });
      } else {
        console.log(JSON.stringify(error));
        showNotification({
          title: "Error",
          // @ts-ignore
          message: error.message,
          color: "red",
          icon: <ExclamationMark />,
        });
      }
    },
    onSuccess: (data) => {
      console.log("inc data:", data);
      if (data.code === 207) {
        showNotification({
          title: "Upload Successful-ish",
          message: data.message || "Loot logged successfully",
          color: "yellow",
        });
      }
      //added to deal with splitting large size loot uploads
      else if (data.code === 500) {
        showNotification({
          title: "Upload Failed",
          message: data.message || "Loot logged unsuccessfully",
          color: "red",
        });
      } else {
        showNotification({
          title: "Success",
          message: data.message || "Loot logged successfully",
          color: "green",
        });
        router.push("/");
      }
      queryClient.invalidateQueries(["loot", currentGuildID]);
    },
  });
  return mutation;
}
