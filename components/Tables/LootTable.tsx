import { rcLootItem } from "@prisma/client";
import { Box, Flex, LoadingOverlay, ScrollArea, Table as Mtable } from "@mantine/core";
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
  ColumnFiltersState,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { Anchor } from "@mantine/core";
import { SortAscending, SortDescending } from "tabler-icons-react";
import React, { useEffect, useState } from "react";
import { useStyles } from "../../styles/theme";
import FilterPopover from "../Filter/FilterPopover";
import { useResizeObserver } from "@mantine/hooks";
import { ColumnFilterDisplay } from "../Filter/ColumnFilterDisplay";
import theme from "../../styles/theme";

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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const { classes } = useStyles();
  const [ref, rect] = useResizeObserver();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });

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
      columnFilters,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    if (rect.width < 721) {
      table.setColumnVisibility({ Actions: false });
    }
    if (rect.width < 600) {
      table.setColumnVisibility({ Instance: false, Boss: false, dateTime: false, Actions: false });
    } else {
      table.setColumnVisibility({ Instance: true, Boss: true, dateTime: true, Actions: true });
    }
  }, [rect, table]);

  return (
    <Box
      component={ScrollArea}
      sx={(theme) => ({
        flexGrow: 1,
        position: "relative",
        height: "100%",
      })}
    >
      <LoadingOverlay visible={props.loading} />
      <ColumnFilterDisplay state={columnFilters} setState={setColumnFilters} />
      <Mtable mt={theme.spacing.sm} ref={ref}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th colSpan={header.colSpan} key={header.id}>
                  {header.isPlaceholder ? null : (
                    <Flex align='center' gap='sm'>
                      <>
                        {header.column.id === "Actions" ? (
                          <div onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        ) : (
                          <div className={classes.tHeader} onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        )}
                        {header.column.id !== "dateTime" && header.column.id !== "Actions" && (
                          <FilterPopover table={table} column={header.column} />
                        )}
                        {
                          { asc: <SortAscending size={18} />, desc: <SortDescending size={18} /> }[
                            header.column.getIsSorted() as string
                          ]
                        }
                      </>
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
