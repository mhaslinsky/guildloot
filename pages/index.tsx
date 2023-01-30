import { Flex, Button, Group, Card } from "@mantine/core";
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
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { useSession } from "next-auth/react";

const Home: NextPage<{ lootHistory: RCLootItem[] }> = (props) => {
  const [sendLoot, setSendLoot] = useState<string | undefined>("");
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const { data, isFetching } = useGrabLoot();
  const { data: session, status } = useSession();
  const { data: guildData } = useGrabUserInfo();

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
    }
    axios
      .post("/api/loot", { rcLootData })
      .then((res) => {
        setSendLoot(undefined);
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

  useEffect(() => {}, [session]);

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
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              onSubmit(sendLoot);
            }}
          >
            <FloatingDBLabelTextarea
              debounce={500}
              minRows={6}
              maxRows={20}
              value={sendLoot}
              onChange={(value) => inputChangeHandler(String(value))}
              placeholder='Paste your RCLootCouncil JSON data here'
              label='RCLootCouncil JSON'
            />
            <Group position='right' mt='xs'>
              <Button type='submit'>Submit</Button>
            </Group>
            {initialRenderComplete && <Table columns={columns} loading={isFetching} data={data || []} />}
          </form>
        </Card>
      </Flex>
    </>
  );
};

export default Home;
