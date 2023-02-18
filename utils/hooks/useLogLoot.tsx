import { useMutation } from "@tanstack/react-query";
import { useGuildStore } from "../store/store";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { ExclamationMark } from "tabler-icons-react";
import { queryClient } from "../queryClient";

const logGuildLoot = async (rcLootData: string | undefined, currentGuild: string | null) => {
  if (!rcLootData) return Promise.reject({ message: "Please enter some loot" });
  if (!currentGuild) return Promise.reject({ message: "Please select a guild" });
  const { data } = await axios.post("/api/loot/post", {
    rcLootData,
    currentGuild,
  });
  return data;
};

export function useLogLoot() {
  const [currentGuild] = useGuildStore((state) => [state.currentGuild]);
  const mutation = useMutation({
    mutationFn: (rcLootData: string | undefined) => logGuildLoot(rcLootData, currentGuild),
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
      console.log(data);
      showNotification({
        title: "Success",
        message: "Loot Logged",
        color: "green",
      });
      queryClient.invalidateQueries(["loot", currentGuild]);
    },
  });
  return mutation;
}
