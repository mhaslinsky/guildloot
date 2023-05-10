import { Autocomplete, createStyles, Input } from "@mantine/core";
import { Column, Table } from "@tanstack/react-table";
import { useMemo, useState, useEffect } from "react";

export default function Filter({ column, table }: { column: Column<any, unknown>; table: Table<any> }) {
  const localStyles = createStyles((theme) => ({
    input: {
      color: theme.colors[theme.primaryColor][4],
      fontWeight: "bold",
      fontSize: theme.fontSizes.lg,
    },
    dropdown: {
      fontWeight: "bold",
      letterSpacing: 0.8,
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[0],
      borderColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
    },
    item: {
      "&:hover": {
        backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
      },
    },
  }));
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const { classes } = localStyles();
  const [value, setValue] = useState("");
  const [valueVar, setValueVar] = useState(column.getFilterValue());
  const debounce = 250;
  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = useMemo(
    () => (typeof firstValue === "number" ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.getFacetedUniqueValues()]
  );

  //debouncing column filter being set
  useEffect(() => {
    const timeout = setTimeout(() => {
      column.setFilterValue(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [column, value]);

  useEffect(() => {
    setValue(columnFilterValue as string);
    if (columnFilterValue !== valueVar) {
      setValueVar(columnFilterValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Autocomplete
      classNames={{ dropdown: classes.dropdown, input: classes.input, item: classes.item }}
      limit={10}
      type='text'
      value={valueVar as string}
      onChange={(e) => {
        setValueVar(e);
        setValue(e);
      }}
      placeholder={`Search ${column.id}.. (${column.getFacetedUniqueValues().size})`}
      data={sortedUniqueValues}
    ></Autocomplete>
  );
}
