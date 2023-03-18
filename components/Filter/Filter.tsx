import { Autocomplete, createStyles, Input } from "@mantine/core";
import { Column, Table } from "@tanstack/react-table";
import { useMemo } from "react";

export default function Filter({ column, table }: { column: Column<any, unknown>; table: Table<any> }) {
  const localStyles = createStyles((theme) => ({
    input: {
      color: theme.colors[theme.primaryColor][2],
      fontWeight: "bold",
      fontSize: theme.fontSizes.lg,
    },
    dropdown: {
      fontWeight: "bold",
      letterSpacing: 0.8,
      borderColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
    },
    item: {
      "&:hover": {
        backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
      },
    },
  }));
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const { classes, theme } = localStyles();

  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = useMemo(
    () => (typeof firstValue === "number" ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.getFacetedUniqueValues()]
  );

  return (
    <Autocomplete
      classNames={{ dropdown: classes.dropdown, input: classes.input, item: classes.item }}
      limit={10}
      type='text'
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => {
        column.setFilterValue(e);
      }}
      placeholder={`Search ${column.id}.. (${column.getFacetedUniqueValues().size})`}
      data={sortedUniqueValues}
    ></Autocomplete>
  );
}
