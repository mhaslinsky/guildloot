import { Flex, Button, Group, Card } from "@mantine/core";
import { queryClient } from "../utils/queryClient";
import { useEffect, useMemo, useState } from "react";
import FloatingDBLabelTextarea from "../components/FloatingDBLabelTextarea";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { NextPage } from "next";
import { RCLootItem } from "../utils/types";
import Table from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { ExclamationMark } from "tabler-icons-react";
import { useGrabLoot } from "../utils/hooks/useGrabLoot";
import { useCurrentGuildStore } from "../utils/store/store";
import { useSession } from "next-auth/react";
import { HeroTitle } from "../components/HeroTitle";

const Home: NextPage<{ lootHistory: RCLootItem[] }> = (props) => {
  const [sendLoot, setSendLoot] = useState<string | undefined>("");
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const currentGuild = useCurrentGuildStore((state) => state.currentGuild);
  const { data, isFetching } = useGrabLoot();
  const { data: session, status } = useSession();

  const inputChangeHandler = (value: string) => {
    setSendLoot(value);
  };

  const onSubmit = async (rcLootData: string | undefined) => {
    if (!rcLootData) {
      showNotification({
        title: "Error",
        message: "Please enter some loot",
        color: "red",
        icon: <ExclamationMark />,
      });
      return;
    } else if (!currentGuild) {
      showNotification({
        title: "Error",
        message: "Please select a guild",
        color: "red",
        icon: <ExclamationMark />,
      });
      return;
    }
    axios
      .post("/api/loot/post", { rcLootData, currentGuild })
      .then((res) => {
        setSendLoot("");
        queryClient.invalidateQueries(["loot", currentGuild]);
        // grabLoot();
      })
      .catch((err) => {
        console.log(err);
        showNotification({
          title: "Error",
          message: err.response.data.message,
          color: "red",
          icon: <ExclamationMark />,
        });
      });
  };

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  const columnHelper = createColumnHelper<RCLootItem>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.player}`, {
        header: "Player",
        cell: (info) => {
          const name = info.getValue().split("-");
          return name[0];
        },
        footer: "Player",
      }),
      columnHelper.accessor(`itemName`, {
        header: "Item",
        cell: (info) => info.getValue(),
        footer: "Item",
      }),
      columnHelper.accessor((row) => `${row.boss}`, {
        header: "Boss",
        cell: (info) => info.getValue(),
        footer: "Boss",
      }),
      columnHelper.accessor((row) => `${row.instance}`, {
        header: "Instance",
        cell: (info) => {
          const name = info.getValue().split("-");
          const display = `${name[0]} (${name[1]})`;
          return display;
        },
        footer: "Instance",
      }),
      columnHelper.accessor((row) => `${row.response}`, {
        header: "Reason",
        cell: (info) => info.getValue(),
        footer: "Reason",
      }),
      columnHelper.accessor("dateTime", {
        header: "Date",
        cell: (info) => {
          if (!info) return "N/A";
          const date = new Date(info.getValue()!).toLocaleDateString("en-US");
          const time = new Date(info.getValue()!).toLocaleTimeString("en-US");
          return `${date} ${time}`;
        },
        footer: "Date",
      }),
    ],
    [columnHelper]
  );

  return (
    <>
      <Flex justify='center' align='center'>
        <Card w='100%'>
          {!session && status == "unauthenticated" && <HeroTitle />}
          {initialRenderComplete && session && <Table columns={columns} loading={isFetching} data={data || []} />}
        </Card>
      </Flex>
    </>
  );
};

export default Home;
