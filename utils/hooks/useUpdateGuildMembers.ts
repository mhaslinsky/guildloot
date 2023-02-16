import { useMutation } from "@tanstack/react-query";
import { useGuildStore } from "../store/store";
import { showNotification } from "@mantine/notifications";
import { ExclamationMark } from "tabler-icons-react";
import axios from "axios";

type updateMemberArgs = {
  role: string | null;
  user: string | null;
};

const updateGuildMembers = async (role: string | null, user: string | null, guild: string | null) => {
  if (!role) return Promise.reject("No role selected");
  if (!user) return Promise.reject("No user selected");
  if (!guild) return Promise.reject("No guild selected");
  const { data } = await axios.post(`/api/guildInfo/${guild}`, { role, user });
  return data;
};

export function useUpdateGuildMembers() {
  const currentGuild = useGuildStore((state) => state.currentGuild);

  const mutation = useMutation({
    mutationFn: (variables: updateMemberArgs) => updateGuildMembers(variables.role, variables.user, currentGuild),
    onError: (error) => {
      showNotification({
        title: "Error",
        message: "There was an error updating the guild member",
        color: "red",
      });
    },
    onMutate: (variables) => {},
    onSuccess: (data) => {
      showNotification({
        title: "Success",
        message: "Update Successful",
        color: "green",
      });
    },
  });

  return mutation;
}
