import { useMutation } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { useGuildStore } from "../../store/store";
import { useRouter } from "next/router";
import { queryClient } from "../../queryClient";

type deleteGuildArgs = {
  gid: string | null;
};

const createGuild = async (gid: string | null) => {
  if (!gid) return Promise.reject({ message: "No Guild Name Entered" });
  const { data } = await axios.delete(`/api/guildInfo/1`, { data: { gid } });
  return data;
};

export function useDeleteGuild() {
  const [setCurrentGuildID, setCurrentGuildName] = useGuildStore((state) => [
    state.setCurrentGuildID,
    state.setCurrentGuildName,
  ]);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (args: deleteGuildArgs) => createGuild(args.gid),
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
    onMutate: (args: deleteGuildArgs) => {},
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["guildMemberships"]);
      setCurrentGuildID(null);
      setCurrentGuildName(null);
      queryClient.invalidateQueries(["guilds"]);
      router.push(`/`);
      showNotification({
        title: "Success",
        message: "Guild Deleted",
        color: "green",
      });
    },
  });

  return mutation;
}
