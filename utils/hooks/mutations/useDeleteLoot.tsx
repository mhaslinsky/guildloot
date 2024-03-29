import { lootItem } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { formValues } from "../../../components/EditForm";
import axios, { AxiosError } from "axios";
import _ from "lodash";
import { showNotification } from "@mantine/notifications";
import { ExclamationMark } from "tabler-icons-react";
import { queryClient } from "../../queryClient";
import { useGuildStore } from "../../store/store";

const deleteGuildLoot = async (lootRows: lootItem[], currentGuildID: string | null) => {
  if (!lootRows) return Promise.reject({ message: "No loot rows selected" });
  if (!currentGuildID) return Promise.reject({ message: "No guild selected" });

  const { data } = await axios.delete("/api/loot/edit", {
    data: {
      lootRows,
      currentGuildID,
    },
  });
  return data;
};

export function useDeleteLoot() {
  const [currentGuildID] = useGuildStore((state) => [state.currentGuildID]);
  const mutation = useMutation({
    mutationFn: (args: lootItem[]) => deleteGuildLoot(args, currentGuildID),
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
          message: data.message || "Loot deleted successfully",
          color: "yellow",
        });
      } else {
        showNotification({
          title: "Success",
          message: data.message || "Loot deleted successfully",
          color: "green",
        });
      }
      queryClient.invalidateQueries(["loot", currentGuildID]);
    },
  });
  return mutation;
}
