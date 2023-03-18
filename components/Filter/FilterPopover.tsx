import { createStyles, Popover, UnstyledButton } from "@mantine/core";
import { Column, Table } from "@tanstack/react-table";
import { useStyles } from "../../styles/theme";
import Filter from "./Filter";
import { Filter as FilterIcon } from "tabler-icons-react";

const localStyles = createStyles((theme) => ({
  dropdown: {
    backgroundColor: theme.colors[theme.primaryColor][9],
    padding: 1,
    zIndex: 100,
  },
}));

export default function FilterPopover({ column, table }: { column: Column<any, unknown>; table: Table<any> }) {
  const { classes: globalClasses } = useStyles();
  const { classes, theme } = localStyles();

  return (
    <Popover classNames={{ dropdown: classes.dropdown }}>
      <Popover.Target>
        <UnstyledButton>
          <FilterIcon className={globalClasses.tHeader} size={16} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Filter column={column} table={table} />
      </Popover.Dropdown>
    </Popover>
  );
}
