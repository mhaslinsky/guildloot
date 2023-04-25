import { lootItem } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { formValues } from "../../../components/EditForm";
import axios, { AxiosError } from "axios";
import _ from "lodash";
import { showNotification } from "@mantine/notifications";
import { ExclamationMark } from "tabler-icons-react";
import { queryClient } from "../../queryClient";
import { useGuildStore } from "../../store/store";

type editLootArgs = {
  lootRows: lootItem[];
  values: formValues;
};

const isValueUndefinedOrEmpty = (value: string | undefined) => value === undefined || value === "";

const editGuildLoot = async (lootRows: lootItem[], updateValues: formValues, currentGuildID: string | null) => {
  if (!lootRows) return Promise.reject({ message: "No loot rows selected" });
  if (!updateValues) return Promise.reject({ message: "No data sent" });
  if (!currentGuildID) return Promise.reject({ message: "No guild selected" });

  if (_.every(updateValues, isValueUndefinedOrEmpty)) return Promise.reject({ message: "No data to update" });

  const { data } = await axios.patch("/api/loot/edit", {
    lootRows,
    updateValues,
    currentGuildID,
  });
  return data;
};

export function useEditLoot() {
  const [currentGuildID] = useGuildStore((state) => [state.currentGuildID]);
  const mutation = useMutation({
    mutationFn: (args: editLootArgs) => editGuildLoot(args.lootRows, args.values, currentGuildID),
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
          message: data.message || "Loot editted successfully",
          color: "yellow",
        });
      } else {
        showNotification({
          title: "Success",
          message: data.message || "Loot editted successfully",
          color: "green",
        });
      }
      queryClient.invalidateQueries(["loot", currentGuildID]);
    },
  });
  return mutation;
}
