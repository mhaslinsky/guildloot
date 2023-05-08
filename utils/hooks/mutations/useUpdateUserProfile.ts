import { useMutation } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { queryClient } from "../../queryClient";

type updateUserArgs = {
  propToChange: "username" | "image";
  value: string | null | undefined;
};

const updateGuildMembers = async (propToChange: "username" | "image", value: string | null | undefined) => {
  if (!propToChange) return Promise.reject({ message: "No property selected to change" });
  if (!value) return Promise.reject({ message: "No value entered" });

  const { data } = await axios.post(`/api/profile/`, { propToChange, value });
  return data;
};

export function useUpdateUserProfile() {
  const mutation = useMutation({
    mutationFn: (args: updateUserArgs) => updateGuildMembers(args.propToChange, args.value),
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
    onMutate: (variables: updateUserArgs) => {},
    onSuccess: (data) => {
      showNotification({
        title: "Success",
        message: data.message,
        color: "green",
      });
      queryClient.invalidateQueries(["guildMemberships"]);
    },
  });

  return mutation;
}
