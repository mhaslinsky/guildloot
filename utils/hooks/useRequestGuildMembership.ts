import { useMutation } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { queryClient } from "../queryClient";

type requestMembershipArgs = {
  guildID: string | null;
};

const requestMembership = async (guildID: string | null) => {
  if (!guildID) return Promise.reject({ message: "No guild selected" });
  const { data } = await axios.post(`/api/guildMemberships`, { guildID });
  return data;
};

export function useRequestGuildMembership() {
  const mutation = useMutation({
    mutationFn: (variables: requestMembershipArgs) => requestMembership(variables.guildID),
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
    onMutate: (variables: requestMembershipArgs) => {},
    onSuccess: (data) => {
      console.log(data);
      //   showNotification({
      //     title: "Success",
      //     message: "Request sent",
      //     color: "green",
      //   });
      //   queryClient.invalidateQueries(["guilds"]);
    },
  });

  return mutation;
}
