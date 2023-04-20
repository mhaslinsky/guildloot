import { lootItem } from "@prisma/client";
import {
  Box,
  Flex,
  LoadingOverlay,
  ScrollArea,
  Table as Mtable,
  Checkbox,
  ActionIcon,
  Button,
  Drawer,
} from "@mantine/core";
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
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { Anchor } from "@mantine/core";
import { SortAscending, SortDescending } from "tabler-icons-react";
import React, { useEffect, useState, useMemo } from "react";
import { useStyles } from "../../styles/theme";
import FilterPopover from "../Filter/FilterPopover";
import { useResizeObserver } from "@mantine/hooks";
import { ColumnFilterDisplay } from "../Filter/ColumnFilterDisplay";
import theme from "../../styles/theme";
import { PaginationControls } from "../PaginationControls";
import { IconSettings } from "@tabler/icons";
import { EditForm } from "../EditForm";
import { useNumTablesStore } from "../../utils/store/store";

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

const LootTable: React.FC<{ numTables: number; columns: any; loading: boolean; data: lootItem[] }> = (props) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "dateTime", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const { classes } = useStyles();
  const [ref, rect] = useResizeObserver();
  const [flexDirection, setFlexDirection] = useState<"column" | "row">("row");
  const [numFilters, setNumFilters] = useState(0);

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    enableRowSelection: true,
    enableHiding: true,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnVisibility,
      columnFilters,
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
    if (rect.width < 655) {
      table.setColumnVisibility({
        ...columnVisibility,
        Instance: false,
        Size: false,
        Boss: false,
        dateTime: false,
        Select: false,
      });
    } else if (rect.width > 655) {
      table.setColumnVisibility({ ...columnVisibility, Instance: true, Size: true, Boss: true, dateTime: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect.width]);

  useEffect(() => {
    if (props.numTables > 1) table.setColumnVisibility({ ...columnVisibility, Select: false });
    else {
      table.setColumnVisibility({ ...columnVisibility, Select: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.numTables]);

  useEffect(() => {
    if (rect.width > 1060) {
      setFlexDirection("row");
    } else if (rect.width < 1060 && numFilters > 1) {
      setFlexDirection("column");
    } else if (rect.width < 436 && rect.width > 0) {
      setFlexDirection("column");
    } else if (rect.width === 0) {
      setFlexDirection("row");
    } else {
      setFlexDirection("row");
    }
  }, [numFilters, rect]);

  function displayHandler(numFilters: number) {
    setNumFilters(numFilters);
  }

  return (
    <Box
      component={ScrollArea}
      offsetScrollbars
      styles={(theme) => ({
        root: {
          flexGrow: 1,
          position: "relative",
          height: "100%",
        },
        scrollbar: {
          '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors[theme.primaryColor][7] : theme.colors.gray[3],
          },
        },
      })}
    >
      <LoadingOverlay visible={props.loading} />
      <Drawer
        size={`calc(var(--mantine-header-height, 0px) + 1rem)`}
        position='top'
        opened={table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected()}
        onClose={() => {}}
        withOverlay={false}
        styles={(theme) => ({
          header: {
            display: "none",
          },
          body: {
            height: "100%",
          },
        })}
      >
        <>
          <EditForm table={table} />
        </>
      </Drawer>
      <Flex direction={flexDirection} gap={10} justify='space-between' align='center' pt={theme.spacing.sm}>
        <ColumnFilterDisplay state={columnFilters} setState={setColumnFilters} numFilters={displayHandler} />
        <PaginationControls table={table} />
      </Flex>
      <Mtable mt={theme.spacing.sm} ref={ref}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th colSpan={header.colSpan} key={header.id}>
                  {header.isPlaceholder ? null : (
                    <Flex align='center' gap='sm'>
                      <>
                        {header.column.id === "Actions" || header.column.id === "Select" ? (
                          <div onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        ) : (
                          <div className={classes.tHeader} onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        )}
                        {header.column.id !== "dateTime" &&
                          header.column.id !== "Actions" &&
                          header.column.id !== "Select" && <FilterPopover table={table} column={header.column} />}
                        {
                          {
                            asc: <SortAscending size={18} />,
                            desc: <SortDescending size={18} />,
                            false: "",
                          }[header.column.getIsSorted() as string]
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
