import { Card, createStyles, Group, Text } from "@mantine/core";
import { ColumnFiltersState } from "@tanstack/react-table";
import theme from "../../styles/theme";

interface FilterText {
  [key: string]: string;
  itemName: string;
}

const filterText: FilterText = {
  itemName: "Item",
};

const useStyles = createStyles((theme) => ({
  card: {
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[7],
    fontWeight: 700,
    boxShadow:
      theme.colorScheme === "dark" ? `1px 1px 3px ${theme.colors[theme.primaryColor][6]}` : theme.shadows.sm,
    backgroundImage:
      theme.colorScheme === "dark"
        ? theme.fn.gradient({
            from: theme.colors[theme.primaryColor][4],
            to: theme.colors[theme.primaryColor][5],
            deg: 56,
          })
        : theme.fn.gradient({ from: theme.colors.gray[0], to: theme.colors[theme.primaryColor][1], deg: 25 }),
    cursor: "pointer",
    "&:hover": {
      backgroundImage:
        theme.colorScheme === "dark"
          ? theme.fn.gradient({
              from: theme.colors[theme.primaryColor][5],
              to: theme.colors[theme.primaryColor][6],
              deg: 56,
            })
          : theme.fn.gradient({ from: theme.colors.gray[0], to: theme.colors[theme.primaryColor][2], deg: 25 }),
    },
    "&:active": {
      transform: "scale(0.98)",
      backgroundImage:
        theme.colorScheme === "dark"
          ? theme.fn.gradient({
              from: theme.fn.darken(theme.colors[theme.primaryColor][7], 0.1),
              to: theme.fn.darken(theme.colors[theme.primaryColor][8], 0.1),
              deg: 56,
            })
          : theme.fn.gradient({ from: theme.colors.gray[1], to: theme.colors[theme.primaryColor][1], deg: 15 }),
    },
  },
  nfCard: {
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[7],
    fontWeight: 700,
    boxShadow:
      theme.colorScheme === "dark" ? `1px 1px 3px ${theme.colors[theme.primaryColor][6]}` : theme.shadows.sm,
    backgroundImage:
      theme.colorScheme === "dark"
        ? theme.fn.gradient({
            from: theme.colors[theme.primaryColor][4],
            to: theme.colors[theme.primaryColor][5],
            deg: 56,
          })
        : theme.fn.gradient({ from: theme.colors.gray[0], to: theme.colors[theme.primaryColor][1], deg: 25 }),
  },
}));

export function ColumnFilterDisplay(props: {
  state: ColumnFiltersState;
  setState: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}) {
  const { classes, cx } = useStyles();

  const displayFilters = props.state.map((filter) => (
    <Card
      className={cx(classes.card)}
      p={4}
      onClick={() => {
        props.setState(props.state.filter((f) => f.id !== filter.id));
      }}
      key={filter.id}
    >
      {filterText[filter.id as string] || filter.id}: {filter.value as string}
    </Card>
  ));

  const noFilters = (
    <Card className={cx(classes.nfCard)} p={4}>
      Filters: None
    </Card>
  );

  return <Group>{displayFilters.length > 0 ? displayFilters : noFilters}</Group>;
}
