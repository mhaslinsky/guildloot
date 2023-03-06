// import { RCLootItem } from "../utils/types";
import { Guild, rcLootItem } from "@prisma/client";
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
import { Anchor } from "@mantine/core";
import { SortAscending, SortDescending } from "tabler-icons-react";
import React, { useEffect, useState } from "react";
import { useStyles } from "../../styles/theme";
import { useMediaQuery } from "@mantine/hooks";
import { useAutoCompleteDataStore, useGuildStore, useGlobalFilterStore } from "../../utils/store/store";

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

const LootTable: React.FC<{ columns: any; loading: boolean; data: rcLootItem[] }> = (props) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "dateTime", desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const { classes } = useStyles();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [globalFilter, setGlobalFilter] = useGlobalFilterStore((state) => [
    state.globalFilter,
    state.setGlobalFilter,
  ]);
  const setAutoCompleteData = useAutoCompleteDataStore((state) => state.setAutoCompleteData);
  const currentGuildID = useGuildStore((state) => state.currentGuildID);

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
    if (isMobile) {
      table.setColumnVisibility({ Instance: false, Boss: false, dateTime: false });
    } else {
      table.setColumnVisibility({ Instance: true, Boss: true, dateTime: true });
    }
  }, [isMobile, table]);

  useEffect(() => {
    let cbData: any[] = [];
    table.getAllColumns().forEach((column) => {
      if (column.id === "dateTime" || "Actions") return;
      cbData.push([...column.getFacetedUniqueValues().keys()]);
    });
    const flattened = cbData.flat();
    setAutoCompleteData(flattened);
  }, [setAutoCompleteData, table, currentGuildID]);

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
                    <Flex className={classes.tHeader} gap='md'>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {
                        { asc: <SortAscending size={18} />, desc: <SortDescending size={18} /> }[
                          header.column.getIsSorted() as string
                        ]
                      }
                    </Flex>
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
                  if (cell.column.id === "itemName") {
                    return (
                      <td key={cell.id}>
                        <Anchor
                          key={cell.row.original.itemId}
                          href={`https://www.wowhead.com/wotlk/item=${cell.row.original.itemId}`}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Anchor>
                      </td>
                    );
                  } else {
                    return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </Mtable>
    </Box>
  );
};

export default LootTable;
