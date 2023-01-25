import { RCLootItem } from "../utils/types";
import { Flex, LoadingOverlay, Table as Mtable, TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  FilterFn,
  ColumnFiltersState,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFacetedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { Anchor } from "@mantine/core";
import { SortAscending, SortDescending } from "tabler-icons-react";
import { useEffect, useMemo, useState } from "react";
import { useStyles } from "../styles/theme";
import { useMediaQuery } from "@mantine/hooks";
import DebouncedInput from "./DebouncedInput";
import { useGlobalFilterStore } from "../utils/store/store";

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

const Table: React.FC<{ columns: any; loading: boolean; data: RCLootItem[] }> = (props) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "dateTime", desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { classes } = useStyles();
  const isMobile = useMediaQuery("(max-width: 600px)");
  // const globalFilter = useGlobalFilterStore((state) => state.globalFilter);
  // const setGlobalFilter = useGlobalFilterStore((state) => state.setGlobalFilter);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const columnHelper = createColumnHelper<RCLootItem>();

  useEffect(() => {
    console.log("rerender");
  }, []);

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
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    enableGlobalFilter: true,
    columnResizeMode: "onChange",
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    console.log(globalFilter);
  }, [globalFilter]);

  useEffect(() => {
    if (isMobile) {
      table.setColumnVisibility({ instance: false, boss: false, dateTime: false });
    } else {
      table.setColumnVisibility({ instance: true, boss: true, dateTime: true });
    }
  }, [isMobile, table]);

  return (
    <>
      {JSON.stringify(table.getState())}
      <DebouncedInput
        value={globalFilter ?? ""}
        onChange={(value) => setGlobalFilter(String(value))}
        placeholder='Search all columns...'
      />
      <Mtable style={{ position: "relative" }}>
        <LoadingOverlay visible={props.loading} />
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th onClick={header.column.getToggleSortingHandler()} key={header.id}>
                  <>
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
                  </>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                <>
                  {console.log(row.getVisibleCells())}
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
                </>
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
    </>
  );
};

export default Table;
