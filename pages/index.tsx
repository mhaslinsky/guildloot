import { Flex, Card, ActionIcon, Text, Group, Checkbox } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import LootTable from "../components/Tables/LootTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useGrabLoot } from "../utils/hooks/queries/useGrabLoot";
import { useSession } from "next-auth/react";
import { HeroTitle } from "../components/HeroTitle";
import { IconSettings } from "@tabler/icons";
import { useNumTablesStore } from "../utils/store/store";
import { lootItem } from "@prisma/client";
import { IndeterminateCheckbox } from "../components/IndeterminateCheckbox";
import { DisplayDate } from "../components/DisplayDate";

const Home: NextPage = () => {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const { data, isFetching } = useGrabLoot();
  const { data: session, status } = useSession();

  const [numTables] = useNumTablesStore((state) => [state.numTables]);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  const columnHelper = createColumnHelper<lootItem>();
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "Select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            table={table}
            disabled={false}
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler}
          />
        ),
      }),
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
      columnHelper.accessor((row) => `${row.instance} `, {
        header: "Instance",
        cell: (info) => info.getValue(),
        footer: "Instance",
      }),
      columnHelper.accessor((row) => `${row.raidSize}`, {
        header: "Size",
        cell: (info) => {
          const raidSize = info.getValue() == "TWENTY_FIVE" ? "25" : "10";
          const display = `${raidSize}`;
          return display;
        },
        footer: "Size",
      }),
      columnHelper.accessor((row) => `${row.response}`, {
        header: "Reason",
        cell: (info) => info.getValue(),
        footer: "Reason",
      }),
      columnHelper.accessor("dateTime", {
        header: "Date",
        cell: (info) => <DisplayDate date={info} />,
        footer: "Date",
      }),
    ],
    [columnHelper]
  );

  return (
    <Flex h='100%' justify='center' align='center'>
      {status == "loading" && <Text>Checking for cached login...</Text>}
      {!session && status == "unauthenticated" && <HeroTitle />}
      {initialRenderComplete && session && (
        <Card pt={0} pb={0} pr={0} h='100%' w='100%'>
          <Group h='100%' align='flex-start' grow>
            {Array.from({ length: numTables }).map((elem, index) => {
              return (
                <LootTable
                  numTables={numTables}
                  columns={columns}
                  key={index}
                  loading={isFetching}
                  data={data || []}
                />
              );
            })}
          </Group>
        </Card>
      )}
    </Flex>
  );
};

export default Home;
