// import { RCLootItem } from "../utils/types";
import { rcLootItem } from "@prisma/client";
import { Box, Flex, LoadingOverlay, Table as Mtable, Popover, Input, UnstyledButton } from "@mantine/core";
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
  Column,
  Table,
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { Anchor } from "@mantine/core";
import { SortAscending, SortDescending, Filter as FilterIcon } from "tabler-icons-react";
import React, { useEffect, useMemo, useState } from "react";
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
      columnFilters,
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    onColumnFiltersChange: setColumnFilters,
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

function FilterPopover({ column, table }: { column: Column<any, unknown>; table: Table<any> }) {
  const { classes } = useStyles();

  return (
    <Popover>
      <Popover.Target>
        <UnstyledButton>
          <FilterIcon className={classes.tHeader} size={16} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Filter column={column} table={table} />
      </Popover.Dropdown>
    </Popover>
  );
}

function Filter({ column, table }: { column: Column<any, unknown>; table: Table<any> }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () => (typeof firstValue === "number" ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.getFacetedUniqueValues()]
  );

  return (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <Input
        value={(columnFilterValue ?? "") as string}
        onChange={(e) => {
          column.setFilterValue(e.target.value);
        }}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        type='text'
        list={column.id + "list"}
      ></Input>
    </>
  );
}
