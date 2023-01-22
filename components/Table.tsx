import { RCLootItem } from "../utils/types";
import { Flex, Table as Mtable } from "@mantine/core";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Anchor } from "@mantine/core";
import { SortAscending, SortDescending } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { useStyles } from "../styles/theme";
import { useMediaQuery } from "@mantine/hooks";

const Table: React.FC<{ columns: any; data: RCLootItem[] }> = (props) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "dateTime", desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const { classes } = useStyles();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const table = useReactTable({
    columns: props.columns,
    enableHiding: true,
    data: props.data,
    state: {
      sorting,
      columnVisibility,
    },
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
  );
};

export default Table;
