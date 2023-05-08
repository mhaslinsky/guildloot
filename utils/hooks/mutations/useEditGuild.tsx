import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { showNotification } from "@mantine/notifications";
import { ExclamationMark } from "tabler-icons-react";
import { queryClient } from "../../queryClient";
import { useGuildStore } from "../../store/store";

type editGuildArgs = {
  server: string;
};

const editGuildLoot = async (server: string, currentGuildID: string | null) => {
  if (!server) return Promise.reject({ message: "No server provided" });
  if (!currentGuildID) return Promise.reject({ message: "No guild selected" });

  const { data } = await axios.patch("/api/guildInfo/1", {
    server,
    currentGuildID,
  });
  return data;
};

export function useEditGuild() {
  const [currentGuildID] = useGuildStore((state) => [state.currentGuildID]);
  const mutation = useMutation({
    mutationFn: (args: editGuildArgs) => editGuildLoot(args.server, currentGuildID),
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
      showNotification({
        title: "Success",
        message: data.message || "Guild server changed successfully",
        color: "green",
      });
      queryClient.invalidateQueries(["guildMembers", currentGuildID]);
    },
  });
  return mutation;
}
