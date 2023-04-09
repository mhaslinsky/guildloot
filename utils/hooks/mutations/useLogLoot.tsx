import { useMutation } from "@tanstack/react-query";
import { useGuildStore } from "../../store/store";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { ExclamationMark } from "tabler-icons-react";
import { queryClient } from "../../queryClient";

type logLootArgs = {
  lootData: string | undefined;
  addon: "RCLootCouncil" | "Gargul" | string | null;
  raidSize?: 10 | 25;
};

const logGuildLoot = async (
  lootData: string | undefined,
  addon: "RCLootCouncil" | "Gargul" | string | null,
  currentGuild: string | null,
  raidSize?: 10 | 25
) => {
  if (!(addon == "RCLootCouncil" || addon == "Gargul"))
    return Promise.reject({ message: "Please select a valid loot tracker" });
  if (!lootData) return Promise.reject({ message: "Please enter some loot" });
  if (!currentGuild) return Promise.reject({ message: "Please select a guild" });
  if (addon == "Gargul" && !raidSize) return Promise.reject({ message: "Please select a raid size" });
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
      if (data.code === 207) {
        showNotification({
          title: "Upload Successful-ish",
          message: data.message || "Loot logged successfully",
          color: "yellow",
        });
      } else {
        showNotification({
          title: "Success",
          message: data.message || "Loot logged successfully",
          color: "green",
        });
      }
      queryClient.invalidateQueries(["loot", currentGuildID]);
    },
  });
  return mutation;
}
