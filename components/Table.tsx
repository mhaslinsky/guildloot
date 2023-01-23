import { RCLootItem } from "../utils/types";
import { Flex, LoadingOverlay, Table as Mtable } from "@mantine/core";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { Anchor } from "@mantine/core";
import { SortAscending, SortDescending } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { useStyles } from "../styles/theme";
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

const Table: React.FC<{ loading: boolean; columns: any; data: RCLootItem[] }> = (props) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "dateTime", desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const { classes } = useStyles();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const table = useReactTable({
    columns: props.columns,
    enableHiding: true,
    data: props.data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    if (isMobile) {
      table.setColumnVisibility({ instance: false, boss: false, dateTime: false });
    } else {
      table.setColumnVisibility({ instance: true, boss: true, dateTime: true });
    }
  }, [isMobile, table]);

  return (
    <Mtable style={{ position: "relative" }}>
      <LoadingOverlay visible={props.loading} />
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
  );
};

export default Table;
