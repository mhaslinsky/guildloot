import { Flex, Card, Text, Group, Tooltip } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import LootTable from "../components/Tables/LootTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useGrabLoot } from "../utils/hooks/queries/useGrabLoot";
import { useSession } from "next-auth/react";
import { HeroTitle } from "../components/HeroTitle";
import { useNumTablesStore } from "../utils/store/store";
import { lootItem } from "@prisma/client";
import { IndeterminateCheckbox } from "../components/IndeterminateCheckbox";
import { DisplayDate } from "../components/DisplayDate";
import _ from "lodash";

const Home: NextPage = () => {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetching } = useGrabLoot();
  const { data: session, status } = useSession();

  const [numTables] = useNumTablesStore((state) => [state.numTables]);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  useEffect(() => {
    //checks with getNextPageParam in useInfQuery to see if there is a next page
    if (hasNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage]);

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
        filterFn: "fuzzy",
        cell: (info) => {
          const name = info.getValue().split("-");
          return name[0];
        },
        footer: "Player",
      }),
      columnHelper.accessor(`itemName`, {
        header: "Item",
        filterFn: "fuzzy",
        cell: (info) => info.getValue(),
        footer: "Item",
      }),
      columnHelper.accessor((row) => `${row.boss}`, {
        header: "Boss",
        filterFn: "fuzzy",
        cell: (info) => info.getValue(),
        footer: "Boss",
      }),
      columnHelper.accessor((row) => `${row.instance} `, {
        header: "Instance",
        filterFn: "fuzzy",
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
        filterFn: "fuzzy",
        cell: (info) => {
          if (info.getValue().length > 22)
            return (
              <Tooltip label={info.getValue()}>
                <Text>{_.truncate(info.getValue(), { length: 22 })}</Text>
              </Tooltip>
            );
          else return <Text>{info.getValue()}</Text>;
        },
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
      {status == "loading" && <Text>Trying to log you in...</Text>}
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
                  data={
                    data?.pages
                      .map((chunk) => {
                        return chunk.lootChunk;
                      })
                      .flat() || []
                  }
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
