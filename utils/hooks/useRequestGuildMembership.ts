import { useMutation } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { useGrabUserInfo } from "./useUserInfo";
import { Guild } from "@prisma/client";

type requestMembershipArgs = {
  guildID: string | null;
};

const requestMembership = async (guildID: string | null, existingMemberships: Guild[] | undefined) => {
  if (!guildID) return Promise.reject({ message: "No guild selected" });
  if (existingMemberships?.find((guild) => guild.id == guildID))
    return Promise.reject({ message: "Already a member" });
  const { data } = await axios.post(`/api/guildMemberships`, { guildID });
  return data;
};

export function useRequestGuildMembership() {
  const { data } = useGrabUserInfo();
  const guildMemberships = data?.guildAdmin.concat(data?.guildMember).concat(data?.guildOfficer);
  const mutation = useMutation({
    mutationFn: (variables: requestMembershipArgs) => requestMembership(variables.guildID, guildMemberships),
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
          //@ts-ignore
          message: err.message,
          color: "red",
        });
      }
    },
    onMutate: (variables: requestMembershipArgs) => {},
    onSuccess: (data) => {
      showNotification({
        title: "Success",
        message: "Request sent",
        color: "green",
      });
      //   queryClient.invalidateQueries(["guilds"]);
    },
  });

  return mutation;
}
