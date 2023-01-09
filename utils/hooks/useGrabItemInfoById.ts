import { useState } from "react";
import axios from "axios";

export const useGrabItemInfoById = () => {
  const [itemThumb, setItemThumb] = useState<string>("");
  const [itemName, setItemName] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getBlizzItem = async (itemId: number | undefined) => {
    try {
      setIsLoading(true);
      axios
        .post("/api/grabBlizzData", { itemId })
        .then((res) => {
          console.log("itemID " + res.data.itemID + res.data.message);
          setItemName(res.data.itemName);
          setItemThumb(res.data.itemIcon);
        })
        .catch((err) => {
          console.log("itemID " + itemId + " not found or already exists in local DB");
          setItemName("doesn't exist or already cached");
        });
      setIsLoading(false);
    } catch (error) {
      console.log("itemID " + itemId + " not found or already exists in local DB");
      setItemName("doesn't exist or already exists");
      setIsLoading(false);
    }
  };

  return { itemThumb, itemName, isLoading, getBlizzItem };
};
