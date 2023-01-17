import { Flex, Button, Group, Card, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import FloatingLabelTextarea from "../components/floatingLabelTextarea";
import axios from "axios";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { RCLootItem, LootRow } from "../utils/types";
import Table from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";

const Home: NextPage<{ lootHistory: RCLootItem[] }> = (props) => {
  const [sendLoot, setSendLoot] = useState<string>("");
  const [loot, setLoot] = useState<RCLootItem[]>([]);
  const router = useRouter();

  const inputChangeHandler = (value: string) => {
    setSendLoot(value);
  };

  async function grabLoot() {
    const { data } = await axios({ url: "/api/loot", method: "GET" });
    setLoot(data);
  }

  const onSubmit = async (rcLootData: string) => {
    axios
      .post("/api/loot", { rcLootData })
      .then((res) => {
        setSendLoot("");
        grabLoot();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    grabLoot();
  }, []);

  const columnHelper = createColumnHelper<LootRow>();

  const columns = [
    columnHelper.accessor("player", {
      header: "Player",
      cell: (info) => {
        const name = info.getValue().split("-");
        return name[0];
      },
      footer: "Player",
    }),
    columnHelper.accessor("itemName", {
      header: "Item",
      cell: (info) => info.getValue(),
      footer: "Item",
    }),
    columnHelper.accessor("boss", {
      header: "Boss",
      cell: (info) => info.getValue(),
      footer: "Boss",
    }),
    columnHelper.accessor("instance", {
      header: "Instance",
      cell: (info) => {
        const name = info.getValue().split("-");
        const display = `${name[0]} (${name[1]})`;
        return display;
      },
      footer: "Instance",
    }),
    columnHelper.accessor("response", {
      header: "Reason",
      cell: (info) => info.getValue(),
      footer: "Reason",
    }),
    columnHelper.accessor("dateTime", {
      header: "Date",
      cell: (info) => {
        const date = new Date(info.getValue()).toLocaleDateString("en-US");
        const time = new Date(info.getValue()).toLocaleTimeString("en-US");
        return `${date} ${time}`;
      },
      footer: "Date",
    }),
  ];

  return (
    <>
      <Flex mt='xl' mb='xl' justify='center' align='center'>
        <Card w='100%' m='xs'>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              onSubmit(sendLoot);
            }}
          >
            <FloatingLabelTextarea
              minRows={6}
              maxRows={20}
              value={sendLoot}
              inputValueChange={inputChangeHandler}
              placeholder='Paste your RCLootCouncil JSON data here'
              label='RCLootCouncil JSON'
            />
            <Group position='right' mt='xs'>
              <Button type='submit'>Submit</Button>
            </Group>
            <Table columns={columns} data={loot} />
          </form>
        </Card>
      </Flex>
    </>
  );
};

export default Home;
