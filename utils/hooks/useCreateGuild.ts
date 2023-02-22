import { useMutation } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { randomStore, useGuildStore } from "../store/store";
import { useRouter } from "next/router";

type createGuildArgs = {
  guildName: string | null;
  server: string | null;
  avatar: string | null;
};

const createGuild = async (guildName: string | null, server: string | null, avatar: string | null) => {
  if (!guildName) return Promise.reject({ message: "No Guild Name Entered" });
  if (!server) return Promise.reject({ message: "No Server Selected" });
  const { data } = await axios.post(`/api/createGuild/1`, { guildName, server, avatar });
  return data;
};

export function useCreateGuild() {
  const [setCurrentGuildID, setCurrentGuildName] = useGuildStore((state) => [
    state.setCurrentGuildID,
    state.setCurrentGuildName,
  ]);
  const [setCreateGuildModalOpened] = randomStore((state) => [state.setCreateGuildModalOpen]);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (args: createGuildArgs) => createGuild(args.guildName, args.server, args.avatar),
    onError: (err) => {
      if (err instanceof AxiosError) {
        showNotification({
          title: "Error",
          message: err?.response?.data.message,
          color: "red",
        });
      } else {
        showNotification({
          title: "Error",
          message: "unknown errror",
          color: "red",
        });
      }
    },
    onMutate: (args: createGuildArgs) => {},
    onSuccess: (data, variables, context) => {
      setCurrentGuildID(data.guild.id);
      setCurrentGuildName(data.guild.name);
      router.push(`/manage`);
      setCreateGuildModalOpened(false);
      showNotification({
        title: "Success",
        message: "Guild created",
        color: "green",
      });
      //   queryClient.invalidateQueries("guilds");
    },
  });

  return mutation;
}
