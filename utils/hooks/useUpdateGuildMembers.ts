import { useMutation } from "@tanstack/react-query";
import { useGuildStore } from "../store/store";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { queryClient } from "../queryClient";

type updateMemberArgs = {
  role: string | null;
  userID: string | null;
};

const updateGuildMembers = async (role: string | null, userID: string | null, guild: string | null) => {
  if (!role) return Promise.reject({ message: "No role selected" });
  if (!userID) return Promise.reject({ message: "No user selected" });
  if (!guild) return Promise.reject({ message: "No guild selected" });
  const { data } = await axios.post(`/api/guildInfo/${guild}`, { role, userID });
  return data;
};

export function useUpdateGuildMembers() {
  const currentGuildID = useGuildStore((state) => state.currentGuildID);

  const mutation = useMutation({
    mutationFn: (variables: updateMemberArgs) => updateGuildMembers(variables.role, variables.userID, currentGuildID),
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
    onMutate: (variables: updateMemberArgs) => {},
    onSuccess: (data) => {
      console.log(data);
      showNotification({
        title: "Success",
        message: "Update Successful",
        color: "green",
      });
      queryClient.invalidateQueries(["guildMembers", currentGuildID]);
    },
  });

  return mutation;
}
