// import { RCLootItem } from "../utils/types";
import { Guild } from "@prisma/client";
import { Box, Flex, LoadingOverlay, Table as Mtable } from "@mantine/core";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  FilterFn,
  getFacetedUniqueValues,
  getFacetedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { SortAscending, SortDescending } from "tabler-icons-react";
import React, { useEffect, useState } from "react";
import { useStyles } from "../../styles/theme";
import { useAutoCompleteDataStore, useGlobalFilterStore } from "../../utils/store/store";
import { useMediaQuery } from "@mantine/hooks";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);
  // Store the itemRank info
  addMeta({ itemRank });
  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const GuildTable: React.FC<{ columns: any; loading: boolean; data: Guild[] }> = (props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const { classes } = useStyles();
  const globalFilter = useGlobalFilterStore((state) => state.globalFilter);
  const setGlobalFilter = useGlobalFilterStore((state) => state.setGlobalFilter);
  const setAutoCompleteData = useAutoCompleteDataStore((state) => state.setAutoCompleteData);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    enableHiding: true,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnVisibility,
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    let cbData: any[] = [];
    table.getAllColumns().forEach((column) => {
      if (column.id === "Request Membership") return;
      cbData.push([...column.getFacetedUniqueValues().keys()]);
    });
    const flattened = cbData.flat();
    setAutoCompleteData(flattened);
  }, [setAutoCompleteData, table]);

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
      })}
    >
      <LoadingOverlay visible={props.loading} />
      <Mtable>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th onClick={header.column.getToggleSortingHandler()} key={header.id}>
                  {header.isPlaceholder ? null : (
                    <>
                      {header.id == "Request Membership" ? (
                        <Flex justify='end' pr={11} className={classes.tHeader} gap='md'>
                          {isMobile
                            ? "Membership"
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {
                            { asc: <SortAscending size={16} />, desc: <SortDescending size={18} /> }[
                              header.column.getIsSorted() as string
                            ]
                          }
                        </Flex>
                      ) : (
                        <Flex className={classes.tHeader} gap='md'>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {
                            { asc: <SortAscending size={16} />, desc: <SortDescending size={18} /> }[
                              header.column.getIsSorted() as string
                            ]
                          }
                        </Flex>
                      )}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </Mtable>
    </Box>
  );
};

export default GuildTable;
