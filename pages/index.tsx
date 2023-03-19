import { Flex, Card, ActionIcon, Text, Group, Divider, Stack } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { RCLootItem } from "../utils/types";
import LootTable from "../components/Tables/LootTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useGrabLoot } from "../utils/hooks/useGrabLoot";
import { useSession } from "next-auth/react";
import { HeroTitle } from "../components/HeroTitle";
import { IconSettings } from "@tabler/icons";
import { useNumTablesStore } from "../utils/store/store";

const Home: NextPage = () => {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const { data, isFetching } = useGrabLoot();
  const { data: session, status } = useSession();

  const [numTables] = useNumTablesStore((state) => [state.numTables]);

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
      columnHelper.display({
        header: "Actions",
        cell: (info) => (
          <Flex justify='center'>
            <ActionIcon
              onClick={() => {
                console.log(info.cell.row.original);
              }}
              variant='default'
            >
              <IconSettings size='1rem' />
            </ActionIcon>
          </Flex>
        ),
        footer: "Actions",
      }),
    ],
    [columnHelper]
  );

  return (
    <>
      <Flex justify='center' align='center'>
        {status == "loading" && <Text>Checking for cached login...</Text>}
        {!session && status == "unauthenticated" && <HeroTitle />}
        {initialRenderComplete && session && (
          <>
            <Stack w='100%'>
              <Card>
                <Group align='flex-start' grow>
                  {Array.from({ length: numTables }).map((elem, index) => {
                    return (
                      <Group key={index} align='flex-start'>
                        <LootTable columns={columns} loading={isFetching} data={data || []} />
                        <Divider size='lg' orientation='vertical' />
                      </Group>
                    );
                  })}
                </Group>
              </Card>
            </Stack>
          </>
        )}
      </Flex>
    </>
  );
};

export default Home;
