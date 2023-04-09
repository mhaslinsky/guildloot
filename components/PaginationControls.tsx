import { Button, Flex, NativeSelect, Select, Text } from "@mantine/core";
import { ChevronsRight, ChevronsLeft, ChevronLeft, ChevronRight } from "tabler-icons-react";
import { lootItem } from "@prisma/client";
import { Table } from "@tanstack/react-table";
import { useEffect } from "react";
import theme from "../styles/theme";

export function PaginationControls(props: { table: Table<lootItem> }) {
  const { table } = props;

  useEffect(() => {
    table.setPageSize(50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex gap={1} justify='space-between' align='center' wrap='wrap' mb={4} pr={1}>
      <NativeSelect
        value={table.getState().pagination.pageSize.toString()}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        data={["10", "20", "30", "40", "50", "100"]}
      />
      <Flex gap={1} align='center'>
        <Button
          size='sm'
          variant='filled'
          onClick={() => table.setPageIndex(0)}
          disabled={table.getState().pagination.pageIndex === 0 ? true : false}
          aria-label={"First page"}
        >
          <ChevronsLeft size={18} />
        </Button>
        <Button
          size='sm'
          variant='filled'
          onClick={() => table.previousPage()}
          disabled={table.getState().pagination.pageIndex === 0 ? true : false}
          aria-label={"Previous page"}
        >
          <ChevronLeft size={18} />
        </Button>
        <Button
          size='sm'
          variant='filled'
          onClick={() => table.nextPage()}
          disabled={table.getState().pagination.pageIndex === table.getPageCount() - 1 ? true : false}
          aria-label={"Next page"}
        >
          <ChevronRight size={18} />
          {table.getState().pagination.pageIndex + 1}
        </Button>
        <Button
          size='sm'
          variant='filled'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={table.getState().pagination.pageIndex === table.getPageCount() - 1 ? true : false}
          aria-label={"Last page"}
        >
          <ChevronsRight size={18} />
          {table.getPageCount()}
        </Button>
      </Flex>
    </Flex>
  );
}
