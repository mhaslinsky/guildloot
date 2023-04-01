import { Button, Flex, NativeSelect, Select, Text } from "@mantine/core";
import { ChevronsRight, ChevronsLeft, ChevronLeft, ChevronRight } from "tabler-icons-react";
import { rcLootItem } from "@prisma/client";
import { Table } from "@tanstack/react-table";

export function PaginationControls(props: { table: Table<rcLootItem> }) {
  const { table } = props;
  //   const { pageSize } = pagination;

  return (
    <Flex justify='space-between' align='center' wrap='wrap' mb={4}>
      <Flex align='center' mb={{ base: 2, md: 0 }}>
        <Text fz='sm' mr={2}>
          Show
        </Text>
        <NativeSelect
          value={table.getState().pagination.pageSize.toString()}
          onChange={(e) => {
            console.log(e.target.value);
            table.setPageSize(Number(e.target.value));
          }}
          data={["10", "20", "30", "40", "50", "100"]}
        >
          {["10", "20", "30", "40", "50", "100"].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </NativeSelect>
      </Flex>
      <Flex align='center'>
        <Button
          size='sm'
          variant='outline'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage}
          aria-label={"First page"}
        >
          <ChevronsLeft size={18} />
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage}
          aria-label={"Previous page"}
        >
          <ChevronLeft size={18} />
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={() => {
            console.log(table.getCanNextPage);
            table.nextPage();
          }}
          disabled={!table.getCanNextPage}
          aria-label={"Next page"}
        >
          <ChevronRight size={18} />
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanPreviousPage}
          aria-label={"Last page"}
        >
          <ChevronsRight size={18} />
        </Button>
      </Flex>
    </Flex>
  );
}
